import puppeteer from 'puppeteer';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = JSON.parse(readFileSync(join(__dirname, '..', 'stamp_catalog.json'), 'utf-8'));
const IMG_DIR = join(__dirname, '..', 'stamp_images');

const existingGood = new Set();
for (const f of readdirSync(IMG_DIR)) {
  if (!f.endsWith('.png')) continue;
  const id = parseInt(f.replace('stamp_', '').replace('.png', ''));
  const sz = statSync(join(IMG_DIR, f)).size;
  if (sz >= 45000) existingGood.add(id);
}
const toGen = CATALOG.filter(s => !existingGood.has(s.id));
console.log(`Generating ${toGen.length} light stamps...`);

const THEMES = {
  ocean:    { bg:'#F8FBFF', ring:'#6BAED6', light:'#DCEEFB', mid:'#A8D4F0', text:'#2C5F8A' },
  mountain: { bg:'#F8FBF6', ring:'#6AAE6A', light:'#DCEFD8', mid:'#A8DCA5', text:'#2C6A2E' },
  onsen:    { bg:'#FFFAF7', ring:'#D48A6A', light:'#FAE0D2', mid:'#F0C0A0', text:'#8A4420' },
  castle:   { bg:'#FDFAF5', ring:'#B89868', light:'#F0E4D0', mid:'#E0CCA8', text:'#6A4820' },
  sakura:   { bg:'#FFF8FA', ring:'#E07898', light:'#FDE0EA', mid:'#F8B8D0', text:'#A03058' },
  scenic:   { bg:'#F6FBF8', ring:'#5AAA80', light:'#D4F0E0', mid:'#A0D8B8', text:'#2A6848' },
  dog:      { bg:'#FFFBF2', ring:'#C8A050', light:'#F4E8D0', mid:'#E8D0A8', text:'#7A5828' },
  default:  { bg:'#F8FAF6', ring:'#6AAA68', light:'#DCF0D8', mid:'#B0DCA8', text:'#2A6830' },
};

