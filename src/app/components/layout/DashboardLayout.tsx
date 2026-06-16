import { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2, Settings,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Dashboard } from '../dashboard/Dashboard';
import { Transactions } from '../transactions/Transactions';
import { Budget } from '../budget/Budget';
import { Reports } from '../reports/Reports';
import { Settings as SettingsPage } from '../settings/Settings';
import { TransactionModal } from '../transactions/TransactionModal';
import { useApp } from '../../context/AppContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { id: 'budget', label: 'Budget', icon: Target },
  { id: 'reports', label: 'Laporan', icon: BarChart2 },
  { id: 'settings', label: 'Profil', icon: Settings },
];

function BottomNav() {
  const { currentPage, setCurrentPage } = useApp();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'white', borderTop: '1px solid #E2E8F0',
      display: 'flex', paddingBottom: 'env(safe-area-inset-bottom, 4px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button key={item.id} onClick={() => setCurrentPage(item.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, padding: '10px 4px 8px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: isActive ? '#2563EB' : '#94A3B8', transition: 'color 0.15s',
            }}>
            <div style={{
              width: 36, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 10, background: isActive ? '#EFF6FF' : 'transparent',
              transition: 'background 0.15s',
            }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function DashboardLayout() {
  const { currentPage, setCurrentPage } = useApp();
  const isMobile = useIsMobile();
  const [addTxOpen, setAddTxOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <Topbar onAddTransaction={() => setAddTxOpen(true)} />
            <Dashboard onNavigate={setCurrentPage} />
          </>
        );
      case 'transactions':
        return <Transactions />;
      case 'budget':
        return <Budget />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <>
            <Topbar onAddTransaction={() => setAddTxOpen(true)} />
            <Dashboard onNavigate={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar — desktop only */}
      {!isMobile && <Sidebar />}

      {/* Main content */}
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
        paddingBottom: isMobile ? 72 : 0,
      }}>
        {renderPage()}
      </div>

      {/* Bottom nav — mobile only */}
      {isMobile && <BottomNav />}

      <TransactionModal open={addTxOpen} onClose={() => setAddTxOpen(false)} />
    </div>
  );
}
