import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import type { Product, PetKind } from '../data/content';
import { compressImage } from '../utils/imageCompressor';
import { Plus, X, Edit2, Trash2, Download, MinusCircle, FileDown, Copy, LogOut } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function Admin() {
  const { products, addProduct, addProducts, updateProduct, deleteProduct, categories: dynamicCategories, addCategory, deleteCategory, media, addMedia, deleteMedia } = useProducts();
  const { orders, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'Rakesh' && loginPassword === 'rocky1325') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'media'>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCategoryDiscountModalOpen, setIsCategoryDiscountModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Single Product Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [kind, setKind] = useState<PetKind>('dog');
  const [image, setImage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageName, setImageName] = useState('');
  
  // Media state
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaName, setMediaName] = useState('');

  // Dynamic Bulk Upload state
  const [bulkList, setBulkList] = useState([
    { name: '', category: '', price: '₹', originalPrice: '', discount: '', kind: 'dog' as PetKind, image: '', imageName: '' }
  ]);

  // Category Discount state
  const [discountCategory, setDiscountCategory] = useState('');
  const [categoryDiscountPercent, setCategoryDiscountPercent] = useState('');

  // Auto calculate sale price
  useEffect(() => {
    if (originalPrice && discount) {
      const orig = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
      const disc = parseFloat(discount.replace(/[^\d.]/g, ''));
      if (!isNaN(orig) && !isNaN(disc) && disc > 0 && orig > 0) {
        // Assume discount is percentage
        const sale = orig - (orig * (disc / 100));
        setPrice('₹' + Math.round(sale).toString());
        // Auto-formatting is now handled onBlur to prevent cursor jumping
      }
    }
  }, [originalPrice, discount]);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!mediaName) setMediaName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 0.7);
        setMediaPreview(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMedia = () => {
    if (mediaPreview && mediaName) {
      addMedia({ name: mediaName, url: mediaPreview });
      setMediaPreview('');
      setMediaName('');
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const compressed = await compressImage(result, 800, 0.7);
      addMedia({ name: file.name, url: compressed });
    }
    
    e.target.value = '';
  };

  const handleExportCSV = () => {
    // Generate CSV data: product name, category, image name, price, original price
    const headers = ['Product Name', 'Category', 'Image Name', 'Price', 'Original Price', 'Discount'];
    const rows = products.map(p => {
      // Extract image name from URL or use provided imageName
      let imgName = p.imageName || '';
      if (!imgName && p.image && !p.image.startsWith('data:')) {
        const parts = p.image.split('/');
        imgName = parts[parts.length - 1] || '';
        // Remove query parameters if any
        if (imgName.includes('?')) {
          imgName = imgName.split('?')[0];
        }
      } else if (!imgName && p.image && p.image.startsWith('data:')) {
         imgName = p.name; // Use product name if it's a local upload
      }

      // If imgName is still 'Local Upload' or empty, use the product name
      if (!imgName || imgName === 'Local Upload') {
        imgName = p.name;
      }

      return [
        `"${p.name.replace(/"/g, '""')}"`, // escape quotes
        p.category,
        `"${imgName}"`,
        p.price,
        p.originalPrice || '',
        p.discount || ''
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    
    // Create a Blob with UTF-8 BOM and trigger download so Excel reads symbols correctly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'phoenix_pets_products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || '');
      setDiscount(product.discount || '');
      setKind(product.kind);
      setImage(product.image || '');
      setImageName(product.imageName || '');
    } else {
      setEditingProduct(null);
      setName('');
      setCategory('');
      setPrice('₹');
      setOriginalPrice('');
      setDiscount('');
      setKind('dog');
      setImage('');
      setImageName('');
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct({ ...editingProduct, name, category, price, originalPrice, discount, kind, image, imageName });
    } else {
      addProduct({ name, category, price, originalPrice, discount, kind, image, imageName });
    }
    closeProductModal();
  };

  const handleAddBulkRow = () => {
    setBulkList([...bulkList, { name: '', category: '', price: '₹', originalPrice: '', discount: '', kind: 'dog' as PetKind, image: '', imageName: '' }]);
  };

  const handleRemoveBulkRow = (index: number) => {
    setBulkList(bulkList.filter((_, i) => i !== index));
  };

  const handleBulkChange = (index: number, field: string, value: string) => {
    setBulkList(prev => {
      const updated = [...prev];
      let product = { ...updated[index], [field]: value };
      
      // Auto calculate sale price
      if (field === 'originalPrice' || field === 'discount') {
        const orig = parseFloat(product.originalPrice.replace(/[^\d.]/g, ''));
        const disc = parseFloat(product.discount.replace(/[^\d.]/g, ''));
        if (!isNaN(orig) && !isNaN(disc) && disc > 0 && orig > 0) {
          const sale = orig - (orig * (disc / 100));
          product.price = '₹' + Math.round(sale).toString();
          // We do not format the discount to "% OFF" automatically in the bulk row
          // while typing to avoid jumping cursor, user can type the number.
        }
      }
      
      updated[index] = product;
      return updated;
    });
  };

  const handleBulkSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Manual validation
    for (let i = 0; i < bulkList.length; i++) {
      const p = bulkList[i];
      if (!p.name.trim()) {
        alert(`Row ${i + 1}: Please enter a product name.`);
        return;
      }
      if (!p.category) {
        alert(`Row ${i + 1}: Please select a category.`);
        return;
      }
      if (p.price === '₹' || p.price.trim() === '') {
        alert(`Row ${i + 1}: Please enter a price.`);
        return;
      }
    }

    const validProducts = bulkList.filter(p => p.name.trim() !== '' && p.category !== '' && p.price !== '₹' && p.price !== '');
    if (validProducts.length > 0) {
      // Map categories to kind automatically
      const productsWithKind = validProducts.map(p => {
        let kind: PetKind = 'dog';
        const catLow = p.category.toLowerCase();
        if (catLow === 'bird') kind = 'bird';
        else if (catLow === 'cat') kind = 'cat';
        else if (catLow === 'fighting rooster') kind = 'rooster';
        else if (catLow === 'guinea pig') kind = 'guinea_pig';
        else if (catLow === 'hamster') kind = 'hamster';
        else if (catLow === 'pigeon') kind = 'pigeon';
        else if (catLow === 'rabbit') kind = 'rabbit';
        else if (catLow === 'reptiles') kind = 'reptile';
        else if (catLow === 'turtle') kind = 'turtle';
        else if (catLow === 'mammal') kind = 'mammal';
        
        return { ...p, kind };
      });
      
      try {
        let success = false;
        if (typeof addProducts === 'function') {
          success = await addProducts(productsWithKind) as boolean;
        } else {
          for (const p of productsWithKind) {
            await addProduct(p);
          }
          success = true;
        }
        
        if (success !== false) {
          setIsBulkModalOpen(false);
          setBulkList([{ name: '', category: '', price: '₹', originalPrice: '', discount: '', kind: 'dog' as PetKind, image: '', imageName: '' }]);
        }
      } catch (err) {
        alert("An error occurred while adding products.");
      }
    } else {
      alert("Please fill in the product details before submitting.");
    }
  };

  const handleApplyCategoryDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCategory || !categoryDiscountPercent) return;
    
    const disc = parseFloat(categoryDiscountPercent.replace(/[^\d.]/g, ''));
    if (isNaN(disc) || disc <= 0) {
      alert('Please enter a valid discount percentage');
      return;
    }

    // Find all products in this category
    const categoryProducts = products.filter(p => p.category.toLowerCase() === discountCategory.toLowerCase());
    
    if (categoryProducts.length === 0) {
      alert(`No products found in category "${discountCategory}"`);
      return;
    }

    // Update each product
    categoryProducts.forEach(p => {
      // Determine base price to discount from (if it already has originalPrice, use it; otherwise use price)
      const basePriceStr = p.originalPrice || p.price;
      const basePrice = parseFloat(basePriceStr.replace(/[^\d.]/g, ''));
      
      if (!isNaN(basePrice) && basePrice > 0) {
        const sale = basePrice - (basePrice * (disc / 100));
        const updatedProduct: Product = {
          ...p,
          originalPrice: '₹' + basePrice.toString(), // Keep or set original price
          price: '₹' + Math.round(sale).toString(),
          discount: `${disc}% OFF`
        };
        updateProduct(updatedProduct);
      }
    });

    setIsCategoryDiscountModalOpen(false);
    setDiscountCategory('');
    setCategoryDiscountPercent('');
    alert(`Successfully applied ${disc}% discount to ${categoryProducts.length} products in ${discountCategory}!`);
  };

  const openInvoice = (order: any) => {
    setSelectedOrder(order);
  };

  const handlePrint = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    // Hide buttons during PDF generation
    const buttons = document.querySelectorAll('.print-hide');
    buttons.forEach(b => ((b as HTMLElement).style.display = 'none'));
    
    const opt = {
      margin:       0,
      filename:     `PhoenixPets_Invoice_${selectedOrder?.id}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      // Restore buttons
      buttons.forEach(b => ((b as HTMLElement).style.display = ''));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-card max-w-sm w-full text-center">
          <div className="flex justify-center mb-6">
            <img src="/phoenix_pets_logo.png" alt="Logo" className="w-20 h-20 object-contain rounded-full bg-black p-2 shadow-sm border border-charcoal/5" />
          </div>
          <h1 className="font-display text-2xl text-charcoal mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a00] focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a00] focus:border-transparent transition-all"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-left">Invalid username or password.</p>
            )}
            <button 
              type="submit" 
              className="w-full bg-[#ff7a00] text-white py-3 rounded-lg font-medium hover:bg-[#e66a00] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto print-hide flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 md:border-r md:border-gray-400 md:pr-8">
          <div className="mb-8 flex flex-col items-start gap-4">
            <img src="/phoenix_pets_logo.png" alt="Logo" className="w-16 h-16 object-contain rounded-full bg-black p-1 shadow-sm border border-charcoal/5" />
            <h1 className="text-4xl font-display text-charcoal">Phoenix Admin</h1>
          </div>

          <nav className="flex flex-col" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'bg-[#ff7a00] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } px-4 py-4 text-left font-medium transition-colors border-b border-gray-400`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'bg-[#ff7a00] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } px-4 py-4 text-left font-medium transition-colors border-b border-gray-400`}
            >
              Orders & Invoices
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'bg-[#ff7a00] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } px-4 py-4 text-left font-medium transition-colors border-b border-gray-400`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`${
                activeTab === 'media'
                  ? 'bg-[#ff7a00] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } px-4 py-4 text-left font-medium transition-colors border-b border-gray-400`}
            >
              Media
            </button>
            <div className="pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4 space-x-4">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:w-auto"
              >
                <Download className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Export to Excel (CSV)
              </button>
              <button
                onClick={() => setIsCategoryDiscountModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:w-auto"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Category Discount
              </button>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:w-auto"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Bulk Add Products
              </button>
              <button
                onClick={() => openProductModal()}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#ff7a00] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ff7a00]/90 focus:outline-none sm:w-auto"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Product
              </button>
            </div>

            <div className="flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-white">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-10 w-10 rounded-full object-cover" src={product.image || 'https://via.placeholder.com/40'} alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {product.category}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {product.price}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button onClick={() => openProductModal(product)} className="text-[#ff7a00] hover:text-[#e06a00] mr-4">
                                <Edit2 size={18} />
                                <span className="sr-only">Edit {product.name}</span>
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                                <span className="sr-only">Delete {product.name}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-white">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {order.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {order.customerDetails.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                            <button onClick={() => openInvoice(order)} className="text-[#ff7a00] hover:text-[#e06a00] inline-flex items-center mr-3">
                              <FileDown size={18} className="mr-1" /> View & Download
                            </button>
                            <button 
                              onClick={() => deleteOrder(order.id)} 
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                              title="Delete Invoice"
                            >
                              <Trash2 size={18} className="mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto print-hide" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeProductModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeProductModal}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={handleProductSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select required value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm rounded-md">
                          <option value="" disabled>Select</option>
                          {dynamicCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                          </div>
                          <input type="text" required value={price.replace(/^₹/, '')} onChange={e => setPrice('₹' + e.target.value)} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" placeholder="499" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                          </div>
                          <input type="text" value={originalPrice.replace(/^₹/, '')} onChange={e => setOriginalPrice(e.target.value ? '₹' + e.target.value : '')} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" placeholder="700" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Discount</label>
                        <input 
                          type="text" 
                          value={discount} 
                          onChange={e => setDiscount(e.target.value)} 
                          onBlur={() => {
                            if (/^\d+(\.\d+)?$/.test(discount.trim())) {
                              setDiscount(discount.trim() + '% OFF');
                            }
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" 
                          placeholder="29% OFF" 
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Product Image Selection</h4>
                      
                      {/* Option 1: Select from Uploaded Media Library */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          1. Choose from Media Library ({media.length} items available)
                        </label>
                        <select
                          value={media.find(m => m.url === image)?.url || ''}
                          onChange={(e) => {
                            const selectedUrl = e.target.value;
                            if (selectedUrl) {
                              const selectedItem = media.find(m => m.url === selectedUrl);
                              setImage(selectedUrl);
                              if (selectedItem?.name) {
                                setImageName(selectedItem.name);
                                if (!name) {
                                  setName(selectedItem.name.replace(/\.[^/.]+$/, ""));
                                }
                              }
                            }
                          }}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] bg-white"
                        >
                          <option value="">-- Select from Media Library --</option>
                          {media.map((item) => (
                            <option key={item.id} value={item.url}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Option 2: Upload New Image File directly */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          2. Or Upload New Image from Computer
                        </label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const dataUrl = reader.result as string;
                                const compressed = await compressImage(dataUrl, 800, 0.7);
                                setImage(compressed);
                                setImageName(file.name);
                                if (!name) {
                                  setName(file.name.replace(/\.[^/.]+$/, ""));
                                }
                                // Save to Media library automatically
                                addMedia({ name: file.name, url: compressed });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#ff7a00]/10 file:text-[#ff7a00] hover:file:bg-[#ff7a00]/20"
                        />
                      </div>



                      {/* Preview Box */}
                      {image && (
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                          <img src={image} alt="Preview" className="h-14 w-14 object-cover rounded-md border border-gray-300 bg-white" />
                          <div className="text-xs text-gray-600 flex-1">
                            <span className="font-medium text-gray-800">Selected Image Preview</span>
                            <p className="truncate max-w-[220px] text-gray-500">{imageName || 'Custom Image'}</p>
                            <button 
                              type="button" 
                              onClick={() => { setImage(''); setImageName(''); }}
                              className="text-red-500 hover:text-red-700 font-medium underline mt-0.5"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-5 sm:mt-4 flex sm:flex-row-reverse">
                      <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#ff7a00] text-base font-medium text-white hover:bg-[#ff7a00]/90 sm:ml-3 sm:w-auto sm:text-sm">
                        {editingProduct ? 'Save' : 'Add'}
                      </button>
                      <button type="button" onClick={closeProductModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Categories</h3>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }
                }}
                className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }
                }}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#ff7a00] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ff7a00]/90 focus:outline-none"
              >
                Add Category
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {dynamicCategories.map(cat => (
                <div key={cat} className="flex justify-between items-center py-2 px-4 hover:bg-gray-50">
                  <span className="font-medium text-charcoal">{cat}</span>
                  <button
                    onClick={() => {
                        deleteCategory(cat);
                    }}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Image</h3>
            <p className="text-sm text-gray-500 mb-4">
              Note: Images are saved directly in your browser's local storage which has a 5MB limit. Please upload small images or compress them first.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Single Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleMediaFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ff7a00]/10 file:text-[#ff7a00] hover:file:bg-[#ff7a00]/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Entire Folder</label>
                  <input 
                    type="file" 
                    // @ts-ignore - webkitdirectory is non-standard but works in all modern browsers
                    webkitdirectory="" 
                    directory=""
                    multiple
                    accept="image/*"
                    onChange={handleFolderUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select a folder to bulk-upload all images inside it directly to the library.</p>
                </div>
              </div>
              
              {mediaPreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview & Details</label>
                  <div className="flex gap-4 items-start">
                    <img src={mediaPreview} alt="Preview" className="h-24 w-24 object-cover rounded border" />
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        placeholder="Image Name"
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00]"
                      />
                      <button
                        onClick={handleUploadMedia}
                        disabled={!mediaName.trim()}
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#ff7a00] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ff7a00]/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-display text-charcoal mb-4">Media Library</h3>
          
          {media.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No media files uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="object-cover w-full h-40"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                        }}
                        className="bg-white p-2 rounded-full text-gray-900 hover:text-[#ff7a00] tooltip"
                        title="Copy URL"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => {
                            deleteMedia(item.id);
                        }}
                        className="bg-white p-2 rounded-full text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Discount Modal */}
      {isCategoryDiscountModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCategoryDiscountModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Apply Category Discount
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Select a category and apply a discount. This will calculate the sale price for all products in that category.
                    </p>
                    <form onSubmit={handleApplyCategoryDiscount} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select required value={discountCategory} onChange={e => setDiscountCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm rounded-md">
                          <option value="" disabled>Select</option>
                          {dynamicCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                        <input type="text" required value={categoryDiscountPercent} onChange={e => setCategoryDiscountPercent(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ff7a00] focus:border-[#ff7a00] sm:text-sm" placeholder="e.g. 10" />
                      </div>
                      <div className="mt-5 sm:mt-4 flex sm:flex-row-reverse">
                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#22c55e] text-base font-medium text-white hover:bg-[#22c55e]/90 sm:ml-3 sm:w-auto sm:text-sm">
                          Apply
                        </button>
                        <button type="button" onClick={() => setIsCategoryDiscountModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto print-hide" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsBulkModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500" onClick={() => setIsBulkModalOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div>
                <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Bulk Add Products</h3>
                <div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                    {bulkList.map((product, index) => (
                      <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="w-full sm:w-1/4">
                          <input type="text" placeholder="Product Name" value={product.name} onChange={e => handleBulkChange(index, 'name', e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:border-[#ff7a00]" />
                        </div>
                        <div className="w-full sm:w-1/4">
                          <select value={product.category} onChange={e => handleBulkChange(index, 'category', e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:border-[#ff7a00]">
                            <option value="" disabled>Category</option>
                            {dynamicCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full sm:w-1/6 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm font-medium">₹</span>
                          </div>
                          <input type="text" value={product.price.replace(/^₹/, '')} onChange={e => handleBulkChange(index, 'price', '₹' + e.target.value)} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#ff7a00]" placeholder="Sale Price" />
                        </div>
                        <div className="w-full sm:w-1/6 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm font-medium">₹</span>
                          </div>
                          <input type="text" value={product.originalPrice.replace(/^₹/, '')} onChange={e => handleBulkChange(index, 'originalPrice', '₹' + e.target.value)} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#ff7a00]" placeholder="Orig Price" />
                        </div>
                        <div className="w-full sm:w-28">
                          <input 
                            type="text" 
                            placeholder="Disc(10)" 
                            value={product.discount} 
                            onChange={e => handleBulkChange(index, 'discount', e.target.value)} 
                            onBlur={() => {
                              if (/^\d+(\.\d+)?$/.test(product.discount.trim())) {
                                handleBulkChange(index, 'discount', product.discount.trim() + '% OFF');
                              }
                            }}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:border-[#ff7a00]" 
                          />
                        </div>
                        <div className="w-full sm:w-1/3 flex items-center gap-2">
                          <div className="flex-1 space-y-1">
                            <select
                              value={media.find(m => m.url === product.image)?.url || ''}
                              onChange={(e) => {
                                const selectedUrl = e.target.value;
                                const selectedItem = media.find(m => m.url === selectedUrl);
                                if (selectedUrl) {
                                  handleBulkChange(index, 'image', selectedUrl);
                                  if (selectedItem?.name) {
                                    handleBulkChange(index, 'imageName', selectedItem.name);
                                    if (!product.name) {
                                      handleBulkChange(index, 'name', selectedItem.name.replace(/\.[^/.]+$/, ""));
                                    }
                                  }
                                }
                              }}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-xs focus:outline-none focus:border-[#ff7a00] bg-white"
                            >
                              <option value="">-- Choose from Media ({media.length}) --</option>
                              {media.map(m => (
                                <option key={m.id} value={m.url}>{m.name}</option>
                              ))}
                            </select>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer bg-[#ff7a00]/10 text-[#ff7a00] hover:bg-[#ff7a00]/20 py-1 px-2 rounded font-semibold text-[10px] whitespace-nowrap">
                                Choose File
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = async () => {
                                        const dataUrl = reader.result as string;
                                        const compressed = await compressImage(dataUrl, 800, 0.7);
                                        handleBulkChange(index, 'image', compressed);
                                        handleBulkChange(index, 'imageName', file.name);
                                        if (!product.name) {
                                          handleBulkChange(index, 'name', file.name.replace(/\.[^/.]+$/, ""));
                                        }
                                        addMedia({ name: file.name, url: compressed });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              <span className="text-[10px] text-gray-500 truncate max-w-[100px]" title={product.imageName || "No file chosen"}>
                                {product.imageName || "No file chosen"}
                              </span>
                            </div>
                          </div>

                          {product.image && (
                            <img src={product.image} alt="Preview" className="h-10 w-10 object-cover rounded border border-gray-300 bg-white flex-shrink-0" />
                          )}
                        </div>
                        <div className="w-auto">
                          <button type="button" onClick={() => handleRemoveBulkRow(index)} className="text-red-500 hover:text-red-700 p-2" disabled={bulkList.length === 1}>
                            <MinusCircle size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <button type="button" onClick={handleAddBulkRow} className="inline-flex items-center text-sm text-[#ff7a00] font-medium hover:text-[#e06a00]">
                      <Plus size={16} className="mr-1" /> Add Another Row
                    </button>
                    <div className="flex space-x-3">
                      <button type="button" onClick={() => setIsBulkModalOpen(false)} className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:text-gray-500">
                        Cancel
                      </button>
                      <button type="button" onClick={handleBulkSubmit} className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#ff7a00] text-sm font-medium text-white hover:bg-[#ff7a00]/90">
                        Upload All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal / Printable Area */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity print-hide" onClick={() => setSelectedOrder(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen print-hide">&#8203;</span>
            <div className="inline-block align-bottom sm:align-middle relative">
              <div className="print-hide flex justify-end space-x-2 mb-4 w-full">
                <button onClick={handlePrint} className="bg-[#ff7a00] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#ff7a00]/90 focus:outline-none inline-flex items-center shadow-sm transition-colors">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Download Invoice
                </button>
                <button onClick={() => setSelectedOrder(null)} className="bg-white rounded-md px-3 py-1.5 text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none shadow-sm text-xs">
                  Close
                </button>
              </div>
              <div className="bg-white invoice-print mx-auto" style={{ width: '210mm', height: '297mm' }}>

              {/* Invoice Content */}
              <div 
                id="invoice-content" 
                className="p-12 bg-white w-full h-full flex flex-col text-left border-[16px] border-double border-gray-200"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
                  <div className="text-left flex-1">
                    <h2 className="text-4xl font-display text-charcoal font-bold tracking-widest uppercase mb-2">INVOICE</h2>
                    <p className="text-base font-bold text-gray-800 mt-2">Order #{selectedOrder.id}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center justify-start mx-6">
                    <div className="bg-black rounded-full h-24 w-24 flex items-center justify-center p-3 shadow-md border-2 border-[#ff7a00]/30">
                      <img src="/phoenix_pets_logo.png" alt="Phoenix Pets Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold text-xl text-charcoal mb-1 font-display">Phoenix Pets</h3>
                    <p className="text-sm font-semibold text-gray-600 max-w-[220px] ml-auto leading-tight">No.35/15, S Mada St, Sarojini Nagar, Kolathur, Chennai, Greater Chennai, Tamil Nadu 600099</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1.5">+91 8797979300</p>
                  </div>
                </div>

                <div className="mb-8 bg-gray-50/70 p-5 rounded-lg border border-gray-100">
                  <div className="max-w-sm">
                    <h4 className="text-xs font-bold text-gray-400 mb-1 font-display tracking-widest uppercase">BILL TO:</h4>
                    <p className="font-bold text-gray-900 text-lg font-display">{selectedOrder.customerDetails.name}</p>
                    <p className="font-semibold text-sm text-gray-700 mt-1">{selectedOrder.customerDetails.email}</p>
                    <p className="font-semibold text-sm text-gray-700 mt-0.5">{selectedOrder.customerDetails.phone}</p>
                    <p className="font-semibold text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedOrder.customerDetails.address}</p>
                  </div>
                </div>

                <table className="min-w-full mb-6 border-collapse border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100/80">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-16">S.No</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200">Item</th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-24">Qty</th>
                      <th className="py-3 px-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 w-32">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={item.id}>
                        <td className="py-3.5 px-4 text-sm font-semibold text-gray-700 text-center">{idx + 1}</td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{item.name}</td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-gray-700 text-center">{item.quantity}</td>
                        <td className="py-3.5 px-4 text-sm font-bold text-gray-900 text-right">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-gray-900 text-base">Total:</td>
                      <td className="py-4 px-4 text-right font-bold text-2xl text-[#ff7a00]">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Terms & Conditions Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-left">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 font-display">
                    Terms & Conditions:
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1 font-medium">
                    <li>Goods once sold cannot be returned or exchanged without prior authorization & valid receipt.</li>
                    <li>Live pets and perishable pet food items are non-refundable once delivered safely.</li>
                    <li>For any claims, damage reports, or delivery inquiries, please contact Phoenix Pets within 24 hours.</li>
                  </ol>
                </div>

                <div className="text-center mt-auto pt-6 border-t border-gray-200">
                  <p className="font-bold text-gray-700 text-base font-display">Thank you for shopping with Phoenix Pets!</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      </div> {/* End of Main Content Area */}

      {/* Print styles injected directly to hide non-invoice elements during printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-print, .invoice-print * {
            visibility: visible;
          }
          .invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
