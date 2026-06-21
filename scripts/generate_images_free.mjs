#!/usr/bin/env node
/**
 * 全1231駅スタンプ画像生成（高速版）
 *
 * 1. Pollinations.ai で風景イラストを生成（文字なし）
 * 2. sharp + svg-text で日本語駅名を画像内に焼き込み
 * 3. 完成したスタンプ画像をPNGで保存
 *
 * 高速化: 並列5リクエスト、スリープ最小化、バッチ200枚
 * コスト: ¥0
 * 依存: npm install sharp
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
console.log(`カタログ: ${catalog.length}駅`);

let progress = {};
if (existsSync(PROGRESS_PATH)) {
  progress = JSON.parse(readFileSync(PROGRESS_PATH, 'utf-8'));
  const done = Object.values(progress).filter(p => p.status === 'done').length;
  console.log(`前回の進捗: ${done}枚生成済み`);
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('sharp未インストール。インストール中...');
  const { execSync } = await import('child_process');
  execSync('npm install sharp', { cwd: join(__dirname, '..'), stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

async function fetchLandscape(stamp) {
  const prompt = [
    'Circular watercolor landscape painting inside a thin circular border on cream background.',
    'NO TEXT NO LETTERS NO WORDS NO CHARACTERS NO WRITING anywhere.',
    'Hand-drawn Japanese watercolor style, warm nostalgic.',
    `Scene: ${stamp.main_symbol}. ${stamp.secondary_symbol}.`,
    `Feel of ${stamp.pref} Japan.`,
    'Soft muted watercolors, earth tones, gentle warm light.',
    'Leave the bottom 20% of the circle slightly lighter for name area.',
    'Beautiful collectible travel stamp. Pure illustration only.',
  ].join(' ');

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${stamp.id}&nologo=true`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

function buildNameOverlay(stationName, prefName, width) {
  const nameLen = stationName.length;
  const fontSize = nameLen > 8 ? 28 : nameLen > 5 ? 34 : nameLen > 3 ? 40 : 48;
  const prefSize = 16;
  const bannerY = 380;
  const bannerH = 100;

  return Buffer.from(`<svg width="${width}" height="${width}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="c"><circle cx="${width/2}" cy="${width/2}" r="${width/2 - 6}"/></clipPath>
    </defs>
    <g clip-path="url(#c)">
      <rect x="0" y="${bannerY}" width="${width}" height="${bannerH}" fill="rgba(255,252,245,0.88)"/>
      <rect x="0" y="${bannerY}" width="${width}" height="1.5" fill="rgba(139,115,85,0.2)"/>
    </g>
    <text x="${width/2}" y="${bannerY + 45}" text-anchor="middle" font-size="${fontSize}" font-weight="900" fill="#3A2010" font-family="'Noto Serif CJK JP','Noto Serif JP','Yu Mincho',serif">${stationName}</text>
    <text x="${width/2}" y="${bannerY + 72}" text-anchor="middle" font-size="${prefSize}" font-weight="600" fill="#8B7355" font-family="'Noto Sans CJK JP','Noto Sans JP',sans-serif">${prefName}</text>
  </svg>`);
}

function buildFrame(width, borderColor) {
  return Buffer.from(`<svg width="${width}" height="${width}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 3}" fill="none" stroke="${borderColor}" stroke-width="4"/>
    <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 10}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.3" stroke-dasharray="4,3"/>
  </svg>`);
}

async function createStamp(stamp, landscapeBuffer) {
  const SIZE = 512;
  const RARITY_COLORS = {
    common: '#4A7C59', rare: '#2E6B9E', epic: '#7B4DB5', legendary: '#B8860B'
  };
  const borderColor = RARITY_COLORS[stamp.rarity] || RARITY_COLORS.common;

  const circleMask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2 - 6}" fill="white"/></svg>`);

  const cropped = await sharp(landscapeBuffer)
    .resize(SIZE, SIZE, { fit: 'cover' })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const bg = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 245, g: 240, b: 228, alpha: 255 } }
  }).png().toBuffer();

  const nameOverlay = buildNameOverlay(stamp.station_name, stamp.pref, SIZE);
  const frame = buildFrame(SIZE, borderColor);

  const final = await sharp(bg)
    .composite([
      { input: cropped, blend: 'over' },
      { input: nameOverlay, blend: 'over' },
      { input: frame, blend: 'over' },
    ])
    .png({ quality: 85, compressionLevel: 8 })
    .toBuffer();

  return final;
}

// 並列実行ユーティリティ
async function parallelMap(items, fn, concurrency) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function processStamp(stamp) {
  const imgPath = join(IMG_DIR, `stamp_${stamp.id}.png`);

  try {
    const landscape = await fetchLandscape(stamp);
    const final = await createStamp(stamp, landscape);
    writeFileSync(imgPath, final);

    progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.png`, ts: new Date().toISOString() };
    return { id: stamp.id, name: stamp.station_name, ok: true, size: final.length };
  } catch (e) {
    progress[stamp.id] = { status: 'error', error: e.message };
    return { id: stamp.id, name: stamp.station_name, ok: false, error: e.message };
  }
}

async function main() {
  const BATCH = parseInt(process.env.BATCH_SIZE || '200');
  const CONCURRENCY = parseInt(process.env.CONCURRENCY || '5');
  const toGen = catalog.filter(s => !progress[s.id] || progress[s.id].status !== 'done').slice(0, BATCH);

  if (toGen.length === 0) {
    console.log('\nすべて生成済みです！');
    return;
  }

  console.log(`\n今回生成: ${toGen.length}枚 (並列${CONCURRENCY}, コスト: ¥0)\n`);
  const startTime = Date.now();
  let ok = 0, fail = 0, saveCounter = 0;

  await parallelMap(toGen, async (stamp, i) => {
    const result = await processStamp(stamp);

    if (result.ok) {
      ok++;
      console.log(`[${ok + fail}/${toGen.length}] #${result.id} ${result.name} OK (${(result.size/1024).toFixed(0)}KB)`);
    } else {
      fail++;
      console.log(`[${ok + fail}/${toGen.length}] #${result.id} ${result.name} FAIL: ${result.error}`);
    }

    // 20枚ごとに進捗保存
    saveCounter++;
    if (saveCounter % 20 === 0) {
      writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');
    }
  }, CONCURRENCY);

  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalDone = Object.values(progress).filter(p => p.status === 'done').length;
  const remaining = catalog.length - totalDone;
  const perImage = ok > 0 ? (elapsed / ok).toFixed(1) : '-';

  console.log(`\n=== 完了 ===`);
  console.log(`今回: ${ok}枚 OK / ${fail}枚 エラー`);
  console.log(`所要時間: ${elapsed}秒（${perImage}秒/枚）`);
  console.log(`累計: ${totalDone}/${catalog.length}枚`);
  console.log(`残り: ${remaining}枚`);
  if (remaining > 0) {
    const estMinutes = (remaining * parseFloat(perImage || '5') / 60).toFixed(0);
    console.log(`推定残り時間: 約${estMinutes}分（並列${CONCURRENCY}時）`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
