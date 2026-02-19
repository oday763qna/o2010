
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
  ArrowLeft
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

  // ضمان أن المكون قد تم تحميله في المتصفح قبل محاولة حساب أبعاد الرسم البياني
  useEffect(() => {
    setIsMounted(true);
    
    // محاكاة تحديث الأبعاد بعد فترة قصيرة لحل مشاكل الحسابات الأولية في Recharts
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

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
    return () => clearTimeout(resizeTimer);
  }, [state.tasks.length, state.aiEnabled, state.user.totalFocusTime]);

  const stats = [
    { label: 'المهام', value: state.user.completedTasks, Icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'الجلسات', value: state.user.focusSessions, Icon: Timer, color: 'text-rose-600' },
    { label: 'ساعات التركيز', value: Math.round(state.user.totalFocusTime / 60), Icon: Target, color: 'text-[#007AFF]' },
    { label: 'الاستمرار', value: state.user.streak, Icon: Flame, color: 'text-orange-600' },
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

  const chartColors = {
    primary: '#007AFF',
    secondary: isLight ? '#cbd5e1' : '#334155',
    grid: isLight ? '#f1f5f9' : '#1e293b',
    text: isLight ? '#555555' : '#aaaaaa'
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-safe">
        <div>
          <h1 className="text-3xl font-black app-text-primary tracking-tight">مرحباً، {state.user.name}</h1>
          <p className="app-text-secondary text-sm font-bold opacity-80">نظرة عامة على إنتاجيتك</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] shadow-sm">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </header>

      {/* Hero Card */}
      <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[#007AFF] font-black text-[10px] uppercase tracking-widest">
            <Target className="w-4 h-4" /> ركز على ما يهم
          </div>
          <h2 className="text-2xl font-black app-text-primary leading-tight">استثمر وقتك بذكاء<br/>وحقق أهدافك اليوم</h2>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3 bg-[#007AFF] text-white px-8 py-4 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[#007AFF]/30 active:scale-95 transition-all hover:bg-[#0066EE]"
          >
            استعراض المهام <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#007AFF]/10 rounded-full blur-[80px]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2.2rem] flex flex-col items-center text-center shadow-sm">
            <stat.Icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <span className="text-[10px] font-black app-text-secondary uppercase mb-1 tracking-wider">{stat.label}</span>
            <span className="text-2xl font-black app-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Fixed Chart Container */}
      <div className="glass p-6 rounded-[2.5rem] space-y-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black app-text-primary">إحصائيات الإنجاز</h3>
          <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-3 py-1 rounded-full uppercase">أسبوعي</span>
        </div>
        
        {/* الحاوية ذات الأبعاد الثابتة والمحددة بدقة لتجنب أخطاء Recharts */}
        <div 
          ref={containerRef}
          className="w-full h-[280px] min-h-[280px] relative"
          style={{ width: '100%', height: '280px' }}
        >
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyData} 
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                // ضمان عدم التمدد العشوائي قبل حساب الأبعاد
              >
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
                    borderRadius: '1.2rem', 
                    border: 'none', 
                    background: isLight ? '#ffffff' : '#0f172a', 
                    color: isLight ? '#222222' : '#eeeeee',
                    boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.12)',
                    fontFamily: 'Cairo',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  itemStyle={{ direction: 'rtl', textAlign: 'right' }}
                />
                <Bar 
                  dataKey="completed" 
                  radius={[6, 6, 6, 6]} 
                  barSize={24}
                  animationDuration={1500}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 3 ? chartColors.primary : chartColors.secondary} 
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/10 rounded-3xl space-y-3">
               <div className="w-10 h-10 border-4 border-[#007AFF]/30 border-t-[#007AFF] rounded-full animate-spin"></div>
               <p className="text-[11px] font-bold app-text-secondary">جاري معايرة الرسوم البيانية...</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      {state.aiEnabled && (
        <div className="p-8 rounded-[2.8rem] border bg-[#007AFF]/5 border-[#007AFF]/15 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black app-text-primary text-right tracking-tight">تحليل Gemini الذكي</h3>
              <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-widest text-right">نصائح مخصصة لأدائك</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {loadingAI ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-300/20 rounded-full w-full" />
                <div className="h-4 bg-slate-300/20 rounded-full w-3/4" />
                <div className="h-4 bg-slate-300/20 rounded-full w-5/6" />
              </div>
            ) : aiInsights.length > 0 ? (
              aiInsights.map((insight, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl glass items-center text-right border-white/5 shadow-sm active:scale-[0.99] transition-all">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shrink-0 shadow-sm shadow-[#007AFF]/40" />
                  <p className="text-xs font-bold leading-relaxed app-text-primary">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-10 text-center glass rounded-3xl border-dashed border-2 border-slate-500/15">
                <p className="text-xs app-text-secondary font-bold opacity-60">أكمل مهامك اليوم لتبدأ خوارزمية Gemini في تحليل أنماط إنتاجيتك وتقديم نصائح ذكية.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
