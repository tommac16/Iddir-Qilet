import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDb } from '../services/mockDb';

const PublicLayout: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLogoUrl(mockDb.getSettings().logoUrl || '');
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const renderLogo = (className = "w-8 h-8") => {
      if (logoUrl) return <img src={logoUrl} alt="Logo" className={`${className} object-contain`} />;
      return <ShieldCheck className={`${className} text-accent-600 group-hover:scale-110 transition-transform`} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-brand-100 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                 <div className="relative group/logo">
                    <Link to="/" className="block">
                        {renderLogo("w-12 h-12")}
                    </Link>
                 </div>
                 
                 <Link to="/" className="flex flex-col group">
                    <span className="font-serif font-bold text-xl leading-none text-brand-900 group-hover:text-accent-600 transition-colors">{t('app.title')}</span>
                    <span className="text-[10px] text-brand-500 font-medium tracking-wide uppercase">{t('app.subtitle')}</span>
                 </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-accent-600 font-bold' : 'text-brand-600 hover:text-brand-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher variant="light" />
              <button
                onClick={() => navigate('/login')}
                className="bg-brand-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-brand-800 transition shadow-sm hover:shadow-md"
              >
                {t('landing.btn.login')}
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
               <LanguageSwitcher variant="light" />
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-800">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-100 absolute w-full left-0 py-4 px-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-base font-medium ${
                    isActive ? 'text-accent-600' : 'text-brand-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-brand-50">
               <button
                onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                }}
                className="w-full bg-brand-900 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-brand-800 transition"
              >
                {t('landing.btn.login')}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-300 py-12 border-t border-brand-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-2">
                <div className="flex items-center gap-3 text-white mb-4">
                    {logoUrl ? 
                        <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain" /> : 
                        <ShieldCheck className="w-10 h-10 text-accent-500" />
                    }
                    <div className="flex flex-col">
                        <span className="font-serif font-bold text-xl leading-none">{t('app.title')}</span>
                        <span className="text-xs text-brand-400 font-serif mt-1">{t('app.subtitle')}</span>
                    </div>
                </div>
                <p className="text-brand-400 max-w-sm mb-4 font-serif text-sm">
                   {t('landing.hero.subtitle')}
                </p>
                <p className="text-brand-500 text-sm">
                    {t('landing.est')}
                </p>
            </div>
            
            <div>
                <h4 className="text-white font-bold mb-4">{t('nav.home')}</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/about" className="hover:text-white transition">{t('nav.about')}</Link></li>
                    <li><Link to="/gallery" className="hover:text-white transition">{t('nav.gallery')}</Link></li>
                    <li><Link to="/contact" className="hover:text-white transition">{t('nav.contact')}</Link></li>
                </ul>
            </div>

            <div>
                 <h4 className="text-white font-bold mb-4">{t('landing.footer.contact')}</h4>
                 <ul className="space-y-2 text-sm">
                    <li>{t('contact.address.val')}</li>
                    <li>+251 914 41 15 67</li>
                    <li>info@mahberqilet.com</li>
                 </ul>
            </div>
          </div>
          
          <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2024 {t('app.subtitle')}. {t('landing.footer.rights')}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">{t('landing.footer.privacy')}</a>
              <a href="#" className="hover:text-white transition">{t('landing.footer.bylaws')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;