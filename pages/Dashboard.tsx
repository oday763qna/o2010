import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
          <p className="app-text-secondary text-sm font-medium">خطتك لليوم جاهزة</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </header>

      {/* Quick Action Card */}
      <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden ${isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[#007AFF] font-black text-[10px] uppercase tracking-widest">
            <Target className="w-4 h-4" /> ركز على الهدف
          </div>
          <h2 className="text-2xl font-black app-text-primary">حول فكرتك إلى واقع ملموس</h2>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3 bg-[#007AFF] text-white px-8 py-4 rounded-[1.2rem] font-black text-sm shadow-xl shadow-[#007AFF]/30 active:scale-95 transition-all"
          >
            إضافة مهمة جديدة <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#007AFF]/10 rounded-full blur-[80px]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-[2rem] flex flex-col items-center text-center">
            <stat.Icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <span className="text-[10px] font-black app-text-secondary uppercase mb-1">{stat.label}</span>
            <span className="text-2xl font-black app-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="glass p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-sm font-black app-text-primary">إنجازك الأسبوعي</h3>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: isLight ? '#64748b' : '#94a3b8', fontWeight: 'bold' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                contentStyle={{ borderRadius: '1rem', border: 'none', background: isLight ? '#fff' : '#1e293b', color: isLight ? '#1a1a1a' : '#fff' }}
              />
              <Bar dataKey="completed" radius={[8, 8, 8, 8]} barSize={20}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#007AFF' : (isLight ? '#e2e8f0' : '#1e293b')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      {state.aiEnabled && (
        <div className="p-8 rounded-[2.5rem] border bg-[#007AFF]/5 border-[#007AFF]/20 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black app-text-primary text-right">تحليل Gemini</h3>
              <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-wider text-right">رؤى إنتاجية ذكية</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {loadingAI ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-200/20 rounded-full w-full" />
                <div className="h-4 bg-slate-200/20 rounded-full w-3/4" />
              </div>
            ) : aiInsights.length > 0 ? (
              aiInsights.map((insight, i) => (
                <div key={i} className="p-4 rounded-2xl glass text-xs font-bold leading-relaxed app-text-primary">
                  {insight}
                </div>
              ))
            ) : (
              <p className="text-xs app-text-secondary text-center italic">أكمل بعض المهام لتلقي تحليل ذكي لأدائك.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;