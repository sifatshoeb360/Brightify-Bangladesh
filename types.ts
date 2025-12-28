
export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  variants?: { name: string; options: string[] }[];
  tags: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  tags: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export interface Moderator {
  id: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface AppSettings {
  siteName: string;
  primaryColor: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  facebookUrl: string;
  showPromoBanner: boolean;
  promoText: string;
  adminPassword?: string;
  moderators: Moderator[];
}

export interface FormSubmission {
  id: string;
  type: 'contact' | 'newsletter';
  data: any;
  date: string;
  read: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
}
