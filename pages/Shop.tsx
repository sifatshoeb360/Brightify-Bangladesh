
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid2X2, List } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ProductCard } from './Home';

export const Shop: React.FC = () => {
  const { products, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const activeCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));

    return result;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-slate-500">Discover premium decoration pieces for your home.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Categories
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setSearchParams({})}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${!activeCategory ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${activeCategory === cat.slug ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Sort By</h4>
            <select
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-xl text-slate-500 font-medium">No products found matching your filters.</p>
              <button onClick={() => { setSearch(''); setSearchParams({}); }} className="mt-4 text-violet-600 font-bold underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
