import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = JSON.parse(readFileSync(join(__dirname, '..', 'stamp_catalog.json'), 'utf-8'));
const IMG_DIR = join(__dirname, '..', 'stamp_images');

// Find stamps that need regeneration (missing OR small)
const existingGood = new Set();
for (const f of readdirSync(IMG_DIR)) {
  if (!f.endsWith('.png')) continue;
  const id = parseInt(f.replace('stamp_', '').replace('.png', ''));
  const sz = statSync(join(IMG_DIR, f)).size;
  if (sz >= 45000) existingGood.add(id);
}
const toGen = CATALOG.filter(s => !existingGood.has(s.id));
console.log(`Generating ${toGen.length} watercolor stamps with Puppeteer...`);

// Color themes — white paper + light watercolor washes
const THEMES = {
  ocean:    { bg: '#FAFEFF', c1: '#4A9AD8', c2: '#7DC4F0', c3: '#B0D8F8', c4: '#DCF0FF', accent: '#2A5A8A' },
  mountain: { bg: '#FBFEFB', c1: '#50A855', c2: '#7ED080', c3: '#A8E8A8', c4: '#D4F8D0', accent: '#2A6A2C' },
  onsen:    { bg: '#FFFAF8', c1: '#E88050', c2: '#F0A878', c3: '#F8CCA8', c4: '#FDE8D8', accent: '#904020' },
  castle:   { bg: '#FEFCF8', c1: '#A88050', c2: '#C8A878', c3: '#E0C8A0', c4: '#F0E4D0', accent: '#6A4820' },
  sakura:   { bg: '#FFFAFC', c1: '#F07898', c2: '#F8A0B8', c3: '#FCC8D8', c4: '#FEE8F0', accent: '#B84068' },
  scenic:   { bg: '#FAFEFB', c1: '#58A880', c2: '#80D0A0', c3: '#A8E8C0', c4: '#D0F8E0', accent: '#387858' },
  dog:      { bg: '#FFFCF5', c1: '#D8A048', c2: '#E8C070', c3: '#F0D8A0', c4: '#F8ECD0', accent: '#8A6028' },
  default:  { bg: '#FCFEFC', c1: '#58A860', c2: '#88D090', c3: '#B0F0B0', c4: '#D8FAD8', accent: '#386838' },
};

