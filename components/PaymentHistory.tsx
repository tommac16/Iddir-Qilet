import React, { useState, useEffect } from 'react';
import { Member, Transaction, TransactionStatus } from '../types';
import { mockDb } from '../services/mockDb';
import { ArrowUp, ArrowDown, Filter, Search, Printer, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentHistoryProps {
  member: Member;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ member }) => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch all transactions and filter for current member
    const allTxs = mockDb.getTransactions();
    const memberTxs = allTxs.filter(tx => tx.memberId === member.id);
    setTransactions(memberTxs);
  }, [member.id]);

  useEffect(() => {
    let result = [...transactions];

    // Filter by Type
    if (filterType !== 'ALL') {
      result = result.filter(tx => tx.type === filterType);
    }

    // Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.description.toLowerCase().includes(lowerTerm) ||
        tx.id.toLowerCase().includes(lowerTerm)
      );
    }

    // Filter by Date Range
    if (startDate) {
      result = result.filter(tx => tx.date >= startDate);
    }
    if (endDate) {
      result = result.filter(tx => tx.date <= endDate);
    }

    // Sort
    result.sort((a, b) => {
      // Handle numeric amount sorting separately if needed, but string comparison works for ISO dates
      // For amounts (numbers):
      if (sortConfig.key === 'amount') {
         return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      
      // For strings (date, description, etc)
      if (a[sortConfig.key]! < b[sortConfig.key]!) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key]! > b[sortConfig.key]!) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, filterType, sortConfig, searchTerm, startDate, endDate]);

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleExportInvoice = () => {
    const totalAmount = filteredTransactions.reduce((sum, tx) => {
        if (tx.status === TransactionStatus.COMPLETED) {
            return sum + (tx.type === 'PENALTY' ? -tx.amount : tx.amount);
        }
        return sum;
    }, 0);

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Statement - ${member.fullName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700&display=swap');
            body { font-family: 'Noto Serif Ethiopic', 'Times New Roman', serif; padding: 40px; color: #1f2937; max-width: 800px; mx-auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #b45309; padding-bottom: 20px; }
            .logo { color: #b45309; font-size: 28px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
            .sub-logo { color: #4b5563; font-size: 14px; }
            .invoice-title { font-size: 24px; font-weight: bold; text-align: right; color: #374151; margin-bottom: 10px; }
            
            .meta-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .meta-box p { margin: 5px 0; font-size: 14px; }
            .meta-label { font-weight: bold; color: #4b5563; width: 80px; display: inline-block; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; border-bottom: 2px solid #e5e7eb; padding: 12px 8px; background-color: #f9fafb; font-size: 14px; text-transform: uppercase; color: #6b7280; }
            td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            .amount-col { text-align: right; font-family: monospace; font-size: 15px; }
            
            .summary-section { display: flex; justify-content: flex-end; }
            .summary-table { width: 250px; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #374151; font-weight: bold; font-size: 18px; margin-top: 5px; }

            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            
            .stamp { 
                border: 3px double #b45309; color: #b45309; 
                display: inline-block; padding: 10px 20px; 
                transform: rotate(-5deg); font-weight: bold; 
                font-size: 18px; letter-spacing: 2px;
                opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Mahber Iddir St.Merry Qilet</div>
            <div class="sub-logo">Mekelle, Ethiopia • +251 914 41 15 67</div>
          </div>

          <div class="invoice-title">OFFICIAL STATEMENT</div>

          <div class="meta-container">
            <div class="meta-box">
              <p><strong>BILLED TO:</strong></p>
              <p>${member.fullName}</p>
              <p>${member.email}</p>
              <p>ID: ${member.id}</p>
            </div>
            <div class="meta-box" style="text-align: right;">
              <p><span class="meta-label">Date:</span> ${new Date().toLocaleDateString()}</p>
              <p><span class="meta-label">Ref #:</span> INV-${Date.now().toString().slice(-6)}</p>
              <p><span class="meta-label">Status:</span> ${member.status}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Status</th>
                <th class="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(tx => `
                <tr>
                  <td>${tx.date}</td>
                  <td>${tx.description}</td>
                  <td style="font-size: 12px;">${tx.type}</td>
                  <td>${tx.status}</td>
                  <td class="amount-col" style="${tx.type === 'PENALTY' ? 'color: red;' : ''}">
                    ${tx.type === 'PENALTY' ? '-' : ''}${tx.amount.toLocaleString()} ETB
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <div class="summary-table">
               <div class="total-row">
                 <span>TOTAL NET:</span>
                 <span>${totalAmount.toLocaleString()} ETB</span>
               </div>
               <div style="margin-top: 20px; text-align: center;">
                  <div class="stamp">OFFICIAL DOCUMENT</div>
               </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your contribution to the Mahber Iddir St.Merry Qilet community.</p>
            <p>This is a computer-generated document. No signature is required.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION': return 'bg-green-100 text-green-800';
      case 'PENALTY': return 'bg-red-100 text-red-800';
      case 'CLAIM_PAYOUT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status?: TransactionStatus) => {
      switch (status) {
          case TransactionStatus.PENDING:
              return (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                      <Clock className="w-3 h-3" /> Pending
                  </span>
              );
          case TransactionStatus.REJECTED:
              return (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                      <XCircle className="w-3 h-3" /> Rejected
                  </span>
              );
          default:
              return null; // Don't show generic 'Completed' to save space, assume no badge = completed/historic
      }
  };

  const getAmountDisplay = (tx: Transaction) => {
      if (tx.type === 'PENALTY') {
          return { prefix: '-', color: 'text-red-600' };
      }
      if (tx.status === TransactionStatus.PENDING) {
          return { prefix: '+', color: 'text-brand-400' }; // Greyed out for pending
      }
      if (tx.status === TransactionStatus.REJECTED) {
          return { prefix: '', color: 'text-gray-400 line-through' };
      }
      return { prefix: '+', color: 'text-green-600' };
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-20 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-900">{t('nav.history')}</h1>
        <p className="text-brand-500 mt-1 text-sm md:text-base">{t('history.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-brand-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-brand-50/50">
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-wrap">
             <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={t('history.search_placeholder')} 
                  className="pl-9 pr-4 py-2 border border-brand-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 outline-none w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <select 
                  className="border border-brand-200 rounded-lg text-sm p-2 outline-none bg-white text-brand-700 flex-1 md:w-40"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">{t('history.filter.all')}</option>
                  <option value="CONTRIBUTION">{t('history.filter.contribution')}</option>
                  <option value="PENALTY">{t('history.filter.penalty')}</option>
                  <option value="CLAIM_PAYOUT">{t('history.filter.payout')}</option>
                </select>
             </div>

             <div className="flex items-center gap-2 w-full md:w-auto">
                <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <input 
                  type="date" 
                  className="border border-brand-200 rounded-lg text-sm p-2 outline-none bg-white text-brand-700 flex-1 md:w-auto"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder={t('history.start_date')}
                />
                <span className="text-brand-400">-</span>
                <input 
                  type="date" 
                  className="border border-brand-200 rounded-lg text-sm p-2 outline-none bg-white text-brand-700 flex-1 md:w-auto"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder={t('history.end_date')}
                />
             </div>
          </div>

          <button 
             onClick={handleExportInvoice}
             className="flex items-center justify-center gap-2 text-white bg-brand-800 hover:bg-brand-900 text-sm font-medium px-4 py-2 rounded-lg transition w-full xl:w-auto shadow-sm"
          >
             <Printer className="w-4 h-4" /> {t('history.export')}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-brand-900 font-semibold border-b border-brand-100">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-brand-100 transition group whitespace-nowrap"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    {t('common.date')}
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 hidden md:table-cell">{t('common.description')}</th>
                <th className="px-6 py-4">{t('common.type')}</th>
                <th 
                  className="px-6 py-4 text-right cursor-pointer hover:bg-brand-100 transition whitespace-nowrap"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    {t('common.amount')}
                    {sortConfig.key === 'amount' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const display = getAmountDisplay(tx);
                  return (
                    <tr key={tx.id} className="hover:bg-brand-50/50 transition">
                      <td className="px-6 py-4 font-mono text-brand-600">
                          {tx.date}
                          <div className="md:hidden text-xs text-brand-900 font-sans mt-1">
                              {tx.description}
                          </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-900 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                              {tx.description}
                              {getStatusBadge(tx.status)}
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(tx.type)}`}>
                          {tx.type === 'CLAIM_PAYOUT' ? t('history.payout_badge') : tx.type}
                        </span>
                        <div className="md:hidden mt-1">
                            {getStatusBadge(tx.status)}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${display.color} whitespace-nowrap`}>
                        {display.prefix}{tx.amount.toLocaleString()} ETB
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-brand-400">
                    {t('history.no_tx')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-brand-100 bg-brand-50/30 text-xs text-brand-400 text-center">
           {t('history.showing')} {filteredTransactions.length} {t('history.records')}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;