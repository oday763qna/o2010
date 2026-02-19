import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import TopHeader from './components/TopHeader';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import NotesPage from './pages/NotesPage';
import FocusMode from './pages/FocusMode';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import Onboarding from './components/Onboarding';

const AppContent: React.FC = () => {
  const { state, isOnline } = useApp();

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    const root = document.documentElement;
    if (state.theme === 'light') {
      root.classList.remove('dark-theme');
      root.classList.add('light-theme');
      document.body.style.backgroundColor = '#f8fafc';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8fafc');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark-theme');
      document.body.style.backgroundColor = '#020617';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#020617');
    }
  }, [state.theme]);

  if (!state.onboarded) return <Onboarding />;
  if (state.isFocusMode) return <FocusMode />;

  return (
    <div className="flex flex-col min-h-screen transition-all duration-500">
      <Sidebar />
      <TopHeader />
      
      <main className="flex-1 p-5 md:p-10 pb-28 pt-20 lg:pt-10 overflow-y-auto">
        {!isOnline && (
          <div className="mb-6 px-4 py-3 border rounded-2xl flex items-center justify-between text-xs font-bold bg-red-500/10 border-red-500/20 text-red-500">
            <span>وضع العمل دون اتصال نشط</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;