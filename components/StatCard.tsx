import React from 'react';
import { StatCardProps } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-brand-500">{title}</p>
          <h3 className="text-2xl font-bold text-brand-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-brand-400 ml-2">{t('dashboard.stat.vs_last')}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;