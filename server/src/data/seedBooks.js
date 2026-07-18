// Placeholder cover reused for every book until real cover URLs are available.
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=900&q=80";

const seedBooks = [
  // ------------------------- Nursery -------------------------
  {
    title: "Cursive Writing - 0",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Cursive Writing - 1",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Enjoy Rhymes - 1",
    category: "Nursery",
    price: 140,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Enjoy Rhymes - 2",
    category: "Nursery",
    price: 140,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - A",
    category: "Nursery",
    price: 110,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - B",
    category: "Nursery",
    price: 110,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - C",
    category: "Nursery",
    price: 110,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - 1",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - 2",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - 3",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - 4",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Play and Create - 5",
    category: "Nursery",
    price: 120,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "মজায় ভরা Bilingual Rhymes - 1",
    category: "Nursery",
    price: 100,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "মজায় ভরা Bilingual Rhymes - 2",
    category: "Nursery",
    price: 100,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  // ------------- Madhyamik list (category: Madhyamik per catalogue) -------------
  {
    title: "Exploring Physical Science Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Life Science Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Mathematics Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring History Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Geography Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring English Teacher (মাধ্যমিক সাজেশন -2027)",
    author: "Mukherjee & Banerjee",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring বাংলা মেন্টর (মাধ্যমিক সাজেশন -2027)",
    author: "Aloke Bandhan (আলোক বর্ধন)",
    category: "Madhyamik",
    price: 160,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  // ------------------------- Higher Secondary -------------------------
  {
    title: "Exploring Biology Teacher (Suggestion -2026 XII)",
    author: "S. N. Mukherjee & B. N. Banerjee",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Physics Teacher (Suggestion -2026 XII)",
    author: "S. N. Mukherjee & B. N. Banerjee",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Chemistry Teacher (Suggestion -2026 XII)",
    author: "S. N. Mukherjee & B. N. Banerjee",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Computer Application (Suggestion -2026 XII)",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring Environmental Studies (Suggestion -2026 XII)",
    author: "S. N. Mukherjee & B. N. Banerjee",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring English Teacher (Suggestion -2026 XII)",
    author: "S. N. Mukherjee & B. N. Banerjee",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  },
  {
    title: "Exploring বাংলা মেন্টর (Suggestion -2026 XII)",
    author: "Aloke Bandhan (আলোক বর্ধন)",
    category: "H.S.",
    price: 150,
    image: PLACEHOLDER_IMAGE,
    isBestSeller: false,
    searchCount: 0
  }
];

export default seedBooks;
