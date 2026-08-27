import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import InvoiceView from '../components/InvoiceView';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrders();
  
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const adminUpiId = localStorage.getItem('admin_upi_id');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = cart.reduce((sum, item) => {
    const numericPrice = Number(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + (numericPrice * item.quantity);
  }, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;
    if (adminUpiId) {
      setShowPayment(true);
    } else {
      await processOrder();
    }
  };

  const processOrder = async (screenshot?: string) => {
    const newOrder = await addOrder(
      { name, email, phone, address },
      cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
      total,
      screenshot
    );
    clearCart();
    setIsCheckout(false);
    setTermsAgreed(false);
    
    if (newOrder) {
      setCompletedOrder(newOrder);
    } else {
      setIsSuccess(true);
    }
  };

  const handlePaymentConfirm = (screenshot: string) => {
    setShowPayment(false);
    processOrder(screenshot);
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-[#f8eedf] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-display text-charcoal mb-4">Order Placed Successfully!</h2>
        <p className="text-charcoal/60 mb-8">Please download or print your invoice below.</p>
        <button 
          onClick={() => {
            setCompletedOrder(null);
            setIsSuccess(true);
          }} 
          className="btn-primary bg-[#ff7a00] text-white mb-8"
        >
          Continue Shopping
        </button>
        <InvoiceView 
          order={completedOrder} 
          onClose={() => {
             setCompletedOrder(null);
             setIsSuccess(true);
          }} 
          showPaidStamp={true} 
        />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-[#f8eedf] flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-soft max-w-lg w-full text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display text-charcoal mb-4">Order Placed!</h2>
          <p className="text-charcoal/60 mb-8">Thank you for your purchase. Your order has been recorded.</p>
          <Link to="/shop" className="inline-flex btn-primary bg-[#ff7a00] text-white">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#f8eedf]">
      <div className="container-shell">
        <h1 className="font-display text-4xl text-charcoal mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
            <ShoppingBag size={48} className="mx-auto text-charcoal/20 mb-4" />
            <h2 className="text-2xl font-display text-charcoal mb-2">Your cart is empty</h2>
            <p className="text-charcoal/60 mb-6">Looks like you haven't added any premium products yet.</p>
            <Link to="/" className="inline-flex items-center gap-2 btn-primary bg-[#ff7a00] text-white">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-soft">
                  <div className="w-full sm:w-24 h-24 bg-cream-soft rounded-xl overflow-hidden shrink-0 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="font-display text-lg text-charcoal">{item.name}</h3>
                    <p className="text-sm text-charcoal/60 capitalize mb-2">{item.kind} • {item.category}</p>
                    <div className="font-medium text-charcoal">{item.price}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-charcoal/10 rounded-pill p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-soft transition-colors text-charcoal"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-soft transition-colors text-charcoal"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft h-fit">
              <h2 className="font-display text-2xl text-charcoal mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-charcoal/80 mb-8">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-charcoal/10 pt-4 flex justify-between font-display text-xl text-charcoal">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!isCheckout ? (
                <button onClick={() => setIsCheckout(true)} className="w-full btn-primary bg-[#ff7a00] text-white">
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 border-t border-charcoal/10 pt-6">
                  <h3 className="font-medium text-charcoal mb-2">Delivery Details</h3>
                  <input type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ff7a00]" />
                  <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ff7a00]" />
                  <input type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ff7a00]" />
                  <textarea required placeholder="Delivery Address" value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ff7a00]"></textarea>
                  
                  <div className="flex items-start mt-4 mb-2">
                    <div className="flex items-center h-5">
                      <input
                        id="cart-terms"
                        name="cart-terms"
                        type="checkbox"
                        required
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="focus:ring-[#ff7a00] h-4 w-4 text-[#ff7a00] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="cart-terms" className="font-medium text-gray-700">
                        I agree to terms & conditions
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!termsAgreed}
                    className="w-full btn-primary bg-[#ff7a00] text-white mt-2 disabled:opacity-50"
                  >
                    Place Order (₹{total.toLocaleString('en-IN')})
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {showPayment && adminUpiId && (
        <PaymentModal
          amount={total}
          upiId={adminUpiId}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
