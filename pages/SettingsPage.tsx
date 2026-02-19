
import React from 'react';
import { useApp } from '../store';
import { Sun, Moon, Sparkles, Trash2, Info } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  const isLight = state.theme === 'light';

  const toggleTheme = () => { dispatch({ type: 'SET_THEME', payload: isDark ? 'light' : 'dark' }); };

  return (
    <div className="max-w-md mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="pt-safe">
        <h2 className="text-3xl font-black app-text-primary">الإعدادات</h2>
        <p className="app-text-secondary text-sm mt-1 font-medium">تحكم في بيئة إنتاجيتك</p>
      </header>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest app-text-secondary mr-2">وضع المظهر (صباحي/ليلي)</h3>
        <div onClick={toggleTheme} className="glass p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLight ? 'bg-amber-100 text-amber-600' : 'bg-[#007AFF]/20 text-[#007AFF]'}`}>{isLight ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}</div>
            <div>
              <p className="font-black app-text-primary">{isLight ? 'النمط الصباحي' : 'النمط الليلي'}</p>
              <p className="text-[10px] app-text-secondary font-bold mt-0.5">{isLight ? 'إضاءة طبيعية ومريحة' : 'حماية لعينك في الظلام'}</p>
            </div>
          </div>
          <div className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isDark ? 'bg-[#007AFF] justify-end' : 'bg-slate-200 justify-start'}`}><div className="w-6 h-6 rounded-full bg-white shadow-md transition-all flex items-center justify-center">{isLight ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />}</div></div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest app-text-secondary mr-2">الذكاء الاصطناعي</h3>
        <div className={`p-8 rounded-[2.5rem] border transition-all ${state.aiEnabled ? 'bg-[#007AFF]/5 border-[#007AFF]/20' : 'bg-white/5 border-white/5'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${state.aiEnabled ? 'bg-[#007AFF] text-white' : 'bg-slate-200 text-slate-500'}`}><Sparkles className="w-6 h-6" /></div>
            <div><p className="font-black app-text-primary">مساعد Gemini الذكي</p><p className="text-[10px] app-text-secondary font-bold mt-0.5">تحليل المسارات وتقسيم المهام</p></div>
          </div>
          <button onClick={() => dispatch({ type: 'SET_AI_ENABLED', payload: !state.aiEnabled })} className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${state.aiEnabled ? 'bg-[#007AFF] justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-6 h-6 rounded-full bg-white shadow-md transition-all" /></button>
        </div>
      </section>

      <section className="pt-6 space-y-4">
        <button onClick={() => { if(confirm('هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); } }} className="w-full p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all tap-target"><Trash2 className="w-5 h-5" /> مسح ذاكرة النظام بالكامل</button>
        <div className="flex items-center gap-3 justify-center text-[10px] app-text-secondary font-bold"><Info className="w-3 h-3" /> تم التطوير بواسطة عدي قطقط</div>
      </section>
    </div>
  );
};

export default SettingsPage;
