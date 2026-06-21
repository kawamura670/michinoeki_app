#!/usr/bin/env node
/**
 * Pollinations.ai で全1231駅のスタンプ画像を無料生成
 *
 * コスト: ¥0（完全無料・登録不要・APIキー不要）
 * 使い方: node scripts/generate_images_free.mjs
 * バッチ: BATCH_SIZE=100 node scripts/generate_images_free.mjs
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

async function generateImage(stamp) {
  const prompt = [
    'Circular stamp design for Japanese roadside station.',
    'Style: hand-drawn watercolor illustration, warm nostalgic travel stamp.',
    'Thin circular border.',
    `Main: ${stamp.main_symbol}.`,
    `Sub: ${stamp.secondary_symbol}.`,
    `"${stamp.station_name}" in Japanese at bottom.`,
    `${stamp.pref} region.`,
    'Soft watercolor, muted natural tones, cream background outside circle.',
    'Collectible travel stamp book quality. No extra text.',
  ].join(' ');

  const encoded = encodeURIComponent(prompt);
  const seed = stamp.id;
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function main() {
  const BATCH = parseInt(process.env.BATCH_SIZE || '30');
  const toGen = catalog.filter(s => !progress[s.id] || progress[s.id].status !== 'done').slice(0, BATCH);

  console.log(`\n今回生成: ${toGen.length}枚 (コスト: ¥0)\n`);
  let ok = 0, fail = 0;

  for (const stamp of toGen) {
    const imgPath = join(IMG_DIR, `stamp_${stamp.id}.png`);
    if (existsSync(imgPath) && (!progress[stamp.id] || progress[stamp.id].status === 'done')) {
      console.log(`SKIP: #${stamp.id} ${stamp.station_name}`);
      progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.png` };
      continue;
    }

    try {
      process.stdout.write(`GEN #${stamp.id} ${stamp.pref} ${stamp.station_name}...`);
      const buf = await generateImage(stamp);
      writeFileSync(imgPath, buf);
      progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.png`, ts: new Date().toISOString() };
      ok++;
      console.log(` OK (${(buf.length/1024).toFixed(0)}KB)`);
      writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');
      await new Promise(r => setTimeout(r, 2000));
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
  console.log(`残り: ${catalog.length - totalDone}枚 → もう一度実行してください`);
}

main().catch(e => { console.error(e); process.exit(1); });
