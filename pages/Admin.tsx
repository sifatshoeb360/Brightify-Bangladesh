
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, ShoppingBag, Settings, Edit, Trash2, Plus, 
  CheckCircle, Package, Lock, LogOut, Eye, EyeOff, Users, 
  UserPlus, ExternalLink, X, Image as ImageIcon 
} from 'lucide-react';
import { Moderator, Product } from '../types';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'moderators' | 'settings'>('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    salePrice: undefined,
    description: '',
    category: 'Lighting',
    images: [''],
    stock: 10,
    isFeatured: false,
    isNewArrival: true,
    tags: []
  });

  // Moderator Form State
  const [modName, setModName] = useState('');
  const [modPassword, setModPassword] = useState('');

  const { products, setProducts, orders, submissions, settings, setSettings, categories } = useApp();

  // Simple session check
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('adminAuth');
    if (sessionAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = loginPassword === (settings.adminPassword || 'admin');
    const isModerator = (settings.moderators || []).some(m => m.password === loginPassword);

    if (isAdmin || isModerator) {
      setIsAuthorized(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('adminAuth');
    setLoginPassword('');
  };

  const handleToggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      price: 0,
      salePrice: undefined,
      description: '',
      category: 'Lighting',
      images: [''],
      stock: 10,
      isFeatured: false,
      isNewArrival: true,
      tags: []
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setProductFormData({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = productFormData.name?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    
    const finalImages = productFormData.images?.filter(img => img.trim() !== '') || [];

    if (editingProductId) {
      // Edit
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productFormData, slug, images: finalImages } as Product : p));
    } else {
      // Add
      const newProduct: Product = {
        ...productFormData as Product,
        id: Date.now().toString(),
        slug,
        images: finalImages
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    
    setIsProductModalOpen(false);
  };

  const handleAddModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modName || !modPassword) return;

    const newMod: Moderator = {
      id: Date.now().toString(),
      name: modName,
      password: modPassword,
      createdAt: new Date().toLocaleDateString()
    };

    setSettings({
      ...settings,
      moderators: [...(settings.moderators || []), newMod]
    });

    setModName('');
    setModPassword('');
  };

  const removeModerator = (id: string) => {
    if (confirm('Remove this moderator access?')) {
      setSettings({
        ...settings,
        moderators: settings.moderators.filter(m => m.id !== id)
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden border border-slate-100">
               <img src="https://i.ibb.co/v4ynLLwk/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-500">Enter your secure access key</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  autoFocus
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-slate-900"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-rose-500 text-xs font-medium ml-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all transform hover:scale-[1.02]"
            >
              Access Dashboard
            </button>
          </form>

          <Link to="/" className="flex items-center justify-center gap-2 text-slate-400 hover:text-violet-600 mt-8 text-sm transition-colors font-medium">
            <ExternalLink size={14} /> Back to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 space-y-8 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-3">
          <img src="https://i.ibb.co/v4ynLLwk/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover brightness-200" />
          <span className="text-white font-bold text-xl tracking-tight">Brightify BD</span>
        </Link>
        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: ShoppingBag },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'moderators', label: 'Moderators', icon: Users },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 mt-4">
             <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                <ExternalLink size={20} />
                Visit Website
             </Link>
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-medium text-sm transition-colors">
                <ExternalLink size={16} /> View Store
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{loginPassword === settings.adminPassword ? 'Super Admin' : 'Staff Member'}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Session</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold border border-violet-200">A</div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={`৳${orders.reduce((sum, o) => sum + o.total, 0)}`} color="bg-emerald-50 text-emerald-600" />
              <StatCard title="Total Orders" value={orders.length} color="bg-blue-50 text-blue-600" />
              <StatCard title="Products" value={products.length} color="bg-violet-50 text-violet-600" />
              <StatCard title="Form Inquiries" value={submissions.length} color="bg-amber-50 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                      <div>
                        <p className="font-bold text-sm">{order.customerName}</p>
                        <p className="text-xs text-slate-400">{order.date}</p>
                      </div>
                      <span className="text-violet-600 font-bold">৳{order.total}</span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-slate-400 italic text-center py-4">No orders yet.</p>}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4">Latest Inquiries</h3>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-3 border-l-4 border-violet-500 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{sub.data.email || 'Subscriber'}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{sub.type}</p>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(sub.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {submissions.length === 0 && <p className="text-slate-400 italic text-center py-4">No inquiries yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold">Product Catalog</h3>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Product Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price (৳)</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-slate-100" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.category}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">৳{p.salePrice || p.price}</p>
                        {p.salePrice && <p className="text-[10px] text-slate-400 line-through">৳{p.price}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${p.stock < 5 ? 'text-rose-500' : 'text-slate-600'}`}>{p.stock} units</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleActive(p.id)} className="flex items-center gap-2">
                          {p.isFeatured ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-bold">
                              <CheckCircle size={10} /> Featured
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-400 hover:text-violet-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'moderators' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-violet-600" /> Grant Staff Access
              </h3>
              <form onSubmit={handleAddModerator} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  required
                  placeholder="Moderator Name"
                  className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20"
                  value={modName}
                  onChange={(e) => setModName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="Moderator Access Key"
                  className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20"
                  value={modPassword}
                  onChange={(e) => setModPassword(e.target.value)}
                />
                <button type="submit" className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20">
                  Save Access
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold">Active Staff Members</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Key Access</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(settings.moderators || []).map(mod => (
                    <tr key={mod.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-sm text-slate-800">{mod.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">••••••••</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{mod.createdAt}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeModerator(mod.id)} className="text-rose-500 hover:text-rose-700 p-2 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(settings.moderators || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No additional staff accounts created.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-6 text-xl">Global Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Store Display Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Email</label>
                  <input type="email" className="w-full p-3 bg-slate-50 border-none rounded-xl" value={settings.contactEmail} onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Support Phone</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-xl" value={settings.phoneNumber} onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})} />
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6 mt-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock size={16} /> Super Admin Password
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current/New Admin Key</label>
                  <input
                    type="password"
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Enter new master password"
                    value={settings.adminPassword || ''}
                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 italic">Keep this in a safe place. Default is 'admin'.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-2xl mt-6 border border-violet-100">
                <input
                  type="checkbox"
                  id="promo"
                  checked={settings.showPromoBanner}
                  onChange={(e) => setSettings({ ...settings, showPromoBanner: e.target.checked })}
                  className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="promo" className="text-sm font-bold text-violet-900">Enable Website Top Banner</label>
              </div>
              
              {settings.showPromoBanner && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promo Banner Content</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-slate-50 border-none rounded-xl"
                    value={settings.promoText}
                    onChange={(e) => setSettings({ ...settings, promoText: e.target.value })}
                  />
                </div>
              )}

              <button className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-violet-700 transition-all mt-4 shadow-violet-600/20">
                Apply All Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Unified Add/Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingProductId ? <Edit size={20} className="text-violet-600" /> : <Plus size={20} className="text-violet-600" />}
                {editingProductId ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Title</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20" 
                    placeholder="Enter name"
                    value={productFormData.name}
                    onChange={e => setProductFormData({...productFormData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Collection/Category</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-violet-500/20"
                    value={productFormData.category}
                    onChange={e => setProductFormData({...productFormData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Price (৳)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20"
                    value={productFormData.price}
                    onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discount Price (৳)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Leave blank if no discount"
                    value={productFormData.salePrice || ''}
                    onChange={e => setProductFormData({...productFormData, salePrice: e.target.value ? Number(e.target.value) : undefined})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Description</label>
                <textarea 
                  required 
                  rows={4} 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl resize-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Describe your product for your customers..."
                  value={productFormData.description}
                  onChange={e => setProductFormData({...productFormData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Image URL</label>
                <div className="flex gap-3">
                   <div className="flex-1 relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required 
                        type="url" 
                        className="w-full p-3 pl-10 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Paste image link here..."
                        value={productFormData.images?.[0] || ''}
                        onChange={e => {
                          const imgs = [...(productFormData.images || [''])];
                          imgs[0] = e.target.value;
                          setProductFormData({...productFormData, images: imgs});
                        }}
                      />
                   </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">Use direct image hosting links for best results.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Units</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl"
                    value={productFormData.stock}
                    onChange={e => setProductFormData({...productFormData, stock: Number(e.target.value)})}
                  />
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="featured" 
                      className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500"
                      checked={productFormData.isFeatured}
                      onChange={e => setProductFormData({...productFormData, isFeatured: e.target.checked})}
                    />
                    <label htmlFor="featured" className="text-sm font-bold text-slate-700">Mark as Featured</label>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700 transition-all"
                >
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
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
