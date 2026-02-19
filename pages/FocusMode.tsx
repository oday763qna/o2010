import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { Play, Pause, RotateCcw, FastForward, X, Zap, Coffee } from 'lucide-react';

const FocusMode: React.FC = () => {
  const { state, dispatch } = useApp();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(25 * 60);
  const isLight = state.theme === 'light';

  useEffect(() => {
    let interval: any;
    if (isActive) {
      if (!startTimeRef.current) { startTimeRef.current = Date.now(); initialTimeLeftRef.current = timeLeft; }
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const next = Math.max(0, initialTimeLeftRef.current - elapsed);
        setTimeLeft(next);
        if (next === 0) handleSessionEnd();
      }, 500);
    } else { startTimeRef.current = null; }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleSessionEnd = () => {
    setIsActive(false);
    if (!isBreak) {
      setSessionCount(prev => prev + 1);
      dispatch({ type: 'UPDATE_USER', payload: { totalFocusTime: state.user.totalFocusTime + 25, focusSessions: state.user.focusSessions + 1, xp: state.user.xp + 100 } });
      setIsBreak(true); setTimeLeft(5 * 60);
    } else { setIsBreak(false); setTimeLeft(25 * 60); }
  };

  const progress = (( (isBreak ? 5 * 60 : 25 * 60) - timeLeft) / (isBreak ? 5 * 60 : 25 * 60)) * 100;

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-between py-24 px-10 select-none overflow-hidden slide-up transition-all duration-500 ${isLight ? 'bg-slate-50' : 'bg-[#050505]'}`}>
      <button onClick={() => dispatch({ type: 'SET_FOCUS_MODE', payload: false })} className="absolute top-12 left-10 w-12 h-12 rounded-full glass flex items-center justify-center app-text-secondary tap-target"><X className="w-6 h-6" /></button>
      <div className="relative flex flex-col items-center justify-center space-y-16 flex-1 w-full z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">{isBreak ? <Coffee className="w-5 h-5 text-emerald-500" /> : <Zap className="w-5 h-5 text-[#007AFF] animate-pulse" />}<p className={`font-black tracking-[0.3em] text-[10px] uppercase ${isBreak ? 'text-emerald-500' : 'text-[#007AFF]'}`}>{isActive ? (isBreak ? 'وقت الراحة' : 'جلسة تركيز نشطة') : 'استعد للبدء'}</p></div>
          <h2 className="text-2xl font-bold tracking-tight max-w-[200px] mx-auto leading-snug app-text-primary">{isBreak ? 'استرح قليلاً لتجديد طاقتك' : 'حافظ على تركيزك'}</h2>
        </div>
        <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.02)"} strokeWidth="6" />
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke={isBreak ? "#10b981" : "#007AFF"} strokeWidth="8" strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * progress / 100)} className="transition-all duration-1000 ease-linear" style={{ strokeLinecap: 'round' }} />
          </svg>
          <div className="text-[84px] font-thin tracking-tighter tabular-nums app-text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
        </div>
        <div className="flex gap-10 justify-center items-center">
          <button onClick={() => { setTimeLeft(isBreak ? 5 * 60 : 25 * 60); setIsActive(false); }} className="w-14 h-14 rounded-full glass flex items-center justify-center app-text-secondary active:scale-90 transition-all"><RotateCcw className="w-6 h-6" /></button>
          <button onClick={() => setIsActive(!isActive)} className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl active:scale-90 ${isActive ? 'glass' : 'bg-[#007AFF] shadow-[#007AFF]/30'}`}>{isActive ? <Pause className="w-12 h-12 app-text-primary fill-current" /> : <Play className="w-12 h-12 fill-white mr-1.5" />}</button>
          <button onClick={handleSessionEnd} className="w-14 h-14 rounded-full glass flex items-center justify-center app-text-secondary active:scale-90 transition-all"><FastForward className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;