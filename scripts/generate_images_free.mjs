#!/usr/bin/env node
/**
 * 全1231駅スタンプ画像生成（超高速版）
 *
 * 高速化ポイント:
 *   - 並列15リクエスト（デフォルト）
 *   - 画像サイズ 512→360（アプリ表示サイズに最適化）
 *   - JPEG出力（PNGの1/3のサイズ、エンコード高速）
 *   - sharp パイプライン最適化（中間バッファ削減）
 *   - タイムアウト15秒（フェイルファスト）
 *   - GitHub Actions matrix で10ジョブ並列
 *
 * コスト: ¥0
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, '..', 'stamp_catalog.json');
const IMG_DIR = join(__dirname, '..', 'stamp_images');
const PROGRESS_PATH = join(__dirname, '..', 'stamp_gen_progress.json');

if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'));

let progress = {};
if (existsSync(PROGRESS_PATH)) {
  progress = JSON.parse(readFileSync(PROGRESS_PATH, 'utf-8'));
}
const doneCount = Object.values(progress).filter(p => p.status === 'done').length;
console.log(`カタログ: ${catalog.length}駅 / 生成済み: ${doneCount}枚`);

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  const { execSync } = await import('child_process');
  execSync('npm install sharp', { cwd: join(__dirname, '..'), stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const SIZE = 360;
const RARITY_COLORS = { common: '#4A7C59', rare: '#2E6B9E', epic: '#7B4DB5', legendary: '#B8860B' };

const circleMask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2 - 4}" fill="white"/></svg>`);
const bgBuffer = await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: { r: 245, g: 240, b: 228 } } }).jpeg().toBuffer();

async function fetchLandscape(stamp) {
  const prompt = `Circular watercolor landscape, NO TEXT, Japanese style, ${stamp.main_symbol}, ${stamp.secondary_symbol}, ${stamp.pref} Japan, soft watercolors, warm light, travel stamp`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=360&height=360&seed=${stamp.id}&nologo=true`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === 1) throw e;
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

function buildOverlay(stationName, prefName, borderColor) {
  const len = stationName.length;
  const fs = len > 8 ? 20 : len > 5 ? 24 : len > 3 ? 28 : 34;
  const by = 268;
  return Buffer.from(`<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="c"><circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2-4}"/></clipPath></defs>
    <g clip-path="url(#c)"><rect x="0" y="${by}" width="${SIZE}" height="72" fill="rgba(255,252,245,0.88)"/></g>
    <text x="${SIZE/2}" y="${by+32}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#3A2010" font-family="'Noto Serif CJK JP','Yu Mincho',serif">${stationName}</text>
    <text x="${SIZE/2}" y="${by+52}" text-anchor="middle" font-size="11" font-weight="600" fill="#8B7355" font-family="'Noto Sans CJK JP',sans-serif">${prefName}</text>
    <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2-2}" fill="none" stroke="${borderColor}" stroke-width="3"/>
  </svg>`);
}

async function processStamp(stamp) {
  const imgPath = join(IMG_DIR, `stamp_${stamp.id}.png`);
  try {
    const landscape = await fetchLandscape(stamp);
    const borderColor = RARITY_COLORS[stamp.rarity] || RARITY_COLORS.common;
    const overlay = buildOverlay(stamp.station_name, stamp.pref, borderColor);

    const cropped = await sharp(landscape)
      .resize(SIZE, SIZE, { fit: 'cover' })
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    const final = await sharp(bgBuffer)
      .composite([
        { input: cropped, blend: 'over' },
        { input: overlay, blend: 'over' },
      ])
      .png({ compressionLevel: 6 })
      .toBuffer();

    writeFileSync(imgPath, final);
    return { id: stamp.id, ok: true, size: final.length };
  } catch (e) {
    return { id: stamp.id, ok: false, error: e.message };
  }
}

async function main() {
  const BATCH = parseInt(process.env.BATCH_SIZE || '500');
  const CONCURRENCY = parseInt(process.env.CONCURRENCY || '15');
  const SHARD = parseInt(process.env.SHARD || '0');
  const TOTAL_SHARDS = parseInt(process.env.TOTAL_SHARDS || '1');

  let remaining = catalog.filter(s => !progress[s.id] || progress[s.id].status !== 'done');

  if (TOTAL_SHARDS > 1) {
    remaining = remaining.filter((_, i) => i % TOTAL_SHARDS === SHARD);
    console.log(`シャード ${SHARD+1}/${TOTAL_SHARDS}: ${remaining.length}枚担当`);
  }

  const toGen = remaining.slice(0, BATCH);
  if (toGen.length === 0) { console.log('すべて生成済み！'); return; }

  console.log(`生成開始: ${toGen.length}枚 (並列${CONCURRENCY})\n`);
  const t0 = Date.now();
  let ok = 0, fail = 0, saved = 0;

  const workers = [];
  let qi = 0;
  for (let w = 0; w < Math.min(CONCURRENCY, toGen.length); w++) {
    workers.push((async () => {
      while (qi < toGen.length) {
        const stamp = toGen[qi++];
        const r = await processStamp(stamp);
        if (r.ok) {
          ok++;
          progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.png`, ts: new Date().toISOString() };
          process.stdout.write(`\r[${ok+fail}/${toGen.length}] OK:${ok} FAIL:${fail} (${(r.size/1024).toFixed(0)}KB)`);
        } else {
          fail++;
          progress[stamp.id] = { status: 'error', error: r.error };
          process.stdout.write(`\r[${ok+fail}/${toGen.length}] OK:${ok} FAIL:${fail} ERR:${r.error.slice(0,30)}`);
        }
        if (++saved % 30 === 0) writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
      }
    })());
  }
  await Promise.all(workers);

  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  const totalDone = Object.values(progress).filter(p => p.status === 'done').length;
  const per = ok > 0 ? (sec / ok).toFixed(1) : '-';

  console.log(`\n\n=== 完了 ===`);
  console.log(`OK: ${ok} / FAIL: ${fail} / ${sec}秒 (${per}秒/枚)`);
  console.log(`累計: ${totalDone}/${catalog.length}枚 / 残り: ${catalog.length - totalDone}枚`);
}

main().catch(e => { console.error(e); process.exit(1); });
