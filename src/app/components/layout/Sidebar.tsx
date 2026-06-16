import { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2,
  Settings, LogOut, Wallet, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { id: 'budget', label: 'Budget', icon: Target },
  { id: 'reports', label: 'Laporan', icon: BarChart2 },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, logout, currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10, borderBottom: '1px solid #F1F5F9', minHeight: 72,
      }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Wallet size={20} color="white" />
        </div>
        {!collapsed && (
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>FinTrack</span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', top: 22, right: -12, width: 24, height: 24,
          background: 'white', border: '1px solid #E2E8F0', borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94A3B8', zIndex: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#2563EB' : '#64748B',
                transition: 'all 0.15s', width: '100%', textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.color = '#0F172A';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#2563EB' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #F1F5F9' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, borderRadius: 10, background: '#F8FAFC' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Keluar' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#EF4444', width: '100%',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
