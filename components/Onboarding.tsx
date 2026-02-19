import React, { useState } from 'react';
import { useApp } from '../store';
import { Sparkles, Target, Zap, Rocket, ChevronLeft } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);

  // Forced light theme styles for Onboarding (Morning Welcome)
  const bg = "bg-[#f8fafc]";
  const textPrimary = "text-[#222222]";
  const textSecondary = "text-[#555555]";
  const accent = "text-[#007AFF]";
  const btnBg = "bg-[#007AFF]";

  return (
    <div className={`fixed inset-0 z-[5000] ${bg} flex flex-col items-center justify-center p-10 overflow-hidden`} dir="rtl">
      {/* Visual Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-16 relative text-center">
        {step === 1 ? (
          <div className="space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="w-32 h-32 bg-[#007AFF] rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#007AFF]/20">
              <Rocket className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className={`text-5xl font-black ${textPrimary} tracking-tight`}>مهام OD</h1>
              <p className={`${textSecondary} text-lg font-medium leading-relaxed`}>مرحبا بك في مستقبلك المنظم. مساعدك الذكي بانتظارك لزيادة إنتاجيتك.</p>
            </div>
            <div className="space-y-4">
               <button onClick={() => setStep(2)} className={`w-full py-6 ${btnBg} text-white font-black rounded-[2rem] text-xl shadow-xl shadow-[#007AFF]/20 transition-all active:scale-95`}>
                 ابدأ الرحلة
               </button>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">نظام إنتاجية الجيل القادم</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-left-8 duration-700">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
              <h2 className={`text-2xl font-black ${textPrimary}`}>بماذا نتميز؟</h2>
              <div className="w-10 h-10" />
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Sparkles, label: "ذكاء Gemini 3.0", desc: "تحليل تلقائي للمهام وتقسيمها بذكاء." },
                { icon: Target, label: "أهداف استراتيجية", desc: "ركز على ما يهم حقاً وحقق نتائج ملموسة." },
                { icon: Zap, label: "نظام التطور", desc: "اجمع النقاط وارتقِ بمستواك مع كل إنجاز." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] flex items-center gap-6 text-right shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <div className="w-16 h-16 bg-[#007AFF]/5 rounded-[1.5rem] flex items-center justify-center text-[#007AFF]">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className={`font-black text-lg ${textPrimary}`}>{item.label}</h4>
                    <p className={`text-xs ${textSecondary} font-bold leading-relaxed`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => dispatch({ type: 'COMPLETE_ONBOARDING' })} 
              className={`w-full py-6 ${btnBg} text-white font-black rounded-[2rem] text-xl shadow-xl shadow-[#007AFF]/20 transition-all active:scale-95`}
            >
              تفعيل النظام
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;