
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../store';

const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const isLight = state.theme === 'light';

  // إخفاء الشريط في صفحة "حول النظام" لتجنب التكرار
  if (location.pathname === '/about') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 pt-safe pb-4 flex items-center justify-between pointer-events-none backdrop-blur-sm">
      <div className="flex items-center gap-3 pointer-events-auto">
        <button 
          onClick={() => navigate('/about')}
          className={`w-12 h-12 rounded-[1.2rem] glass flex items-center justify-center shadow-lg active:scale-90 transition-all border-white/10 group hover:bg-[#007AFF]/5`}
          aria-label="دليل المساعدة"
          title="دليل المساعدة"
        >
          <HelpCircle className={`w-6 h-6 transition-all group-hover:rotate-12 group-hover:scale-110 ${isLight ? 'text-[#007AFF]' : 'text-[#3b82f6]'}`} />
        </button>
      </div>
      
      {/* عرض حالة المساعد الذكي بتنسيق عصري */}
      <div className="pointer-events-auto">
        {state.aiEnabled ? (
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/25 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-[#007AFF] animate-pulse" />
            <span className="text-[9px] font-black text-[#007AFF] uppercase tracking-widest">Gemini نشط</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-500/10 border border-slate-500/15 backdrop-blur-md opacity-50">
            <span className="text-[9px] font-black app-text-secondary uppercase tracking-widest">AI متوقف</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