function buildSVG(stamp) {
  const s = stamp.series || 'default';
  const t = THEMES[s] || THEMES.default;
  const id = stamp.id;
  const r = (id * 7 + 13) % 100;
  const name = stamp.station_name;
  const fontSize = name.length <= 3 ? 40 : name.length <= 5 ? 34 : name.length <= 7 ? 28 : name.length <= 10 ? 22 : 18;
  const rarity = stamp.rarity || 'common';
  const rarityCol = { legendary:'#D4A017', epic:'#9B6DD7', rare:'#4A90C8', common:'#7AAA80' }[rarity];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 480 480">
  <defs>
    <clipPath id="c"><circle cx="240" cy="240" r="222"/></clipPath>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.light}"/>
    </linearGradient>
    <radialGradient id="sun" cx="${30+r%40}%" cy="20%" r="35%">
      <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <circle cx="240" cy="240" r="226" fill="${t.bg}"/>

  <g clip-path="url(#c)">
    <!-- Sky -->
    <rect width="480" height="480" fill="url(#sky)"/>
    <!-- Sun glow -->
    <rect width="480" height="480" fill="url(#sun)"/>

    <!-- Distant mountains - very light -->
    <path d="M-20,${250+r%15} Q${60+r%30},${190+r%30} ${140+r%20},${220+r%15} Q${200+r%20},${180+r%25} ${270+r%15},${210+r%15} Q${330+r%20},${185+r%20} ${400+r%15},${215+r%15} L500,${240+r%10} L500,340 L-20,340Z" fill="${t.mid}" opacity="0.15"/>
    <path d="M-20,${265+r%10} Q${80+r%30},${230+r%20} ${180+r%20},${250+r%10} Q${280+r%20},${225+r%15} ${380+r%15},${245+r%10} L500,${255+r%10} L500,340 L-20,340Z" fill="${t.ring}" opacity="0.1"/>

    <!-- Ground -->
    <path d="M-20,${300+r%10} Q120,${285+r%10} 240,${292+r%8} Q360,${288+r%8} 500,${295+r%10} L500,480 L-20,480Z" fill="${t.light}" opacity="0.5"/>

    <!-- Subtle accent elements based on series -->
    ${s === 'ocean' ? `
      <path d="M-20,${290+r%8} Q100,${280+r%10} 240,${286+r%6} Q380,${282+r%8} 500,${288+r%8} L500,340 L-20,340Z" fill="${t.mid}" opacity="0.12"/>
      ${[...Array(4)].map((_,i) => `<line x1="${i*120+r%30}" y1="${295+i%2*3}" x2="${i*120+60+r%20}" y2="${295+i%2*3}" stroke="white" stroke-width="1" opacity="0.3"/>`).join('')}
    ` : s === 'sakura' ? `
      ${[...Array(8)].map((_,i) => `<circle cx="${30+i*58+r%20}" cy="${200+i%4*25+r%15}" r="${2+i%3}" fill="${t.ring}" opacity="${0.08+i%3*0.04}"/>`).join('')}
    ` : s === 'onsen' ? `
      ${[...Array(3)].map((_,i) => `<path d="M${210+i*20},${240+r%10} Q${215+i*20},${220+r%10} ${220+i*20},${235+r%10}" stroke="${t.mid}" stroke-width="1.5" fill="none" opacity="0.15"/>`).join('')}
    ` : s === 'castle' ? `
      <rect x="${210+r%30}" y="${200+r%15}" width="3" height="35" fill="${t.ring}" opacity="0.1"/>
      <rect x="${240+r%30}" y="${200+r%15}" width="3" height="35" fill="${t.ring}" opacity="0.1"/>
      <line x1="${205+r%30}" y1="${198+r%15}" x2="${248+r%30}" y2="${198+r%15}" stroke="${t.ring}" stroke-width="2" opacity="0.12"/>
    ` : ''}

    <!-- Soft clouds -->
    ${[...Array(2)].map((_,i) => `
      <ellipse cx="${100+i*250+r%40}" cy="${60+r%30+i*15}" rx="${40+r%15}" ry="${12+r%5}" fill="white" opacity="0.5"/>
      <ellipse cx="${115+i*250+r%40}" cy="${55+r%30+i*15}" rx="${28+r%10}" ry="${9+r%4}" fill="white" opacity="0.4"/>
    `).join('')}

    <!-- Name banner -->
    <rect x="30" y="360" width="420" height="100" fill="white" opacity="0.92" rx="4"/>
    <line x1="50" y1="363" x2="430" y2="363" stroke="${t.ring}" stroke-width="0.5" opacity="0.25"/>

    <!-- Station name -->
    <text x="240" y="${fontSize > 30 ? 405 : 402}" text-anchor="middle" font-family="'Yu Mincho','Hiragino Mincho ProN',serif" font-size="${fontSize}" font-weight="bold" fill="${t.text}" opacity="0.9">${name}</text>
    <!-- Prefecture -->
    <text x="240" y="440" text-anchor="middle" font-family="'Yu Gothic',sans-serif" font-size="14" fill="${t.text}" opacity="0.45">${stamp.pref}</text>
  </g>

  <!-- Border -->
  <circle cx="240" cy="240" r="224" fill="none" stroke="${t.ring}" stroke-width="4" opacity="0.5"/>
  <circle cx="240" cy="240" r="219" fill="none" stroke="${t.ring}" stroke-width="0.5" opacity="0.2"/>

  <!-- Rarity badge -->
  <circle cx="418" cy="62" r="12" fill="${rarityCol}" opacity="0.6"/>
  <circle cx="415" cy="59" r="4" fill="white" opacity="0.3"/>
</svg>`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512 });

  let done = 0;
  const total = toGen.length;
  const start = Date.now();

  for (const stamp of toGen) {
    const svg = buildSVG(stamp);
    const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden}</style></head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(r => setTimeout(r, 150));
    await page.screenshot({ path: join(IMG_DIR, `stamp_${stamp.id}.png`), type: 'png' });
    done++;
    if (done % 20 === 0 || done === total) {
      const sec = ((Date.now() - start) / 1000).toFixed(0);
      const rate = (done / sec * 60).toFixed(1);
      const eta = ((total - done) / (done / sec) / 60).toFixed(1);
      console.log(`${done}/${total} (${rate}/min, ${sec}s, ~${eta}min left)`);
    }
  }

  await browser.close();
  console.log(`DONE: ${total} stamps in ${((Date.now()-start)/60000).toFixed(1)} min`);
})();
