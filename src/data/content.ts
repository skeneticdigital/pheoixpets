// ── All copy and structured content lives here so it can be swapped later. ──

export const brand = {
  name: 'Phoenix Pets',
  logo: '/phoenix_pets_logo.jpg',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export type PetKind = 'bird' | 'dog' | 'cat' | 'pigeon' | 'hamster' | 'rabbit' | 'guinea_pig' | 'turtle' | 'reptile' | 'rooster' | 'mammal';

export interface PetAsset {
  id: string;
  kind: PetKind;
  breed: string;
  file: string; // intended final asset path
}

export const heroSlides: PetAsset[] = [
  { id: 's1', kind: 'dog', breed: 'Golden Retriever', file: 'assets/dogs/dog-01.webp' },
  { id: 's2', kind: 'cat', breed: 'Persian', file: 'assets/cats/cat-01.webp' },
  { id: 's3', kind: 'bird', breed: 'Macaw', file: 'assets/birds/bird-01.webp' },
  { id: 's4', kind: 'dog', breed: 'Beagle', file: 'assets/dogs/dog-02.webp' },
  { id: 's5', kind: 'cat', breed: 'Bengal', file: 'assets/cats/cat-02.webp' },
  { id: 's6', kind: 'bird', breed: 'Cockatiel', file: 'assets/birds/bird-02.webp' },
  { id: 's7', kind: 'dog', breed: 'German Shepherd', file: 'assets/dogs/dog-03.webp' },
];

export const heroContent = {
  eyebrow: 'Phoenix Pets',
  title: 'Everything Your Pet Needs',
  description:
    'Discover premium care, products and essentials for the pets who mean everything to you. We do not sell pets, just the best supplies for them.',
  primaryButton: 'Shop Now',
  secondaryButton: 'Learn More',
};

export const aboutContent = {
  eyebrow: 'Our Story',
  heading: 'Care, considered down to the last whisker.',
  paragraph:
    "Furrow began with one simple belief: pets deserve the same thought and quality we'd want for ourselves. Every product on our shelves is chosen by people who share their homes with dogs, cats and birds of their own — tested, tasted (by them, not us) and loved before it ever reaches you.",
  cta: 'Learn Our Story',
  stat: { value: '12+', label: 'Years caring for pets' },
};

export interface Category {
  id: string;
  kind: PetKind;
  title: string;
  description: string;
  button: string;
  breeds: string[];
  productsCount: number;
}

export const categories: Category[] = [
  {
    id: 'reptiles',
    kind: 'reptile',
    title: 'Reptiles',
    description: 'Specialized habitats, heating, and nutrition for your scaled companions.',
    button: 'Explore Reptiles',
    breeds: [],
    productsCount: 56,
  },

  {
    id: 'bird',
    kind: 'bird',
    title: 'Bird',
    description: 'Aviary essentials, seed blends and enrichment for feathered family members.',
    button: 'Explore Bird',
    breeds: [],
    productsCount: 124,
  },
  {
    id: 'dog',
    kind: 'dog',
    title: 'Dog',
    description: 'Food, gear and grooming for every breed, from puppyhood to their golden years.',
    button: 'Explore Dog',
    breeds: [],
    productsCount: 342,
  },
  {
    id: 'cat',
    kind: 'cat',
    title: 'Cat',
    description: 'Nutrition and comfort essentials tailored to independent, curious companions.',
    button: 'Explore Cat',
    breeds: [],
    productsCount: 289,
  },
  {
    id: 'pigeon',
    kind: 'pigeon',
    title: 'Pigeon',
    description: 'Premium feeds and health essentials for pigeons.',
    button: 'Explore Pigeon',
    breeds: [],
    productsCount: 45,
  },
  {
    id: 'hamster',
    kind: 'hamster',
    title: 'Hamster',
    description: 'Cozy bedding and balanced nutrition for your tiny friends.',
    button: 'Explore Hamster',
    breeds: [],
    productsCount: 32,
  },
  {
    id: 'rabbit',
    kind: 'rabbit',
    title: 'Rabbit',
    description: 'High-fiber diets and supplies for happy bunnies.',
    button: 'Explore Rabbit',
    breeds: [],
    productsCount: 67,
  },
  {
    id: 'guinea_pig',
    kind: 'guinea_pig',
    title: 'Guinea Pig',
    description: 'Vitamin C enriched food and habitats for guinea pigs.',
    button: 'Explore Guinea Pig',
    breeds: [],
    productsCount: 28,
  },
  {
    id: 'turtle',
    kind: 'turtle',
    title: 'Turtle',
    description: 'Aquatic and terrestrial nutrition for healthy shells.',
    button: 'Explore Turtle',
    breeds: [],
    productsCount: 19,
  },
  {
    id: 'fighting_rooster',
    kind: 'rooster',
    title: 'Fighting Rooster',
    description: 'High-protein feeds and supplements for fighting roosters.',
    button: 'Explore Fighting Rooster',
    breeds: [],
    productsCount: 14,
  },
  {
    id: 'mammal',
    kind: 'mammal',
    title: 'Mammal',
    description: 'General supplies for small and large mammal companions.',
    button: 'Explore Mammal',
    breeds: [],
    productsCount: 88,
  }
];

export const services = [
  {
    id: 'grooming',
    title: 'Pet Grooming',
    description: 'Gentle, breed-specific grooming that keeps coats healthy and pets relaxed.',
    icon: 'Scissors',
  },
  {
    id: 'nutrition',
    title: 'Pet Nutrition',
    description: 'Vet-formulated diets built around your pet\u2019s age, size and energy.',
    icon: 'Wheat',
  },
  {
    id: 'veterinary',
    title: 'Veterinary Care',
    description: 'Preventive checkups and trusted advice from a network of partner vets.',
    icon: 'Stethoscope',
  },
  {
    id: 'essentials',
    title: 'Pet Essentials',
    description: 'Thoughtfully designed collars, beds and toys that are built to last.',
    icon: 'ShoppingBag',
  },
];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  kind: PetKind;
  image?: string;
  imageName?: string;
}

