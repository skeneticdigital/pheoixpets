import html2pdf from 'html2pdf.js';
import { Download, X } from 'lucide-react';

interface InvoiceViewProps {
  order: any;
  onClose: () => void;
  showPaidStamp?: boolean;
}

export default function InvoiceView({ order, onClose, showPaidStamp = false }: InvoiceViewProps) {
  if (!order) return null;

  const handlePrint = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    // Hide buttons during PDF generation
    const buttons = document.querySelectorAll('.print-hide');
    buttons.forEach(b => ((b as HTMLElement).style.display = 'none'));
    
    const opt = {
      margin:       0,
      filename:     `PhoenixPets_Invoice_${order.id}.pdf`,
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

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity print-hide" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen print-hide">&#8203;</span>
        <div className="inline-block align-bottom sm:align-middle relative">
          <div className="print-hide flex justify-end space-x-2 mb-4 w-full">
            <button onClick={handlePrint} className="bg-[#ff7a00] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#ff7a00]/90 focus:outline-none inline-flex items-center shadow-sm transition-colors">
              <Download className="h-3.5 w-3.5 mr-1.5" /> Download Invoice
            </button>
            <button onClick={onClose} className="bg-white rounded-md px-3 py-1.5 text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none shadow-sm text-xs inline-flex items-center">
               <X className="h-3.5 w-3.5 mr-1" /> Close
            </button>
          </div>
          <div className="bg-white invoice-print mx-auto relative" style={{ width: '210mm', height: '297mm' }}>
            


            {/* Invoice Content */}
            <div 
              id="invoice-content" 
              className="p-12 bg-white w-full h-full flex flex-col text-left border-[16px] border-double border-gray-200"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
                <div className="text-left flex-1">
                  <h2 className="text-4xl font-display text-charcoal font-bold tracking-widest uppercase mb-2">INVOICE</h2>
                  <p className="text-base font-bold text-gray-800 mt-2">Order #{order.id}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center justify-start mx-6">
                  <div className="bg-black rounded-full h-24 w-24 flex items-center justify-center p-3 shadow-md border-2 border-[#ff7a00]/30">
                    <img src="/phoenix_pets_logo.png" alt="Phoenix Pets Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="text-right flex-1 flex flex-col items-end">
                  {showPaidStamp && (
                    <div className="mb-2 inline-block transform -rotate-6 opacity-80 pointer-events-none">
                      <div className="border-2 border-green-600 rounded px-2 py-0.5 text-green-600 text-xl font-bold font-display uppercase tracking-widest bg-white/50 shadow-sm" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
                        PAID
                      </div>
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-charcoal mb-1 font-display">Phoenix Pets</h3>
                  <p className="text-sm font-semibold text-gray-600 max-w-[220px] ml-auto leading-tight">No.35/15, S Mada St, Sarojini Nagar, Kolathur, Chennai, Greater Chennai, Tamil Nadu 600099</p>
                  <p className="text-sm font-semibold text-gray-700 mt-1.5">+91 8797979300</p>
                </div>
              </div>

              <div className="mb-8 bg-gray-50/70 p-5 rounded-lg border border-gray-100">
                <div className="max-w-sm">
                  <h4 className="text-xs font-bold text-gray-400 mb-1 font-display tracking-widest uppercase">BILL TO:</h4>
                  <p className="font-bold text-gray-900 text-lg font-display">{order.customerDetails.name}</p>
                  <p className="font-semibold text-sm text-gray-700 mt-1">{order.customerDetails.email}</p>
                  <p className="font-semibold text-sm text-gray-700 mt-0.5">{order.customerDetails.phone}</p>
                  <p className="font-semibold text-sm text-gray-700 mt-1 whitespace-pre-wrap">{order.customerDetails.address}</p>
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
                  {order.items.map((item: any, idx: number) => (
                    <tr key={item.id}>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-700 text-center">{idx + 1}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{item.name}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-700 text-center">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-sm font-bold text-gray-900 text-right">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-white border-t border-gray-200">
                    <td colSpan={3} className="py-3 px-4 text-right font-bold text-gray-700 text-sm">Subtotal:</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 text-sm">₹{(order.totalAmount > 100 ? order.totalAmount - 100 : order.totalAmount).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td colSpan={3} className="py-3 px-4 text-right font-bold text-gray-700 text-sm">Shipping:</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 text-sm">₹100</td>
                  </tr>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td colSpan={3} className="py-4 px-4 text-right font-bold text-gray-900 text-base">Total:</td>
                    <td className="py-4 px-4 text-right font-bold text-2xl text-[#ff7a00]">₹{order.totalAmount.toLocaleString('en-IN')}</td>
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

              {/* Payment Screenshot (Admin View) */}
              {order.paymentScreenshot && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-left print-hide">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 font-display">
                    Payment Verification Screenshot:
                  </h4>
                  <div className="flex justify-center bg-gray-50 p-2 rounded border border-gray-200">
                    <img 
                      src={order.paymentScreenshot} 
                      alt="Payment Verification" 
                      className="max-h-[300px] object-contain rounded"
                    />
                  </div>
                </div>
              )}

              <div className="text-center mt-auto pt-6 border-t border-gray-200 flex justify-between items-center">
                <p className="font-bold text-gray-700 text-base font-display">Thank you for shopping with Phoenix Pets!</p>
                {showPaidStamp && (
                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">✓ Payment Received</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
