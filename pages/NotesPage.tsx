import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Note } from '../types';
import { Plus, Search, Brain, ChevronLeft, X } from 'lucide-react';

const NotesPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isLight = state.theme === 'light';

  useEffect(() => {
    if (activeNote) {
      const timer = setTimeout(() => { dispatch({ type: 'UPDATE_NOTE', payload: activeNote }); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeNote]);

  const createNote = () => {
    const newNote: Note = { id: Math.random().toString(36).substr(2, 9), title: 'ملاحظة جديدة', content: '', folder: 'الرئيسية', updatedAt: new Date().toISOString(), attachments: [] };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setActiveNote(newNote);
  };

  if (activeNote) {
    return (
      <div className={`fixed inset-0 z-[1000] flex flex-col slide-up ${isLight ? 'bg-white' : 'bg-[#050505]'}`}>
        <header className="p-6 border-b border-white/5 flex items-center justify-between pt-safe">
          <button onClick={() => setActiveNote(null)} className="w-10 h-10 flex items-center justify-center rounded-xl glass tap-target"><ChevronLeft className="w-6 h-6 rotate-180 app-text-primary" /></button>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-black app-text-secondary uppercase">مزامنة نشطة</span></div>
        </header>
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <input type="text" value={activeNote.title} onChange={e => setActiveNote({...activeNote, title: e.target.value})} className="bg-transparent text-3xl font-black outline-none w-full text-[#007AFF] placeholder-[#007AFF]/30" placeholder="عنوان الملاحظة" />
          <textarea className="w-full h-[60vh] bg-transparent outline-none resize-none text-lg app-text-primary leading-relaxed font-medium placeholder-slate-700" placeholder="ابدأ التدوين هنا..." value={activeNote.content} onChange={e => setActiveNote({...activeNote, content: e.target.value})} />
        </div>
      </div>
    );
  }

  const filteredNotes = state.notes.filter(n => n.title.includes(searchTerm) || n.content.includes(searchTerm));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between pt-safe">
        <h2 className="text-3xl font-black app-text-primary">المعرفة</h2>
        <button onClick={createNote} className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><Plus className="w-6 h-6 text-white" /></button>
      </header>
      <div className="relative">
        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 app-text-secondary" />
        <input type="text" placeholder="ابحث في أفكارك..." className="w-full py-5 pr-14 pl-6 rounded-[2rem] glass outline-none font-bold text-sm app-text-primary placeholder-slate-600" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute left-6 top-1/2 -translate-y-1/2 app-text-secondary"><X className="w-4 h-4" /></button>}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="py-20 text-center opacity-20"><Brain className="w-16 h-16 app-text-primary mx-auto mb-4" /><p className="font-black text-sm app-text-primary">لا توجد ملاحظات مطابقة</p></div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} onClick={() => setActiveNote(note)} className="p-6 rounded-[2.5rem] glass active:scale-[0.98] transition-all">
              <h4 className="text-xl font-black mb-2 app-text-primary">{note.title || 'بدون عنوان'}</h4>
              <p className="text-sm app-text-secondary line-clamp-2 font-medium mb-4">{note.content || "لا يوجد محتوى..."}</p>
              <div className="flex justify-between items-center opacity-40"><span className="text-[9px] font-black app-text-secondary">{new Date(note.updatedAt).toLocaleDateString('ar-SA')}</span><Brain className="w-4 h-4 app-text-primary" /></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPage;