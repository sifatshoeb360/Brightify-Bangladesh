
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, ShoppingBag, Settings, Edit, Trash2, Plus, 
  CheckCircle, Package, Lock, LogOut, Eye, EyeOff, Users, 
  UserPlus, ExternalLink, X, Image as ImageIcon, Sparkles, Hash,
  Mail, Key, ShieldAlert, Loader2, BookOpen, FileText, Tags, Wallet
} from 'lucide-react';
import { Moderator, Product, BlogPost, Category } from '../types';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'moderators' | 'settings' | 'blog'>('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | null>(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    products, setProducts, 
    categories, setCategories, 
    orders, submissions, 
    settings, setSettings, 
    blogPosts, setBlogPosts 
  } = useApp();

  // Category Form Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    name: '',
    image: '',
    slug: ''
  });

  // Auth Recovery State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    salePrice: undefined,
    description: '',
    category: '',
    images: ['', '', '', ''],
    stock: 10,
    isFeatured: false,
    isNewArrival: true,
    tags: []
  });

  // Blog Form Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    images: ['', '', '', ''],
    author: 'Admin',
    tags: []
  });

  // Moderator Form State
  const [modName, setModName] = useState('');
  const [modPassword, setModPassword] = useState('');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('adminAuth');
    const sessionRole = sessionStorage.getItem('adminRole');
    if (sessionAuth === 'true') {
      setIsAuthorized(true);
      setUserRole(sessionRole as any);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = loginPassword === (settings.adminPassword || 'admin');
    const isModerator = (settings.moderators || []).some(m => m.password === loginPassword);

    if (isAdmin) {
      setIsAuthorized(true);
      setUserRole('admin');
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminRole', 'admin');
      setError('');
    } else if (isModerator) {
      setIsAuthorized(true);
      setUserRole('moderator');
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminRole', 'moderator');
      setActiveTab('dashboard'); // Default to a safe tab
      setError('');
    } else {
      setError('Invalid password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setUserRole(null);
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminRole');
    setLoginPassword('');
  };

  // RBAC Navigation Logic
  // Moderator: Dashboard, Products, Blog
  // Admin: Dashboard, Products, Categories, Orders, Blog, Moderators, Settings
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, role: 'any' },
    { id: 'products', label: 'Products', icon: ShoppingBag, role: 'any' },
    { id: 'categories', label: 'Categories', icon: Tags, role: 'admin' },
    { id: 'orders', label: 'Orders', icon: Package, role: 'admin' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, role: 'any' },
    { id: 'moderators', label: 'Moderators', icon: Users, role: 'admin' },
    { id: 'settings', label: 'Store Settings', icon: Settings, role: 'admin' },
  ].filter(item => item.role === 'any' || (item.role === 'admin' && userRole === 'admin'));

  // Category Handlers
  const openAddCategoryModal = () => {
    if (userRole !== 'admin') return;
    setEditingCategoryId(null);
    setCategoryFormData({ name: '', image: '', slug: '' });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    if (userRole !== 'admin') return;
    setEditingCategoryId(cat.id);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryFormData.name?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    
    if (editingCategoryId) {
      setCategories(prev => prev.map(c => c.id === editingCategoryId ? { ...c, ...categoryFormData, slug } as Category : c));
    } else {
      const newCat: Category = { ...categoryFormData as Category, id: Date.now().toString(), slug };
      setCategories(prev => [...prev, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (userRole !== 'admin') return;
    if (confirm('Are you sure? Products in this category might appear uncategorized.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  // Blog Handlers
  const openAddBlogModal = () => {
    setEditingBlogId(null);
    setBlogFormData({ title: '', content: '', images: ['', '', '', ''], author: userRole === 'admin' ? 'Admin' : 'Moderator', tags: [] });
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (post: BlogPost) => {
    setEditingBlogId(post.id);
    const paddedImages = [...(post.images || [])];
    while (paddedImages.length < 4) paddedImages.push('');
    setBlogFormData({ ...post, images: paddedImages });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = blogFormData.title?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    const finalImages = (blogFormData.images || []).filter(img => img && img.trim() !== '');

    if (editingBlogId) {
      setBlogPosts(prev => prev.map(b => b.id === editingBlogId ? { ...b, ...blogFormData, slug, images: finalImages } as BlogPost : b));
    } else {
      const newPost: BlogPost = { ...blogFormData as BlogPost, id: Date.now().toString(), slug, images: finalImages, date: new Date().toLocaleDateString(), excerpt: blogFormData.content?.substring(0, 100) + '...' };
      setBlogPosts(prev => [newPost, ...prev]);
    }
    setIsBlogModalOpen(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    const recoveryPayload = { type: 'PASSWORD_RESET_REQUEST', requestedAt: new Date().toLocaleString(), email: recoveryEmail, site: settings.siteName };
    try {
      const response = await fetch("https://formspree.io/f/mykyppye", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(recoveryPayload) });
      if (response.ok) setRecoverySent(true); else setError('Failed to initiate recovery.');
    } catch (err) { setError('Connection error.'); } finally { setIsRecovering(false); }
  };

  const handleAddModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') return;
    if (!modName || !modPassword) return;
    const newMod: Moderator = { id: Date.now().toString(), name: modName, password: modPassword, createdAt: new Date().toLocaleDateString() };
    setSettings({ ...settings, moderators: [...(settings.moderators || []), newMod] });
    setModName(''); setModPassword('');
  };

  const removeModerator = (id: string) => {
    if (userRole !== 'admin') return;
    if (confirm('Permanently remove this moderator?')) {
      setSettings({ ...settings, moderators: settings.moderators.filter(m => m.id !== id) });
    }
  };

  const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductFormData({ name: '', price: 0, salePrice: undefined, description: '', category: categories[0]?.name || '', images: ['', '', '', ''], stock: 10, isFeatured: false, isNewArrival: true, tags: [] });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    const paddedImages = [...product.images];
    while (paddedImages.length < 4) paddedImages.push('');
    setProductFormData({ ...product, images: paddedImages });
    setIsProductModalOpen(true);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(productFormData.images || ['', '', '', ''])];
    newImages[index] = value;
    setProductFormData({ ...productFormData, images: newImages });
  };

  const handleBlogImageUrlChange = (index: number, value: string) => {
    const newImages = [...(blogFormData.images || ['', '', '', ''])];
    newImages[index] = value;
    setBlogFormData({ ...blogFormData, images: newImages });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = productFormData.name?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    const finalImages = (productFormData.images || []).filter(img => img && img.trim() !== '');
    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productFormData, slug, images: finalImages } as Product : p));
    } else {
      const newProduct: Product = { ...productFormData as Product, id: Date.now().toString(), slug, images: finalImages };
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden border border-slate-100">
               <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-500">{isRecoveryMode ? 'Account Recovery' : 'Secure Authorization'}</p>
          </div>

          {!isRecoveryMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Access Password</label>
                <div className="relative">
                  <input
                    autoFocus
                    type={showPassword ? "text" : "password"}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 placeholder-slate-300"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <p className="text-rose-500 text-xs font-medium ml-1">{error}</p>}
                <div className="text-right">
                  <button type="button" onClick={() => { setIsRecoveryMode(true); setError(''); }} className="text-xs font-bold text-violet-600 hover:underline">Forgot Password?</button>
                </div>
              </div>
              <button type="submit" className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                <Lock size={18} /> Access Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {recoverySent ? (
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={32} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Recovery Sent!</h3>
                  <p className="text-sm text-slate-500">Dispatch sent to: <span className="font-bold">{settings.contactEmail}</span></p>
                  <button type="button" onClick={() => { setIsRecoveryMode(false); setRecoverySent(false); }} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back to Login</button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Confirm Your Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input required type="email" className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-slate-900" placeholder="your-admin@email.com" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button type="submit" disabled={isRecovering} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
                      {isRecovering ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                      {isRecovering ? 'Processing...' : 'Send Recovery Link'}
                    </button>
                    <button type="button" onClick={() => { setIsRecoveryMode(false); setError(''); }} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                  </div>
                </>
              )}
            </form>
          )}
          <Link to="/" className="flex items-center justify-center gap-2 text-slate-400 hover:text-violet-600 mt-8 text-sm transition-colors font-medium">
            <ExternalLink size={14} /> Back to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 space-y-8 hidden md:flex flex-col border-r border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover brightness-200" />
          <span className="text-white font-bold text-xl tracking-tight">Brightify BD</span>
        </Link>
        <nav className="space-y-2 flex-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 mt-4">
             <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-200 font-medium">
                <ExternalLink size={20} /> Visit Store
             </Link>
          </div>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="px-4 py-2 mb-4 bg-slate-800/50 rounded-xl">
             <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Logged in as</p>
             <p className="text-xs font-bold text-white capitalize">{userRole}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold capitalize text-slate-900 tracking-tight">{activeTab}</h1>
            <p className="text-sm text-slate-500">Administration Suite Panel</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={`৳${orders.reduce((sum, o) => sum + o.total, 0)}`} color="bg-emerald-50 text-emerald-600" />
              <StatCard title="Orders" value={orders.length} color="bg-blue-50 text-blue-600" />
              <StatCard title="Products" value={products.length} color="bg-violet-50 text-violet-600" />
              <StatCard title="Categories" value={categories.length} color="bg-amber-50 text-amber-600" />
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Inventory List</h3>
              <button onClick={openAddModal} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors">
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Stock</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                        <span className="font-bold">{p.name}</span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">{p.category}</td>
                      <td className="px-8 py-5 font-bold">৳{p.salePrice || p.price}</td>
                      <td className="px-8 py-5">
                         <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold">{p.stock} units</span>
                      </td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                         <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit size={18} /></button>
                         <button onClick={(e) => handleDeleteProduct(e, p.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Blog Management</h3>
              <button onClick={openAddBlogModal} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20">
                <Plus size={18} /> New Blog Post
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm group">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {post.images && post.images.length > 0 ? (
                      <img src={post.images[0]} className="w-full h-full object-cover" alt={post.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{post.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditBlogModal(post)} className="p-2 text-slate-400 hover:text-violet-600"><Edit size={18} /></button>
                        <button onClick={() => setBlogPosts(prev => prev.filter(b => b.id !== post.id))} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restricted Admin-Only Modules */}
        {activeTab === 'categories' && userRole === 'admin' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Category Management</h3>
              <button onClick={openAddCategoryModal} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors">
                <Plus size={18} /> New Category
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Preview</th>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <img src={cat.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                      </td>
                      <td className="px-8 py-5 font-bold">{cat.name}</td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                         <button onClick={() => openEditCategoryModal(cat)} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit size={18} /></button>
                         <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && userRole === 'admin' && (
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-100"><h3 className="font-bold text-lg">Customer Orders</h3></div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                   <tr>
                     <th className="px-8 py-4">ID</th>
                     <th className="px-8 py-4">Customer</th>
                     <th className="px-8 py-4">Total</th>
                     <th className="px-8 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {orders.map(o => (
                     <tr key={o.id} className="hover:bg-slate-50/50">
                       <td className="px-8 py-5 text-sm font-mono text-violet-600">{o.id}</td>
                       <td className="px-8 py-5"><p className="font-bold">{o.customerName}</p><p className="text-xs text-slate-400">{o.date}</p></td>
                       <td className="px-8 py-5 font-bold">৳{o.total}</td>
                       <td className="px-8 py-5"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase">{o.status}</span></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'moderators' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <h3 className="font-bold text-lg">Add Moderator</h3>
                <form onSubmit={handleAddModerator} className="space-y-4">
                  <input required type="text" className="w-full p-3.5 bg-slate-50 border-none rounded-xl" placeholder="Full Name" value={modName} onChange={e => setModName(e.target.value)} />
                  <input required type="text" className="w-full p-3.5 bg-slate-50 border-none rounded-xl" placeholder="Password" value={modPassword} onChange={e => setModPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl">Grant Access</button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-100"><h3 className="font-bold">Personnel</h3></div>
               <div className="divide-y divide-slate-100">
                 {settings.moderators.map(mod => (
                   <div key={mod.id} className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Users size={16}/></div>
                        <div><p className="font-bold">{mod.name}</p><p className="text-xs text-slate-400">{mod.createdAt}</p></div>
                     </div>
                     <div className="flex items-center gap-4">
                        <p className="font-mono text-xs text-violet-600">{mod.password}</p>
                        <button onClick={() => removeModerator(mod.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && userRole === 'admin' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                 <Sparkles className="text-violet-600" size={24} /> Branding & Identity
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Store Name</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="Brightify BD" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Admin Password</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="••••••••" value={settings.adminPassword} onChange={e => setSettings({...settings, adminPassword: e.target.value})} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Website Logo URL</label>
                       <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="Paste image link here..." value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} />
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center h-24">
                        <img src={settings.logoUrl} alt="Preview" className="max-h-full rounded-lg" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Homepage Hero Image URL</label>
                       <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="Paste hero image link..." value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} />
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center h-24 overflow-hidden">
                        <img src={settings.heroImage} alt="Preview" className="w-full object-cover" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                 <Wallet className="text-violet-600" size={24} /> Payment Configuration
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Bkash Personal Number</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 font-mono" placeholder="017XXXXXXXX" value={settings.bkashNumber} onChange={e => setSettings({...settings, bkashNumber: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Nagad Personal Number</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 font-mono" placeholder="01XXXXXXXXX" value={settings.nagadNumber} onChange={e => setSettings({...settings, nagadNumber: e.target.value})} />
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                 <Mail className="text-violet-600" size={24} /> Contact Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Public Email</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="info@example.com" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Contact Phone</label>
                     <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10" placeholder="+880..." value={settings.phoneNumber} onChange={e => setSettings({...settings, phoneNumber: e.target.value})} />
                  </div>
               </div>
               <button onClick={() => alert('Settings synchronized successfully.')} className="w-full purple-gradient text-white py-5 rounded-2xl font-bold shadow-lg shadow-violet-600/30 hover:opacity-90 transition-all">
                 Apply Global Settings
               </button>
            </div>
          </div>
        )}

        {/* Fallback Protection / Access Denied Screen */}
        {(activeTab === 'categories' || activeTab === 'settings' || activeTab === 'moderators' || activeTab === 'orders') && userRole === 'moderator' && (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-100">
             <ShieldAlert size={64} className="mx-auto text-rose-500 mb-6 opacity-20" />
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Restricted Module</h2>
             <p className="text-slate-500 mb-8">Your moderator account is limited to product and blog management. Please contact a Super Admin for further clearance.</p>
             <button onClick={() => setActiveTab('dashboard')} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold">Return to Dashboard</button>
          </div>
        )}
      </main>

      {/* Shared Modals (Product and Blog) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 text-slate-900">
              <h3 className="text-xl font-bold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 overflow-y-auto text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Product Title</label>
                  <input required className="w-full p-3 bg-slate-50 border-none rounded-xl" placeholder="Enter Product Title (e.g. Warm White Curtain Lights)" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                  <select required className="w-full p-3 bg-slate-50 border-none rounded-xl" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value})}>
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Description</label>
                <textarea required rows={4} className="w-full p-3 bg-slate-50 border-none rounded-xl" placeholder="Describe the product features, dimensions, and materials..." value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Price (৳)</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl" placeholder="0.00" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Sale Price (৳)</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl" placeholder="0.00 (Optional)" value={productFormData.salePrice || ''} onChange={e => setProductFormData({...productFormData, salePrice: e.target.value ? Number(e.target.value) : undefined})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Initial Stock</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl" placeholder="10" value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Product Gallery (URLs)</label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map(idx => (
                    <input key={idx} type="url" className="p-3 bg-slate-50 border-none rounded-xl text-xs" placeholder={idx === 0 ? "Primary Image Link (Required)" : "Additional Image Link (Optional)"} required={idx === 0} value={productFormData.images?.[idx] || ''} onChange={e => handleImageUrlChange(idx, e.target.value)} />
                  ))}
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-violet-600" checked={productFormData.isFeatured} onChange={e => setProductFormData({...productFormData, isFeatured: e.target.checked})} />
                  <span className="text-sm font-bold text-slate-700">Best Seller / Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-emerald-600" checked={productFormData.isNewArrival} onChange={e => setProductFormData({...productFormData, isNewArrival: e.target.checked})} />
                  <span className="text-sm font-bold text-slate-700">New Arrival</span>
                </label>
              </div>
              <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all">
                {editingProductId ? 'Update Item' : 'Create Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBlogModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 text-slate-900">
              <h3 className="text-xl font-bold">{editingBlogId ? 'Edit Post' : 'Create Blog Post'}</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveBlog} className="p-8 space-y-6 overflow-y-auto text-slate-700">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Article Title</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl" placeholder="Title of your story..." value={blogFormData.title} onChange={e => setBlogFormData({...blogFormData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content / Description</label>
                <textarea required rows={8} className="w-full p-4 bg-slate-50 border-none rounded-2xl resize-none" placeholder="Tell the world something amazing..." value={blogFormData.content} onChange={e => setBlogFormData({...blogFormData, content: e.target.value})} />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Gallery (Optional - up to 4 images)</label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map(idx => (
                    <input key={idx} type="url" className="p-3 bg-slate-50 border-none rounded-xl text-xs" placeholder={`Image URL ${idx + 1}`} value={blogFormData.images?.[idx] || ''} onChange={e => handleBlogImageUrlChange(idx, e.target.value)} />
                  ))}
                </div>
              </div>
              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-violet-600 text-white font-bold">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin-Only Category Modal */}
      {isCategoryModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 text-slate-900">
              <h3 className="text-xl font-bold">{editingCategoryId ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 text-slate-400">Category Name</label>
                <input required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-slate-700" placeholder="e.g. Smart Lighting" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 text-slate-400">Thumbnail Image URL</label>
                <input required type="url" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-xs text-slate-700" placeholder="Paste image link here..." value={categoryFormData.image} onChange={e => setCategoryFormData({...categoryFormData, image: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all">
                {editingCategoryId ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-violet-500/10">
    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
    <div className={`mt-4 h-1 w-12 rounded-full ${color.split(' ')[0]}`} />
  </div>
);