// Scene elements per series
function getScene(series, id) {
  const r = (id * 7 + 13) % 100;
  const scenes = {
    ocean: `
      <path d="M0,220 Q80,${180+r%30} 160,210 Q240,${195+r%25} 320,215 Q400,${200+r%20} 480,208 L480,300 L0,300Z" fill="THEME_C2" opacity="0.22" filter="url(#wc)"/>
      <path d="M0,240 Q100,${220+r%20} 200,235 Q300,${225+r%15} 400,230 Q450,228 480,232 L480,300 L0,300Z" fill="THEME_C1" opacity="0.18" filter="url(#wc)"/>
      ${[...Array(6)].map((_,i) => `<ellipse cx="${40+i*80+r%30}" cy="${235+i%3*5}" rx="${30+r%15}" ry="3" fill="white" opacity="0.4"/>`).join('')}
      <path d="M${60+r%40},${100+r%30} Q${120+r%30},${60+r%40} ${180+r%50},${110+r%30} Q${150+r%30},${80+r%30} ${200+r%40},${90+r%30}" fill="THEME_C3" opacity="0.15" filter="url(#wc)"/>
    `,
    mountain: `
      <path d="M-20,200 L${60+r%30},${80+r%40} L${140+r%20},180 L${200+r%20},${70+r%30} L${280+r%20},170 L${340+r%30},${90+r%30} L500,190 L500,300 L-20,300Z" fill="THEME_C2" opacity="0.2" filter="url(#wc)"/>
      <path d="M-20,230 L${80+r%40},${130+r%30} L${160+r%20},200 L${250+r%30},${120+r%30} L${350+r%20},210 L500,220 L500,300 L-20,300Z" fill="THEME_C1" opacity="0.15" filter="url(#wc)"/>
      ${[...Array(5)].map((_,i) => `<ellipse cx="${30+i*100+r%40}" cy="${160+i%3*20+r%10}" rx="${12+r%8}" ry="${20+r%10}" fill="THEME_C3" opacity="0.15" filter="url(#wc)"/>`).join('')}
      <path d="M0,260 Q120,${245+r%15} 240,255 Q360,${248+r%12} 480,258 L480,300 L0,300Z" fill="THEME_C4" opacity="0.15" filter="url(#wc)"/>
    `,
    onsen: `
      <path d="M-20,220 L${100+r%30},${120+r%30} L${200+r%20},200 L${320+r%30},${130+r%30} L500,210 L500,300 L-20,300Z" fill="THEME_C3" opacity="0.15" filter="url(#wc)"/>
      <ellipse cx="${220+r%40}" cy="${200+r%20}" rx="60" ry="20" fill="THEME_C2" opacity="0.2" filter="url(#wc)"/>
      ${[...Array(3)].map((_,i) => `<path d="M${200+i*20+r%10},${180+r%10} Q${205+i*20},${160-i*12} ${210+i*20+r%5},${175+r%5}" stroke="THEME_C4" stroke-width="3" fill="none" opacity="0.25" filter="url(#wc)"/>`).join('')}
      <path d="M0,260 Q160,${248+r%12} 320,255 Q420,250 480,258 L480,300 L0,300Z" fill="THEME_C4" opacity="0.12" filter="url(#wc)"/>
    `,
    castle: `
      <path d="M-20,230 L${80+r%40},${140+r%30} L${200+r%20},220 L${300+r%30},${150+r%30} L500,225 L500,300 L-20,300Z" fill="THEME_C3" opacity="0.15" filter="url(#wc)"/>
      <rect x="${180+r%40}" y="${110+r%20}" width="5" height="50" fill="THEME_C1" opacity="0.2" filter="url(#wc)"/>
      <rect x="${220+r%40}" y="${110+r%20}" width="5" height="50" fill="THEME_C1" opacity="0.2" filter="url(#wc)"/>
      <line x1="${172+r%40}" y1="${108+r%20}" x2="${232+r%40}" y2="${108+r%20}" stroke="THEME_C1" stroke-width="3" opacity="0.25"/>
      <line x1="${176+r%40}" y1="${118+r%20}" x2="${228+r%40}" y2="${118+r%20}" stroke="THEME_C1" stroke-width="2" opacity="0.2"/>
      ${[...Array(4)].map((_,i) => `<ellipse cx="${50+i*110+r%30}" cy="${180+i%2*20+r%10}" rx="${14+r%8}" ry="${22+r%10}" fill="THEME_C2" opacity="0.15" filter="url(#wc)"/>`).join('')}
    `,
    sakura: `
      ${[...Array(8)].map((_,i) => `<ellipse cx="${20+i*60+r%30}" cy="${130+i%4*30+r%20}" rx="${10+r%8}" ry="${15+r%10}" fill="THEME_C2" opacity="0.18" filter="url(#wc)"/>`).join('')}
      ${[...Array(15)].map((_,i) => `<circle cx="${r*3+i*31%460}" cy="${80+i*17%200}" r="${3+i%4}" fill="THEME_C1" opacity="${0.12+i%5*0.04}" filter="url(#wc)"/>`).join('')}
      <path d="M0,250 Q120,${238+r%12} 240,245 Q360,${240+r%10} 480,248 L480,300 L0,300Z" fill="THEME_C4" opacity="0.15" filter="url(#wc)"/>
      ${[...Array(5)].map((_,i) => `<circle cx="${50+i*90+r%20}" cy="${240+r%10}" r="${4+r%3}" fill="THEME_C3" opacity="0.2"/>`).join('')}
    `,
    scenic: `
      <path d="M-20,180 L${80+r%30},${80+r%30} L${160+r%20},160 L${240+r%30},${70+r%40} L${340+r%20},170 L500,185 L500,300 L-20,300Z" fill="THEME_C2" opacity="0.18" filter="url(#wc)"/>
      <path d="M0,220 Q80,${210+r%15} 160,218 Q300,${205+r%15} 480,215 L480,300 L0,300Z" fill="THEME_C1" opacity="0.15" filter="url(#wc)"/>
      ${[...Array(4)].map((_,i) => `<ellipse cx="${40+i*120+r%30}" cy="${155+i%2*15}" rx="${10+r%6}" ry="${18+r%8}" fill="THEME_C3" opacity="0.15" filter="url(#wc)"/>`).join('')}
      <path d="M0,235 Q160,228 320,232 Q430,230 480,234 L480,300 L0,300Z" fill="THEME_C2" opacity="0.1" filter="url(#wc)"/>
    `,
  };
  const v = id % 6;
  const defaults = [scenes.mountain, scenes.ocean, scenes.scenic, scenes.castle, scenes.sakura, scenes.onsen];
  return scenes[series] || defaults[v];
}

