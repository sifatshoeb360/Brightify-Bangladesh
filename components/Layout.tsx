
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, Facebook, Instagram, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, wishlist, settings, language, setLanguage, t } = useApp();
  const location = useLocation();

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('shop'), path: '/shop' },
    { name: t('blog'), path: '/blog' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {settings.showPromoBanner && (
        <div className="bg-violet-600 text-white text-xs py-2 text-center font-medium">
          {settings.promoText}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={settings.logoUrl} 
              alt={settings.siteName} 
              className="w-8 h-8 rounded-lg object-cover shadow-sm"
            />
            <span className="text-xl font-bold text-slate-800 tracking-tight">{settings.siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-full">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'bn' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                BN
              </button>
            </div>

            <Link to="/admin" className="p-2 text-slate-500 hover:text-violet-600 transition-colors">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="p-2 text-slate-500 hover:text-rose-500 transition-colors relative">
              <Heart size={20} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 text-slate-500 hover:text-violet-600 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-slate-500" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
          <div className="space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 px-3 pt-4 border-t border-slate-100">
             <span className="text-sm font-bold text-slate-500">Language:</span>
             <button 
               onClick={() => { setLanguage('en'); setIsOpen(false); }}
               className={`px-4 py-2 rounded-xl font-bold text-xs ${language === 'en' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
             >
               English
             </button>
             <button 
               onClick={() => { setLanguage('bn'); setIsOpen(false); }}
               className={`px-4 py-2 rounded-xl font-bold text-xs ${language === 'bn' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
             >
               বাংলা
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  const { settings, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img 
              src={settings.logoUrl} 
              alt={settings.siteName} 
              className="w-10 h-10 rounded-lg object-cover shadow-sm grayscale brightness-200"
            />
            <span className="text-xl font-bold text-white">{settings.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Elevating your home aesthetic with premium decoration pieces. Designed with elegance, delivered with care.
          </p>
          <div className="flex gap-4">
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">{t('shop')}</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shop" className="hover:text-white">Lighting</Link></li>
            <li><Link to="/shop" className="hover:text-white">Wall Decor</Link></li>
            <li><Link to="/shop" className="hover:text-white">Furniture Accents</Link></li>
            <li><Link to="/shop" className="hover:text-white">Best Sellers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/about" className="hover:text-white">{t('about')}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t('contact')}</Link></li>
            <li><Link to="/blog" className="hover:text-white">{t('blog')}</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> {settings.phoneNumber}</li>
            <li className="flex items-center gap-2"><Mail size={16} /> {settings.contactEmail}</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-1" /> {settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-xs">
        &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
};
