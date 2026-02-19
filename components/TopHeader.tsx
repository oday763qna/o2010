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
          className={`w-11 h-11 rounded-2xl glass flex items-center justify-center shadow-lg active:scale-90 transition-all border-white/10 group`}
          aria-label="معلومات عنا"
          title="معلومات عنا"
        >
          <HelpCircle className={`w-6 h-6 ${isLight ? 'text-[#007AFF]' : 'text-blue-400'} group-hover:rotate-12 transition-transform`} />
        </button>
      </div>
      
      {/* عرض حالة الذكاء الاصطناعي بشكل مصغر */}
      <div className="pointer-events-auto">
        {state.aiEnabled && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/20 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#007AFF]" />
            <span className="text-[8px] font-black text-[#007AFF] uppercase tracking-tighter">AI نشط</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;