import React, { useState } from 'react';
import { X, Upload, Loader2, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import { mockDb, compressImage } from '../services/mockDb';
import { useLanguage } from '../contexts/LanguageContext';
import { TransactionStatus } from '../types';

interface PaymentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

const PaymentSubmissionModal: React.FC<PaymentSubmissionModalProps> = ({ isOpen, onClose, memberId, memberName }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const compressed = await compressImage(e.target.files[0]);
            setReceiptImage(compressed);
            setError('');
        } catch (err) {
            setError("Image processing failed. Try a smaller file.");
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptImage) {
        setError("Please upload a receipt image.");
        return;
    }
    
    setLoading(true);

    setTimeout(() => {
        mockDb.addTransaction({
            id: `tx${Date.now()}`,
            memberId,
            memberName,
            date: new Date().toISOString().split('T')[0],
            amount: Number(formData.amount),
            type: 'CONTRIBUTION',
            description: formData.description,
            status: TransactionStatus.PENDING,
            receiptUrl: receiptImage
        });
        
        setLoading(false);
        onClose();
        // Reset form
        setFormData({ amount: '', description: '' });
        setReceiptImage(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-brand-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-600" />
                {t('payment.modal_title')}
            </h3>
            <button onClick={onClose} className="text-brand-400 hover:text-brand-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-800 border border-blue-100">
                <FileText className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>
                    {t('payment.info')}
                </p>
            </div>

            {/* Amount */}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-brand-700">{t('common.amount')} (ETB)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="number"
                        id="amount"
                        required
                        min="1"
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-3 pr-12 sm:text-sm border-brand-300 rounded-md border py-2.5 outline-none"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">ETB</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-700">{t('common.description')}</label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="description"
                        required
                        className="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border border-brand-300 rounded-md p-2.5 outline-none"
                        placeholder={t('payment.desc_placeholder')}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>

            {/* Receipt Upload */}
            <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">{t('payment.upload_receipt')}</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-200 border-dashed rounded-lg hover:bg-brand-50 transition ${receiptImage ? 'bg-green-50 border-green-200' : ''}`}>
                    <div className="space-y-1 text-center">
                        {receiptImage ? (
                            <div className="relative group">
                                <img src={receiptImage} alt="Receipt Preview" className="mx-auto h-32 object-contain rounded-md" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-md">
                                    <button 
                                        type="button" 
                                        onClick={() => setReceiptImage(null)}
                                        className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className="mx-auto h-12 w-12 text-brand-300" />
                                <div className="flex text-sm text-brand-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent-600 hover:text-accent-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-brand-400">PNG, JPG, GIF up to 2MB</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-brand-300 rounded-md shadow-sm text-sm font-medium text-brand-700 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('claims.btn_submitting')}
                        </>
                    ) : (
                        t('common.submit')
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentSubmissionModal;