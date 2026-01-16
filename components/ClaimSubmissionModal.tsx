import React, { useState } from 'react';
import { X, HeartHandshake, Loader2, FileText } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { useLanguage } from '../contexts/LanguageContext';

interface ClaimSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

const ClaimSubmissionModal: React.FC<ClaimSubmissionModalProps> = ({ isOpen, onClose, memberId, memberName }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'FUNERAL' as const,
    amountRequested: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
        mockDb.addClaim({
            memberId,
            memberName,
            type: formData.type as any,
            amountRequested: Number(formData.amountRequested),
            description: formData.description
        });
        setLoading(false);
        onClose();
        // Reset form
        setFormData({ type: 'FUNERAL', amountRequested: '', description: '' });
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-brand-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-accent-600" />
                {t('claims.modal_title')}
            </h3>
            <button onClick={onClose} className="text-brand-400 hover:text-brand-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-800">
                <FileText className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>
                    {t('claims.info')}
                </p>
            </div>

            {/* Type */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-brand-700">{t('claims.label_type')}</label>
                <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-300 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md border"
                >
                    <option value="FUNERAL">{t('claims.type.funeral')}</option>
                    <option value="MEDICAL">{t('claims.type.medical')}</option>
                    <option value="WEDDING">{t('claims.type.wedding')}</option>
                    <option value="OTHER">{t('claims.type.other')}</option>
                </select>
            </div>

            {/* Amount */}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-brand-700">{t('claims.label_amount')}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        required
                        min="1"
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-3 pr-12 sm:text-sm border-brand-300 rounded-md border py-2 outline-none"
                        placeholder="0.00"
                        value={formData.amountRequested}
                        onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">ETB</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-700">{t('claims.label_reason')}</label>
                <div className="mt-1">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        required
                        className="shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border border-brand-300 rounded-md p-2 outline-none"
                        placeholder={t('claims.placeholder_desc')}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-brand-300 rounded-md shadow-sm text-sm font-medium text-brand-700 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                    {t('claims.btn_cancel')}
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
                        t('claims.btn_submit')
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimSubmissionModal;