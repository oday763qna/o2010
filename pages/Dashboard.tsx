
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
  const isLight = state.theme === 'light';

  const stats = [
    { label: 'المهام', value: state.user.completedTasks, Icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'الجلسات', value: state.user.focusSessions, Icon: Timer, color: 'text-rose-500' },
    { label: 'ساعات التركيز', value: Math.round(state.user.totalFocusTime / 60), Icon: Target, color: 'text-[#007AFF]' },
    { label: 'الاستمرار', value: state.user.streak, Icon: Flame, color: 'text-orange-500' },
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

  useEffect(() => {
    const fetchAI = async () => {
      if (!state.aiEnabled || state.tasks.length === 0) return;
      setLoadingAI(true);
      try {
        const insights = await getBehavioralAnalysis(state.tasks, state.user.totalFocusTime);
        setAiInsights(insights);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchAI();
  }, [state.tasks.length, state.aiEnabled]);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-safe">
        <div>
          <h1 className="text-3xl font-black app-text-primary">مرحباً، {state.user.name}</h1>
          <p className="app-text-secondary text-sm font-medium">خطتك لليوم جاهزة للبدء</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </header>

      {/* Quick Action Card */}
      <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-300 ${isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[#007AFF] font-black text-[10px] uppercase tracking-widest">
            <Target className="w-4 h-4" /> ركز على الهدف التالي
          </div>
          <h2 className="text-2xl font-black app-text-primary leading-tight">حول أفكارك العظيمة إلى<br/>واقع ملموس اليوم</h2>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3 bg-[#007AFF] text-white px-8 py-4 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[#007AFF]/30 active:scale-95 transition-all hover:bg-[#0066EE]"
          >
            إضافة مهمة جديدة <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#007AFF]/10 rounded-full blur-[80px]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-[2rem] flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <stat.Icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <span className="text-[10px] font-black app-text-secondary uppercase mb-1">{stat.label}</span>
            <span className="text-2xl font-black app-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Weekly Chart - Following dimensions requirement */}
      <div className="glass p-6 rounded-[2.5rem] space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black app-text-primary">الإنتاجية الأسبوعية</h3>
          <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-2 py-1 rounded-md">7 أيام أخيرة</span>
        </div>
        <div style={{ width: "100%", height: "100%", minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={isLight ? '#f1f5f9' : '#1e293b'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: isLight ? '#64748b' : '#94a3b8', fontWeight: 'bold' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,122,255,0.05)' }} 
                contentStyle={{ 
                  borderRadius: '1rem', 
                  border: 'none', 
                  background: isLight ? '#fff' : '#0f172a', 
                  color: isLight ? '#1a1a1a' : '#f8fafc',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Cairo'
                }}
              />
              <Bar dataKey="completed" radius={[6, 6, 6, 6]} barSize={18}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#007AFF' : (isLight ? '#cbd5e1' : '#334155')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      {state.aiEnabled && (
        <div className="p-8 rounded-[2.5rem] border bg-[#007AFF]/5 border-[#007AFF]/20 space-y-6 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black app-text-primary text-right">تحليل Gemini الذكي</h3>
              <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-wider text-right">رؤى عميقة لأدائك</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {loadingAI ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200/20 rounded-full w-full" />
                <div className="h-4 bg-slate-200/20 rounded-full w-3/4" />
                <div className="h-4 bg-slate-200/20 rounded-full w-5/6" />
              </div>
            ) : aiInsights.length > 0 ? (
              aiInsights.map((insight, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl glass items-center text-right">
                  <div className="w-2 h-2 rounded-full bg-[#007AFF] shrink-0" />
                  <p className="text-xs font-bold leading-relaxed app-text-primary">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center glass rounded-2xl border-dashed border-2 border-slate-500/10">
                <p className="text-xs app-text-secondary font-bold">ابدأ بإكمال المهام لتفعيل محرك التحليل السلوكي للذكاء الاصطناعي.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
