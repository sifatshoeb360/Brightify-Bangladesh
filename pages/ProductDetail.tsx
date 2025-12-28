
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Zap, ArrowLeft, Star, Truck, 
  ShieldCheck, Heart, Share2, Plus, Minus, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ProductCard } from './Home';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(() => 
    products.find(p => p.slug === slug), 
  [products, slug]);

  const relatedProducts = useMemo(() => 
    products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4),
  [products, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-8">The item you are looking for might have been moved or removed.</p>
        <Link to="/shop" className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  // Function to render description with preserved formatting
  const renderDescription = (text: string) => {
    const hasHtml = /<[a-z][\s\S]*>/i.test(text);
    
    if (hasHtml) {
      return (
        <div 
          className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap prose prose-slate max-w-none prose-p:my-0 prose-ul:my-2 prose-li:my-0"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
    
    return (
      <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
        {text}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Back to browsing
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-sm relative">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.isNewArrival && (
              <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW ARRIVAL
              </span>
            )}
          </div>
          
          {/* Gallery Thumbnails: Only show if there's more than one valid image */}
          {product.images.length > 1 && (
            <div className="flex flex-wrap gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-violet-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-violet-600 font-bold text-sm uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" />)}
              </div>
              <span className="text-sm text-slate-400">(24 customer reviews)</span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Current Price</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-violet-600">৳{product.salePrice || product.price}</span>
                {product.salePrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">৳{product.price}</span>
                )}
              </div>
            </div>
            {product.salePrice && (
              <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-sm font-bold">
                Save ৳{product.price - product.salePrice}
              </div>
            )}
          </div>

          <div className="mb-8">
            {renderDescription(product.description)}
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100 mb-10">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{product.stock} units available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-3 bg-violet-600 text-white py-5 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/30"
              >
                <Zap size={20} /> Buy It Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Fast<br/>Delivery</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Secure<br/>Payment</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <Heart size={18} />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Satisfaction<br/>Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 pt-16 border-t border-slate-100">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">You May Also Like</h2>
            <Link to="/shop" className="text-violet-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
