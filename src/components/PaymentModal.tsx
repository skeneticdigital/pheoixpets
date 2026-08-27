import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { compressImage } from '../utils/imageCompressor';

interface PaymentModalProps {
  amount: number;
  upiId: string;
  onConfirm: (screenshot: string) => void;
  onCancel: () => void;
}

export default function PaymentModal({ amount, upiId, onConfirm, onCancel }: PaymentModalProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UPI Intent URL format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Phoenix%20Pets&am=${amount}&cu=INR`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Analyze the image text to ensure it's a payment screenshot
          const result = await Tesseract.recognize(file, 'eng');
          const lowerText = result.data.text.toLowerCase();
          
          // Keywords that typically appear in a UPI success screenshot
          const keywords = ['successful', 'paid', 'transaction', 'upi', 'sent', '₹', 'rupees', 'success', 'completed'];
          const isValid = keywords.some(kw => lowerText.includes(kw));

          if (!isValid) {
            setErrorMsg('This does not look like a valid payment screenshot. Please upload a clear screenshot of the successful UPI transaction.');
            setIsCompressing(false);
            return;
          }

          setErrorMsg(null);
          const compressed = await compressImage(reader.result as string, 800);
          setScreenshot(compressed);
        } catch (e) {
          console.error('Error compressing screenshot:', e);
          setErrorMsg('Failed to process image. Please try another one.');
        } finally {
          setIsCompressing(false);
        }
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read file.');
        setIsCompressing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMsg('Failed to process image. Please try another one.');
      setIsCompressing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6 relative">
          
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-display text-charcoal mb-2 text-center">Complete Payment</h3>
          <p className="text-gray-500 text-center text-sm mb-6">Scan the QR code with any UPI app to pay.</p>

          <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded-xl">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 inline-block">
              <QRCodeSVG 
                value={upiUrl} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Amount to pay</p>
            <p className="text-3xl font-bold text-[#ff7a00]">₹{amount.toLocaleString('en-IN')}</p>
            <p className="text-sm font-medium text-gray-700 mt-2">UPI ID: {upiId}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Payment Screenshot
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                screenshot ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7a00] mb-2"></div>
                  <p className="text-sm text-gray-500">Processing image...</p>
                </div>
              ) : screenshot ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <CheckCircle2 className="text-green-500 mb-2" size={32} />
                  <p className="text-sm font-medium text-green-700">Screenshot uploaded successfully</p>
                  <p className="text-xs text-green-600 mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">Click to upload your UPI success screenshot</p>
                  <p className="text-xs text-gray-400 mt-1">Required to place your order</p>
                </div>
              )}
            </div>
            {errorMsg && (
              <p className="text-red-500 text-xs font-medium mt-2 text-center">{errorMsg}</p>
            )}
          </div>

          <button 
            onClick={() => screenshot && onConfirm(screenshot)}
            disabled={!screenshot || isCompressing}
            className="w-full btn-primary bg-green-600 text-white hover:bg-green-700 font-medium py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I have completed the payment
          </button>
        </div>
      </div>
    </div>
  );
}
