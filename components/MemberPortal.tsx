import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Member } from '../types';
import { Wallet, Clock, CheckCircle, HeartHandshake, Edit2, Camera } from 'lucide-react';
import ClaimSubmissionModal from './ClaimSubmissionModal';
import EditMemberModal from './EditMemberModal';
import PaymentSubmissionModal from './PaymentSubmissionModal';
import { useLanguage } from '../contexts/LanguageContext';

interface MemberPortalProps {
  member: Member;
  onMemberUpdate: () => void;
}

const MemberPortal: React.FC<MemberPortalProps> = ({ member, onMemberUpdate }) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { t } = useLanguage();

  // Helper to generate dynamic dates
  const today = new Date();
  
  // Events
  const event1 = new Date(today);
  event1.setDate(today.getDate() + 14); // 2 weeks from now
  
  const event2 = new Date(today);
  event2.setDate(today.getDate() + 45); // 1.5 months from now

  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const eventDateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  // Recent contributions (Last 3 months)
  const contributions = [0, 1, 2].map(i => {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    d.setDate(1); // Assume payment on 1st of month
    return {
        date: d.toLocaleDateString('en-US', dateOptions),
        amount: 100.00
    };
  });
  
  // Determine greeting key based on gender
  const greetingKey = member.gender ? `portal.greeting.${member.gender}` : 'portal.greeting';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <ClaimSubmissionModal 
        isOpen={isClaimModalOpen} 
        onClose={() => setIsClaimModalOpen(false)} 
        memberId={member.id}
        memberName={member.fullName}
      />
      
      <EditMemberModal
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         member={member}
         onMemberUpdated={onMemberUpdate}
       />
       
       <PaymentSubmissionModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          memberId={member.id}
          memberName={member.fullName}
       />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
            <img 
                src={member.avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-brand-100 object-cover group-hover:brightness-90 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                    <Camera className="w-6 h-6" />
                </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-brand-100 text-brand-600">
                <Edit2 className="w-4 h-4" />
            </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-900 leading-tight">
                {t(greetingKey)} {member.fullName}, {t('portal.welcome')}
            </h1>
            <p className="text-xl md:text-2xl text-brand-600 font-serif mt-1 font-medium">
                {t('app.title')} {t('app.subtitle')}
            </p>
            <p className="text-brand-500 flex items-center justify-center md:justify-start gap-2 mt-2">
                {t('portal.id')}: <span className="font-mono bg-brand-50 px-2 py-0.5 rounded text-brand-800">{member.id}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {t('portal.status')}: {member.status}
                </div>
                <div className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {t('portal.joined')}: {member.joinDate}
                </div>
            </div>
        </div>
        <div className="bg-brand-900 text-white p-6 rounded-xl text-center min-w-[200px]">
            <p className="text-brand-300 text-sm uppercase tracking-wide">{t('portal.balance')}</p>
            <div className={`text-3xl font-bold font-mono mt-1 ${member.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {member.balance.toLocaleString()} ETB
            </div>
            <div className="mt-4 space-y-2">
                <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-accent-600 hover:bg-accent-700 py-2 rounded text-sm font-medium transition"
                >
                    {t('portal.btn.pay')}
                </button>
                <button 
                    onClick={() => setIsClaimModalOpen(true)}
                    className="w-full bg-brand-800 hover:bg-brand-700 py-2 rounded text-sm font-medium transition flex items-center justify-center gap-2"
                >
                    <HeartHandshake className="w-4 h-4" /> {t('portal.btn.support')}
                </button>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100">
            <h3 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand-500" /> {t('portal.recent_contrib')}
            </h3>
            <div className="space-y-4">
                {contributions.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-brand-50 rounded-lg transition">
                        <div>
                            <p className="font-medium text-brand-800">{t('portal.monthly_contrib')}</p>
                            <p className="text-xs text-brand-400">{c.date}</p>
                        </div>
                        <span className="font-mono text-brand-600">{c.amount.toFixed(2)} ETB</span>
                    </div>
                ))}
            </div>
             <Link to="/portal/history" className="mt-6 w-full block text-center text-brand-600 hover:text-brand-900 text-sm font-medium hover:underline">
               {t('portal.view_history')}
             </Link>
        </div>

        <div className="bg-brand-50 p-6 rounded-xl border border-brand-100">
             <h3 className="text-lg font-bold text-brand-900 mb-4">{t('portal.upcoming')}</h3>
             <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-accent-500">
                    <p className="text-xs font-bold text-accent-600 mb-1">{event1.toLocaleDateString('en-US', eventDateOptions).toUpperCase()}</p>
                    <h4 className="font-bold text-brand-800">{t('portal.event.assembly')}</h4>
                    <p className="text-sm text-brand-500 mt-1">{t('portal.event.assembly_desc')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-brand-300">
                    <p className="text-xs font-bold text-brand-400 mb-1">{event2.toLocaleDateString('en-US', eventDateOptions).toUpperCase()}</p>
                    <h4 className="font-bold text-brand-800">{t('portal.event.feast')}</h4>
                    <p className="text-sm text-brand-500 mt-1">{t('portal.event.feast_desc')}</p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;