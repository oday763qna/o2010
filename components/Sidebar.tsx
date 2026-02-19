import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../store';
import { LayoutDashboard, Target, BrainCircuit, Settings2, LibraryBig, Zap, WifiOff } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { state, isOnline } = useApp();

  const navItems = [
    { path: '/', label: 'المحور الرئيسي', Icon: LayoutDashboard },
    { path: '/tasks', label: 'إدارة المهام', Icon: Target },
    { path: '/notes', label: 'مخزن المعرفة', Icon: BrainCircuit },
    { path: '/settings', label: 'الإعدادات', Icon: Settings2 },
    { path: '/about', label: 'حول النظام', Icon: LibraryBig },
  ];

  return (
    <aside className="hidden lg:flex w-80 border-l flex-col h-screen sticky top-0 transition-all border-white/5">
      <div className="p-12">
        <h1 className="text-4xl font-black text-[#007AFF] mb-2">مهام OD</h1>
        <div className="flex items-center gap-3"><p className="text-[10px] app-text-secondary uppercase font-black tracking-[0.4em]">المساعد الذكي</p>{!isOnline && <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />}</div>
      </div>
      <nav className="flex-1 px-8 space-y-3">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all group ${isActive ? 'bg-[#007AFF] text-white font-bold shadow-xl shadow-[#007AFF]/20' : 'app-text-secondary hover:glass'}`}><Icon className="w-5 h-5" /><span className="text-sm font-bold">{label}</span></NavLink>
        ))}
      </nav>
      <div className="p-10 border-t border-white/5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-14 h-14 rounded-[1.5rem] bg-[#007AFF] flex items-center justify-center font-black text-white text-xl">{state.user.level}</div>
          <div><div className="flex items-center gap-2"><Zap className="w-3 h-3 text-cyan-400 fill-current" /><p className="text-[10px] font-black uppercase app-text-secondary">الرتبة {state.user.level}</p></div><p className="text-[11px] app-text-secondary font-bold mt-1">{state.user.xp} نقطة</p></div>
        </div>
        <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden"><div className="bg-[#007AFF] h-full transition-all duration-1000 ease-out" style={{ width: `${(state.user.xp % 1000) / 10}%` }} /></div>
      </div>
    </aside>
  );
};

export default Sidebar;