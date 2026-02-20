
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { getBehavioralAnalysis } from '../services/geminiService';
import { 
  CheckCircle2, 
  Timer, 
  Flame, 
  Sparkles, 
  Zap,
  Target,
  ArrowLeft,
  Trophy,
  TrendingUp,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isLight = state.theme === 'light';

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    const fetchAI = async () => {
      if (!state.aiEnabled || state.tasks.length === 0) return;
      setLoadingAI(true);
      try {
        const insights = await getBehavioralAnalysis(state.tasks, state.user.totalFocusTime);
        setAiInsights(insights);
      } catch (e) {
        console.error("AI Insight Error:", e);
      } finally {
        setLoadingAI(false);
      }
    };
    
    fetchAI();
    return () => clearTimeout(timer);
  }, [state.tasks.length, state.aiEnabled, state.user.totalFocusTime]);

  const stats = [
    { label: 'المهام', value: state.user.completedTasks, Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'جلسات', value: state.user.focusSessions, Icon: Timer, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'ساعات', value: Math.round(state.user.totalFocusTime / 60), Icon: Target, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/10' },
    { label: 'سلسلة', value: state.user.streak, Icon: Flame, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ];

  const weeklyData = [
    { name: 'أحد', completed: 3 },
    { name: 'إثن', completed: 6 },
    { name: 'ثلاث', completed: 4 },
    { name: 'أرب', completed: 9 },
    { name: 'خمي', completed: 7 },
    { name: 'جمع', completed: 5 },
    { name: 'سبت', completed: 2 },
  ];

  const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 7500, 10000, 13500, 17500, 22000, 30000];
  const currentLevel = state.user.level;
  const currentLevelMin = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelMin = LEVEL_THRESHOLDS[currentLevel] || (currentLevelMin + 5000);
  const progressInLevel = state.user.xp - currentLevelMin;
  const totalNeededInLevel = nextLevelMin - currentLevelMin;
  const progressPercentage = Math.min(Math.max((progressInLevel / totalNeededInLevel) * 100, 0), 100);

  const chartColors = {
    primary: '#007AFF',
    secondary: isLight ? '#cbd5e1' : '#334155',
    grid: isLight ? '#f1f5f9' : '#1e293b',
    text: isLight ? '#555555' : '#aaaaaa',
    tooltipBg: isLight ? '#ffffff' : '#1e293b',
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-safe">
        <div>
          <h1 className="text-3xl font-black app-text-primary tracking-tight">لوحة الإنتاجية</h1>
          <p className="app-text-secondary text-sm font-bold opacity-80">نظرة عامة على أدائك اليومي</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] shadow-sm">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </header>

      {/* Hero: XP Mastery Card */}
      <div className={`p-8 rounded-[3rem] border relative overflow-hidden transition-all duration-500 shadow-xl ${isLight ? 'bg-white border-slate-100' : 'bg-[#007AFF]/5 border-white/5'}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest app-text-secondary">المستوى الحالي</p>
                <h2 className="text-2xl font-black app-text-primary">مستوى {state.user.level} الإحترافي</h2>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-black px-1">
                <span className="app-text-accent">تقدم الخبرة (XP)</span>
                <span className="app-text-secondary">{state.user.xp} / {nextLevelMin}</span>
              </div>
              <div className="w-full h-4 bg-slate-200/20 rounded-full overflow-hidden shadow-inner p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#007AFF] to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[10px] font-bold app-text-secondary opacity-60 text-right">تبقت {nextLevelMin - state.user.xp} نقطة للوصول للمستوى التالي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pr-4">
             <div className="text-center group">
                <div className="w-16 h-16 rounded-[2rem] bg-orange-500/10 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                   <Flame className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-[10px] font-black uppercase app-text-secondary tracking-tighter">سلسلة الإنجاز</p>
                <p className="text-xl font-black app-text-primary">{state.user.streak} أيام</p>
             </div>
             <div className="w-px h-16 bg-slate-500/10" />
             <div className="text-center group">
                <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                   <Star className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-[10px] font-black uppercase app-text-secondary tracking-tighter">إجمالي XP</p>
                <p className="text-xl font-black app-text-primary">{state.user.xp}</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm hover:translate-y-[-2px] transition-all">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-3`}>
              <stat.Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className="text-[10px] font-black app-text-secondary uppercase mb-1 tracking-wider">{stat.label}</span>
            <span className="text-2xl font-black app-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Fixed Chart Container */}
      <div className="glass p-8 rounded-[3rem] space-y-6 shadow-sm overflow-hidden min-h-[350px]">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
             <TrendingUp className="w-5 h-5 text-[#007AFF]" />
             <h3 className="text-sm font-black app-text-primary">إحصائيات الإنجاز الأسبوعية</h3>
          </div>
          <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-4 py-1.5 rounded-full uppercase tracking-widest">مباشر</span>
        </div>
        
        <div 
          ref={containerRef}
          className="w-full relative flex items-center justify-center"
          style={{ height: '280px', minHeight: '280px', width: '100%' }}
        >
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chartColors.grid} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: chartColors.text, fontWeight: 'bold', fontFamily: 'Cairo' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,122,255,0.04)' }} 
                  contentStyle={{ 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    background: chartColors.tooltipBg, 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                    fontFamily: 'Cairo',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                />
                <Bar dataKey="completed" radius={[8, 8, 8, 8]} barSize={28} animationDuration={2000}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? chartColors.primary : chartColors.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#007AFF]/30 border-t-[#007AFF] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      {state.aiEnabled && (
        <div className="p-8 rounded-[3rem] border bg-gradient-to-br from-[#007AFF]/10 to-transparent border-[#007AFF]/15 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#007AFF] rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-[#007AFF]/30 animate-pulse-slow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black app-text-primary tracking-tight">تحليل Gemini الذكي</h3>
              <p className="text-[11px] text-[#007AFF] font-black uppercase tracking-widest">رؤى مخصصة لتحسين أدائك</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {loadingAI ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-300/10 rounded-3xl w-full" />)}
              </div>
            ) : aiInsights.length > 0 ? (
              aiInsights.map((insight, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-[2rem] glass items-center text-right border-white/5 shadow-sm active:scale-[0.99] transition-all hover:bg-white/10">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#007AFF] to-cyan-400 shrink-0 shadow-lg shadow-[#007AFF]/30" />
                  <p className="text-sm font-bold leading-relaxed app-text-primary">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-12 text-center glass rounded-[2.5rem] border-dashed border-2 border-slate-500/10">
                 <Target className="w-12 h-12 text-slate-500/20 mx-auto mb-4" />
                 <p className="text-xs app-text-secondary font-bold opacity-60">أكمل مهامك بانتظام لتفعيل خوارزمية التحليل الذكي وتقديم نصائح مخصصة.</p>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
