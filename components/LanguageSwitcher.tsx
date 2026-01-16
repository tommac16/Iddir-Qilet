import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return 'bg-brand-900 text-white hover:bg-brand-800 border-brand-700';
      case 'glass':
        return 'bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md';
      case 'light':
      default:
        return 'bg-white text-brand-900 hover:bg-brand-50 border-brand-200 shadow-sm';
    }
  };

  return (
    <button
      onClick={() => setLanguage(language === 'EN' ? 'TI' : 'EN')}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${getVariantClasses()} ${className}`}
      title="Switch Language"
    >
      <Globe className="w-4 h-4" />
      <span className={`text-xs font-bold ${language === 'TI' ? 'font-serif' : 'font-sans'}`}>
        {language === 'EN' ? 'English' : 'ትግርኛ'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;