
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../store';

const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const isLight = state.theme === 'light';

  // لا تظهر الأيقونة إذا كنا في صفحة "حول النظام" بالفعل
  if (location.pathname === '/about') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 pt-safe pb-3 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <button 
          onClick={() => navigate('/about')}
          className={`w-11 h-11 rounded-2xl glass flex items-center justify-center shadow-lg active:scale-90 transition-all border-white/10 group hover:bg-[#007AFF]/5`}
          aria-label="دليل الاستخدام والمعلومات"
          title="دليل الاستخدام والمعلومات"
        >
          <HelpCircle className={`w-6 h-6 transition-transform group-hover:rotate-12 ${isLight ? 'text-[#007AFF]' : 'text-blue-400'}`} />
        </button>
      </div>
      
      {/* عرض حالة الذكاء الاصطناعي بشكل مصغر واحترافي */}
      <div className="pointer-events-auto">
        {state.aiEnabled ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/20 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#007AFF] animate-pulse" />
            <span className="text-[9px] font-black text-[#007AFF] uppercase tracking-tighter">AI نشط ومستعد</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-slate-500/20 backdrop-blur-md opacity-40">
            <span className="text-[9px] font-black app-text-secondary uppercase tracking-tighter">AI معطل</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
