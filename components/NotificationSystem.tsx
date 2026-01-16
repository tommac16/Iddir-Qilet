import React, { useState } from 'react';
import { generateNotification } from '../services/geminiService';
import { NotificationDraft } from '../types';
import { Sparkles, Send, Copy, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationSystem: React.FC = () => {
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<NotificationDraft['audience']>('ALL');
  const [tone, setTone] = useState<NotificationDraft['tone']>('FORMAL');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const toneLabels: Record<string, string> = {
    FORMAL: language === 'TI' ? 'ወግዓዊ' : 'Formal',
    URGENT: language === 'TI' ? 'ህጹጽ' : 'Urgent',
    CELEBRATORY: language === 'TI' ? 'ናይ ሓጎስ' : 'Celebratory'
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    // Pass current language context to the AI service
    const result = await generateNotification({ topic, audience, tone }, language);
    setGeneratedText(result);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-brand-900 flex items-center gap-2">
            {t('ai.title')} <Sparkles className="w-6 h-6 text-accent-500" />
        </h1>
        <p className="text-brand-500 mt-2">
            {t('ai.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 space-y-6">
            <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">{t('ai.topic')}</label>
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={language === 'TI' ? "ምሳሌ፡ ናይ ወርሒ ኣኼባ፣ ሓዘን..." : "e.g. Monthly meeting reminder, Funeral for Ato Kebede"}
                    className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-serif"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">{t('ai.audience')}</label>
                <select 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full p-3 border border-brand-200 rounded-lg outline-none bg-white"
                >
                    <option value="ALL">All Members / ኩሎም ኣባላት</option>
                    <option value="DEFAULTERS">Defaulters / ዘይከፈሉ</option>
                    <option value="ADMINS">Committee / ኮሚቴ</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">{t('ai.tone')}</label>
                <div className="grid grid-cols-3 gap-2">
                    {(['FORMAL', 'URGENT', 'CELEBRATORY'] as const).map((tOption) => (
                        <button
                            key={tOption}
                            onClick={() => setTone(tOption)}
                            className={`py-2 px-3 text-sm rounded-lg border transition ${tone === tOption ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-brand-600 border-brand-200 hover:bg-brand-50'}`}
                        >
                            {toneLabels[tOption]}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-3 bg-accent-600 text-white rounded-lg font-bold hover:bg-accent-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {t('ai.btn.generate')}
            </button>
        </div>

        {/* Output Area */}
        <div className="bg-brand-900 p-6 rounded-xl shadow-lg text-brand-100 flex flex-col">
            <h3 className="text-sm font-bold text-brand-400 uppercase tracking-wider mb-4">{t('ai.preview')}</h3>
            
            <div className="flex-1 bg-brand-800/50 rounded-lg p-4 font-serif leading-relaxed whitespace-pre-wrap border border-brand-700">
                {generatedText || <span className="text-brand-600 italic">{language === 'TI' ? 'ዝተዳለወ መልእኽቲ ኣብዚ ክረአ እዩ...' : 'Your generated message will appear here...'}</span>}
            </div>

            <div className="mt-6 flex gap-4">
                <button 
                    disabled={!generatedText}
                    className="flex-1 py-2 border border-brand-600 hover:bg-brand-800 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Copy className="w-4 h-4" /> Copy
                </button>
                <button 
                    disabled={!generatedText}
                    className="flex-1 py-2 bg-white text-brand-900 hover:bg-brand-100 rounded-lg flex items-center justify-center gap-2 transition font-medium"
                >
                    <Send className="w-4 h-4" /> Send Blast
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;