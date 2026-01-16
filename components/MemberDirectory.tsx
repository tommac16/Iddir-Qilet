import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import { Member, UserRole } from '../types';
import { Search, Edit2, Filter, ArrowUp, ArrowDown, UserPlus, Trash2, Shield, Briefcase, DollarSign, Heart } from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import { useLanguage } from '../contexts/LanguageContext';

const MemberDirectory: React.FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<{ key: keyof Member; direction: 'asc' | 'desc' }>({
    key: 'fullName',
    direction: 'asc',
  });

  useEffect(() => {
    setMembers(mockDb.getMembers());
  }, []);

  const handleMemberAdded = () => {
    setMembers(mockDb.getMembers());
  };

  const handleMemberUpdated = () => {
    setMembers(mockDb.getMembers());
    setSelectedMember(null); // Clear selection prevents stale data re-open issues if immediately clicked again
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
        mockDb.deleteMember(id);
        setMembers(mockDb.getMembers());
    }
  };

  // Sorting Handler
  const handleSort = (key: keyof Member) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === undefined || bVal === undefined) return 0;

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <Shield className="w-3 h-3" />, label: t('directory.role.admin') };
      case UserRole.TREASURER:
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <DollarSign className="w-3 h-3" />, label: t('directory.role.treasurer') };
      case UserRole.SECRETARY:
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Briefcase className="w-3 h-3" />, label: t('directory.role.secretary') };
      case UserRole.COMMUNITY_SERVICE:
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Heart className="w-3 h-3" />, label: t('directory.role.community_service') };
      default:
        return { bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200', icon: null, label: t('directory.role.member') };
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-20 md:pb-8">
       <AddMemberModal 
         isOpen={isAddModalOpen} 
         onClose={() => setIsAddModalOpen(false)} 
         onMemberAdded={handleMemberAdded} 
       />

       <EditMemberModal
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         member={selectedMember}
         onMemberUpdated={handleMemberUpdated}
       />

       {/* Header & Search */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-900">{t('directory.title')}</h1>
            <p className="text-brand-500 mt-1 text-sm md:text-base">{t('directory.subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={t('directory.search_placeholder')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-brand-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 outline-none"
                />
             </div>
             <div className="flex gap-2">
                <button className="flex-1 sm:flex-none p-2 border border-brand-200 rounded-lg bg-white hover:bg-brand-50 text-brand-600 shadow-sm transition-colors flex justify-center items-center">
                    <Filter className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-lg hover:bg-brand-800 transition shadow-sm text-sm font-medium whitespace-nowrap"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>{t('directory.add_btn')}</span>
                </button>
             </div>
          </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-brand-50 text-brand-900 font-semibold border-b border-brand-100">
                   <tr>
                      <th 
                        className="px-6 py-4 cursor-pointer hover:bg-brand-100 transition group" 
                        onClick={() => handleSort('fullName')}
                      >
                         <div className="flex items-center gap-1">
                            {t('dashboard.table.member')}
                            {sortConfig.key === 'fullName' && (
                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                         </div>
                      </th>
                      <th className="px-6 py-4 hidden md:table-cell">
                         <div className="flex items-center gap-2">
                             <div 
                                className="flex items-center gap-1 cursor-pointer hover:text-brand-600 transition"
                                onClick={() => handleSort('email')}
                             >
                                {t('common.email')}
                                {sortConfig.key === 'email' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                             </div>
                             <span className="text-brand-300">|</span>
                             <div 
                                className="flex items-center gap-1 cursor-pointer hover:text-brand-600 transition"
                                onClick={() => handleSort('phone')}
                             >
                                {t('common.phone')}
                                {sortConfig.key === 'phone' && (
                                    sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                             </div>
                         </div>
                      </th>
                      <th 
                        className="px-6 py-4 hidden md:table-cell cursor-pointer hover:bg-brand-100 transition" 
                        onClick={() => handleSort('role')}
                      >
                         <div className="flex items-center gap-1">
                            {t('common.role')}
                            {sortConfig.key === 'role' && (
                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                         </div>
                      </th>
                      <th 
                        className="px-6 py-4 cursor-pointer hover:bg-brand-100 transition" 
                        onClick={() => handleSort('status')}
                      >
                         <div className="flex items-center gap-1">
                            {t('common.status')}
                            {sortConfig.key === 'status' && (
                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                         </div>
                      </th>
                      <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                   {sortedMembers.length > 0 ? sortedMembers.map(member => (
                      <tr key={member.id} className="hover:bg-brand-50/50 transition">
                         <td className="px-6 py-4 flex items-center gap-3">
                            <img src={member.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-brand-200 border-2 border-white shadow-sm object-cover flex-shrink-0" />
                            <div>
                                <p className="font-medium text-brand-900">{member.fullName}</p>
                                <p className="hidden md:block text-xs text-brand-500 font-mono">{t('portal.id')}: {member.id}</p>
                                
                                {/* Mobile Info Stack */}
                                <div className="md:hidden mt-1 flex flex-col gap-0.5">
                                    <p className="text-xs text-brand-500">{member.phone}</p>
                                    <span className="text-[10px] text-brand-400 font-mono">{getRoleBadge(member.role).label}</span>
                                </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-brand-800 text-sm">{member.email}</p>
                            <p className="text-brand-500 text-xs mt-0.5">{member.phone}</p>
                         </td>
                         <td className="px-6 py-4 hidden md:table-cell">
                            {(() => {
                                const badge = getRoleBadge(member.role);
                                return (
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                                      {badge.icon}
                                      {badge.label}
                                  </span>
                                );
                            })()}
                         </td>
                         <td className="px-6 py-4">
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                              ${member.status === 'ACTIVE' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-red-50 text-red-700 border-red-200'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {t(`status.${member.status}`)}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button 
                              onClick={() => handleEditClick(member)} 
                              className="text-brand-400 hover:text-brand-700 p-2 hover:bg-brand-50 rounded-full transition"
                              title={t('common.edit')}
                            >
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(member.id)}
                              className="text-red-400 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition ml-1"
                              title={t('common.delete')}
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   )) : (
                     <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-brand-400">
                            {t('directory.no_members')} "{searchTerm}"
                         </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

export default MemberDirectory;