function buildSVG(stamp) {
  const theme = THEMES[stamp.series] || THEMES.default;
  const scene = getScene(stamp.series, stamp.id);
  const id = stamp.id;
  const r = (id * 13 + 7) % 100;

  // Replace theme color placeholders
  const coloredScene = scene
    .replace(/THEME_C1/g, theme.c1)
    .replace(/THEME_C2/g, theme.c2)
    .replace(/THEME_C3/g, theme.c3)
    .replace(/THEME_C4/g, theme.c4);

  // Font size based on name length
  const name = stamp.station_name;
  const fontSize = name.length <= 3 ? 38 : name.length <= 5 ? 32 : name.length <= 7 ? 26 : name.length <= 10 ? 22 : 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 480 480">
  <defs>
    <!-- Watercolor texture filter — gentle displacement -->
    <filter id="wc" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="${id}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <!-- Paper texture — light grain only, no darkening -->
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${id+100}" result="grain"/>
      <feColorMatrix type="saturate" values="0" in="grain" result="bw"/>
      <feComponentTransfer in="bw" result="faint">
        <feFuncA type="linear" slope="0.03"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="faint" mode="normal"/>
    </filter>
    <!-- Soft glow -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <!-- Watercolor edge -->
    <filter id="wcEdge" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" seed="${id*3}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="0.5"/>
    </filter>
    <clipPath id="circle">
      <circle cx="240" cy="240" r="224"/>
    </clipPath>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${theme.bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.c4}" stop-opacity="0.3"/>
    </radialGradient>
    <!-- Sky gradient — very light -->
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="60%" stop-color="${theme.c4}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${theme.c3}" stop-opacity="0.25"/>
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="240" cy="240" r="228" fill="${theme.bg}"/>

  <g clip-path="url(#circle)">
    <!-- Sky -->
    <rect width="480" height="480" fill="url(#sky)"/>

    <!-- Watercolor wash blobs -->
    ${[...Array(8)].map((_,i) => {
      const cx = (id*37+i*67)%440+20, cy = (id*23+i*53)%350+20;
      const rx = 50+(id*7+i*11)%60, ry = 35+(id*5+i*13)%45;
      const colors = [theme.c1, theme.c2, theme.c3, theme.c4];
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${colors[i%4]}" opacity="${0.03+i%4*0.015}" filter="url(#wc)"/>`;
    }).join('\n    ')}

    <!-- Scene elements -->
    ${coloredScene}

    <!-- Clouds -->
    ${[...Array(3)].map((_,i) => {
      const cx = 80+i*150+(id*11)%60, cy = 50+(id*7+i*19)%40;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${35+(id+i*7)%20}" ry="${12+(id+i*5)%8}" fill="white" opacity="0.15" filter="url(#wc)"/>
    <ellipse cx="${cx+15}" cy="${cy-5}" rx="${25+(id+i*3)%15}" ry="${10+(id+i*9)%6}" fill="white" opacity="0.12" filter="url(#wc)"/>`;
    }).join('\n    ')}

    <!-- Paper texture overlay -->
    <rect width="480" height="480" filter="url(#paper)" opacity="0.5"/>

    <!-- Name banner -->
    <rect x="40" y="355" width="400" height="95" fill="white" opacity="0.85" filter="url(#wcEdge)"/>
    <line x1="60" y1="358" x2="420" y2="358" stroke="${theme.accent}" stroke-width="0.5" opacity="0.3"/>

    <!-- Station name -->
    <text x="240" y="${fontSize > 30 ? 398 : 395}" text-anchor="middle" font-family="'Yu Mincho', 'Hiragino Mincho ProN', serif" font-size="${fontSize}" font-weight="bold" fill="${theme.accent}" opacity="0.85" filter="url(#glow)">${name}</text>

    <!-- Prefecture -->
    <text x="240" y="432" text-anchor="middle" font-family="'Yu Gothic', sans-serif" font-size="14" fill="${theme.accent}" opacity="0.5">${stamp.pref}</text>
  </g>

  <!-- Border rings -->
  <circle cx="240" cy="240" r="226" fill="none" stroke="${theme.c1}" stroke-width="5" opacity="0.6"/>
  <circle cx="240" cy="240" r="220" fill="none" stroke="${theme.c2}" stroke-width="1" opacity="0.3"/>
  <circle cx="240" cy="240" r="230" fill="none" stroke="${theme.accent}" stroke-width="0.5" opacity="0.2"/>

  <!-- Rarity badge -->
  <circle cx="420" cy="60" r="14" fill="${stamp.rarity === 'legendary' ? '#D4A017' : stamp.rarity === 'epic' ? '#9B6DD7' : stamp.rarity === 'rare' ? '#2B6090' : '#5A8A60'}" opacity="0.7"/>
  <circle cx="417" cy="57" r="5" fill="white" opacity="0.25"/>
</svg>`;
}

// Main
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512 });

  let done = 0, total = toGen.length;
  const start = Date.now();

  for (const stamp of toGen) {
    const svg = buildSVG(stamp);
    const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden;background:transparent}</style></head><body>${svg}</body></html>`;

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: join(IMG_DIR, `stamp_${stamp.id}.png`), type: 'png', omitBackground: false });

    done++;
    if (done % 20 === 0 || done === total) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      const rate = (done / elapsed * 60).toFixed(1);
      const eta = ((total - done) / (done / elapsed) / 60).toFixed(1);
      console.log(`${done}/${total} (${rate}/min, ${elapsed}s, ~${eta}min left)`);
    }
  }

  await browser.close();
  const totalMin = ((Date.now() - start) / 60000).toFixed(1);
  console.log(`\nDONE: ${total} stamps in ${totalMin} min`);
})();
