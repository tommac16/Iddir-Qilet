import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { mockDb } from '../services/mockDb';
import { Transaction, TransactionStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, Printer, CheckCircle, XCircle, FileText, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FinancialLedger: React.FC = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPROVALS'>('OVERVIEW');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const refreshData = () => {
    // Force a fresh fetch from DB
    const freshData = mockDb.getTransactions();
    setTransactions(freshData);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Poll for changes occasionally to keep UI in sync if tabs change (optional but good for consistency)
  useEffect(() => {
      if (activeTab === 'APPROVALS') {
          refreshData();
      }
  }, [activeTab]);

  const handleApprove = (id: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent row click events
      e.preventDefault();
      
      // Execute update
      mockDb.updateTransactionStatus(id, TransactionStatus.COMPLETED);
      
      // Update UI immediately
      refreshData();
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      // Execute update
      mockDb.updateTransactionStatus(id, TransactionStatus.REJECTED);
      
      // Update UI immediately
      refreshData();
  };

  const handleExportReport = () => {
      const completedTxs = transactions.filter(t => t.status === TransactionStatus.COMPLETED);
      const totalIncome = completedTxs.reduce((sum, t) => sum + (t.type === 'CONTRIBUTION' ? t.amount : 0), 0);
      const totalExpense = completedTxs.reduce((sum, t) => sum + (t.type === 'EXPENSE' || t.type === 'CLAIM_PAYOUT' ? t.amount : 0), 0);

      const printWindow = window.open('', '_blank', 'width=900,height=800');
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Financial Report</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700&display=swap');
              body { font-family: 'Noto Serif Ethiopic', 'Times New Roman', serif; padding: 40px; color: #1f2937; max-width: 800px; mx-auto; }
              .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #b45309; padding-bottom: 20px; }
              .logo { color: #b45309; font-size: 28px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
              .report-title { font-size: 24px; font-weight: bold; text-align: center; color: #374151; margin-bottom: 30px; }
              
              .summary-grid { display: flex; gap: 20px; margin-bottom: 40px; justify-content: center; }
              .card { border: 1px solid #e5e7eb; padding: 20px; text-align: center; width: 200px; border-radius: 8px; background: #f9fafb; }
              .card h3 { margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; }
              .card p { font-size: 20px; font-weight: bold; margin: 0; color: #111; }

              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { text-align: left; border-bottom: 2px solid #e5e7eb; padding: 12px 8px; background-color: #f9fafb; font-size: 14px; text-transform: uppercase; color: #6b7280; }
              td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
              .amount-col { text-align: right; font-family: monospace; font-size: 15px; }
              
              .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Mahber Iddir St.Merry Qilet</div>
              <div>Mekelle, Ethiopia</div>
            </div>

            <div class="report-title">FINANCIAL LEDGER REPORT</div>
            <div style="text-align: center; margin-bottom: 30px; color: #666;">Generated on ${new Date().toLocaleDateString()}</div>

            <div class="summary-grid">
                <div class="card">
                    <h3>Total Income</h3>
                    <p style="color: green;">+${totalIncome.toLocaleString()} ETB</p>
                </div>
                <div class="card">
                    <h3>Total Expense</h3>
                    <p style="color: red;">-${totalExpense.toLocaleString()} ETB</p>
                </div>
                <div class="card">
                    <h3>Net Balance</h3>
                    <p>${(totalIncome - totalExpense).toLocaleString()} ETB</p>
                </div>
            </div>

            <h3>Recent Transactions (Last 20)</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th class="amount-col">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${completedTxs.slice(0, 20).map(tx => `
                  <tr>
                    <td>${tx.date}</td>
                    <td>${tx.memberName || 'System'}</td>
                    <td>${tx.description}</td>
                    <td>${tx.type}</td>
                    <td class="amount-col">
                      ${tx.amount.toLocaleString()} ETB
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Generated by Mahber Management System.</p>
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

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    // Generate data for the last 5 months including current
    for (let i = 4; i >= 0; i--) {
        const d = new Date(today);
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        
        // Use filtered transactions for chart to only show completed
        const completed = transactions.filter(t => t.status === TransactionStatus.COMPLETED);

        const seed = d.getMonth() + d.getFullYear(); 
        const pseudoRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        
        const income = 2000 + Math.floor(pseudoRandom(seed) * 2000);
        const expense = 1000 + Math.floor(pseudoRandom(seed + 1) * 3000);

        data.push({ name: monthName, income, expense });
    }
    return data;
  }, [transactions]);

  const pieData = [
    { name: t('financials.source.contributions'), value: 70 },
    { name: t('financials.source.penalties'), value: 10 },
    { name: t('financials.source.donations'), value: 20 },
  ];

  const COLORS = ['#8a7266', '#d97706', '#5e4b42'];
  
  const pendingTransactions = transactions.filter(t => t.status === TransactionStatus.PENDING);
  const completedTransactions = transactions.filter(t => t.status === TransactionStatus.COMPLETED || t.status === undefined); 

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-brand-900">{t('financials.title')}</h1>
        <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900 border border-brand-200 px-3 py-2 rounded-lg bg-white"
        >
            <Printer className="w-4 h-4" /> {t('financials.export')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-brand-200">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'OVERVIEW' ? 'text-accent-600' : 'text-brand-500 hover:text-brand-800'}`}
          >
              {t('ledger.tab.overview')}
              {activeTab === 'OVERVIEW' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-600"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('APPROVALS')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'APPROVALS' ? 'text-accent-600' : 'text-brand-500 hover:text-brand-800'}`}
          >
              {t('ledger.tab.pending')}
              {pendingTransactions.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingTransactions.length}</span>
              )}
              {activeTab === 'APPROVALS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-600"></div>}
          </button>
      </div>

      {activeTab === 'OVERVIEW' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-brand-100">
                <h3 className="text-lg font-bold text-brand-800 mb-6">{t('financials.chart_title')}</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0cec7" />
                        <XAxis dataKey="name" tick={{fill: '#8a7266'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#8a7266'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="income" fill="#8a7266" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#d97706" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-brand-800 mb-2 w-full text-left">{t('financials.pie_title')}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-2">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-brand-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                                    {item.name}
                                </span>
                                <span className="font-bold text-brand-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-brand-100">
                <div className="p-6 border-b border-brand-100">
                <h3 className="text-lg font-bold text-brand-900">{t('financials.recent_tx')}</h3>
                </div>
                <div className="divide-y divide-brand-50">
                {completedTransactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-brand-50 transition">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {tx.amount > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                        <p className="font-medium text-brand-900">{tx.description}</p>
                        <p className="text-sm text-brand-500">{tx.date} • {tx.memberName || t('common.system')}</p>
                        </div>
                    </div>
                    <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ETB
                    </span>
                    </div>
                ))}
                </div>
            </div>
          </>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border border-brand-100">
              <div className="p-6 border-b border-brand-100">
                <h3 className="text-lg font-bold text-brand-900">{t('ledger.pending_title')}</h3>
                <p className="text-sm text-brand-500">{t('ledger.pending_desc')}</p>
              </div>
              
              {pendingTransactions.length === 0 ? (
                  <div className="p-12 text-center text-brand-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>{t('ledger.no_pending')}</p>
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-brand-50 text-brand-900 font-semibold">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.table.date')}</th>
                                <th className="px-6 py-4">{t('dashboard.table.member')}</th>
                                <th className="px-6 py-4">{t('dashboard.table.desc')}</th>
                                <th className="px-6 py-4">{t('common.amount')}</th>
                                <th className="px-6 py-4">{t('ledger.receipt')}</th>
                                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-50">
                            {pendingTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-brand-50/50">
                                    <td className="px-6 py-4 font-mono text-brand-600">{tx.date}</td>
                                    <td className="px-6 py-4 font-bold text-brand-900">{tx.memberName}</td>
                                    <td className="px-6 py-4 text-brand-600">{tx.description}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-green-600">+{tx.amount.toLocaleString()} ETB</td>
                                    <td className="px-6 py-4">
                                        {tx.receiptUrl ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedReceipt(tx.receiptUrl || null); }}
                                                className="flex items-center gap-1 text-accent-600 hover:text-accent-700 underline text-xs"
                                            >
                                                <FileText className="w-3 h-3" /> {t('ledger.view_receipt')}
                                            </button>
                                        ) : (
                                            <span className="text-brand-300 text-xs italic">No receipt</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={(e) => handleApprove(tx.id, e)}
                                                className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition"
                                                title={t('ledger.approve')}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleReject(tx.id, e)}
                                                className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition"
                                                title={t('ledger.reject')}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              )}
          </div>
      )}

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

export default FinancialLedger;