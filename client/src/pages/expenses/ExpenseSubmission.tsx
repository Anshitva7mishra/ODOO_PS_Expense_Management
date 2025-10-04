import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpense } from '../../contexts/ExpenseContext';
import { useCompany } from '../../contexts/CompanyContext';
import { UploadIcon } from 'lucide-react';
const ExpenseSubmission: React.FC = () => {
  const navigate = useNavigate();
  const {
    submitExpense,
    processReceipt,
    loading
  } = useExpense();
  const {
    company,
    currencies,
    convertCurrency
  } = useCompany();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(company?.currency || 'USD');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [processingReceipt, setProcessingReceipt] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ['Travel', 'Meals', 'Office Supplies', 'Entertainment', 'Transportation', 'Accommodation', 'Training', 'Software', 'Hardware', 'Other'];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || !category || !description || !date) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      let convertedAmount = numAmount;
      if (currency !== company?.currency && company) {
        convertedAmount = convertCurrency(numAmount, currency, company.currency);
      }
      await submitExpense({
        amount: convertedAmount,
        originalAmount: currency !== company?.currency ? numAmount : undefined,
        originalCurrency: currency !== company?.currency ? currency : undefined,
        category,
        description,
        date,
        receiptUrl: receiptPreview || undefined
      });
      navigate('/expenses/history');
    } catch (err) {
      setError('Failed to submit expense. Please try again.');
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOCR = async () => {
    if (!receiptFile) return;
    setProcessingReceipt(true);
    try {
      const result = await processReceipt(receiptFile);
      if (result.amount) {
        setAmount(result.amount.toString());
      }
      if (result.category) {
        setCategory(result.category);
      }
      if (result.description) {
        setDescription(result.description);
      }
      if (result.date) {
        setDate(result.date);
      }
    } catch (err) {
      console.error('OCR processing failed:', err);
    } finally {
      setProcessingReceipt(false);
    }
  };
  return <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Submit Expense
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill out the form below to submit a new expense for approval
        </p>
      </div>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm">
          {error}
        </div>}
      <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left column */}
            <div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Amount*
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" min="0" required className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="0.00" />
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    {currencies.map(curr => <option key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </option>)}
                  </select>
                </div>
                {currency !== company?.currency && <p className="mt-1 text-xs text-gray-500">
                    Will be converted to {company?.currency} at current exchange
                    rate
                  </p>}
              </div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map(cat => <option key={cat} value={cat}>
                      {cat}
                    </option>)}
                </select>
              </div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Brief description of the expense" />
              </div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
            </div>
            {/* Right column - Receipt upload */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Receipt (Optional)
              </label>
              <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md h-48 sm:h-64">
                {receiptPreview ? <div className="w-full h-full relative">
                    <img src={receiptPreview} alt="Receipt preview" className="h-full mx-auto object-contain" />
                    <button type="button" onClick={() => {
                  setReceiptFile(null);
                  setReceiptPreview(null);
                }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                      ✕
                    </button>
                  </div> : <div className="space-y-1 text-center flex flex-col items-center justify-center">
                    <UploadIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
                    <div className="flex text-xs sm:text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>}
              </div>
              {receiptFile && <button type="button" onClick={handleOCR} disabled={processingReceipt} className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                  {processingReceipt ? <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </> : 'Extract data from receipt'}
                </button>}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-0 sm:space-x-3">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {loading ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </> : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default ExpenseSubmission;