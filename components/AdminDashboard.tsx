import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Member, Claim, ClaimStatus, Transaction } from '../types';
import StatCard from './StatCard';
import { Users, Wallet, AlertCircle, CheckCircle, XCircle, HeartHandshake, Stethoscope, PartyPopper, HelpCircle, Edit2, UserPlus, DollarSign, FileText, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import EditMemberModal from './EditMemberModal';

interface AdminDashboardProps {
  user?: Member;
  onMemberUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onMemberUpdate }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Spread to force new reference
    setMembers([...mockDb.getMembers()]);
    setClaims([...mockDb.getClaims()]);
    setTransactions([...mockDb.getTransactions()]);
    setTotalFunds(mockDb.getTotalFunds());
  };

  const handleClaimAction = (id: string, status: ClaimStatus) => {
    if (status === ClaimStatus.REJECTED) {
        if (!window.confirm(t('dashboard.registrations.confirm_reject'))) {
            return;
        }
    }
    
    mockDb.updateClaim(id, status);
    refreshData();
  };

  const handleApproveRegistration = (memberId: string) => {
      if (window.confirm(t('ledger.confirm_approve'))) {
          try {
              mockDb.approveRegistration(memberId);
              refreshData();
          } catch(e) {
              console.error(e);
          }
      }
  };

  const handleRejectRegistration = (memberId: string) => {
      if (window.confirm(t('dashboard.registrations.confirm_reject'))) {
           try {
              mockDb.rejectRegistration(memberId);
              refreshData();
          } catch(e) {
              console.error(e);
          }
      }
  };

  const handleMemberUpdated = () => {
      onMemberUpdate(); // Update App state
      refreshData();
  };

  const pendingClaims = claims.filter(c => c.status === ClaimStatus.PENDING);
  // Strictly filter by PENDING string from mockDb
  const pendingRegistrations = members.filter(m => m.status === 'PENDING');

  const getClaimIcon = (type: string) => {
    switch (type) {
      case 'FUNERAL': return <HeartHandshake className="w-3.5 h-3.5" />;
      case 'MEDICAL': return <Stethoscope className="w-3.5 h-3.5" />;
      case 'WEDDING': return <PartyPopper className="w-3.5 h-3.5" />;
      default: return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  const greetingKey = user?.gender ? `portal.greeting.${user.gender}` : 'portal.greeting';

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <EditMemberModal
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         member={user || null}
         onMemberUpdated={handleMemberUpdated}
       />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-5">
           {user && (
               <div 
                  className="relative group flex-shrink-0 cursor-pointer"
                  onClick={() => setIsEditModalOpen(true)}
               >
                    <img 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-brand-200 shadow-sm group-hover:border-accent-400 transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <button 
                        type="button"
                        className="absolute bottom-0 -right-1 bg-white p-1.5 rounded-full shadow border border-brand-200 text-brand-600 group-hover:text-accent-600 group-hover:border-accent-300 transition-all"
                        title={t('modal.edit_title')}
                    >
                        <Edit2 className="w-3 h-3" />
                    </button>
               </div>
           )}
           <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-900 leading-tight">
                 {t(greetingKey)} {user?.fullName || 'Admin'}, {t('portal.welcome')}
              </h1>
              <p className="text-brand-500 mt-1">{t('dashboard.overview')}</p>
           </div>
        </div>
        <div className="bg-brand-100 text-brand-800 px-4 py-2 rounded-lg font-medium text-sm md:text-base whitespace-nowrap">
          {t('dashboard.date')}: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t('dashboard.stat.members')} 
          value={members.length} 
          icon={<Users className="w-6 h-6" />} 
          trend="+2" 
          trendUp={true} 
        />
        <StatCard 
          title={t('dashboard.stat.funds')} 
          value={`${totalFunds.toLocaleString()} ETB`} 
          icon={<Wallet className="w-6 h-6" />} 
          trend="+15%" 
          trendUp={true} 
        />
        <StatCard 
          title={t('dashboard.stat.pending_regs')} 
          value={pendingRegistrations.length} 
          icon={<UserPlus className="w-6 h-6" />} 
          trend={pendingRegistrations.length > 0 ? t('dashboard.stat.action_required') : t('dashboard.stat.all_clear')}
          trendUp={pendingRegistrations.length === 0} 
        />
      </div>

      {/* Pending Registrations Section */}
      {pendingRegistrations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden ring-2 ring-accent-100">
            <div className="p-6 border-b border-brand-100 bg-accent-50/30 flex justify-between items-center">
              <div>
                  <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-accent-600" />
                      {t('dashboard.registrations.title')}
                  </h2>
                  <p className="text-sm text-brand-500 mt-1">Approve new members and collect initial fee (2200 ETB)</p>
              </div>
              <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-xs font-bold">{pendingRegistrations.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-50 text-brand-900 font-semibold">
                  <tr>
                    <th className="px-6 py-4">{t('dashboard.table.member')}</th>
                    <th className="px-6 py-4">{t('common.phone')}</th>
                    <th className="px-6 py-4">{t('ledger.receipt')}</th>
                    <th className="px-6 py-4 text-right">{t('dashboard.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {pendingRegistrations.map((member) => {
                    // Try to find matching transaction more flexibly
                    const tx = transactions.find(t => 
                        t.memberId === member.id && 
                        (t.description.includes('Initial Registration') || t.description.includes('Initial Payment'))
                    );
                    
                    return (
                      <tr key={member.id} className="hover:bg-brand-50/50 transition">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <img src={member.avatarUrl} className="w-8 h-8 rounded-full bg-brand-200" alt="" />
                            <div>
                                <p className="font-bold text-brand-900">{member.fullName}</p>
                                <p className="text-xs text-brand-400">{member.email}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-brand-600 font-mono">{member.phone}</td>
                        <td className="px-6 py-4">
                            {tx?.receiptUrl ? (
                                <button 
                                    type="button"
                                    onClick={() => setSelectedReceipt(tx.receiptUrl || null)}
                                    className="flex items-center gap-1 text-accent-600 hover:text-accent-700 underline text-xs font-medium"
                                >
                                    <FileText className="w-3 h-3" /> {t('ledger.view_receipt')}
                                </button>
                            ) : (
                                <span className="text-brand-300 text-xs italic">No Receipt</span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button 
                            type="button"
                            onClick={() => handleApproveRegistration(member.id)}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm mr-2"
                          >
                            <DollarSign className="w-3 h-3" />
                            {t('dashboard.registrations.approve_btn')}
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRejectRegistration(member.id)}
                            className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            <XCircle className="w-3 h-3" />
                            {t('dashboard.registrations.reject_btn')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      )}

      {/* Recent Claims Section */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
        <div className="p-6 border-b border-brand-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-900">{t('dashboard.claims.title')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-brand-900 font-semibold">
              <tr>
                <th className="px-6 py-4">{t('dashboard.table.member')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('dashboard.table.type')}</th>
                <th className="px-6 py-4 hidden md:table-cell">{t('dashboard.table.desc')}</th>
                <th className="px-6 py-4">{t('dashboard.table.amount')}</th>
                <th className="px-6 py-4">{t('dashboard.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('dashboard.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-brand-50/50 transition">
                  <td className="px-6 py-4 font-medium">
                      {claim.memberName}
                      <div className="sm:hidden mt-1">
                          <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">
                            {getClaimIcon(claim.type)} {claim.type}
                          </span>
                      </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                      {getClaimIcon(claim.type)}
                      {claim.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-brand-600 truncate max-w-xs hidden md:table-cell">{claim.description}</td>
                  <td className="px-6 py-4 font-mono font-medium whitespace-nowrap">{claim.amountRequested.toLocaleString()} ETB</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${claim.status === ClaimStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                        claim.status === ClaimStatus.REJECTED ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'}`}>
                      {t(`status.${claim.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {claim.status === ClaimStatus.PENDING && (
                      <>
                        <button 
                          onClick={() => handleClaimAction(claim.id, ClaimStatus.APPROVED)}
                          className="inline-flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm mr-2"
                          title="Approve"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleClaimAction(claim.id, ClaimStatus.REJECTED)}
                          className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                          title="Reject"
                        >
                          <XCircle className="w-3 h-3" />
                          {t('dashboard.registrations.reject_btn')}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-brand-400">
                    {t('dashboard.claims.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Member Add Hint */}
      <div className="bg-brand-900 text-brand-100 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
            <h3 className="font-bold text-lg">{t('dashboard.manage.title')}</h3>
            <p className="text-brand-300 text-sm">{t('dashboard.manage.desc')}</p>
        </div>
        <button 
            onClick={() => navigate('/admin/members')}
            className="bg-white text-brand-900 px-4 py-2 rounded-lg font-medium hover:bg-brand-50 transition w-full sm:w-auto"
        >
            {t('dashboard.manage.btn')}
        </button>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}>
              <div className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setSelectedReceipt(null)}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                  >
                      <X className="w-5 h-5" />
                  </button>
                  <img src={selectedReceipt} alt="Receipt" className="max-w-full max-h-[85vh] object-contain" />
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;