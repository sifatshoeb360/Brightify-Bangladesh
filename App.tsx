
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { ProductDetail } from './pages/ProductDetail';
import { ScrollToTop } from './components/ScrollToTop';
import { BookOpen, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
  const { t } = useApp();
  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto py-24 px-4 text-center text-slate-800">
        <h1 className="text-4xl font-bold mb-6">{t('aboutTitle')}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          {t('aboutText')}
        </p>
      </div>
    </AnimatedPage>
  );
};

const Blog = () => {
  const { blogPosts, t } = useApp();
  
  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">{t('inspirationTitle')}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">{t('inspirationSubtitle')}</p>
        </div>

        <div className="space-y-32">
          {blogPosts.length > 0 ? blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group">
              {post.images && post.images.length > 0 && (
                <div className="p-3">
                  <div className={`grid gap-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                    {post.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-[2.5rem] border border-slate-100 aspect-square">
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="blog" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-8 py-10 md:px-20 md:py-16">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.15] tracking-tight group-hover:text-violet-600 transition-colors">
                  {post.title}
                </h2>
                <div className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
                <div className="pt-12 mt-12 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                   <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><User size={12} /> {post.author}</span>
                   </div>
                   <Link to={`/contact`} className="inline-flex items-center gap-2 text-violet-600 font-bold hover:translate-x-1 transition-transform group-hover:underline">
                      {t('consultDesigners')} <BookOpen size={18} />
                   </Link>
                </div>
              </div>
            </article>
          )) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <BookOpen size={40} />
               </div>
               <p className="text-slate-500 font-bold text-lg">{t('noStories')}</p>
               <p className="text-slate-400 text-sm">{t('noStoriesSub')}</p>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/shop" element={<AnimatedPage><Shop /></AnimatedPage>} />
            <Route path="/product/:slug" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
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
