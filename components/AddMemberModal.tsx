import React, { useState } from 'react';
import { X, UserPlus, Loader2, Mail, Phone, User, Shield } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onMemberAdded }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: UserRole.MEMBER,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    gender: 'MALE' as 'MALE' | 'FEMALE'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
    }

    // Simulate API delay
    setTimeout(() => {
        // Generate Sequential ID: m00001, m00002, etc.
        const members = mockDb.getMembers();
        
        const maxId = members.reduce((max, m) => {
           const numericPart = m.id.replace(/\D/g, '');
           const num = numericPart ? parseInt(numericPart, 10) : 0;
           return !isNaN(num) && num > max ? num : max;
        }, 0);

        const uniqueId = `m${String(maxId + 1).padStart(5, '0')}`;
        
        let phoneSuffix = formData.phone.replace(/\D/g, '');
        if (phoneSuffix.startsWith('0')) phoneSuffix = phoneSuffix.substring(1);
        const fullPhone = `+251 ${phoneSuffix}`;

        const newMember = {
            id: uniqueId,
            ...formData,
            phone: fullPhone,
            joinDate: new Date().toISOString().split('T')[0],
            balance: 0,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=a08679&color=fff`
        };

        mockDb.addMember(newMember);
        onMemberAdded();
        
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            role: UserRole.MEMBER,
            status: 'ACTIVE',
            gender: 'MALE'
        });
        setLoading(false);
        onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-brand-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-accent-600" />
                {t('modal.add_title')}
            </h3>
            <button onClick={onClose} className="text-brand-400 hover:text-brand-600 transition-colors p-1 hover:bg-brand-100 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.full_name')}</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                    <input 
                        name="fullName"
                        type="text"
                        placeholder="e.g. Temesgen Gmichael"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-9 w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.email')}</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <input 
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-9 w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.phone')}</label>
                    <div className="flex">
                        <div className="inline-flex items-center px-3 border border-r-0 border-brand-200 rounded-l-lg bg-brand-50 text-brand-500 select-none">
                           <Phone className="w-4 h-4 mr-2 text-brand-400" />
                           <span className="text-sm font-medium text-brand-700">+251</span>
                        </div>
                        <input 
                            name="phone"
                            type="tel"
                            placeholder="911 234 567"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-brand-200 rounded-r-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm transition-all"
                        />
                    </div>
                    <p className="text-xs text-brand-400 mt-1">Format: 911 234 567</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.role')}</label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="pl-9 w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm bg-white appearance-none transition-all"
                        >
                            <option value={UserRole.MEMBER}>{t('directory.role.member')}</option>
                            <option value={UserRole.ADMIN}>{t('directory.role.admin')}</option>
                            <option value={UserRole.TREASURER}>{t('directory.role.treasurer')}</option>
                            <option value={UserRole.SECRETARY}>{t('directory.role.secretary')}</option>
                            <option value={UserRole.COMMUNITY_SERVICE}>{t('directory.role.community_service')}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">{t('modal.initial_status')}</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm bg-white transition-all"
                    >
                        <option value="ACTIVE">{t('status.ACTIVE')}</option>
                        <option value="INACTIVE">{t('status.INACTIVE')}</option>
                    </select>
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.gender')}</label>
                 <select
                     name="gender"
                     value={formData.gender}
                     onChange={handleChange}
                     className="w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm bg-white transition-all"
                 >
                     <option value="MALE">{t('common.male')}</option>
                     <option value="FEMALE">{t('common.female')}</option>
                 </select>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-brand-50 mt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-brand-300 rounded-lg text-brand-700 hover:bg-brand-50 text-sm font-medium transition-colors"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('modal.create_btn')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;