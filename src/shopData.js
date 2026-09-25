// Shop catalog. Single read path, mirroring data.js conventions.
// Prices, sizes, and inventory are authored here for this build and are
// placeholders until the brand confirms them. Photography is real product
// imagery (Unsplash) — provenance recorded in .impeccable/provenance.json.

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
    blurb: 'Plain black short-sleeve. No logo. The mark is the wearer.',
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
    blurb: 'Built for the track and the street. Grip first, look second.',
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
    blurb: 'The other colour. Same cut. Different day.',
  },
  {
    id: 'p6',
    name: 'Track Pant',
    nameSub: 'Black · French terry · Drawstring',
    price: 64,
    pillar: 'IRON',
    img: 'product-6.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    blurb: 'Tapered. Warm-up to errand without changing.',
  },
];

export const SHOP_META = {
  name: 'Shop',
  blurb: 'The uniform. Six pieces, no logo, no season.',
};

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const fmtPrice = (n) => `$${n}`;