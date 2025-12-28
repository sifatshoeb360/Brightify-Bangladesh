
import { Product, Category, BlogPost, Testimonial, Banner, AppSettings } from './types';

export const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", 
  "Chapai Nawabganj", "Chattogram", "Chuadanga", "Cumilla", "Cox's Bazar", "Dhaka", "Dinajpur", 
  "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", 
  "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", 
  "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", 
  "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", 
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", 
  "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", 
  "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
].sort();

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Eternal Rose LED String Lights',
    price: 1200,
    salePrice: 950,
    description: 'Beautifully crafted LED rose string lights that bring a magical glow to any room. Perfect for bedrooms, weddings, or festive decorations.',
    category: 'Lighting',
    images: ['https://i.ibb.co/VYd8K4g/product-1.jpg', 'https://i.ibb.co/Vq8sYtV/product-2.jpg'],
    stock: 50,
    isFeatured: true,
    isNewArrival: true,
    tags: ['roses', 'led', 'romantic'],
    slug: 'eternal-rose-led-lights'
  },
  {
    id: '2',
    name: 'Celestial Star & Moon Curtain',
    price: 1800,
    salePrice: 1550,
    description: 'Transform your windows into a galaxy with these warm white star and moon curtain lights.',
    category: 'Lighting',
    images: ['https://i.ibb.co/zXn2H1B/product-3.jpg', 'https://i.ibb.co/N7x1n9v/product-4.jpg'],
    stock: 30,
    isFeatured: true,
    isNewArrival: false,
    tags: ['stars', 'curtain', 'warm-white'],
    slug: 'celestial-star-moon-curtain'
  },
  {
    id: '3',
    name: 'Galaxy Nebula Projector',
    price: 2500,
    description: 'Remote-controlled projector with 14 color themes. Includes music sync mode for the ultimate space adventure at home.',
    category: 'Lighting',
    images: ['https://i.ibb.co/KNP1m1G/product-10.jpg', 'https://i.ibb.co/Srb2L98/product-11.jpg'],
    stock: 15,
    isFeatured: true,
    isNewArrival: true,
    tags: ['projector', 'galaxy', 'tech'],
    slug: 'galaxy-nebula-projector'
  },
  {
    id: '4',
    name: 'Pastel Rose Garland',
    price: 1100,
    salePrice: 850,
    description: 'Soft multi-color rose garlands perfect for soft aesthetic room decor.',
    category: 'Wall Decor',
    images: ['https://i.ibb.co/h7Vv3yR/product-12.jpg', 'https://i.ibb.co/M9B2yYn/product-13.jpg'],
    stock: 45,
    isFeatured: false,
    isNewArrival: false,
    tags: ['pastel', 'floral', 'garland'],
    slug: 'pastel-rose-garland'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Lighting', slug: 'lighting', image: 'https://picsum.photos/seed/light/400/400' },
  { id: 'c2', name: 'Wall Decor', slug: 'wall-decor', image: 'https://picsum.photos/seed/wall/400/400' },
  { id: 'c3', name: 'Furniture Accents', slug: 'furniture', image: 'https://picsum.photos/seed/furniture/400/400' },
  { id: 'c4', name: 'Accessories', slug: 'accessories', image: 'https://picsum.photos/seed/access/400/400' }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Ways to Brighten Your Living Room',
    excerpt: 'Light is the soul of a home. Discover how small changes can make a big impact.',
    content: 'Full content here...',
    author: 'Admin',
    date: '2024-03-20',
    image: 'https://picsum.photos/seed/blog1/800/400',
    slug: '5-ways-to-brighten-living-room',
    tags: ['Interior Design', 'Lighting']
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Sara Khan', role: 'Homemaker', content: 'The lights from Brightify BD changed the entire vibe of my bedroom. Absolutely love the quality!', rating: 5, avatar: 'https://i.pravatar.cc/150?u=sara' },
  { id: 't2', name: 'Ahmed Rezwan', role: 'Architect', content: 'Premium finishing and very fast delivery. Highly recommended for home staging.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=ahmed' }
];

export const INITIAL_SETTINGS: AppSettings = {
  siteName: 'Brightify BD',
  primaryColor: '#7c3aed',
  contactEmail: 'info@brightifybd.com',
  phoneNumber: '+880 1711 111111',
  address: 'Gulshan, Dhaka, Bangladesh',
  facebookUrl: 'https://www.facebook.com/BrightifyBD',
  showPromoBanner: true,
  promoText: 'Ramadan Special: Up to 25% Off on All Lighting!',
  adminPassword: 'admin',
  moderators: []
};
