
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Heart, ShoppingBag, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Home: React.FC = () => {
  const { products, categories, testimonials, settings } = useApp();
  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={settings.heroImage}
            alt="Premium Home Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/50" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start text-white">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="inline-block px-4 py-1.5 bg-violet-600/20 backdrop-blur-md border border-violet-400/30 rounded-full text-violet-200 text-xs font-bold tracking-widest uppercase mb-6">
              New Collection 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Illuminate Your <br /> <span className="text-violet-400">Living Space</span>
            </h1>
            <p className="text-lg md:text-xl max-w-lg mb-8 text-slate-100/90 leading-relaxed">
              Discover a curated collection of premium lighting and decor that turns every house into a dream home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-violet-600 hover:bg-violet-700 px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-violet-600/30">
                Shop Now
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-full font-bold transition-all border border-white/20">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform">
          <div className="bg-violet-100 p-4 rounded-full text-violet-600"><Truck /></div>
          <div>
            <h4 className="font-bold">Fast Delivery</h4>
            <p className="text-sm text-slate-500">Across Bangladesh</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600"><ShieldCheck /></div>
          <div>
            <h4 className="font-bold">Quality Materials</h4>
            <p className="text-sm text-slate-500">Handpicked items</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform">
          <div className="bg-rose-100 p-4 rounded-full text-rose-600"><Heart /></div>
          <div>
            <h4 className="font-bold">Happy Customers</h4>
            <p className="text-sm text-slate-500">Satisfaction guaranteed</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-slate-500">Find the perfect match for your style</p>
          </div>
          <Link to="/shop" className="text-violet-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            See All <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
                <p className="text-slate-500">Freshly added pieces for your collection</p>
              </div>
            </div>
            <Link to="/shop?filter=newest" className="hidden sm:flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform">
              Explore All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 tracking-tight">Best Sellers</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our most-loved pieces, chosen by our wonderful community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-60" />
          <img
            src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000"
            alt="Decor Lifestyle"
            className="relative rounded-3xl shadow-2xl z-10"
          />
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Why Brightify BD?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We believe that your home should be a reflection of your personality. That's why we source only the finest materials and designs that blend contemporary trends with timeless elegance.
          </p>
          <ul className="space-y-4">
            {[
              "Exclusive local designs you won't find anywhere else",
              "Direct support from our Dhaka-based styling team",
              "Seamless online shopping & secure checkout",
              "Affordable luxury for every room"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/about" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Learn More
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-16 text-slate-900 tracking-tight">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-lg italic text-slate-700 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4 mt-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="purple-gradient rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative shadow-2xl shadow-violet-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative tracking-tight">Ready to transform your home?</h2>
          <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto relative">
            Join thousands of happy homeowners and start your decoration journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link to="/shop" className="bg-white text-violet-600 px-10 py-4 rounded-full font-bold shadow-xl hover:bg-slate-50 transition-colors">
              Browse Collection
            </Link>
            <Link to="/contact" className="border-2 border-white/40 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 relative">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              NEW ARRIVAL
            </span>
          )}
          {product.salePrice && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              OFFER
            </span>
          )}
        </div>
      </Link>
      <div className="p-5 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="block font-bold text-slate-800 hover:text-violet-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-3">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-violet-600">৳{product.salePrice}</span>
              <span className="text-sm text-slate-400 line-through">৳{product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900">৳{product.price}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-2 rounded-xl transition-all text-xs"
          >
            <ShoppingBag size={14} />
            Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-2 rounded-xl transition-all shadow-md text-xs"
          >
            <Zap size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
