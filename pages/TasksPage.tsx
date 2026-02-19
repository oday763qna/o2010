
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
    }, 500);
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
      setEdited(prev => ({ ...prev, subTasks: [...prev.subTasks, ...subs], pomodoroConfig: result.recommendedPomodoro || prev.pomodoroConfig }));
    } catch (e) { console.error(e); } finally { setLoadingAI(false); }
  };

  const inputStyle = `w-full p-4 rounded-2xl border outline-none font-bold text-sm transition-all ${isLight ? 'bg-slate-50 border-slate-100 text-slate-900 focus:border-[#007AFF]' : 'bg-white/5 border-white/5 text-white focus:border-[#1E90FF]'}`;

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col slide-up ${isLight ? 'bg-white' : 'bg-[#020617]'}`}>
      <header className="p-6 border-b border-white/5 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl glass"><ChevronLeft className="w-6 h-6 rotate-180 app-text-primary" /></button>
          <h2 className="text-xl font-black app-text-primary">تفاصيل المهمة</h2>
        </div>
        <button onClick={() => { dispatch({ type: 'DELETE_TASK', payload: task.id }); onClose(); }} className="text-rose-500 font-black text-sm flex items-center gap-1"><Trash2 className="w-4 h-4" /> حذف</button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase app-text-secondary tracking-widest mr-2">العنوان</label>
          <input type="text" value={edited.title} onChange={e => setEdited({...edited, title: e.target.value})} className={inputStyle} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase app-text-secondary tracking-widest mr-2">الوصف</label>
          <textarea value={edited.description} onChange={e => setEdited({...edited, description: e.target.value})} className={`${inputStyle} h-32 resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase app-text-secondary tracking-widest mr-2">الأولوية</label>
            <select value={edited.priority} onChange={e => setEdited({...edited, priority: e.target.value as any})} className={inputStyle}>
              <option value="منخفضة">منخفضة</option><option value="متوسطة">متوسطة</option><option value="عالية">عالية</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase app-text-secondary tracking-widest mr-2">التصنيف</label>
            <select value={edited.category} onChange={e => setEdited({...edited, category: e.target.value as any})} className={inputStyle}>
              <option value="عمل">عمل</option><option value="دراسة">دراسة</option><option value="ترفيه">ترفيه</option><option value="أخرى">أخرى</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase app-text-accent tracking-widest mr-2">المهام الفرعية</label>
            <button onClick={handleAISuggest} disabled={loadingAI} className="text-[10px] font-black flex items-center gap-1 bg-[#007AFF]/10 text-[#007AFF] px-3 py-1.5 rounded-lg border border-[#007AFF]/20">
              <Sparkles className="w-3 h-3" /> {loadingAI ? 'جاري التقسيم...' : 'تقسيم ذكي'}
            </button>
          </div>
          <div className="space-y-3">
            {edited.subTasks.map(st => (
              <div key={st.id} className="flex items-center gap-4 p-4 rounded-2xl glass">
                <button 
                  onClick={() => setEdited({...edited, subTasks: edited.subTasks.map(s => s.id === st.id ? {...s, isCompleted: !s.isCompleted} : s)})}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${st.isCompleted ? 'bg-[#007AFF] border-[#007AFF]' : 'border-slate-400'}`}
                >
                  {st.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
                <span className={`text-sm font-bold ${st.isCompleted ? 'line-through opacity-40 app-text-secondary' : 'app-text-primary'}`}>{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 pb-safe">
        <button onClick={onClose} className="w-full py-5 bg-[#007AFF] text-white font-black rounded-[1.5rem] shadow-xl shadow-[#007AFF]/20 active:scale-95 transition-all">حفظ العودة</button>
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
  const [error, setError] = useState(false);

  const isLight = state.theme === 'light';

  const filteredTasks = state.tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.includes(searchTerm) || 
    t.priority.includes(searchTerm)
  );

  const handleCreate = () => {
    if (!newTask.title?.trim() || !newTask.description?.trim()) {
      setError(true);
      return;
    }
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title!,
      description: newTask.description!,
      priority: newTask.priority as Priority,
      category: newTask.category as Category,
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
    setError(false);
  };

  const inputClass = (err?: boolean) => `w-full p-5 rounded-[1.5rem] border outline-none font-bold text-sm transition-all ${err ? 'border-rose-500 bg-rose-50/10' : (isLight ? 'bg-slate-50 border-slate-100 text-slate-900 focus:border-[#007AFF]' : 'bg-white/5 border-white/5 text-white focus:border-[#1E90FF]')}`;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-safe">
        <h2 className="text-3xl font-black app-text-primary">المهام</h2>
        <button onClick={() => setIsAddOpen(true)} className="w-12 h-12 bg-[#007AFF] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><Plus className="w-6 h-6" /></button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 app-text-secondary opacity-50" />
        <input 
          type="text" 
          placeholder="ابحث بالاسم، التصنيف، أو الأولوية..." 
          className={`w-full py-5 pr-14 pl-6 rounded-[2rem] border outline-none font-bold text-sm transition-all ${isLight ? 'bg-white border-slate-100 shadow-sm text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/5 text-white placeholder-slate-600'}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500"><X className="w-4 h-4" /></button>}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
            {/* Added Target icon here */}
            <Target className="w-20 h-20 mb-4 app-text-primary" />
            <p className="font-black text-sm">لا توجد مهام حالياً</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} onClick={() => setSelectedTask(task)} className="p-6 rounded-[2.5rem] glass relative overflow-hidden active:scale-[0.98] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${task.priority === 'عالية' ? 'bg-rose-500/10 text-rose-500' : 'bg-[#007AFF]/10 text-[#007AFF]'}`}>{task.priority}</span>
                    <span className="text-[8px] font-black uppercase px-2 py-1 rounded-md bg-slate-500/10 app-text-secondary">{task.category}</span>
                  </div>
                  <h4 className={`text-xl font-black ${task.status === 'مكتملة' ? 'line-through opacity-40' : 'app-text-primary'}`}>{task.title}</h4>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: task.status === 'مكتملة' ? 'قيد الانتظار' : 'مكتملة', completionPercentage: task.status === 'مكتملة' ? 0 : 100 } }); if(task.status !== 'مكتملة') dispatch({ type: 'UPDATE_USER', payload: { completedTasks: state.user.completedTasks + 1, xp: state.user.xp + 50 } }) }} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === 'مكتملة' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {task.status === 'مكتملة' && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black app-text-secondary">
                <div className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> {task.pomodoroConfig} د</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(task.dueDate).toLocaleDateString('ar-SA')}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-md flex items-end slide-up">
          <div className={`w-full p-8 space-y-8 rounded-t-[3rem] border-t pb-safe max-h-[90vh] overflow-y-auto ${isLight ? 'bg-white border-slate-100' : 'bg-[#020617] border-white/5'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black app-text-primary">إضافة مهمة</h3>
              <button onClick={() => setIsAddOpen(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase app-text-secondary mr-2">عنوان المهمة *</label>
                <input type="text" placeholder="مثال: مراجعة مشروع التخرج" value={newTask.title} onChange={e => { setNewTask({...newTask, title: e.target.value}); setError(false); }} className={inputClass(error && !newTask.title)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase app-text-secondary mr-2">وصف موجز *</label>
                <textarea placeholder="ما الذي تريد إنجازه؟" value={newTask.description} onChange={e => { setNewTask({...newTask, description: e.target.value}); setError(false); }} className={`${inputClass(error && !newTask.description)} h-24 resize-none`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase app-text-secondary mr-2">الأولوية</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className={inputClass()}>
                    <option value="منخفضة">منخفضة</option><option value="متوسطة">متوسطة</option><option value="عالية">عالية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase app-text-secondary mr-2">التصنيف</label>
                  <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value as any})} className={inputClass()}>
                    <option value="عمل">عمل</option><option value="دراسة">دراسة</option><option value="ترفيه">ترفيه</option><option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              {error && <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black"><AlertCircle className="w-3 h-3" /> يرجى ملء الحقول الإجبارية</div>}
            </div>

            <button onClick={handleCreate} className="w-full py-6 bg-[#007AFF] text-white font-black rounded-[2rem] shadow-2xl shadow-[#007AFF]/30 active:scale-95 transition-all text-lg">إنشاء المهمة الآن</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
