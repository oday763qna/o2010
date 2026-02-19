import React from 'react';
import { useApp } from '../store';
import { 
  Rocket, 
  ShieldCheck, 
  Mail, 
  PlusCircle, 
  Search, 
  Timer, 
  Sparkles, 
  SunMoon, 
  Lightbulb, 
  User, 
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const isLight = state.theme === 'light';

  const features = [
    {
      icon: PlusCircle,
      title: 'إنشاء المهام',
      desc: 'ببساطة اضغط على أيقونة (+). المهام تتطلب: العنوان، الوصف، الأولوية (عالية، متوسطة، منخفضة) وتصنيفاً واضحاً.',
      color: 'text-blue-500'
    },
    {
      icon: Search,
      title: 'البحث والفرز',
      desc: 'ابحث عن مهامك فورياً من شريط البحث. يمكنك الفرز حسب الاسم أو التصنيف أو الأولوية لتصل لمرادك بسرعة.',
      color: 'text-indigo-500'
    },
    {
      icon: Timer,
      title: 'مؤقت بومودورو',
      desc: 'استخدم وضع التركيز المخصص لكل مهمة. الجلسة الافتراضية 25 دقيقة تتبعها استراحة 5 دقائق لتعزيز كفاءتك.',
      color: 'text-rose-500'
    },
    {
      icon: Sparkles,
      title: 'اقتراحات Gemini AI',
      desc: 'دع الذكاء الاصطناعي يقسم مهامك الكبيرة إلى مهام فرعية صغيرة (Subtasks) ويحلل نمط إنتاجيتك الأسبوعي.',
      color: 'text-[#007AFF]'
    },
    {
      icon: SunMoon,
      title: 'الأنماط الصباحية والليلية',
      desc: 'خصص بيئة عملك. النمط الصباحي للإضاءة الطبيعية والنمط الليلي المظلم لتقليل إجهاد العين أثناء العمل المتأخر.',
      color: 'text-amber-500'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-2xl mx-auto" dir="rtl">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[100] px-6 pt-safe pb-3 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl glass flex items-center justify-center shadow-lg active:scale-90 transition-all border-white/10 pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 app-text-primary rotate-180" />
        </button>
        <h1 className="text-sm font-black app-text-primary pointer-events-none">دليل الاستخدام</h1>
        <div className="w-11" />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 pt-16">
        <div className="w-28 h-28 bg-[#007AFF] rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#007AFF]/30 animate-pulse-slow">
          <Rocket className="w-14 h-14 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-black app-text-primary tracking-tight">مهام OD</h2>
          <p className="text-[10px] app-text-secondary font-black uppercase tracking-[0.4em] opacity-50">إصدار الإنتاجية الذكية 2025</p>
        </div>
        <p className="text-base font-medium leading-relaxed app-text-secondary px-8">
          أداتك الاحترافية لتنظيم الفوضى وتحويلها إلى إنجازات يومية ملموسة باستخدام أحدث تقنيات Google Gemini.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-full p-6 rounded-[2.5rem] bg-[#007AFF] text-white flex items-center justify-between shadow-2xl shadow-[#007AFF]/30 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="font-black text-lg">ابدأ العمل الآن</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">المحور الرئيسي للنظام</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Features Detailed Guide */}
      <section className="space-y-6 px-4">
        <div className="flex items-center gap-3 mr-2">
          <div className="w-1.5 h-6 bg-[#007AFF] rounded-full" />
          <h2 className="text-2xl font-black app-text-primary">دليل الميزات</h2>
        </div>
        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="glass p-6 rounded-[2.5rem] flex items-start gap-6 border-white/5">
              <div className={`w-14 h-14 shrink-0 rounded-[1.5rem] flex items-center justify-center bg-white/5 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-lg app-text-primary">{feature.title}</h4>
                <p className="text-xs leading-relaxed app-text-secondary font-bold opacity-80">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productivity Tips */}
      <section className="px-4">
        <div className="p-8 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black app-text-primary">نصائح للإنتاجية</h3>
          </div>
          <ul className="space-y-5 relative z-10">
            {[
              "قسم مهامك الكبيرة دوماً باستخدام زر Gemini AI.",
              "استخدم تصنيف 'أخرى' للمهام العاجلة التي لا تتبع تخصصك.",
              "حافظ على تركيزك الكامل في وضع بومودورو للحصول على XP مضاعف.",
              "راجع إنجازاتك الأسبوعية في لوحة البيانات كل سبت."
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm font-bold app-text-secondary leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Developer & Support Contact */}
      <section className="px-4 pb-10">
        <div className="glass p-10 rounded-[3rem] space-y-10 text-center relative border-white/5">
          <div className="space-y-3">
            <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-6 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl">
               <User className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black app-text-primary">عدي قطقط</h3>
            <p className="text-[11px] font-black uppercase text-[#007AFF] tracking-widest bg-[#007AFF]/10 px-4 py-1.5 rounded-full inline-block">مطور أنظمة ومصمم تجربة مستخدم</p>
          </div>

          <div className="space-y-4">
            <a 
              href="mailto:oday5qutqut@gmail.com" 
              className="w-full p-6 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center gap-4 font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              <Mail className="w-6 h-6" />
              تواصل معنا للدعم
            </a>
            
            <div className="flex items-center justify-center gap-6 pt-4 opacity-40">
               <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5 app-text-primary" />
                  <span className="text-[8px] font-black uppercase tracking-tighter app-text-secondary">أمان كامل</span>
               </div>
               <div className="w-px h-8 bg-slate-500/20" />
               <div className="flex flex-col items-center gap-1">
                  <ExternalLink className="w-5 h-5 app-text-primary" />
                  <span className="text-[8px] font-black uppercase tracking-tighter app-text-secondary">V4.0 2025</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;