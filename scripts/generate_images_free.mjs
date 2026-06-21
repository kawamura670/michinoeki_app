#!/usr/bin/env node
/**
 * 全1231駅スタンプ画像生成（完成形）
 *
 * 1. Pollinations.ai で風景イラストを生成（文字なし）
 * 2. sharp + svg-text で日本語駅名を画像内に焼き込み
 * 3. 完成したスタンプ画像をPNGで保存
 *
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

// sharp の動的インポート
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('sharp未インストール。インストール中...');
  const { execSync } = await import('child_process');
  execSync('npm install sharp', { cwd: join(__dirname, '..'), stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

// 風景画像を生成
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
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// 日本語駅名をSVGで生成 → 画像に合成
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
    <text x="${width/2}" y="${bannerY + 45}" text-anchor="middle" font-size="${fontSize}" font-weight="900" fill="#3A2010" font-family="'Hiragino Mincho Pro','Yu Mincho','Noto Serif JP',serif">${stationName}</text>
    <text x="${width/2}" y="${bannerY + 72}" text-anchor="middle" font-size="${prefSize}" font-weight="600" fill="#8B7355" font-family="'Hiragino Sans','Noto Sans JP',sans-serif">${prefName}</text>
  </svg>`);
}

// 外枠をSVGで描画
function buildFrame(width, borderColor) {
  return Buffer.from(`<svg width="${width}" height="${width}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 3}" fill="none" stroke="${borderColor}" stroke-width="4"/>
    <circle cx="${width/2}" cy="${width/2}" r="${width/2 - 10}" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.3" stroke-dasharray="4,3"/>
  </svg>`);
}

// 完成形スタンプを合成
async function createStamp(stamp, landscapeBuffer) {
  const SIZE = 512;
  const RARITY_COLORS = {
    common: '#4A7C59', rare: '#2E6B9E', epic: '#7B4DB5', legendary: '#B8860B'
  };
  const borderColor = RARITY_COLORS[stamp.rarity] || RARITY_COLORS.common;

  // 円形にクロップ
  const circleMask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2 - 6}" fill="white"/></svg>`);

  const cropped = await sharp(landscapeBuffer)
    .resize(SIZE, SIZE, { fit: 'cover' })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // クリーム背景 + 円形風景 + 名前 + 枠を合成
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

async function main() {
  const BATCH = parseInt(process.env.BATCH_SIZE || '30');
  const toGen = catalog.filter(s => !progress[s.id] || progress[s.id].status !== 'done').slice(0, BATCH);

  console.log(`\n今回生成: ${toGen.length}枚 (コスト: ¥0)\n`);
  let ok = 0, fail = 0;

  for (const stamp of toGen) {
    const imgPath = join(IMG_DIR, `stamp_${stamp.id}.png`);

    try {
      process.stdout.write(`#${stamp.id} ${stamp.pref} ${stamp.station_name}...`);

      // 1. 風景画像を取得
      const landscape = await fetchLandscape(stamp);

      // 2. 駅名焼き込み＋枠合成で完成形を生成
      const final = await createStamp(stamp, landscape);

      // 3. 保存
      writeFileSync(imgPath, final);
      progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.png`, ts: new Date().toISOString() };
      ok++;
      console.log(` OK (${(final.length/1024).toFixed(0)}KB)`);

      writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');
      await new Promise(r => setTimeout(r, 2500));

    } catch (e) {
      console.log(` FAIL: ${e.message}`);
      progress[stamp.id] = { status: 'error', error: e.message };
      fail++;
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');
  const totalDone = Object.values(progress).filter(p => p.status === 'done').length;
  console.log(`\n=== 完了 === 今回: ${ok}枚 エラー: ${fail}枚 累計: ${totalDone}/${catalog.length}枚`);
  console.log(`残り: ${catalog.length - totalDone}枚`);
}

main().catch(e => { console.error(e); process.exit(1); });
