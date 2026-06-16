import { useState } from 'react';
import { Bell, Search, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transaksi',
  budget: 'Budget',
  reports: 'Laporan',
  settings: 'Pengaturan',
};

interface TopbarProps {
  onAddTransaction?: () => void;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

export function Topbar({ onAddTransaction, searchValue, onSearchChange }: TopbarProps) {
  const { currentPage, setCurrentPage, currentUser } = useApp();
  const isMobile = useIsMobile();
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const title = PAGE_TITLES[currentPage] || 'Dashboard';
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const notifications = [
    { id: 1, text: 'Budget Makanan sudah 85% terpakai', time: '2 jam lalu', emoji: '⚠️' },
    { id: 2, text: 'Transaksi baru: Gaji bulan ini', time: '1 hari lalu', emoji: '✅' },
    { id: 3, text: 'Laporan bulanan siap diunduh', time: '3 hari lalu', emoji: '📊' },
  ];

  if (isMobile) {
    return (
      <header style={{
        height: 60, background: 'white', borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', padding: '0 16px',
        gap: 12, position: 'sticky', top: 0, zIndex: 40,
      }}>
        {showMobileSearch && onSearchChange ? (
          // Mobile search mode
          <>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input autoFocus type="text" placeholder="Cari transaksi..." value={searchValue || ''}
                onChange={e => onSearchChange(e.target.value)}
                style={{ width: '100%', padding: '8px 36px', border: '1.5px solid #2563EB', borderRadius: 10, fontSize: 14, color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
              {searchValue && (
                <button onClick={() => onSearchChange('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => { setShowMobileSearch(false); onSearchChange?.(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Batal
            </button>
          </>
        ) : (
          // Normal mobile topbar
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
            </div>

            {/* Search icon (transactions page only) */}
            {onSearchChange && (
              <button onClick={() => setShowMobileSearch(true)}
                style={{ width: 36, height: 36, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                <Search size={17} />
              </button>
            )}

            {/* Add button */}
            {onAddTransaction && (
              <button onClick={onAddTransaction}
                style={{ width: 36, height: 36, background: '#2563EB', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Plus size={18} />
              </button>
            )}

            {/* Notification bell */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotif(!showNotif)}
                style={{ position: 'relative', width: 36, height: 36, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                <Bell size={17} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
              </button>
              {showNotif && (
                <>
                  <div onClick={() => setShowNotif(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                  <div style={{ position: 'absolute', top: 44, right: 0, width: 280, background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Notifikasi</div>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: '10px 14px', display: 'flex', gap: 10, borderBottom: '1px solid #F8FAFC', fontSize: 12, color: '#374151' }}>
                        <span>{n.emoji}</span>
                        <div>
                          <div>{n.text}</div>
                          <div style={{ color: '#94A3B8', marginTop: 2, fontSize: 11 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Avatar */}
            <button onClick={() => setCurrentPage('settings')}
              style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              {initials}
            </button>
          </>
        )}
      </header>
    );
  }

  // Desktop topbar
  return (
    <header style={{
      height: 72, background: 'white', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', padding: '0 28px',
      gap: 16, position: 'sticky', top: 0, zIndex: 9,
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{title}</h1>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>{today}</div>
      </div>

      {onSearchChange && (
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input type="text" placeholder="Cari transaksi..." value={searchValue || ''} onChange={e => onSearchChange(e.target.value)}
            style={{ width: '100%', padding: '9px 36px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: '#0F172A', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; }}
          />
          {searchValue && (
            <button onClick={() => onSearchChange('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {onAddTransaction && (
        <button onClick={onAddTransaction}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <Plus size={15} /> Tambah
        </button>
      )}

      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowNotif(!showNotif)}
          style={{ position: 'relative', width: 40, height: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
        </button>
        {showNotif && (
          <>
            <div onClick={() => setShowNotif(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{ position: 'absolute', top: 48, right: 0, width: 320, background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Notifikasi</span>
                <span style={{ fontSize: 11, background: '#EF4444', color: 'white', borderRadius: 10, padding: '2px 7px', fontWeight: 600 }}>3</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '12px 16px', display: 'flex', gap: 12, borderBottom: '1px solid #F8FAFC', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{n.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={() => setCurrentPage('settings')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10 }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
          {initials}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{currentUser?.name?.split(' ')[0]}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Profil</div>
        </div>
      </button>
    </header>
  );
}
