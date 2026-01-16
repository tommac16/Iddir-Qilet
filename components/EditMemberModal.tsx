import React, { useState, useEffect } from 'react';
import { X, User, Loader2, Mail, Phone, Shield, Camera, Check, Bell } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { UserRole, Member, NotificationPreferences } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onMemberUpdated: () => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, member, onMemberUpdated }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Member>>({});

  useEffect(() => {
    if (member) {
      setFormData({ 
          ...member,
          // Ensure prefs are loaded or default provided in state if missing in DB for old records
          notificationPreferences: member.notificationPreferences || {
            email: true,
            sms: true,
            types: { meetings: true, payments: true, news: true }
          }
      });
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
          setError("Image size too large. Please choose an image under 2MB.");
          return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
            setFormData((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preference Toggle Handlers
  const toggleChannel = (channel: 'email' | 'sms') => {
      const currentPrefs = formData.notificationPreferences || {
            email: true,
            sms: true,
            types: { meetings: true, payments: true, news: true }
      };

      setFormData(prev => ({
          ...prev,
          notificationPreferences: {
              ...currentPrefs,
              [channel]: !currentPrefs[channel]
          }
      }));
  };

  const toggleType = (type: keyof NotificationPreferences['types']) => {
      const currentPrefs = formData.notificationPreferences || {
            email: true,
            sms: true,
            types: { meetings: true, payments: true, news: true }
      };

      setFormData(prev => ({
          ...prev,
          notificationPreferences: {
              ...currentPrefs,
              types: {
                  ...currentPrefs.types,
                  [type]: !currentPrefs.types[type]
              }
          }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
    }

    setTimeout(() => {
        try {
            const updatedMember = { ...member, ...formData } as Member;
            mockDb.updateMember(updatedMember);
            onMemberUpdated();
            setLoading(false);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save changes. The image may be too large for local storage.");
            setLoading(false);
        }
    }, 800);
  };

  const prefs = formData.notificationPreferences || {
      email: true,
      sms: true,
      types: { meetings: true, payments: true, news: true }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center flex-shrink-0">
            <h3 className="text-lg font-serif font-bold text-brand-900 flex items-center gap-2">
                <User className="w-5 h-5 text-accent-600" />
                {t('modal.edit_title')}
            </h3>
            <button onClick={onClose} className="text-brand-400 hover:text-brand-600 transition-colors p-1 hover:bg-brand-100 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-center justify-center p-6 bg-brand-50 rounded-xl border-2 border-brand-100 border-dashed hover:border-brand-200 transition-colors">
                <div className="relative mb-4 group">
                    <img 
                        src={formData.avatarUrl || member.avatarUrl} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full bg-brand-200 object-cover border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 rounded-lg text-sm font-medium text-brand-700 hover:bg-brand-50 hover:text-brand-900 transition shadow-sm">
                    <Camera className="w-4 h-4 text-accent-600" />
                    <span>{t('modal.change_photo')}</span>
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                    />
                </label>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.full_name')}</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <input 
                            name="fullName"
                            type="text"
                            value={formData.fullName || ''}
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
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="pl-9 w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.phone')}</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                            <input 
                                name="phone"
                                type="tel"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="pl-9 w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm transition-all"
                            />
                        </div>
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
                        <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.status')}</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm bg-white transition-all font-medium ${formData.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}
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
                         value={formData.gender || ''}
                         onChange={handleChange}
                         className="w-full p-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-sm bg-white transition-all"
                     >
                         <option value="">Select Gender</option>
                         <option value="MALE">{t('common.male')}</option>
                         <option value="FEMALE">{t('common.female')}</option>
                     </select>
                </div>
            </div>

            {/* Notification Preferences Section */}
            <div className="pt-4 border-t border-brand-100">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-accent-600" />
                    <h4 className="font-serif font-bold text-brand-900">{t('prefs.title')}</h4>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Alert Channels */}
                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">{t('prefs.channels')}</h5>
                        <label className="flex items-center justify-between p-3 rounded-lg border border-brand-200 hover:bg-brand-50 cursor-pointer transition">
                            <span className="text-sm font-medium text-brand-700">{t('prefs.email')}</span>
                            <div className={`relative w-10 h-5 transition rounded-full ${prefs.email ? 'bg-accent-500' : 'bg-gray-300'}`} onClick={(e) => { e.preventDefault(); toggleChannel('email'); }}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${prefs.email ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-lg border border-brand-200 hover:bg-brand-50 cursor-pointer transition">
                            <span className="text-sm font-medium text-brand-700">{t('prefs.sms')}</span>
                             <div className={`relative w-10 h-5 transition rounded-full ${prefs.sms ? 'bg-accent-500' : 'bg-gray-300'}`} onClick={(e) => { e.preventDefault(); toggleChannel('sms'); }}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${prefs.sms ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {/* Event Types */}
                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">{t('prefs.types')}</h5>
                        <label className="flex items-center gap-3 text-sm text-brand-700 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={prefs.types.meetings} 
                                onChange={() => toggleType('meetings')}
                                className="rounded text-accent-600 focus:ring-accent-500 w-4 h-4 border-brand-300" 
                            />
                            {t('prefs.meetings')}
                        </label>
                        <label className="flex items-center gap-3 text-sm text-brand-700 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={prefs.types.payments} 
                                onChange={() => toggleType('payments')}
                                className="rounded text-accent-600 focus:ring-accent-500 w-4 h-4 border-brand-300" 
                            />
                            {t('prefs.payments')}
                        </label>
                        <label className="flex items-center gap-3 text-sm text-brand-700 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={prefs.types.news} 
                                onChange={() => toggleType('news')}
                                className="rounded text-accent-600 focus:ring-accent-500 w-4 h-4 border-brand-300" 
                            />
                            {t('prefs.news')}
                        </label>
                    </div>
                </div>
            </div>

        </form>

        <div className="p-4 border-t border-brand-50 bg-white flex justify-end gap-3 flex-shrink-0">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-brand-300 rounded-lg text-brand-700 hover:bg-brand-50 text-sm font-medium transition-colors"
            >
                {t('common.cancel')}
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> {t('modal.save_btn')}</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;