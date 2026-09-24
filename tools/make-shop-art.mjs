// Generates theme-matched shop artwork (flat vector clipart) into public/assets/shop/.
// Deterministic, dependency-free. Re-run: `node tools/make-shop-art.mjs`
// Palette matches docs/brand-guidelines.md: off-black, bone, smoke, ember.

import { mkdir, writeFile } from 'node:fs/promises';

const OUT = new URL('../public/assets/shop/', import.meta.url);

const INK = '#0C0A09';
const BONE = '#E7E5E4';
const BONE2 = '#D6D3D1';
const SHADE = '#A8A29E';
const DARK = '#292524';
const EMBER = '#C2410C';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const SANS = `system-ui, -apple-system, 'Segoe UI', sans-serif`;

const bg = (w, h, glow) => {
  let grid = '';
  for (let x = 80; x < w; x += 80) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#FAFAF9" stroke-opacity="0.05"/>`;
  for (let y = 80; y < h; y += 80) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#FAFAF9" stroke-opacity="0.05"/>`;
  return `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C1917"/><stop offset="1" stop-color="#0C0A09"/></linearGradient>
<radialGradient id="gl" cx="0.5" cy="0.36" r="0.6"><stop offset="0" stop-color="${glow}" stop-opacity="0.30"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>${grid}<rect width="${w}" height="${h}" fill="url(#gl)"/>
<rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="#FAFAF9" stroke-opacity="0.14" stroke-width="2"/>`;
};

const topMark = (w, y = 84) => `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="8" fill="${SHADE}">ELITE HUMAN</text>`;

const caption = (w, h, name, pillar, accent = SHADE) =>
  `<text x="${w / 2}" y="${h - 72}" text-anchor="middle" font-family="${MONO}" font-size="30" letter-spacing="6" fill="#FAFAF9">${name}</text>
<text x="${w / 2}" y="${h - 36}" text-anchor="middle" font-family="${MONO}" font-size="22" letter-spacing="6" fill="${accent}">${pillar}</text>`;

const O = `stroke="${INK}" stroke-width="7" stroke-linejoin="round"`;
const fold = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.22" stroke-width="4" stroke-linecap="round"/>`;

// ---- garments (800x1000 stage, centered x=400) ----
const tee = (boxy = false) => {
  const sh = boxy ? { l: 285, r: 515, sL: 195, sR: 605, bot: 740 } : { l: 310, r: 490, sL: 230, sR: 570, bot: 780 };
  return `<path d="M${sh.l} 250 L${sh.l - 80} 280 L${sh.sL - 60} 410 L${sh.sL + 15} 445 L${sh.l - 45} 375 L${sh.l - 45} ${sh.bot} L${sh.r + 45} ${sh.bot} L${sh.r + 45} 375 L${sh.sR - 15} 445 L${sh.sR + 60} 410 L${sh.r + 80} 280 L${sh.r} 250 C${sh.r - 10} 290 ${440} 310 400 310 C360 310 ${sh.l + 10} 290 ${sh.l} 250 Z" fill="${BONE}" ${O}/>
<path d="M350 250 C360 288 380 302 400 302 C420 302 440 288 450 250" fill="none" stroke="${INK}" stroke-width="6"/>
<line x1="${sh.l - 45}" y1="${sh.bot - 28}" x2="${sh.r + 45}" y2="${sh.bot - 28}" stroke="${INK}" stroke-opacity="0.35" stroke-width="4"/>
${fold(`M340 420 C350 520 345 620 335 ${sh.bot - 60}`)}${fold(`M460 420 C450 520 455 620 465 ${sh.bot - 60}`)}
<text x="400" y="470" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="44" letter-spacing="4" fill="${INK}">EH</text>`;
};

const stringer = () => `<path d="M345 250 L305 265 C293 360 288 460 288 545 L288 780 L512 780 L512 545 C512 460 507 360 495 265 L455 250 C448 284 426 302 400 302 C374 302 352 284 345 250 Z" fill="${BONE}" ${O}/>
<path d="M350 250 C360 288 380 302 400 302 C420 302 440 288 450 250" fill="none" stroke="${INK}" stroke-width="6"/>
<path d="M305 265 C293 360 288 460 288 545" fill="none" stroke="${DARK}" stroke-width="8"/>
<path d="M495 265 C507 360 512 460 512 545" fill="none" stroke="${DARK}" stroke-width="8"/>
<line x1="288" y1="752" x2="512" y2="752" stroke="${INK}" stroke-opacity="0.35" stroke-width="4"/>
<text x="400" y="640" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="40" letter-spacing="4" fill="${INK}">EH</text>`;

const shorts = () => `<rect x="300" y="300" width="200" height="48" rx="8" fill="${DARK}" ${O}/>
<line x1="385" y1="348" x2="380" y2="400" stroke="${BONE2}" stroke-width="6" stroke-linecap="round"/>
<line x1="415" y1="348" x2="420" y2="400" stroke="${BONE2}" stroke-width="6" stroke-linecap="round"/>
<path d="M300 348 L500 348 L526 600 L424 600 L400 468 L376 600 L274 600 Z" fill="${BONE}" ${O}/>
<line x1="300" y1="348" x2="274" y2="600" stroke="${INK}" stroke-opacity="0.25" stroke-width="4"/>
<path d="M500 380 L514 560" stroke="${BONE2}" stroke-width="10"/>
<line x1="290" y1="572" x2="380" y2="572" stroke="${INK}" stroke-opacity="0.35" stroke-width="4"/>
<line x1="420" y1="572" x2="510" y2="572" stroke="${INK}" stroke-opacity="0.35" stroke-width="4"/>
<text x="400" y="330" text-anchor="middle" font-family="${MONO}" font-size="20" letter-spacing="4" fill="${BONE2}">EH · 5"</text>`;

const compression = () => `<path d="M335 255 L275 290 L232 690 L284 702 L330 470 Z" fill="${BONE2}" ${O}/>
<path d="M465 255 L525 290 L568 690 L516 702 L470 470 Z" fill="${BONE2}" ${O}/>
<path d="M335 250 L465 250 L476 780 L324 780 Z" fill="${BONE}" ${O}/>
<path d="M352 250 C362 286 381 300 400 300 C419 300 438 286 448 250" fill="none" stroke="${INK}" stroke-width="6"/>
<line x1="340" y1="420" x2="460" y2="420" stroke="${INK}" stroke-opacity="0.25" stroke-width="4"/>
<line x1="338" y1="560" x2="462" y2="560" stroke="${INK}" stroke-opacity="0.25" stroke-width="4"/>
<rect x="232" y="660" width="52" height="42" fill="${DARK}" ${O}/><rect x="516" y="660" width="52" height="42" fill="${DARK}" ${O}/>
<text x="400" y="500" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="38" letter-spacing="4" fill="${INK}">EH</text>`;

const hoodie = (zip, emberSleeve) => {
  const sleeveL = emberSleeve ? EMBER : BONE2;
  return `<path d="M322 268 C314 168 486 168 478 268 L448 268 C448 208 352 208 352 268 Z" fill="${DARK}" ${O}/>
<path d="M335 262 L272 300 L236 700 L292 712 L332 470 Z" fill="${sleeveL}" ${O}/>
<path d="M465 262 L528 300 L564 700 L508 712 L468 470 Z" fill="${BONE2}" ${O}/>
<path d="M300 280 L500 280 L516 780 L284 780 Z" fill="${BONE}" ${O}/>
${zip ? `<line x1="400" y1="310" x2="400" y2="780" stroke="${INK}" stroke-width="7"/><rect x="388" y="300" width="24" height="34" rx="4" fill="${DARK}" ${O}/>` : `<path d="M352 282 C362 312 381 324 400 324 C419 324 438 312 448 282" fill="none" stroke="${INK}" stroke-width="6"/>`}
${zip
  ? `<path d="M310 560 L370 560 L360 660 L310 660 Z" fill="${BONE2}" ${O}/><path d="M490 560 L430 560 L440 660 L490 660 Z" fill="${BONE2}" ${O}/>`
  : `<path d="M320 600 L480 600 L455 700 L345 700 Z" fill="${BONE2}" ${O}/>`}
<rect x="284" y="738" width="232" height="42" fill="${BONE2}" ${O}/>
<text x="400" y="480" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="40" letter-spacing="4" fill="${INK}">EH</text>
${emberSleeve ? `<text x="284" y="560" text-anchor="middle" font-family="${MONO}" font-size="22" fill="#FAFAF9" transform="rotate(-78 284 560)">001</text>` : ''}`;
};

const joggers = () => `<rect x="315" y="250" width="170" height="46" rx="8" fill="${DARK}" ${O}/>
<line x1="385" y1="296" x2="380" y2="350" stroke="${BONE2}" stroke-width="6" stroke-linecap="round"/>
<line x1="415" y1="296" x2="420" y2="350" stroke="${BONE2}" stroke-width="6" stroke-linecap="round"/>
<path d="M320 296 L397 296 L391 700 L324 700 Z" fill="${BONE}" ${O}/>
<path d="M403 296 L480 296 L476 700 L409 700 Z" fill="${BONE}" ${O}/>
<path d="M397 296 L403 296 L400 380 Z" fill="${INK}"/>
<rect x="322" y="660" width="70" height="44" rx="8" fill="${DARK}" ${O}/><rect x="408" y="660" width="70" height="44" rx="8" fill="${DARK}" ${O}/>
<line x1="470" y1="330" x2="466" y2="620" stroke="${BONE2}" stroke-width="8"/>
<text x="400" y="273" text-anchor="middle" font-family="${MONO}" font-size="20" letter-spacing="4" fill="${BONE2}">EH</text>`;

const cap = () => `<path d="M250 500 C250 340 550 340 550 500 L550 510 L250 510 Z" fill="${BONE}" ${O}/>
<path d="M400 352 L400 510 M310 380 C330 430 330 470 330 510 M490 380 C470 430 470 470 470 510" stroke="${INK}" stroke-opacity="0.3" stroke-width="4" fill="none"/>
<circle cx="400" cy="348" r="14" fill="${DARK}" ${O}/>
<path d="M262 512 C300 596 500 596 538 512 L566 540 C520 624 280 624 234 540 Z" fill="${BONE2}" ${O}/>
<text x="400" y="462" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="40" letter-spacing="3" fill="${INK}">EH</text>`;

const socks = () => {
  let s = '';
  [0, 1, 2].forEach((i) => {
    const x = 235 + i * 125;
    s += `<rect x="${x}" y="380" width="70" height="200" rx="12" fill="${BONE}" ${O}/>
<path d="M${x} 580 L${x} 640 L${x + 150} 640 L${x + 150} 596 L${x + 70} 596 L${x + 70} 580 Z" fill="${BONE}" ${O}/>
<rect x="${x}" y="420" width="70" height="26" fill="${i === 1 ? EMBER : DARK}"/>`;
  });
  return s + `<text x="400" y="720" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="6" fill="${SHADE}">3-PACK</text>`;
};

const graphicTee = () => tee(false) + `
<rect x="312" y="520" width="176" height="180" fill="${INK}"/>
<rect x="330" y="540" width="140" height="22" fill="${BONE}"/><rect x="330" y="570" width="140" height="22" fill="${SHADE}"/><rect x="330" y="600" width="140" height="22" fill="${EMBER}"/>
<text x="400" y="668" text-anchor="middle" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${BONE}">001/300</text>`;

const beanie = () => {
  let ribs = '';
  for (let x = 295; x <= 505; x += 30) ribs += `<line x1="${x}" y1="580" x2="${x}" y2="660" stroke="${INK}" stroke-opacity="0.3" stroke-width="4"/>`;
  return `<path d="M275 580 C275 420 525 420 525 580 Z" fill="${BONE}" ${O}/>
<path d="M400 430 C360 470 340 520 338 580 M400 430 C440 470 460 520 462 580" stroke="${INK}" stroke-opacity="0.25" stroke-width="4" fill="none"/>
<rect x="275" y="560" width="250" height="110" rx="14" fill="${BONE2}" ${O}/>${ribs}
<rect x="360" y="598" width="80" height="34" rx="4" fill="${EMBER}" stroke="${INK}" stroke-width="4"/>
<text x="400" y="623" text-anchor="middle" font-family="${MONO}" font-size="22" fill="#FAFAF9">EH</text>`;
};

