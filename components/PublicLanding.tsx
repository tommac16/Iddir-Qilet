import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, HeartHandshake, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDb } from '../services/mockDb';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [heroBg, setHeroBg] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setHeroBg(mockDb.getSettings().heroBgUrl);
  }, []);

  // Particle Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    
    // Initial resize
    resize();
    window.addEventListener('resize', resize);

    // Particle Config
    // Density based on screen size
    const particleCount = Math.min(Math.floor((width * height) / 12000), 80); 
    const particles: {x: number, y: number, vx: number, vy: number}[] = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3, // Gentle floating speed
            vy: (Math.random() - 0.5) * 0.3
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(252, 211, 77, 0.4)'; // Amber-300 equivalent
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Connect
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 160;

                if (distance < maxDist) {
                    ctx.beginPath();
                    // Fade line based on distance
                    const alpha = 0.15 * (1 - distance / maxDist);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
          100% { transform: translateY(0px); opacity: 0.3; }
        }
        .animate-kenburns {
          animation: kenburns 30s ease-in-out infinite alternate;
        }
        .animate-float-1 {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float 12s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-3 {
          animation: float 10s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative bg-brand-900 text-white overflow-hidden group min-h-[650px] flex items-center justify-center">
        
        {/* Animated Background Image (Slow Zoom) */}
        <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center transition-all duration-700 animate-kenburns" 
            style={{ backgroundImage: `url('${heroBg}')` }}
        />
        
        {/* Animated Particle Network (Canvas) */}
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-0 opacity-80 pointer-events-none mix-blend-screen"
        />

        {/* Animated Ambient Lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-float-1"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-[120px] animate-float-2"></div>
            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] animate-float-3"></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/60 to-brand-900/90"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 py-12 flex flex-col items-center text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md text-accent-400 font-medium text-sm border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3 h-3" />
            {t('landing.est')}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
             {t('landing.hero.title')}
          </h1>
          <p className="text-lg md:text-2xl text-brand-100 max-w-3xl mb-10 font-serif font-light drop-shadow-md leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
             {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/login')}
              className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-accent-900/20 hover:shadow-accent-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {t('landing.btn.login')} <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
            >
              {t('landing.btn.join')}
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group bg-brand-50 p-8 rounded-3xl border border-brand-100 hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent-600 group-hover:text-white transition-colors">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3 font-serif">{t('feature.security')}</h3>
              <p className="text-brand-600 leading-relaxed">
                {t('feature.security.desc')}
              </p>
            </div>
            <div className="group bg-brand-50 p-8 rounded-3xl border border-brand-100 hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent-600 group-hover:text-white transition-colors">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3 font-serif">{t('feature.support')}</h3>
              <p className="text-brand-600 leading-relaxed">
                {t('feature.support.desc')}
              </p>
            </div>
            <div className="group bg-brand-50 p-8 rounded-3xl border border-brand-100 hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent-600 group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3 font-serif">{t('feature.community')}</h3>
              <p className="text-brand-600 leading-relaxed">
                {t('feature.community.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicLanding;