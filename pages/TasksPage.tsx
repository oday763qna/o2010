
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Task, Category, Priority, SubTask } from '../types';
import { breakdownTask } from '../services/geminiService';
import { 
  Plus, 
  Search, 
  Sparkles,
  X,
  AlertCircle,
  Timer,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Trash2,
  Target
} from 'lucide-react';

const TaskDetailsModal: React.FC<{ task: Task; onClose: () => void }> = ({ task, onClose }) => {
  const { state, dispatch } = useApp();
  const [edited, setEdited] = useState<Task>(task);
  const [loadingAI, setLoadingAI] = useState(false);
  const isLight = state.theme === 'light';

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'UPDATE_TASK', payload: edited });
    }, 600);
    return () => clearTimeout(timer);
  }, [edited]);

  const handleAISuggest = async () => {
    if (!edited.title || !state.aiEnabled) return;
    setLoadingAI(true);
    try {
      const result = await breakdownTask(edited.title, edited.description);
      const subs: SubTask[] = result.subtasks.map((s: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: s.title,
        isCompleted: false
      }));
      setEdited(prev => ({ 
        ...prev, 
        subTasks: [...prev.subTasks, ...subs], 
        pomodoroConfig: result.recommendedPomodoro || prev.pomodoroConfig 
      }));
    } catch (e) { 
      console.error("AI Breakdown Error:", e); 
    } finally { 
      setLoadingAI(false); 
    }
  };

  const inputStyle = `w-full p-4 rounded-2xl border outline-none font-bold text-sm transition-all shadow-sm ${isLight ? 'bg-slate-50 border-slate-200 text-[#222222] focus:border-[#007AFF]' : 'bg-white/5 border-white/5 text-[#eeeeee] focus:border-[#3b82f6]'}`;

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col slide-up ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}>
      <header className="p-6 border-b border-white/10 flex items-center justify-between pt-safe backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl glass shadow-sm"><ChevronLeft className="w-6 h-6 rotate-180 app-text-primary" /></button>
          <h2 className="text-xl font-black app-text-primary">تفاصيل المهمة</h2>
        </div>
        <button onClick={() => { if(confirm('حذف هذه المهمة نهائياً؟')) { dispatch({ type: 'DELETE_TASK', payload: task.id }); onClose(); } }} className="text-rose-600 font-black text-sm flex items-center gap-2 hover:opacity-80 transition-opacity"><Trash2 className="w-4 h-4" /> حذف</button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest mr-1 opacity-70">عنوان المهمة</label>
          <input type="text" value={edited.title} onChange={e => setEdited({...edited, title: e.target.value})} className={inputStyle} />
        </div>
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest mr-1 opacity-70">وصف المهمة</label>
          <textarea value={edited.description} onChange={e => setEdited({...edited, description: e.target.value})} className={`${inputStyle} h-40 resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest mr-1 opacity-70">الأولوية</label>
            <select value={edited.priority} onChange={e => setEdited({...edited, priority: e.target.value as any})} className={inputStyle}>
              <option value="منخفضة">منخفضة</option><option value="متوسطة">متوسطة</option><option value="عالية">عالية</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest mr-1 opacity-70">التصنيف</label>
            <select value={edited.category} onChange={e => setEdited({...edited, category: e.target.value as any})} className={inputStyle}>
              <option value="عمل">عمل</option><option value="دراسة">دراسة</option><option value="ترفيه">ترفيه</option><option value="أخرى">أخرى</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase app-text-accent tracking-widest mr-1">الخطوات الفرعية</label>
            <button onClick={handleAISuggest} disabled={loadingAI} className="text-[10px] font-black flex items-center gap-2 bg-[#007AFF]/10 text-[#007AFF] px-4 py-2 rounded-xl border border-[#007AFF]/20 hover:bg-[#007AFF]/20 transition-all">
              <Sparkles className="w-3.5 h-3.5" /> {loadingAI ? 'جاري التحليل...' : 'تحليل Gemini الذكي'}
            </button>
          </div>
          <div className="space-y-4">
            {edited.subTasks.length === 0 && <p className="text-center text-[11px] font-bold app-text-secondary opacity-40 py-6 border-2 border-dashed border-slate-500/10 rounded-3xl">لا توجد خطوات فرعية حالياً. استخدم التحليل الذكي للبدء.</p>}
            {edited.subTasks.map(st => (
              <div key={st.id} className="flex items-center gap-4 p-5 rounded-3xl glass shadow-sm border-white/5 group">
                <button 
                  onClick={() => setEdited({...edited, subTasks: edited.subTasks.map(s => s.id === st.id ? {...s, isCompleted: !s.isCompleted} : s)})}
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm ${st.isCompleted ? 'bg-[#007AFF] border-[#007AFF]' : 'border-slate-400 hover:border-[#007AFF]'}`}
                >
                  {st.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
                <span className={`text-sm font-bold flex-1 tracking-tight ${st.isCompleted ? 'line-through opacity-40 app-text-secondary' : 'app-text-primary'}`}>{st.title}</span>
                <button onClick={() => setEdited({...edited, subTasks: edited.subTasks.filter(s => s.id !== st.id)})} className="text-rose-500/30 hover:text-rose-600 transition-colors active:scale-90"><X className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 pb-safe backdrop-blur-md">
        <button onClick={onClose} className="w-full py-5 bg-[#007AFF] text-white font-black rounded-[1.8rem] shadow-2xl shadow-[#007AFF]/30 active:scale-95 transition-all text-lg">إغلاق وحفظ التغييرات</button>
      </div>
    </div>
  );
};

const TasksPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', description: '', priority: 'متوسطة', category: 'عمل' });
  const [errors, setErrors] = useState<{title?: boolean, description?: boolean}>({});

  const isLight = state.theme === 'light';

  const filteredTasks = state.tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.includes(searchTerm) || 
    t.priority.includes(searchTerm)
  );

  const handleCreate = () => {
    const newErrors: {title?: boolean, description?: boolean} = {};
    if (!newTask.title?.trim()) newErrors.title = true;
    if (!newTask.description?.trim()) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title!,
      description: newTask.description!,
      priority: (newTask.priority || 'متوسطة') as Priority,
      category: (newTask.category || 'عمل') as Category,
      status: 'قيد الانتظار',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedDuration: 30,
      pomodoroConfig: 25,
      notes: '',
      subTasks: [],
      youtubeLinks: [],
      externalLinks: [],
      attachments: [],
      completionPercentage: 0,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    setIsAddOpen(false);
    setNewTask({ title: '', description: '', priority: 'متوسطة', category: 'عمل' });
    setErrors({});
  };

  const inputClass = (err?: boolean) => `w-full p-5 rounded-[1.8rem] border outline-none font-bold text-sm transition-all shadow-sm ${err ? 'border-rose-500 bg-rose-500/5' : (isLight ? 'bg-white border-slate-200 text-[#222222] focus:border-[#007AFF]' : 'bg-white/5 border-white/5 text-[#eeeeee] focus:border-[#3b82f6]')}`;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-safe">
        <h2 className="text-3xl font-black app-text-primary tracking-tight">إدارة المهام</h2>
        <button onClick={() => setIsAddOpen(true)} className="w-12 h-12 bg-[#007AFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/20 active:scale-90 hover:bg-[#0066EE] transition-all"><Plus className="w-7 h-7" /></button>
      </header>

      {/* البحث الفوري */}
      <div className="relative group">
        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 app-text-secondary opacity-40 group-focus-within:opacity-80 transition-opacity" />
        <input 
          type="text" 
          placeholder="ابحث بالاسم، التصنيف، أو مستوى الأولوية..." 
          className={`w-full py-5 pr-14 pl-6 rounded-[2.2rem] border outline-none font-bold text-sm transition-all shadow-sm ${isLight ? 'bg-white border-slate-200 text-[#222222] placeholder-slate-400 focus:border-[#007AFF]' : 'bg-white/5 border-white/5 text-[#eeeeee] placeholder-slate-600 focus:border-[#3b82f6]'}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-600 active:scale-90 transition-transform"><X className="w-5 h-5" /></button>}
      </div>

      <div className="space-y-5">
        {filteredTasks.length === 0 ? (
          <div className="py-28 text-center opacity-40 flex flex-col items-center justify-center">
            <Target className="w-20 h-20 mb-6 app-text-primary" />
            <p className="font-black text-lg tracking-tight app-text-primary">لا توجد مهام حالياً</p>
            <p className="text-[11px] font-bold mt-2 app-text-secondary">اضغط على زر (+) لتبدأ رحلة إنجازاتك.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} onClick={() => setSelectedTask(task)} className="p-7 rounded-[2.8rem] glass relative overflow-hidden active:scale-[0.98] transition-all group hover:bg-white/10 shadow-sm border-white/5">
              <div className="flex items-start justify-between mb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider shadow-sm ${task.priority === 'عالية' ? 'bg-rose-600/15 text-rose-600' : task.priority === 'متوسطة' ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-slate-500/15 app-text-secondary'}`}>{task.priority}</span>
                    <span className="text-[8px] font-black uppercase px-3 py-1.5 rounded-full bg-slate-500/10 app-text-secondary tracking-wider shadow-sm">{task.category}</span>
                  </div>
                  <h4 className={`text-xl font-black tracking-tight ${task.status === 'مكتملة' ? 'line-through opacity-30' : 'app-text-primary'}`}>{task.title}</h4>
                </div>
                <button onClick={(e) => { 
                  e.stopPropagation(); 
                  const isCompleting = task.status !== 'مكتملة';
                  const xpGain = task.priority === 'عالية' ? 75 : task.priority === 'متوسطة' ? 60 : 40;

                  dispatch({ 
                    type: 'UPDATE_TASK', 
                    payload: { ...task, status: isCompleting ? 'مكتملة' : 'قيد الانتظار', completionPercentage: isCompleting ? 100 : 0 } 
                  }); 
                  if(isCompleting) {
                    dispatch({ type: 'UPDATE_USER', payload: { completedTasks: state.user.completedTasks + 1, xp: state.user.xp + xpGain } });
                  } else {
                    dispatch({ type: 'UPDATE_USER', payload: { completedTasks: Math.max(0, state.user.completedTasks - 1), xp: Math.max(0, state.user.xp - xpGain) } });
                  }
                }} className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all shadow-sm ${task.status === 'مكتملة' ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 active:border-[#007AFF] hover:border-[#007AFF]'}`}>
                  {task.status === 'مكتملة' && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              </div>
              <div className="flex items-center gap-6 text-[11px] font-black app-text-secondary opacity-70">
                <div className="flex items-center gap-2"><Timer className="w-4 h-4" /> {task.pomodoroConfig} دقيقة</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(task.dueDate).toLocaleDateString('ar-SA')}</div>
                {task.subTasks.length > 0 && (
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                     {task.subTasks.filter(s => s.isCompleted).length}/{task.subTasks.length} خطوات
                   </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {/* نافذة إضافة المهمة مع التحقق من الحقول الإجبارية */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[3000] bg-black/65 backdrop-blur-lg flex items-end slide-up">
          <div className={`w-full p-8 space-y-8 rounded-t-[3.5rem] border-t pb-safe max-h-[92vh] overflow-y-auto ${isLight ? 'bg-white border-slate-200' : 'bg-[#020617] border-white/10'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black app-text-primary tracking-tight">إضافة هدف جديد</h3>
              <button onClick={() => { setIsAddOpen(false); setErrors({}); }} className="w-11 h-11 rounded-full glass flex items-center justify-center active:scale-90 transition-transform shadow-sm"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest opacity-70">اسم المهمة *</label>
                  {errors.title && <span className="text-rose-600 text-[10px] font-bold">هذا الحقل مطلوب</span>}
                </div>
                <input type="text" placeholder="ما الذي تنوي إنجازه؟" value={newTask.title} onChange={e => { setNewTask({...newTask, title: e.target.value}); setErrors(prev => ({...prev, title: false})); }} className={inputClass(errors.title)} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest opacity-70">وصف المهمة *</label>
                  {errors.description && <span className="text-rose-600 text-[10px] font-bold">هذا الحقل مطلوب</span>}
                </div>
                <textarea placeholder="أضف تفاصيل إضافية هنا..." value={newTask.description} onChange={e => { setNewTask({...newTask, description: e.target.value}); setErrors(prev => ({...prev, description: false})); }} className={`${inputClass(errors.description)} h-28 resize-none`} />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest px-1 opacity-70">مستوى الأولوية</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className={inputClass()}>
                    <option value="منخفضة">منخفضة</option><option value="متوسطة">متوسطة</option><option value="عالية">عالية</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase app-text-secondary tracking-widest px-1 opacity-70">تصنيف المهمة</label>
                  <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value as any})} className={inputClass()}>
                    <option value="عمل">عمل</option><option value="دراسة">دراسة</option><option value="ترفيه">ترفيه</option><option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleCreate} className="w-full py-6 bg-[#007AFF] text-white font-black rounded-[2rem] shadow-2xl shadow-[#007AFF]/30 active:scale-95 transition-all text-lg hover:bg-[#0066EE]">تأكيد وإنشاء المهمة</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
