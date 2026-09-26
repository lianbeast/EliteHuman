// Shop catalog. Single read path, mirroring data.js conventions.
// Prices, sizes, inventory authored here for build 3 — placeholders until
// brand confirms them. Photography: real product imagery (Unsplash),
// provenance recorded in .impeccable/provenance.json.

const BASE = import.meta.env.BASE_URL;

export const imageUrl = (product) => `${BASE}assets/img/shop/${product.img}`;

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Discipline Tee',
    nameSub: 'Black · Cotton · 180gsm',
    price: 38,
    pillar: 'IRON',
    img: 'product-1.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    blurb: 'Plain black short-sleeve. No logo. Mark the wearer.',
  },
  {
    id: 'p2',
    name: 'Gains Hoodie',
    nameSub: 'Charcoal · Fleece · 320gsm',
    price: 72,
    pillar: 'IRON',
    img: 'product-2.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    blurb: 'Heavyweight charcoal. Drawstrings, kangaroo pocket, nothing else.',
  },
  {
    id: 'p3',
    name: 'Focus Cap',
    nameSub: 'Black · Five-panel · Cotton twill',
    price: 28,
    pillar: 'MIND',
    img: 'product-3.jpg',
    sizes: ['One size'],
    stock: 40,
    blurb: 'Unstructured five-panel. Worn in, not worn out.',
  },
  {
    id: 'p4',
    name: 'Sprint Trainer',
    nameSub: 'Off-white · Leather · Gum sole',
    price: 96,
    pillar: 'IRON',
    img: 'product-4.jpg',
    sizes: ['7', '8', '9', '10', '11'],
    stock: 12,
    blurb: 'Built for the 400. Gum sole, no branding.',
  },
  {
    id: 'p5',
    name: 'Crew Tee',
    nameSub: 'Off-white · Cotton · 180gsm',
    price: 38,
    pillar: 'MIND',
    img: 'product-5.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    blurb: 'Off-white base layer. Washes darker with every session.',
  },
  {
    id: 'p6',
    name: 'Track Pant',
    nameSub: 'Black · French Terry · 320gsm',
    price: 64,
    pillar: 'IRON',
    img: 'product-6.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    blurb: 'Tapered leg. Drawstring. No pockets.',
  },
];

export const SHOP_META = {
  // Was the literal nav word "Shop" set at 6rem — a label at headline scale,
  // which reads as a placeholder rather than a heading. "The Uniform" is the
  // brand's own word for the clothing and carries the same meaning.
  name: 'The Uniform',
  blurb: 'Six pieces. No logo.',
};

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const fmtPrice = (n) => `$${n}`;