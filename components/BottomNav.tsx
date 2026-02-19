import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../store';
import { LayoutDashboard, Target, Timer, BrainCircuit, Settings2 } from 'lucide-react';

const BottomNav: React.FC = () => {
  const { state, dispatch } = useApp();
  const isLight = state.theme === 'light';

  const items = [
    { path: '/', label: 'المحور', Icon: LayoutDashboard },
    { path: '/tasks', label: 'المهام', Icon: Target },
    { path: 'FOCUS', label: 'تركيز', Icon: Timer, isFocus: true },
    { path: '/notes', label: 'المعرفة', Icon: BrainCircuit },
    { path: '/settings', label: 'المزيد', Icon: Settings2 },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-[100] px-6 pb-safe pt-3 border-t backdrop-blur-xl flex justify-around items-end shadow-2xl transition-all duration-500 ${isLight ? 'bg-white/80 border-slate-100' : 'bg-[#0a0a0a]/90 border-white/5'}`}>
      {items.map(({ path, label, Icon, isFocus }) => {
        if (isFocus) {
          return (
            <button key={path} onClick={() => dispatch({ type: 'SET_FOCUS_MODE', payload: true })} className="flex flex-col items-center gap-1 -translate-y-4">
              <div className={`w-16 h-16 bg-[#007AFF] rounded-[1.8rem] flex items-center justify-center text-white shadow-xl shadow-[#007AFF]/30 border-[6px] transition-all active:scale-90 ${isLight ? 'border-[#f8fafc]' : 'border-[#050505]'}`}><Icon className="w-7 h-7" /></div>
              <span className="text-[10px] font-black text-[#007AFF] mt-1">{label}</span>
            </button>
          );
        }
        return (
          <NavLink key={path} to={path} className={({ isActive }) => `flex flex-col items-center gap-2 pb-5 transition-all group ${isActive ? 'text-[#007AFF]' : 'app-text-secondary opacity-60'}`}>
            <Icon className="w-6 h-6 group-active:scale-110 transition-transform" />
            <span className="text-[10px] font-black leading-none">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;