
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
import { Contact } from './pages/Contact';
import { ScrollToTop } from './components/ScrollToTop';

// Simplified pages for brevity
const ProductDetail = () => <div className="max-w-7xl mx-auto py-24 px-4 text-center">
  <h1 className="text-3xl font-bold mb-4">Product Details Coming Soon</h1>
  <p className="text-slate-500">We are currently updating our product gallery with high resolution images.</p>
</div>;
const About = () => <div className="max-w-7xl mx-auto py-24 px-4">About Us Content</div>;
const Blog = () => <div className="max-w-7xl mx-auto py-24 px-4">Blog Inspiration Content</div>;

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
