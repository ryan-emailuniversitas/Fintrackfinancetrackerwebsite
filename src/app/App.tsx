import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Wallet } from 'lucide-react';

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', gap: 16 }}>
      <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wallet size={28} color="white" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>FinTrack</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: '#2563EB',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}

type AppView = 'landing' | 'login' | 'register';

function AppInner() {
  const { currentUser, isInitializing } = useApp();
  const [view, setView] = useState<AppView>('landing');

  if (isInitializing) return <LoadingScreen />;
  if (currentUser) return <DashboardLayout />;

  if (view === 'login' || view === 'register') {
    return <AuthPage onBack={() => setView('landing')} defaultTab={view === 'register' ? 'register' : 'login'} />;
  }

  return <LandingPage onGetStarted={() => setView('register')} onLogin={() => setView('login')} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
