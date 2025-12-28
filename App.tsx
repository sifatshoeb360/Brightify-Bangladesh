
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
import { Contact } from './pages/Contact';
import { ProductDetail } from './pages/ProductDetail';
import { ScrollToTop } from './components/ScrollToTop';
import { BookOpen, Calendar, User, ImageIcon } from 'lucide-react';

const About = () => <div className="max-w-7xl mx-auto py-24 px-4 text-center">
  <h1 className="text-4xl font-bold mb-6">About Brightify BD</h1>
  <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
    We are a Dhaka-based premium home decoration store. Our mission is to bring elegance and light to every corner of your home through carefully curated designs and high-quality materials.
  </p>
</div>;

const Blog = () => {
  const { blogPosts } = useApp();
  
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Inspiration & Design</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Expert tips and stories to help you craft your perfect sanctuary.</p>
      </div>

      <div className="space-y-32">
        {blogPosts.length > 0 ? blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group">
            
            {/* 1. TOP: Images (Only if uploaded) */}
            {post.images && post.images.length > 0 && (
              <div className="p-3">
                <div className={`grid gap-3 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-2 md:grid-cols-4'
                }`}>
                  {post.images.slice(0, 4).map((img, i) => (
                    <div key={i} className={`overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-sm aspect-video ${
                      post.images.length === 1 ? 'aspect-video md:aspect-[21/9]' : 'aspect-square md:aspect-[4/3]'
                    } ${post.images.length === 3 && i === 0 ? 'md:col-span-2' : ''}`}>
                      <img 
                        src={img} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={`${post.title} gallery ${i+1}`} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 2. MIDDLE & BOTTOM: Title and Content */}
            <div className="px-8 py-10 md:px-20 md:py-16">
              <div className="flex items-center gap-6 mb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><User size={12} /> {post.author}</span>
                <span className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full">Editorial</span>
              </div>
              
              {/* MIDDLE: Blog Title */}
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.15] tracking-tight group-hover:text-violet-600 transition-colors">
                {post.title}
              </h2>

              {/* BOTTOM: Description */}
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>

              <div className="pt-12 mt-12 border-t border-slate-50 flex items-center justify-between">
                 <Link to={`/contact`} className="inline-flex items-center gap-2 text-violet-600 font-bold hover:translate-x-1 transition-transform group-hover:underline">
                    Get custom decor advice <BookOpen size={18} />
                 </Link>
                 <div className="flex gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-300">#{tag.replace(/\s/g, '')}</span>
                    ))}
                 </div>
              </div>
            </div>
          </article>
        )) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                <BookOpen size={40} />
             </div>
             <p className="text-slate-500 font-bold text-lg">No inspiration stories published yet.</p>
             <p className="text-slate-400 text-sm">Our designers are busy writing for you!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
