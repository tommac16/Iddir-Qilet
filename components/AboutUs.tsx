import React, { useState, useEffect } from 'react';
import { Users, Target, Shield, Heart, Eye, Lock, Scale, Users2, ChevronDown, ChevronUp, CheckCircle, Award, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDb, LeadershipMember } from '../services/mockDb';
import { generateAboutContent } from '../services/geminiService';

const AboutUs: React.FC = () => {
  const { t, language } = useLanguage();
  const [openValueId, setOpenValueId] = useState<string | null>('solidarity');
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);
  
  // AI State
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [valueInsights, setValueInsights] = useState<Record<string, string>>({});
  const [loadingValueId, setLoadingValueId] = useState<string | null>(null);

  useEffect(() => {
    setLeaders(mockDb.getLeadership());
  }, []);

  const handleExpandHistory = async () => {
      setLoadingHistory(true);
      const baseHistory = t('landing.history.desc');
      const story = await generateAboutContent('HISTORY', baseHistory, language);
      setExpandedHistory(story);
      setLoadingHistory(false);
  };

  const handleGetValueInsight = async (id: string, title: string) => {
      setLoadingValueId(id);
      const insight = await generateAboutContent('VALUE', title, language);
      setValueInsights(prev => ({...prev, [id]: insight}));
      setLoadingValueId(null);
  };

  const coreValues = [
    { 
      id: 'solidarity', 
      icon: <Heart className="w-5 h-5 text-red-500" />, 
      title: t('value.solidarity'), 
      desc: t('value.solidarity.desc') 
    },
    { 
      id: 'integrity', 
      icon: <Shield className="w-5 h-5 text-blue-500" />, 
      title: t('value.integrity'), 
      desc: t('value.integrity.desc') 
    },
    { 
      id: 'transparency', 
      icon: <Eye className="w-5 h-5 text-teal-500" />, 
      title: t('value.transparency'), 
      desc: t('value.transparency.desc') 
    },
    { 
      id: 'compassion', 
      icon: <Users2 className="w-5 h-5 text-pink-500" />, 
      title: t('value.compassion'), 
      desc: t('value.compassion.desc') 
    },
    { 
      id: 'accountability', 
      icon: <Lock className="w-5 h-5 text-amber-500" />, 
      title: t('value.accountability'), 
      desc: t('value.accountability.desc') 
    },
    { 
      id: 'equality', 
      icon: <Scale className="w-5 h-5 text-indigo-500" />, 
      title: t('value.equality'), 
      desc: t('value.equality.desc') 
    },
  ];

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Introduction Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-200/40 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-600 text-xs font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Users className="w-3 h-3" />
                <span>Since 2024</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {t('nav.about')}
            </h1>
            <div className="max-w-3xl mx-auto">
                {/* Standard Short History */}
                <p className={`text-xl md:text-2xl text-brand-600 font-serif leading-relaxed font-light transition-all duration-500 ${expandedHistory ? 'opacity-50 scale-95 hidden' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
                    {t('landing.history.desc')}
                </p>

                {/* AI Expanded History */}
                {expandedHistory && (
                    <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-accent-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 text-left">
                        <div className="flex items-center gap-2 mb-4 text-accent-600 font-bold text-sm uppercase tracking-wide">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Storyteller</span>
                        </div>
                        <p className="text-lg text-brand-800 leading-relaxed font-serif whitespace-pre-line">
                            {expandedHistory}
                        </p>
                        <button 
                            onClick={() => setExpandedHistory(null)}
                            className="mt-6 text-sm text-brand-500 hover:text-brand-800 underline"
                        >
                            Show Less
                        </button>
                    </div>
                )}
                
                {/* AI Trigger Button */}
                {!expandedHistory && (
                    <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-10 delay-200">
                        <button 
                            onClick={handleExpandHistory}
                            disabled={loadingHistory}
                            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-accent-200 text-accent-700 rounded-full hover:bg-accent-50 hover:border-accent-300 transition-all shadow-sm"
                        >
                            {loadingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-accent-500 group-hover:text-accent-600" />}
                            <span className="font-medium text-sm">
                                {loadingHistory ? (language === 'TI' ? 'ታሪኽ ይፅሓፍ ኣሎ...' : 'Weaving the story...') : (language === 'TI' ? 'ሙሉእ ታሪኽ ብ AI ርአ' : 'Read Full Story (AI)')}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Target className="w-32 h-32 text-brand-900" />
                </div>
                <div className="w-16 h-16 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-accent-600 group-hover:text-white transition-colors duration-300">
                    <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-brand-900 mb-4">{t('about.mission')}</h3>
                <p className="text-brand-600 leading-relaxed text-lg font-light relative z-10">
                   {t('about.mission.desc')}
                </p>
            </div>

            {/* Vision Card */}
            <div className="group bg-brand-900 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-800 hover:-translate-y-1 relative overflow-hidden text-white">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Users className="w-32 h-32 text-white" />
                </div>
                <div className="w-16 h-16 bg-white/10 text-brand-100 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm group-hover:bg-white group-hover:text-brand-900 transition-colors duration-300">
                    <Users className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4">{t('about.vision')}</h3>
                <p className="text-brand-200 leading-relaxed text-lg font-light relative z-10">
                   {t('about.vision.desc')}
                </p>
            </div>
        </div>
      </section>

      {/* Core Values Accordion */}
      <section className="bg-white py-20 mt-12">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-12">
                <div className="p-3 bg-accent-100 rounded-full text-accent-600">
                    <Award className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-brand-900">{t('about.values')}</h2>
            </div>
            
            <div className="space-y-4">
                {coreValues.map((val) => {
                    const isOpen = openValueId === val.id;
                    const insight = valueInsights[val.id];
                    const isLoading = loadingValueId === val.id;

                    return (
                        <div 
                           key={val.id} 
                           className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                               isOpen 
                               ? 'border-accent-200 bg-brand-50/50 shadow-md scale-[1.02]' 
                               : 'border-brand-100 bg-white hover:border-brand-200'
                           }`}
                        >
                            <button 
                                onClick={() => setOpenValueId(isOpen ? null : val.id)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isOpen ? 'bg-white shadow-sm' : 'bg-brand-50 group-hover:bg-brand-100'}`}>
                                        {val.icon}
                                    </div>
                                    <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-brand-900' : 'text-brand-600 group-hover:text-brand-800'}`}>
                                        {val.title}
                                    </h3>
                                </div>
                                <div className={`text-brand-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-500' : 'group-hover:text-brand-600'}`}>
                                    {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                </div>
                            </button>
                            
                            <div 
                                className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 pl-[5.5rem] pr-10">
                                    <div className="h-px w-full bg-brand-200/50 mb-4"></div>
                                    <p className="text-brand-700 leading-relaxed flex gap-3 text-lg font-light mb-4">
                                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-1" />
                                        {val.desc}
                                    </p>

                                    {/* AI Insight Section */}
                                    {insight ? (
                                        <div className="bg-accent-50 rounded-xl p-4 border border-accent-100 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start gap-3">
                                                <BookOpen className="w-5 h-5 text-accent-600 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-accent-800 text-sm uppercase mb-1">Cultural Wisdom</h4>
                                                    <p className="text-brand-800 italic text-sm">{insight}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleGetValueInsight(val.id, val.title)}
                                            disabled={isLoading}
                                            className="text-xs font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1.5 bg-white border border-accent-200 px-3 py-1.5 rounded-full hover:bg-accent-50 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            {language === 'TI' ? 'ምሳሌ/ምኽሪ ብ AI' : 'Get Proverb (AI)'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="container mx-auto px-6 py-20 relative">
        <div className="flex justify-center items-center mb-16 relative">
             <h2 className="text-4xl font-serif font-bold text-brand-900 text-center">{t('about.leadership')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {leaders.map((leader) => (
                <div key={leader.id} className="group relative rounded-3xl overflow-hidden shadow-lg aspect-[3/4] cursor-pointer bg-brand-200">
                    <img 
                        src={leader.imgUrl} 
                        alt={leader.name} 
                        className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110 md:grayscale md:group-hover:grayscale-0"
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-transparent opacity-90 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content Details */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                            <h4 className="text-white font-bold text-xl mb-1">{leader.name}</h4>
                            <p className="text-accent-400 font-bold uppercase tracking-wider text-xs">{t(leader.roleKey)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;