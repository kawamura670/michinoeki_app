#!/usr/bin/env node
/**
 * 全1231駅スタンプ画像 — ローカルSVG生成（API不要・爆速）
 * アプリ内のbuildStampSVGと同じロジックでSVG→PNGを生成
 * 全1231枚を2-3分で完了
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CATALOG_PATH = join(ROOT, 'stamp_catalog.json');
const DATA_PATH = join(ROOT, 'data.js');
const IMG_DIR = join(ROOT, 'stamp_images');
const PROGRESS_PATH = join(ROOT, 'stamp_gen_progress.json');

if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

let sharp;
try { sharp = (await import('sharp')).default; } catch {
  const { execSync } = await import('child_process');
  execSync('npm install sharp', { cwd: ROOT, stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'));
const dataJs = readFileSync(DATA_PATH, 'utf-8');
const match = dataJs.match(/MICHINOEKI_DATA\s*=\s*(\[[\s\S]*?\]);/);
if (!match) { console.error('data.js parse error'); process.exit(1); }
const STATIONS = eval(match[1]);

let progress = {};
if (existsSync(PROGRESS_PATH)) progress = JSON.parse(readFileSync(PROGRESS_PATH, 'utf-8'));

const RARITY_STYLE = {
  common:   { border:"#4A8B5E", bg:"#2D5A3D" },
  rare:     { border:"#3A8EC4", bg:"#1B4F72" },
  epic:     { border:"#9B6DD7", bg:"#6A3D9A" },
  legendary:{ border:"#D4A017", bg:"#8B6914" },
};

function getCatalogData(id) {
  return catalog.find(c => c.id === id) || null;
}

function buildSVG(station) {
  const sData = getCatalogData(station.id);
  const rarity = sData ? sData.rarity : "common";
  const rs = RARITY_STYLE[rarity];
  const series = sData ? sData.series : "";
  const pid = `s${station.id}`;
  const H = (station.id * 2654435761 >>> 0);

  const skyHue = [200,210,195,25,280,190,205,30,215,185][station.id % 10];
  const skySat = 40 + (H % 30);
  const skyLit = 75 + (H % 10);
  const skyTop = `hsl(${skyHue},${skySat}%,${skyLit}%)`;
  const skyBot = `hsl(${(skyHue+15)%360},${skySat-10}%,${skyLit+8}%)`;

  const gndHue = [120,100,130,140,110,95,125,135,105,115][station.id % 10];
  const gndCol = `hsl(${gndHue},35%,55%)`;
  const gndLight = `hsl(${gndHue},30%,70%)`;
  const waterCol = `hsl(${200+(H%30)},50%,60%)`;
  const mtFar = `hsl(${220+(H%20)},20%,72%)`;
  const mtNear = `hsl(${gndHue},30%,48%)`;

  const isSunset = station.id % 7 === 0;
  const sunsetCol = isSunset ? `hsl(${20+(H%20)},70%,70%)` : "";

  const scenes = [
    `<path d="M20,160 Q70,100 120,160 Q150,90 200,145 Q230,110 280,155" fill="${mtFar}" opacity="0.5"/><path d="M20,170 Q80,120 140,165 Q180,125 230,160 Q260,135 290,165" fill="${mtNear}" opacity="0.4"/><path d="M20,175 L290,175 L290,210 Q200,195 155,200 Q100,195 20,210 Z" fill="${waterCol}" opacity="0.35"/><path d="M60,200 Q100,192 155,196 Q200,192 250,200" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.4"/>`,
    `<rect x="200" y="115" width="14" height="50" rx="2" fill="#E8E0D0" opacity="0.8"/><path d="M192,118 Q207,105 222,118" fill="#C44" opacity="0.6"/><circle cx="207" cy="112" r="4" fill="#FDB" opacity="0.7"/><path d="M20,175 Q80,165 140,172 Q200,160 290,170 L290,220 L20,220 Z" fill="${waterCol}" opacity="0.4"/><path d="M20,180 Q90,172 160,178 Q220,168 290,175" fill="none" stroke="#fff" stroke-width="1" opacity="0.3"/>`,
    `<path d="M20,150 Q80,115 155,145 Q230,110 290,145" fill="${mtFar}" opacity="0.4"/><rect x="20" y="160" width="270" height="55" fill="${gndLight}" opacity="0.3"/><path d="M30,170 L270,170" stroke="${gndCol}" stroke-width="0.5" opacity="0.3"/><path d="M35,180 L265,180" stroke="${gndCol}" stroke-width="0.5" opacity="0.25"/><path d="M40,190 L260,190" stroke="${gndCol}" stroke-width="0.5" opacity="0.2"/>`,
    `<path d="M20,160 Q80,130 155,155 Q220,125 290,155" fill="${mtNear}" opacity="0.25"/><rect x="20" y="170" width="270" height="45" fill="${gndLight}" opacity="0.2"/><line x1="130" y1="200" x2="130" y2="125" stroke="#B33" stroke-width="3.5" opacity="0.7"/><line x1="180" y1="200" x2="180" y2="125" stroke="#B33" stroke-width="3.5" opacity="0.7"/><path d="M118,130 Q155,115 192,130" fill="none" stroke="#B33" stroke-width="4" opacity="0.75" stroke-linecap="round"/><line x1="123" y1="142" x2="187" y2="142" stroke="#B33" stroke-width="2.5" opacity="0.5"/>`,
    `<path d="M20,190 L290,190 L290,220 L20,220 Z" fill="${waterCol}" opacity="0.3"/><path d="M20,155 Q50,180 80,160 L80,195" fill="${mtNear}" opacity="0.3"/><path d="M230,155 Q250,175 280,160 L280,195" fill="${mtNear}" opacity="0.3"/><path d="M60,155 Q120,130 155,145 Q190,130 250,155" fill="none" stroke="#8B7355" stroke-width="3" opacity="0.6" stroke-linecap="round"/>`,
    `<path d="M20,180 L290,180 L290,210 L20,210 Z" fill="${gndLight}" opacity="0.25"/><path d="M120,185 Q155,178 190,185 Q220,178 250,185" fill="${waterCol}" opacity="0.3"/><path d="M60,180 L60,130" stroke="#6B4" stroke-width="2" opacity="0.5"/><path d="M42,140 Q60,105 78,140" fill="#5A3" opacity="0.35"/><path d="M100,180 L100,140" stroke="#6B4" stroke-width="2.5" opacity="0.5"/><path d="M78,148 Q100,108 122,148" fill="#4A2" opacity="0.3"/><path d="M200,180 L200,135" stroke="#6B4" stroke-width="2" opacity="0.5"/><path d="M182,145 Q200,110 218,145" fill="#5A3" opacity="0.35"/>`,
    `<path d="M20,175 L290,175 L290,210 L20,210 Z" fill="${gndLight}" opacity="0.2"/><rect x="135" y="115" width="40" height="60" fill="#E8E0D0" opacity="0.7"/><path d="M128,118 L155,95 L182,118" fill="#445" opacity="0.5"/><path d="M132,105 L155,88 L178,105" fill="#445" opacity="0.4"/><circle cx="80" cy="145" r="18" fill="#F9C" opacity="0.35"/><circle cx="72" cy="138" r="14" fill="#FAD" opacity="0.3"/><circle cx="230" cy="140" r="16" fill="#F9C" opacity="0.3"/>`,
    `<path d="M20,170 L290,170 L290,210 L20,210 Z" fill="${gndLight}" opacity="0.2"/><rect x="70" y="135" width="35" height="40" rx="2" fill="#D4C4A8" opacity="0.5"/><path d="M65,137 L87,120 L110,137" fill="#8B7355" opacity="0.4"/><rect x="195" y="140" width="30" height="35" rx="2" fill="#D4C4A8" opacity="0.5"/><path d="M190,142 L210,128 L230,142" fill="#8B7355" opacity="0.4"/><path d="M125,155 Q130,130 125,110" fill="none" stroke="#fff" stroke-width="2" opacity="0.35" stroke-linecap="round"/><path d="M145,155 Q150,125 145,100" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.4" stroke-linecap="round"/><path d="M165,155 Q170,130 165,110" fill="none" stroke="#fff" stroke-width="2" opacity="0.35" stroke-linecap="round"/><ellipse cx="145" cy="165" rx="35" ry="10" fill="${waterCol}" opacity="0.3"/>`,
    `<path d="M20,165 L290,165 L290,220 L20,220 Z" fill="${waterCol}" opacity="0.35"/><path d="M30,172 Q80,165 130,170 Q200,163 280,170" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.3"/><path d="M140,155 L155,140 L170,155 L175,165 L135,165 Z" fill="#E8E0D0" opacity="0.6"/><line x1="155" y1="140" x2="155" y2="118" stroke="#8B7355" stroke-width="1.5" opacity="0.5"/><path d="M80,160 L90,148 L100,160 L103,165 L77,165 Z" fill="#8B7355" opacity="0.4"/>`,
    `<path d="M20,155 Q80,125 155,148 Q230,120 290,150" fill="${mtFar}" opacity="0.35"/><path d="M20,170 L290,170 L290,210 L20,210 Z" fill="${gndLight}" opacity="0.25"/><circle cx="60" cy="175" r="3" fill="#E8A" opacity="0.5"/><circle cx="75" cy="178" r="2.5" fill="#FA5" opacity="0.45"/><circle cx="95" cy="173" r="3" fill="#F9C" opacity="0.5"/><circle cx="130" cy="174" r="3" fill="#FA5" opacity="0.45"/><circle cx="150" cy="177" r="2.5" fill="#F9C" opacity="0.5"/><circle cx="190" cy="176" r="3" fill="#FA5" opacity="0.5"/><circle cx="210" cy="175" r="2.5" fill="#F9C" opacity="0.45"/>`,
  ];

  const sceneIdx = station.id % scenes.length;
  const seriesLabel = {ocean:"海",mountain:"山",onsen:"湯",castle:"城",sakura:"花",scenic:"景",dog:"犬",rv:"車"}[series];
  const nameSize = station.name.length > 6 ? 16 : station.name.length > 4 ? 20 : 24;
  const locShort = station.location.split(/[市町村区郡]/)[0] || "";

  return `<svg viewBox="0 0 310 310" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${pid}sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${isSunset?sunsetCol:skyTop}"/>
        <stop offset="100%" stop-color="${skyBot}"/>
      </linearGradient>
      <clipPath id="${pid}clip"><circle cx="155" cy="155" r="145"/></clipPath>
    </defs>
    <circle cx="155" cy="155" r="148" fill="#F5F0E8" stroke="${rs.border}" stroke-width="3"/>
    <g clip-path="url(#${pid}clip)">
      <rect x="5" y="5" width="300" height="300" fill="url(#${pid}sky)"/>
      ${isSunset?`<circle cx="240" cy="110" r="25" fill="hsl(35,80%,75%)" opacity="0.5"/><circle cx="240" cy="110" r="15" fill="hsl(40,90%,82%)" opacity="0.6"/>`:`<circle cx="220" cy="80" r="10" fill="#fff" opacity="0.3"/><circle cx="235" cy="85" r="12" fill="#fff" opacity="0.25"/><circle cx="90" cy="70" r="8" fill="#fff" opacity="0.2"/>`}
      ${scenes[sceneIdx]}
      <rect x="5" y="200" width="300" height="110" fill="${gndCol}" opacity="0.15"/>
    </g>
    <circle cx="155" cy="155" r="145" fill="none" stroke="${rs.border}" stroke-width="3"/>
    <circle cx="155" cy="155" r="139" fill="none" stroke="${rs.border}" stroke-width="0.8" opacity="0.2"/>
    <rect x="45" y="225" width="220" height="50" rx="6" fill="rgba(255,255,255,0.85)"/>
    <text x="155" y="248" text-anchor="middle" font-size="${nameSize}" fill="#3A3020" font-weight="900" font-family="serif">${station.name}</text>
    <text x="155" y="266" text-anchor="middle" font-size="9" fill="#8B7355" font-weight="600">${station.pref} ${locShort}</text>
    ${seriesLabel?`<circle cx="260" cy="55" r="16" fill="${rs.bg}" opacity="0.85" stroke="#fff" stroke-width="1.5"/><text x="260" y="60" text-anchor="middle" fill="#fff" font-size="12" font-weight="900">${seriesLabel}</text>`:""}
  </svg>`;
}

async function main() {
  const SKIP_EXISTING = process.env.OVERWRITE !== '1';
  const existing = new Set(SKIP_EXISTING ? readdirSync(IMG_DIR).filter(f => f.endsWith('.png')) : []);

  const toGen = STATIONS.filter(s => !existing.has(`stamp_${s.id}.png`));
  console.log(`生成対象: ${toGen.length}枚 (既存スキップ: ${existing.size}枚)\n`);
  if (toGen.length === 0) { console.log('すべて生成済み！'); return; }

  const t0 = Date.now();
  let ok = 0, fail = 0;
  const BATCH = 50;

  for (let i = 0; i < toGen.length; i += BATCH) {
    const batch = toGen.slice(i, i + BATCH);
    await Promise.all(batch.map(async station => {
      try {
        const svg = buildSVG(station);
        const png = await sharp(Buffer.from(svg)).resize(360, 360).png({ compressionLevel: 6 }).toBuffer();
        writeFileSync(join(IMG_DIR, `stamp_${station.id}.png`), png);
        progress[station.id] = { status: 'done', file: `stamp_${station.id}.png`, ts: new Date().toISOString() };
        ok++;
      } catch (e) {
        progress[station.id] = { status: 'error', error: e.message };
        fail++;
      }
    }));
    process.stdout.write(`\r[${ok + fail}/${toGen.length}] OK:${ok} FAIL:${fail}`);
  }

  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n\n=== 完了 ===`);
  console.log(`OK: ${ok} / FAIL: ${fail} / ${sec}秒 (${(sec/ok*1000).toFixed(0)}ms/枚)`);
  console.log(`累計: ${Object.values(progress).filter(p=>p.status==='done').length}/${STATIONS.length}枚`);
}

main().catch(e => { console.error(e); process.exit(1); });