const kit = () => `<rect x="170" y="430" width="230" height="300" rx="8" fill="${BONE}" ${O}/>
<path d="M215 430 C215 370 275 370 275 430 M325 430 C325 370 385 370 385 430" fill="none" stroke="${INK}" stroke-width="9"/>
<rect x="195" y="500" width="180" height="18" fill="${INK}"/><rect x="195" y="526" width="180" height="18" fill="${SHADE}"/><rect x="195" y="552" width="120" height="18" fill="${EMBER}"/>
<text x="285" y="640" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="3" fill="${INK}">PRACTICE</text>
<rect x="450" y="330" width="64" height="56" rx="10" fill="${DARK}" ${O}/>
<rect x="428" y="386" width="108" height="344" rx="42" fill="${BONE}" ${O}/>
<rect x="428" y="520" width="108" height="56" fill="${EMBER}" stroke="${INK}" stroke-width="5"/>
<text x="482" y="556" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="30" fill="#FAFAF9">EH</text>
<line x1="448" y1="420" x2="448" y2="700" stroke="${INK}" stroke-opacity="0.25" stroke-width="4"/>
<rect x="200" y="770" width="400" height="40" rx="20" fill="${DARK}" ${O} transform="rotate(-8 400 790)"/>
<rect x="200" y="770" width="400" height="40" rx="20" fill="none" stroke="${BONE2}" stroke-width="3" stroke-dasharray="10 8" transform="rotate(6 400 790)"/>`;

// ---- page art ----
const hero = () => `${bg(1000, 1200, EMBER)}
<rect x="310" y="300" width="380" height="18" fill="${BONE}"/>
<rect x="270" y="282" width="54" height="54" fill="${BONE}"/><rect x="676" y="282" width="54" height="54" fill="${BONE}"/>
<circle cx="500" cy="309" r="72" fill="none" stroke="${BONE}" stroke-width="12"/>
<circle cx="500" cy="309" r="26" fill="${EMBER}"/>
${topMark(1000, 130)}
<text x="500" y="600" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="128" letter-spacing="-2" fill="#FAFAF9">WEAR THE</text>
<text x="500" y="740" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="128" letter-spacing="-2" fill="#FAFAF9">DISCIPLINE<tspan fill="${EMBER}">.</tspan></text>
<text x="500" y="812" text-anchor="middle" font-family="${MONO}" font-size="26" letter-spacing="5" fill="${SHADE}">TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT</text>
<rect x="190" y="880" width="190" height="16" fill="#FAFAF9"/><rect x="405" y="880" width="190" height="16" fill="${SHADE}"/><rect x="620" y="880" width="190" height="16" fill="${EMBER}"/>
<text x="285" y="922" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="4" fill="#FAFAF9">BODY</text>
<text x="500" y="922" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="4" fill="${SHADE}">MIND</text>
<text x="715" y="922" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="4" fill="${EMBER}">SPIRIT</text>
<text x="500" y="1080" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="4" fill="${SHADE}">240–480GSM · FREE SHIPPING $150+</text>`;

const pillarCard = (letter, name, tagline, cta, accent) => `${bg(800, 600, accent)}
<text x="80" y="470" font-family="${SANS}" font-weight="800" font-size="340" fill="${accent === EMBER ? EMBER : 'none'}" stroke="${accent === EMBER ? EMBER : '#FAFAF9'}" stroke-width="4">${letter}</text>
<text x="410" y="270" font-family="${SANS}" font-weight="800" font-size="64" fill="#FAFAF9">${name}</text>
<text x="410" y="330" font-family="${MONO}" font-size="24" fill="${SHADE}">${tagline}</text>
<rect x="410" y="370" width="180" height="8" fill="${accent}"/>
<text x="410" y="430" font-family="${MONO}" font-size="26" letter-spacing="3" fill="#FAFAF9">${cta}</text>`;

const craft = () => {
  const card = (y, gsm, name, spec, hot) => `<rect x="150" y="${y}" width="600" height="200" rx="6" fill="#292524" stroke="${hot ? EMBER : '#FAFAF9'}" stroke-opacity="${hot ? 1 : 0.2}" stroke-width="${hot ? 4 : 2}"/>
<rect x="170" y="${y + 18}" width="560" height="164" fill="none" stroke="#FAFAF9" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="10 8"/>
<text x="210" y="${y + 120}" font-family="${SANS}" font-weight="800" font-size="84" fill="#FAFAF9">${gsm}</text>
<text x="420" y="${y + 80}" font-family="${SANS}" font-weight="800" font-size="34" fill="#FAFAF9">${name}</text>
<text x="420" y="${y + 120}" font-family="${MONO}" font-size="22" fill="${SHADE}">${spec}</text>
${hot ? `<rect x="150" y="${y}" width="14" height="200" fill="${EMBER}"/>` : ''}`;
  return `${bg(900, 1100, '#FAFAF9')}
${topMark(900, 120)}
<text x="450" y="230" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="72" fill="#FAFAF9">CUT &amp; CLOTH</text>
${card(300, '240', 'HEAVY JERSEY', 'TEES · SIDE-SEAMED', false)}
${card(530, '380', 'STRETCH FLEECE', 'GYM ZIP · 4-WAY', false)}
${card(760, '480', 'FLAGSHIP FLEECE', 'QUIET HOODIE · NO NOISE', true)}`;
};

