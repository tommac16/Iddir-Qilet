import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PublicLayout from './components/PublicLayout';
import PublicLanding from './components/PublicLanding';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Gallery from './components/Gallery';
import AdminDashboard from './components/AdminDashboard';
import MemberPortal from './components/MemberPortal';
import FinancialLedger from './components/FinancialLedger';
import NotificationSystem from './components/NotificationSystem';
import Register from './components/Register';
import PaymentHistory from './components/PaymentHistory';
import MemberDirectory from './components/MemberDirectory';
import LanguageSwitcher from './components/LanguageSwitcher';
import { UserRole, Member } from './types';
import { mockDb } from './services/mockDb';
import { Menu, ShieldCheck, Shield, Wallet, FileText, User, ArrowLeft, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Login Component
const Login: React.FC<{ onLogin: (role: UserRole, member?: Member) => void }> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [detectedUser, setDetectedUser] = useState<Member | null>(null);
  
  // Background Image State
  const [bgUrl, setBgUrl] = useState('');
  
  const logoUrl = mockDb.getSettings().logoUrl;

  // 1. Load Settings & Remember Me
  useEffect(() => {
    setBgUrl(mockDb.getSettings().loginBgUrl);
    
    const savedEmail = localStorage.getItem('mahber_remember_email');
    if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
    }
  }, []);

  // 2. Smart Detection: Watch email input to find user
  useEffect(() => {
      const user = mockDb.getMembers().find(m => m.email.toLowerCase() === email.toLowerCase());
      if (user) {
          setDetectedUser(user);
          setSelectedRole(user.role);
          setError('');
      } else {
          setDetectedUser(null);
          // Only clear selected role if we aren't manually clicking the cards
          if (!mockDb.getMembers().some(m => m.role === selectedRole && m.email === email)) {
              setSelectedRole(null);
          }
      }
  }, [email]);

  const getTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
  };
  
  const handleRoleSelect = (role: UserRole) => {
     // Find a mock user for this role to simulate real login
     const user = mockDb.getMembers().find(m => m.role === role);
     if (user) {
         setEmail(user.email);
         setSelectedRole(role);
         setPassword(''); // Clear password to force entry
         setError('');
         // Focus password field
         document.getElementById('password-input')?.focus();
     }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
        const user = mockDb.getMembers().find(m => m.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            setError('User account not found. Please check your email.');
            setLoading(false);
            return;
        }

        // Validate password (default for seed data is 123456)
        const validPassword = user.password || '123456';
        if (password !== validPassword) {
            setError('Invalid password. For demo accounts use: 123456');
            setLoading(false);
            return;
        }

        // Handle Remember Me
        if (rememberMe) {
            localStorage.setItem('mahber_remember_email', email);
        } else {
            localStorage.removeItem('mahber_remember_email');
        }

        // Success
        onLogin(user.role, user);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Left Side - Visual Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-brand-900 relative overflow-hidden items-center justify-center text-white p-16 group">
        {/* Background Image with Overlay */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-all duration-700 hover:scale-105"
            style={{ backgroundImage: `url('${bgUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 to-brand-800/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
           <div className="mb-12">
             <div className="mb-8">
                {logoUrl ? 
                    <img src={logoUrl} alt="Logo" className="w-32 h-32 object-contain drop-shadow-lg" /> : 
                    <ShieldCheck className="w-24 h-24 text-accent-500" />
                }
             </div>
             <h1 className="text-6xl font-serif font-bold mb-4 tracking-tight text-white">{t('app.title')}</h1>
             <p className="text-2xl text-brand-200 font-light tracking-wide">{t('app.subtitle')}</p>
           </div>
           
           <div className="space-y-6">
               <p className="text-brand-100 text-lg leading-relaxed font-light border-l-4 border-accent-500 pl-6 italic">
                 "{t('landing.hero.subtitle')}"
               </p>
               <div className="flex items-center gap-4 text-sm text-brand-400 font-medium uppercase tracking-widest pt-8">
                  <span>Est. 2024</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                  <span>Mekelle, Ethiopia</span>
               </div>
           </div>
        </div>
      </div>

      {/* Right Side - Login Controls */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-brand-50/30 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-in slide-in-from-right-8 duration-500">
           
           {/* Header */}
           <div className="text-center lg:text-left mb-8">
              <div className="lg:hidden flex flex-col items-center mb-6">
                 {logoUrl ? 
                     <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4" /> : 
                     <ShieldCheck className="w-16 h-16 text-accent-600 mb-4" />
                 }
              </div>
              
              <h2 className="text-3xl font-serif font-bold text-brand-900">
                {detectedUser ? `${getTimeGreeting()}, ${detectedUser.fullName.split(' ')[0]}` : t('login.title')}
              </h2>
              <p className="text-brand-500 mt-2">
                {detectedUser ? "Please verify your identity to continue." : t('login.subtitle')}
              </p>
           </div>

           {/* Role Selection Shortcuts (Demo Feature) */}
           {!detectedUser && (
               <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                      { role: UserRole.ADMIN, icon: Shield, label: 'Admin', color: 'purple' },
                      { role: UserRole.TREASURER, icon: Wallet, label: 'Finance', color: 'amber' },
                      { role: UserRole.SECRETARY, icon: FileText, label: 'Sec.', color: 'blue' },
                      { role: UserRole.MEMBER, icon: User, label: 'Member', color: 'emerald' },
                  ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => handleRoleSelect(item.role)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${selectedRole === item.role ? `bg-${item.color}-50 border-${item.color}-500 ring-1 ring-${item.color}-500` : 'bg-white border-brand-200 hover:border-brand-400 hover:-translate-y-0.5'}`}
                        title={`Login as ${item.label}`}
                      >
                          <item.icon className={`w-5 h-5 mb-1 ${selectedRole === item.role ? `text-${item.color}-600` : 'text-brand-400'}`} />
                          <span className={`text-[10px] font-bold uppercase ${selectedRole === item.role ? `text-${item.color}-700` : 'text-brand-500'}`}>{item.label}</span>
                      </button>
                  ))}
               </div>
           )}

           {/* Visual User Detected Card */}
           {detectedUser && (
               <div className="bg-white p-4 rounded-xl border border-accent-200 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                   <img src={detectedUser.avatarUrl} alt="" className="w-14 h-14 rounded-full border-2 border-accent-100 object-cover" />
                   <div className="flex-1">
                       <h3 className="font-bold text-brand-900">{detectedUser.fullName}</h3>
                       <p className="text-xs text-brand-500 font-mono">{detectedUser.email}</p>
                   </div>
                   <button onClick={() => { setEmail(''); setDetectedUser(null); setSelectedRole(null); }} className="text-xs text-brand-400 hover:text-red-500 font-medium underline">
                       Change
                   </button>
               </div>
           )}

           {/* Login Form */}
           <form className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-brand-100" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
              )}
              
              {!detectedUser && (
                  <div>
                      <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-1.5 ml-1">{t('common.email')}</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-accent-500 outline-none bg-brand-50/50 transition-all hover:border-brand-300" 
                        placeholder="member@mahberqilet.com"
                        required 
                      />
                  </div>
              )}

              <div>
                  <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-1.5 ml-1">{t('common.password')}</label>
                  <div className="relative">
                    <input 
                        id="password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-accent-500 outline-none bg-brand-50/50 transition-all hover:border-brand-300" 
                        placeholder="••••••••" 
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                  </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-brand-300 text-accent-600 focus:ring-accent-500" 
                      />
                      <span className="text-brand-600">Remember me</span>
                  </label>
                  <a href="#" className="text-accent-600 hover:text-accent-700 font-medium hover:underline">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 text-white py-3.5 rounded-xl font-bold hover:bg-brand-800 transition shadow-lg shadow-brand-900/20 active:scale-[0.99] transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
              >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        {detectedUser ? "Unlock Account" : t('common.continue')}
                        {!loading && <CheckCircle className="w-4 h-4 opacity-50" />}
                      </>
                  )}
              </button>
           </form>

           <div className="text-center">
               <p className="text-brand-600 text-sm">
                   {t('login.new_user')} <Link to="/register" className="text-accent-600 font-bold hover:underline ml-1">{t('login.register')}</Link>
               </p>
               
               <Link to="/" className="inline-flex items-center gap-2 text-brand-400 text-xs hover:text-brand-600 mt-6 transition-colors font-medium">
                    <ArrowLeft className="w-3 h-3" /> {t('common.back_home')}
               </Link>
           </div>
        </div>
      </div>
      
      {/* Floating Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
         <LanguageSwitcher variant="light" />
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<{ 
  children: React.ReactNode, 
  role: UserRole, 
  onLogout: () => void 
}> = ({ children, role, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="flex h-screen bg-brand-50 overflow-hidden relative">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-brand-900/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar role={role} onLogout={onLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-end h-16 px-8 border-b border-brand-100 bg-white z-20">
                    <LanguageSwitcher />
                </header>

                {/* Mobile Header */}
                <div className="md:hidden bg-brand-900 text-white p-4 flex items-center justify-between shadow-md z-20 flex-shrink-0">
                    <div className="flex flex-col">
                        <span className="font-serif font-bold text-lg leading-tight">{t('app.mobile_header')}</span>
                        <span className="text-xs text-brand-300 font-serif">{t('app.mobile_subtitle')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <LanguageSwitcher variant="dark" className="text-xs px-2 py-1 h-8" />
                         <button onClick={() => setSidebarOpen(true)} className="p-1 rounded hover:bg-brand-800">
                             <Menu className="w-6 h-6" />
                         </button>
                    </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | undefined>(undefined);

  // Sync Favicon
  useEffect(() => {
    const settings = mockDb.getSettings();
    if (settings.logoUrl) {
      const link = document.getElementById('app-favicon') as HTMLLinkElement;
      if (link) {
         link.href = settings.logoUrl;
      }
    }
  }, []);

  const handleLogin = (role: UserRole, member?: Member) => {
    setUserRole(role);
    setCurrentUser(member);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(undefined);
  };

  const handleMemberUpdate = () => {
    if (currentUser) {
        const updated = mockDb.getMember(currentUser.id);
        setCurrentUser(updated);
    }
  };

  const STAFF_ROLES = [UserRole.ADMIN, UserRole.TREASURER, UserRole.SECRETARY];

  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          {/* Public Website Routes wrapped in Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicLanding />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/gallery" element={<Gallery />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/login" element={
              userRole ? <Navigate to={STAFF_ROLES.includes(userRole) ? "/admin" : "/portal"} /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={<Register />} />

          {/* Admin/Staff Protected Routes */}
          <Route path="/admin/*" element={
            userRole && STAFF_ROLES.includes(userRole) ? (
              <DashboardLayout role={userRole} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<AdminDashboard user={currentUser} onMemberUpdate={handleMemberUpdate} />} />
                  <Route path="/members" element={<MemberDirectory />} />
                  
                  {/* Financials: Admin & Treasurer Only */}
                  <Route path="/financials" element={
                      [UserRole.ADMIN, UserRole.TREASURER].includes(userRole) ? <FinancialLedger /> : <Navigate to="/admin" />
                  } />
                  
                  {/* Notifications: Admin & Secretary Only */}
                  <Route path="/notifications" element={
                      [UserRole.ADMIN, UserRole.SECRETARY].includes(userRole) ? <NotificationSystem /> : <Navigate to="/admin" />
                  } />
                </Routes>
              </DashboardLayout>
            ) : <Navigate to="/login" />
          } />

          {/* Member Protected Routes */}
          <Route path="/portal/*" element={
            userRole === UserRole.MEMBER && currentUser ? (
              <DashboardLayout role={UserRole.MEMBER} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<MemberPortal member={currentUser} onMemberUpdate={handleMemberUpdate} />} />
                  <Route path="/history" element={<PaymentHistory member={currentUser} />} />
                </Routes>
              </DashboardLayout>
            ) : <Navigate to="/login" />
          } />

        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;