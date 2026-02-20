
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../store';
import { LayoutDashboard, Target, BrainCircuit, Settings2, LibraryBig, Zap, WifiOff, Star } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { state, isOnline } = useApp();

  const navItems = [
    { path: '/', label: 'المحور الرئيسي', Icon: LayoutDashboard },
    { path: '/tasks', label: 'إدارة المهام', Icon: Target },
    { path: '/notes', label: 'مخزن المعرفة', Icon: BrainCircuit },
    { path: '/settings', label: 'الإعدادات', Icon: Settings2 },
    { path: '/about', label: 'حول النظام', Icon: LibraryBig },
  ];

  const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 7500, 10000, 13500, 17500, 22000, 30000];
  const currentLevel = state.user.level;
  const currentLevelMin = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelMin = LEVEL_THRESHOLDS[currentLevel] || (currentLevelMin + 5000);
  const progressInLevel = state.user.xp - currentLevelMin;
  const totalNeededInLevel = nextLevelMin - currentLevelMin;
  const progressPercentage = Math.min(Math.max((progressInLevel / totalNeededInLevel) * 100, 0), 100);

  return (
    <aside className="hidden lg:flex w-80 border-l flex-col h-screen sticky top-0 transition-all border-white/5">
      <div className="p-12">
        <h1 className="text-4xl font-black text-[#007AFF] mb-2 tracking-tighter">مهام OD</h1>
        <div className="flex items-center gap-3">
          <p className="text-[10px] app-text-secondary uppercase font-black tracking-[0.4em]">المساعد الذكي</p>
          {!isOnline && <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />}
        </div>
      </div>
      <nav className="flex-1 px-8 space-y-3">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink 
            key={path} 
            to={path} 
            className={({ isActive }) => `flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all group ${isActive ? 'bg-[#007AFF] text-white font-bold shadow-xl shadow-[#007AFF]/20' : 'app-text-secondary hover:glass'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-bold">{label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-10 border-t border-white/5 bg-[#007AFF]/5">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-[1.5rem] bg-[#007AFF] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#007AFF]/30 animate-pulse-slow">
              {state.user.level}
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-lg shadow-sm">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400 fill-current" />
              <p className="text-[10px] font-black uppercase app-text-secondary tracking-wider">المستوى {state.user.level}</p>
            </div>
            <div className="flex justify-between items-end mt-1">
              <p className="text-[12px] app-text-primary font-black">{state.user.xp} XP</p>
              <p className="text-[9px] app-text-secondary font-bold opacity-60">التالي: {nextLevelMin}</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-200/20 h-2 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-[#007AFF] to-cyan-400 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,122,255,0.5)]" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