const artworks = [
  { file: 'apex-heavy-tee.svg', w: 800, h: 1000, glow: '#FAFAF9', body: tee(false), name: 'APEX HEAVY TEE', pillar: 'BODY' },
  { file: 'discipline-stringer.svg', w: 800, h: 1000, glow: '#FAFAF9', body: stringer(), name: 'DISCIPLINE STRINGER', pillar: 'BODY' },
  { file: 'train-2in1-short.svg', w: 800, h: 1000, glow: '#FAFAF9', body: shorts(), name: 'TRAIN 2-IN-1 SHORT', pillar: 'BODY' },
  { file: 'compression-long.svg', w: 800, h: 1000, glow: '#FAFAF9', body: compression(), name: 'COMPRESSION LS', pillar: 'BODY' },
  { file: 'performance-zip.svg', w: 800, h: 1000, glow: '#FAFAF9', body: hoodie(true, false), name: 'PERFORMANCE ZIP', pillar: 'BODY' },
  { file: 'discipline-boxy-tee.svg', w: 800, h: 1000, glow: '#FAFAF9', body: tee(true), name: 'DISCIPLINE BOXY TEE', pillar: 'MIND' },
  { file: 'mind-quiet-hoodie.svg', w: 800, h: 1000, glow: '#FAFAF9', body: hoodie(false, false), name: 'MIND QUIET HOODIE', pillar: 'MIND · CORE' },
  { file: 'ascend-joggers.svg', w: 800, h: 1000, glow: '#FAFAF9', body: joggers(), name: 'ASCEND JOGGERS', pillar: 'MIND' },
  { file: 'elite-dad-cap.svg', w: 800, h: 1000, glow: '#FAFAF9', body: cap(), name: 'ELITE DAD CAP', pillar: 'MIND' },
  { file: 'crew-socks-3pack.svg', w: 800, h: 1000, glow: '#FAFAF9', body: socks(), name: 'CREW SOCKS ×3', pillar: 'MIND' },
  { file: 'trinity-graphic-tee.svg', w: 800, h: 1000, glow: EMBER, body: graphicTee(), name: 'TRINITY TEE · 001', pillar: 'SPIRIT · 300', ember: true },
  { file: 'manifesto-hoodie.svg', w: 800, h: 1000, glow: EMBER, body: hoodie(false, true), name: 'MANIFESTO HOODIE', pillar: 'SPIRIT · 200', ember: true },
  { file: 'spirit-beanie.svg', w: 800, h: 1000, glow: EMBER, body: beanie(), name: 'SPIRIT BEANIE', pillar: 'SPIRIT', ember: true },
  { file: 'practice-kit.svg', w: 800, h: 1000, glow: EMBER, body: kit(), name: 'PRACTICE KIT', pillar: 'SPIRIT · BUNDLE', ember: true },
  { file: 'hero.svg', w: 1000, h: 1200, custom: hero() },
  { file: 'pillar-body.svg', w: 800, h: 600, custom: pillarCard('B', 'BODY', 'Built for sets.', 'SHOP BODY →', '#FAFAF9') },
  { file: 'pillar-mind.svg', w: 800, h: 600, custom: pillarCard('M', 'MIND', 'Quiet uniform.', 'SHOP MIND →', SHADE) },
  { file: 'pillar-spirit.svg', w: 800, h: 600, custom: pillarCard('S', 'SPIRIT', 'Limited Drop 001.', 'SHOP DROP →', EMBER) },
  { file: 'craft.svg', w: 900, h: 1100, custom: craft() },
];

await mkdir(OUT, { recursive: true });
for (const a of artworks) {
  const inner = a.custom ?? `${bg(a.w, a.h, a.glow)}${topMark(a.w)}${a.body}${caption(a.w, a.h, a.name, a.pillar, a.ember ? EMBER : SHADE)}`;
  await writeFile(new URL(a.file, OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a.w} ${a.h}" role="img">${inner}</svg>\n`);
  console.log('✓', a.file);
}
console.log(`Done — ${artworks.length} files in public/assets/shop/`);
