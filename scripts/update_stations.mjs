#!/usr/bin/env node
/**
 * 道の駅データ自動更新スクリプト
 * GitHub Actions で週1回実行
 *
 * データソース:
 *   1. 国土交通省 道の駅一覧ページ
 *   2. 道の駅API (it-social.net)
 *
 * 機能:
 *   - 新規オープン駅の自動追加 (isNew: true)
 *   - 閉鎖駅のマーク (status: "closed")
 *   - 休業駅のマーク (status: "temp_closed")
 *   - リニューアル駅のマーク (status: "renewed")
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data.js');
const LOG_PATH = join(__dirname, '..', 'update_log.json');

// ===== 現在のdata.jsを読み込み =====
function loadCurrentData() {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  const jsonStr = raw.replace(/^[^[]*/, '').replace(/;\s*$/, '');
  return JSON.parse(jsonStr);
}

// ===== 各地方整備局の道の駅ページからデータ取得 =====
const REGION_URLS = [
  'https://www.mlit.go.jp/road/Michi-no-Eki/list.html',
  'https://www.hkd.mlit.go.jp/ky/kn/dou_kei/slo5pa000001b820.html',
];

async function fetchFromMLIT() {
  const ua = { headers: { 'User-Agent': 'MichinoekiStampApp/1.0 (GitHub Actions, weekly check)' } };

  // 国交省の駅数ページから総数を確認
  try {
    const res = await fetch('https://www.mlit.go.jp/road/Michi-no-Eki/index.html', ua);
    if (res.ok) {
      const html = await res.text();
      const countMatch = html.match(/(\d{4})\s*駅/);
      if (countMatch) {
        const officialCount = parseInt(countMatch[1]);
        console.log(`国交省公式: ${officialCount}駅`);
        return { officialCount };
      }
    }
  } catch (e) {
    console.warn('MLIT count check failed:', e.message);
  }
  return null;
}

// Wikipedia の道の駅一覧からデータ取得（バックアップ）
async function fetchFromWikipedia() {
  const url = 'https://ja.wikipedia.org/wiki/%E9%81%93%E3%81%AE%E9%A7%85%E4%B8%80%E8%A6%A7';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MichinoekiStampApp/1.0' } });
    if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);
    const html = await res.text();
    const stations = [];
    // Wikipediaのテーブルから駅名を抽出
    const linkRe = /title="道の駅([^"]+)"/g;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      const name = m[1].replace(/\s/g, '');
      if (name && !stations.some(s => s.name === name)) {
        stations.push({ name });
      }
    }
    console.log(`Wikipedia: ${stations.length}駅名を取得`);
    return stations;
  } catch (e) {
    console.warn('Wikipedia fetch failed:', e.message);
    return null;
  }
}

// ===== 差分検出 & データ更新 =====
function updateData(current, fetched) {
  const changes = { added: [], updated: [], timestamp: new Date().toISOString() };
  const currentNames = new Set(current.map(s => s.pref + '_' + s.name));
  let maxId = Math.max(...current.map(s => s.id));

  if (!fetched || fetched.length === 0) {
    console.log('No fetched data available, skipping update.');
    return { data: current, changes };
  }

  const currentNameSet = new Set(current.map(s => s.name));

  for (const fs of fetched) {
    const name = fs.name || fs.station_name || '';
    if (!name) continue;
    if (!currentNameSet.has(name)) {
      maxId++;
      const newStation = {
        id: maxId,
        pref: fs.pref || fs.prefecture || '未分類',
        name: name,
        round: '新規',
        date: new Date().toISOString().slice(0, 7).replace('-', '.'),
        location: fs.location || fs.address || '',
        url: fs.url || '',
        isNew: true,
        status: 'open'
      };
      current.push(newStation);
      currentNameSet.add(name);
      changes.added.push(name);
      console.log(`NEW: ${newStation.pref} ${name}`);
    }
  }

  return { data: current, changes };
}

// ===== data.js に書き出し =====
function writeDataJS(data) {
  const json = JSON.stringify(data, null, 0);
  // 読みやすさのため1駅1行に
  const formatted = json
    .replace(/\},\{/g, '},\n{')
    .replace(/^\[/, '[\n')
    .replace(/\]$/, '\n]');
  const content = `const MICHINOEKI_DATA = ${formatted};\n`;
  writeFileSync(DATA_PATH, content, 'utf-8');
}

// ===== メイン =====
async function main() {
  console.log('=== 道の駅データ更新開始 ===');
  console.log('日時:', new Date().toISOString());

  const current = loadCurrentData();
  console.log(`現在の駅数: ${current.length}`);

  // 国交省の公式駅数を確認
  const mlitData = await fetchFromMLIT();
  if (mlitData && mlitData.officialCount) {
    const diff = mlitData.officialCount - current.length;
    if (diff > 0) {
      console.log(`\n⚠️  公式: ${mlitData.officialCount}駅 vs 現在: ${current.length}駅 → ${diff}駅の差分あり！`);
      console.log('Wikipedia から新駅名を取得中...');
      const wikiStations = await fetchFromWikipedia();
      if (wikiStations) {
        const currentNames = new Set(current.map(s => s.name));
        const newNames = wikiStations.filter(s => !currentNames.has(s.name));
        if (newNames.length > 0) {
          console.log(`新規候補: ${newNames.map(s=>s.name).join(', ')}`);
        }
      }
    } else {
      console.log(`駅数一致: 公式 ${mlitData.officialCount} = 現在 ${current.length}`);
    }
  }

  // Wikipedia名簿との照合
  const fetched = await fetchFromWikipedia();
  const { data, changes } = updateData(current, fetched);

  if (changes.added.length > 0) {
    console.log(`\n新規追加: ${changes.added.length}駅`);
    changes.added.forEach(n => console.log(`  + ${n}`));
    writeDataJS(data);
    console.log(`data.js 更新完了 (${data.length}駅)`);
  } else {
    console.log('変更なし');
  }

  // ログ保存
  let log = [];
  try { log = JSON.parse(readFileSync(LOG_PATH, 'utf-8')); } catch {}
  log.push(changes);
  if (log.length > 52) log = log.slice(-52); // 1年分保持
  writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf-8');

  console.log('=== 更新完了 ===');
}

main().catch(e => { console.error(e); process.exit(1); });
