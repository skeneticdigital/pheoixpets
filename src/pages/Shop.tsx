import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import type { Product } from '../data/content';
import { ShoppingBag, ChevronDown, X, Zap, Plus, Minus } from 'lucide-react';

export default function Shop() {
  const { products, categories: dynamicCategories } = useProducts();
  const { addToCart } = useCart();
  const { addOrder } = useOrders();

  
  // Sort categories ensuring Reptiles is first
  const categories = useMemo(() => {
    const others = dynamicCategories.filter(c => c !== 'Reptiles').sort();
    return ['Reptiles', ...others];
  }, [dynamicCategories]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  
  useEffect(() => {
    const queryCat = new URLSearchParams(location.search).get('category');
    if (queryCat) {
      // Find matching category (case-insensitive)
      const matched = dynamicCategories.find(c => c.toLowerCase() === queryCat.toLowerCase());
      if (matched) {
        setSelectedCategories([matched]);
      } else {
        // Fallback to exactly what was in the query if no match
        setSelectedCategories([queryCat]);
      }
    }
  }, [location.search, dynamicCategories]);

  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Direct checkout state
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    if (sortOption === 'price-asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    
    return result;
  }, [products, selectedCategories, sortOption]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingProduct) return;
    
    const singlePrice = parsePrice(orderingProduct.price);
    const totalPrice = singlePrice * orderQuantity;
    
    addOrder(
      customerInfo,
      [{
        id: orderingProduct.id,
        name: orderingProduct.name,
        price: orderingProduct.price,
        quantity: orderQuantity
      }],
      totalPrice
    );
    
    setOrderingProduct(null);
    setOrderQuantity(1);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="font-display text-xl tracking-wider text-charcoal font-bold mb-4 uppercase">
              Categories
            </h3>
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 bg-white group-hover:border-[#ff7a00] transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <div className="absolute inset-0 rounded bg-[#ff7a00] scale-0 peer-checked:scale-100 transition-transform origin-center"></div>
                    <svg className="w-3 h-3 text-white absolute inset-0 m-auto scale-0 peer-checked:scale-100 transition-transform z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-charcoal/80 group-hover:text-charcoal transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
            <p className="text-charcoal/60 text-sm">
              Showing {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 ? 's' : ''}
            </p>
            
            <div className="relative w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-charcoal/70 text-sm hidden sm:inline-block">Sort by:</span>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2 bg-white border border-gray-200 rounded px-4 py-2 text-sm font-medium text-charcoal hover:border-gray-300 transition-colors"
                >
                  {sortOption === 'featured' ? 'Featured' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                  <ChevronDown size={16} />
                </button>
              </div>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                  <button 
                    onClick={() => { setSortOption('featured'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'featured' ? 'bg-[#ff7a00]/10 text-[#ff7a00]' : 'text-charcoal/80 hover:bg-gray-50'}`}
                  >
                    Featured
                  </button>
                  <button 
                    onClick={() => { setSortOption('price-asc'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'price-asc' ? 'bg-[#ff7a00]/10 text-[#ff7a00]' : 'text-charcoal/80 hover:bg-gray-50'}`}
                  >
                    Price: Low to High
                  </button>
                  <button 
                    onClick={() => { setSortOption('price-desc'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'price-desc' ? 'bg-[#ff7a00]/10 text-[#ff7a00]' : 'text-charcoal/80 hover:bg-gray-50'}`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-[fadeIn_0.5s_ease]"
                >
                  {product.image && (
                    <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl bg-cream-soft relative">
                      <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm p-1 rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-md border border-white/20">
                        <img src="/phoenix_pets_logo.png" alt="Phoenix Pets Logo" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-cream-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 shrink-0">
                      {product.category}
                    </span>
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-display font-medium text-[#1e3a8a] text-base">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-[#22c55e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                          {product.discount.includes('%') || product.discount.toLowerCase().includes('off') ? product.discount : `${product.discount}% OFF`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-charcoal group-hover:text-charcoal transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-4">
                    <span className="text-sm font-medium capitalize text-charcoal/50">
                      {product.kind}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setOrderingProduct(product); setOrderQuantity(1); }}
                        className="flex h-10 px-4 items-center justify-center rounded-full bg-[#ff7a00] text-white font-medium text-sm transition-colors hover:bg-[#ff7a00]/90 shadow-sm"
                      >
                        <Zap size={16} className="mr-1" /> Order
                      </button>
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-soft text-charcoal transition-colors hover:bg-gray-200"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/60 text-lg">No products found matching the selected categories.</p>
              <button 
                onClick={() => setSelectedCategories([])}
                className="mt-4 text-[#ff7a00] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Direct Order Modal */}
      {orderingProduct && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setOrderingProduct(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={() => setOrderingProduct(null)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Complete Your Order
                  </h3>
                  
                  <div className="mb-6 flex flex-wrap sm:flex-nowrap items-center justify-between bg-gray-50 p-4 rounded-lg gap-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 bg-white rounded-md border p-1 relative overflow-hidden">
                        <img src={orderingProduct.image || 'https://via.placeholder.com/64'} alt={orderingProduct.name} className="h-full w-full object-cover rounded" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{orderingProduct.name}</h4>
                        <p className="text-sm text-[#ff7a00] font-medium">
                          {orderingProduct.price} {orderQuantity > 1 ? `x ${orderQuantity} = ₹${(parsePrice(orderingProduct.price) * orderQuantity).toLocaleString('en-IN')}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-xs text-gray-500 font-medium mr-1">Qty:</span>
                      <button 
                        type="button"
                        onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-700 font-bold transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900">{orderQuantity}</span>
                      <button 
                        type="button"
                        onClick={() => setOrderQuantity(prev => prev + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-700 font-bold transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" required value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" required value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input type="tel" required value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                      <textarea required rows={3} value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm"></textarea>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#ff7a00] text-base font-medium text-white hover:bg-[#ff7a00]/90 focus:outline-none sm:col-start-2 sm:text-sm">
                        Place Order
                      </button>
                      <button type="button" onClick={() => setOrderingProduct(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
                        Cancel
                      </button>
                    </div>
                    <div className="mt-3 text-center pt-2 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={() => {
                          if (orderingProduct) {
                            for (let i = 0; i < orderQuantity; i++) {
                              addToCart(orderingProduct);
                            }
                            setOrderingProduct(null);
                            setOrderQuantity(1);
                          }
                        }}
                        className="text-sm font-medium text-[#1e3a8a] hover:underline flex items-center justify-center w-full py-2 bg-blue-50/50 rounded-md"
                      >
                        <ShoppingBag size={14} className="mr-1.5" /> 
                        Add to Cart & Continue Shopping
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
