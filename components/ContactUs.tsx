import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-serif font-bold text-brand-900 mb-4">{t('contact.get_in_touch')}</h1>
            <p className="text-brand-500">{t('contact.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-800 flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-brand-900 text-lg mb-1">{t('contact.address')}</h3>
                        <p className="text-brand-600">{t('contact.address.val')}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-800 flex-shrink-0">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-brand-900 text-lg mb-1">{t('common.phone')}</h3>
                        <p className="text-brand-600">+251 914 41 15 67</p>
                        <p className="text-brand-600">+251 914 82 51 74</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-800 flex-shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-brand-900 text-lg mb-1">{t('common.email')}</h3>
                        <p className="text-brand-600">mahberqilet@gmail.com</p>
   
                    </div>
                </div>

            </div>

            {/* Form */}
            <div className="bg-brand-50 p-8 rounded-2xl border border-brand-100">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-700 mb-1">{t('contact.form.name')}</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-accent-500 outline-none" placeholder=" Mac Tom" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-700 mb-1">{t('common.email')}</label>
                        <input type="email" className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-accent-500 outline-none" placeholder="macbel@gmail.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-700 mb-1">{t('contact.form.message')}</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-accent-500 outline-none" placeholder="How can we help you?" />
                    </div>
                    <button type="submit" className="w-full bg-brand-900 text-white py-3 rounded-lg font-medium hover:bg-brand-800 transition flex items-center justify-center gap-2">
                        {t('contact.form.send')} <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;