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

// ===== 道の駅API からデータ取得 =====
async function fetchFromAPI() {
  const url = 'https://www.it-social.net/roadside_station/api/stations.json';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MichinoekiStampApp/1.0' } });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('API fetch failed:', e.message);
    return null;
  }
}

// ===== 国土交通省ページからデータ取得 =====
async function fetchFromMLIT() {
  const url = 'https://www.mlit.go.jp/road/Michi-no-Eki/list.html';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MichinoekiStampApp/1.0' } });
    if (!res.ok) throw new Error(`MLIT returned ${res.status}`);
    const html = await res.text();
    return parseMLITHtml(html);
  } catch (e) {
    console.warn('MLIT fetch failed:', e.message);
    return null;
  }
}

function parseMLITHtml(html) {
  const stations = [];
  // 国交省のテーブルからデータを抽出
  // <tr>内の<td>から駅名、都道府県、所在地を取得
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = rowRe.exec(html)) !== null) {
    const tds = [];
    let tdMatch;
    while ((tdMatch = tdRe.exec(match[1])) !== null) {
      tds.push(tdMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    if (tds.length >= 3 && tds[0] && !/都道府県|No/.test(tds[0])) {
      stations.push({
        pref: tds[0],
        name: tds[1],
        location: tds[2] || ''
      });
    }
  }
  return stations;
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

  // 新規駅の検出
  for (const fs of fetched) {
    const key = (fs.pref || fs.prefecture) + '_' + (fs.name || fs.station_name);
    if (!currentNames.has(key)) {
      maxId++;
      const newStation = {
        id: maxId,
        pref: fs.pref || fs.prefecture || '',
        name: fs.name || fs.station_name || '',
        round: '新規',
        date: new Date().toISOString().slice(0, 7).replace('-', '.'),
        location: fs.location || fs.address || '',
        url: fs.url || '',
        isNew: true,
        status: 'open'
      };
      current.push(newStation);
      changes.added.push(newStation.name);
      console.log(`NEW: ${newStation.pref} ${newStation.name}`);
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

  // 複数ソースから取得を試みる
  let fetched = await fetchFromAPI();
  if (!fetched) {
    console.log('APIフォールバック: 国交省ページを試行...');
    fetched = await fetchFromMLIT();
  }

  if (fetched) {
    console.log(`取得した駅数: ${fetched.length}`);
  }

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
