import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Bell, 
  LogOut, 
  Home,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDb } from '../services/mockDb';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isOpen, setIsOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();
  const logoUrl = mockDb.getSettings().logoUrl;

  // Transition width on desktop, fixed slide-over on mobile with higher z-index
  const baseClasses = `fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-40 bg-brand-900 text-brand-100 flex flex-col shadow-xl ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`;

  const linkClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-6'} py-3 transition-all duration-200 relative group ${isActive ? 'bg-brand-800 text-white border-r-4 border-accent-500' : 'hover:bg-brand-800 hover:text-white'}`;

  const Tooltip = ({ text }: { text: string }) => (
    isCollapsed ? (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-brand-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md border border-brand-700 transition-opacity duration-200">
        {text}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-brand-800"></div>
      </div>
    ) : null
  );

  // Permission helpers
  const isAdmin = role === UserRole.ADMIN;
  const isTreasurer = role === UserRole.TREASURER;
  const isSecretary = role === UserRole.SECRETARY;
  
  const canViewDashboard = isAdmin || isTreasurer || isSecretary;
  const canViewMembers = isAdmin || isTreasurer || isSecretary;
  const canViewFinancials = isAdmin || isTreasurer;
  const canViewNotifications = isAdmin || isSecretary;
  
  const isMember = role === UserRole.MEMBER;

  return (
    <div className={baseClasses}>
      {/* Desktop Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-8 bg-brand-800 text-brand-200 p-1 rounded-full border border-brand-700 shadow-lg z-40 hover:bg-accent-600 hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`p-6 border-b border-brand-700 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} transition-all duration-300 h-24 relative`}>
         {/* Mobile Close Button */}
         <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4 text-brand-400 hover:text-white p-1 rounded-full hover:bg-brand-800"
         >
            <X className="w-5 h-5" />
         </button>

        {logoUrl ? (
             <img src={logoUrl} alt="Logo" className={`object-contain transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12 flex-shrink-0'}`} />
        ) : (
             <ShieldCheck className={`text-accent-500 transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10 flex-shrink-0'}`} />
        )}
        
        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
           <h1 className="text-2xl font-serif font-bold tracking-wide leading-none">{t('app.title')}</h1>
           <p className="text-xs text-brand-400 font-medium mt-1 whitespace-nowrap">{t('app.subtitle')}</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto overflow-x-hidden">
        <NavLink to="/" className={linkClasses} onClick={() => setIsOpen(false)}>
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.home')}</span>
            <Tooltip text={t('nav.home')} />
        </NavLink>

        {canViewDashboard && (
            <NavLink to="/admin" end className={linkClasses} onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.dashboard')}</span>
              <Tooltip text={t('nav.dashboard')} />
            </NavLink>
        )}
        
        {canViewMembers && (
            <NavLink to="/admin/members" className={linkClasses} onClick={() => setIsOpen(false)}>
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.members')}</span>
              <Tooltip text={t('nav.members')} />
            </NavLink>
        )}

        {canViewFinancials && (
            <NavLink to="/admin/financials" className={linkClasses} onClick={() => setIsOpen(false)}>
              <Wallet className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.financials')}</span>
              <Tooltip text={t('nav.financials')} />
            </NavLink>
        )}

        {canViewNotifications && (
             <NavLink to="/admin/notifications" className={linkClasses} onClick={() => setIsOpen(false)}>
              <Bell className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.notifications')}</span>
              <Tooltip text={t('nav.notifications')} />
            </NavLink>
        )}

        {isMember && (
          <>
            <NavLink to="/portal" end className={linkClasses} onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.portal')}</span>
              <Tooltip text={t('nav.portal')} />
            </NavLink>
            <NavLink to="/portal/history" className={linkClasses} onClick={() => setIsOpen(false)}>
              <Wallet className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.history')}</span>
              <Tooltip text={t('nav.history')} />
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-brand-700">
        <button 
          onClick={onLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-2 w-full text-brand-300 hover:text-white transition-colors rounded-lg hover:bg-brand-800 group relative`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>{t('nav.logout')}</span>
          <Tooltip text={t('nav.logout')} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;