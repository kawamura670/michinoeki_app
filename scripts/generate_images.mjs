#!/usr/bin/env node
/**
 * DALL-E スタンプ画像自動生成スクリプト
 *
 * 使い方:
 *   1. OpenAI APIキーを取得: https://platform.openai.com/api-keys
 *   2. 環境変数にセット: export OPENAI_API_KEY="sk-..."
 *   3. 実行: node scripts/generate_images.mjs
 *
 * コスト: DALL-E 3 1024x1024 = 約$0.04/枚
 *         1231枚 × $0.04 = 約$49（¥7,500程度）
 *
 * バッチ処理: 50枚ずつ生成、途中再開可能
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, '..', 'stamp_catalog.json');
const IMG_DIR = join(__dirname, '..', 'stamp_images');
const PROGRESS_PATH = join(__dirname, '..', 'stamp_gen_progress.json');

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('ERROR: OPENAI_API_KEY 環境変数をセットしてください');
  console.error('  export OPENAI_API_KEY="sk-..."');
  process.exit(1);
}

// 出力ディレクトリ
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

// カタログ読み込み
const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'));
console.log(`カタログ: ${catalog.length}駅`);

// 進捗読み込み（途中再開用）
let progress = {};
if (existsSync(PROGRESS_PATH)) {
  progress = JSON.parse(readFileSync(PROGRESS_PATH, 'utf-8'));
  console.log(`前回の進捗: ${Object.keys(progress).length}枚生成済み`);
}

// DALL-E API呼び出し
async function generateImage(stamp) {
  const prompt = [
    'A circular stamp design (40mm diameter) for a Japanese roadside station (道の駅).',
    'Style: hand-drawn watercolor illustration, warm and nostalgic, like a real travel stamp.',
    'Circular frame with thin border.',
    `Main subject (70%): ${stamp.main_symbol}.`,
    `Secondary element: ${stamp.secondary_symbol}.`,
    `Station name "${stamp.station_name}" written in Japanese curved along the bottom.`,
    `Prefecture: ${stamp.pref}.`,
    'Color palette: soft watercolors, muted natural tones.',
    'Must look like a collectible travel stamp from a real stamp book.',
    'White/cream background outside the circle.',
    'No text other than the station name.',
  ].join(' ');

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, 'base64');
}

// メイン処理
async function main() {
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '50');
  const START_FROM = parseInt(process.env.START_FROM || '0');
  let generated = 0;
  let errors = 0;

  const toGenerate = catalog.filter(s =>
    !progress[s.id] && s.id > START_FROM
  ).slice(0, BATCH_SIZE);

  console.log(`\n今回生成: ${toGenerate.length}枚 (バッチサイズ: ${BATCH_SIZE})`);
  console.log(`推定コスト: $${(toGenerate.length * 0.04).toFixed(2)}\n`);

  for (const stamp of toGenerate) {
    const imgPath = join(IMG_DIR, `stamp_${stamp.id}.webp`);

    if (existsSync(imgPath)) {
      console.log(`SKIP: #${stamp.id} ${stamp.station_name} (既存)`);
      progress[stamp.id] = { status: 'done', file: `stamp_${stamp.id}.webp` };
      continue;
    }

    try {
      console.log(`GEN: #${stamp.id} ${stamp.pref} ${stamp.station_name}...`);
      const imgBuffer = await generateImage(stamp);

      // PNG → WebP変換（Node.js標準ではできないのでPNGのまま保存）
      const pngPath = join(IMG_DIR, `stamp_${stamp.id}.png`);
      writeFileSync(pngPath, imgBuffer);

      progress[stamp.id] = {
        status: 'done',
        file: `stamp_${stamp.id}.png`,
        timestamp: new Date().toISOString()
      };
      generated++;

      // 進捗保存（毎回）
      writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');

      // レートリミット対策（1秒待機）
      await new Promise(r => setTimeout(r, 1000));

    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
      progress[stamp.id] = { status: 'error', error: e.message };
      errors++;

      // エラー時は5秒待機
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');

  console.log(`\n=== 完了 ===`);
  console.log(`生成: ${generated}枚`);
  console.log(`エラー: ${errors}枚`);
  console.log(`累計: ${Object.values(progress).filter(p => p.status === 'done').length}/${catalog.length}枚`);
  console.log(`\n残り: ${catalog.length - Object.values(progress).filter(p => p.status === 'done').length}枚`);
  console.log(`次回実行: node scripts/generate_images.mjs`);
}

main().catch(e => { console.error(e); process.exit(1); });
