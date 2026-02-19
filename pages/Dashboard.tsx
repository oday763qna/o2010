
import React, { useState, useEffect } from 'react';
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
  const isLight = state.theme === 'light';

  useEffect(() => {
    setIsMounted(true);
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
          <p className="app-text-secondary text-sm font-bold opacity-80">خطتك جاهزة لإنجازات اليوم</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] shadow-sm">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </header>

      {/* Hero Quick Action */}
      <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[#007AFF] font-black text-[10px] uppercase tracking-widest">
            <Target className="w-4 h-4" /> هدفك القادم بانتظارك
          </div>
          <h2 className="text-2xl font-black app-text-primary leading-tight">اجعل اليوم بداية<br/>لفصل جديد من الإنجاز</h2>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3 bg-[#007AFF] text-white px-8 py-4 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[#007AFF]/30 active:scale-95 transition-all hover:bg-[#0066EE]"
          >
            إضافة مهمة الآن <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#007AFF]/10 rounded-full blur-[80px]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2.2rem] flex flex-col items-center text-center shadow-sm">
            <stat.Icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <span className="text-[10px] font-black app-text-secondary uppercase mb-1 tracking-wider">{stat.label}</span>
            <span className="text-2xl font-black app-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Weekly Performance Chart */}
      <div className="glass p-6 rounded-[2.5rem] space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black app-text-primary">مستوى الأداء الأسبوعي</h3>
          <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-3 py-1 rounded-full uppercase">آخر 7 أيام</span>
        </div>
        {/* Important: Fixed height to prevent Recharts -1 width error */}
        <div className="w-full h-[280px] min-h-[280px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chartColors.grid} />
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
                    direction: 'rtl'
                  }}
                />
                <Bar dataKey="completed" radius={[6, 6, 6, 6]} barSize={22}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? chartColors.primary : chartColors.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100/10 rounded-3xl animate-pulse">
               <p className="text-[11px] font-bold app-text-secondary">جاري تهيئة الرسوم البيانية...</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Behavioral Analysis */}
      {state.aiEnabled && (
        <div className="p-8 rounded-[2.8rem] border bg-[#007AFF]/5 border-[#007AFF]/15 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black app-text-primary text-right tracking-tight">رؤى Gemini الذكية</h3>
              <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-widest text-right">تحليل سلوكي لإنتاجيتك</p>
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
                <div key={i} className="flex gap-4 p-4 rounded-2xl glass items-center text-right border-white/5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shrink-0 shadow-sm shadow-[#007AFF]/40" />
                  <p className="text-xs font-bold leading-relaxed app-text-primary">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center glass rounded-3xl border-dashed border-2 border-slate-500/15">
                <p className="text-xs app-text-secondary font-bold opacity-70">أكمل بعض المهام وجلسات التركيز لتزويد Gemini بالبيانات اللازمة لتحليل أدائك.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