export const products: Product[] = [
  { id: 'p1', name: 'Slow-Grain Dog Food', category: 'Dog', price: '₹1400', kind: 'dog', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600' },
  { id: 'p2', name: 'Feather Wand Toy', category: 'Cat', price: '₹350', kind: 'cat', image: 'https://images.unsplash.com/photo-1545529468-42764ef8c85f?auto=format&fit=crop&q=80&w=600' },
  { id: 'p3', name: 'Orthopedic Cloud Bed', category: 'Dog', price: '₹2999', kind: 'dog', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600' },
  { id: 'p4', name: 'Woven Perch Swing', category: 'Bird', price: '₹600', kind: 'bird', image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&q=80&w=600' },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Ananya R.',
    pet: 'Mochi \u2014 Golden Retriever',
    quote:
      'Furrow changed how we think about Mochi\u2019s routine. The nutrition guidance alone was worth it.',
  },
  {
    id: 't2',
    name: 'Karthik S.',
    pet: 'Whiskey \u2014 Persian Cat',
    quote:
      'The grooming team treats Whiskey like family. She actually looks forward to appointments now.',
  },
  {
    id: 't3',
    name: 'Meera V.',
    pet: 'Kiwi \u2014 Cockatiel',
    quote:
      'Hard to find quality bird supplies locally. Furrow\u2019s aviary range is thoughtfully made.',
  },
  {
    id: 't4',
    name: 'Rohan D.',
    pet: 'Bruno \u2014 Beagle',
    quote:
      'Every order feels considered, right down to the packaging. Bruno approves too.',
  },
];

export const ctaContent = {
  heading: 'Because Their Happiness Matters.',
  subtext: 'Everything your pet needs, all in one place.',
  button: 'Explore Our Collection',
};

export const footerContent = {
  description:
    'Explore the world of premium pet care. From expert services to carefully selected food, essentials and toys, everything your pet needs in one place.',
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shop', href: '/shop' },
  ],
  categoryLinks: [
    { label: 'Reptiles', href: '/shop' },
    { label: 'Dog', href: '/shop' },
    { label: 'Cat', href: '/shop' },
    { label: 'Bird', href: '/shop' },
    { label: 'Mammal', href: '/shop' }
  ],
  contact: {
    phone: ['+91 8797979300'],
    email: 'hello@phoenixpets.in',
    address: 'No.35/15, S Mada St, Sarojini Nagar, Kolathur, Chennai, Greater Chennai, Tamil Nadu 600099',
  },
  bottom: {
    copyright: '\u00A9 2026 Phoenix Pets. All Rights Reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookies Policy', href: '/cookies-policy' }
    ],
    credit: 'Crafted by Skenetic Digital',
  },
};
