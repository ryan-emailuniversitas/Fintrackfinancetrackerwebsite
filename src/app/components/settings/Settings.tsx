import { useState } from 'react';
import { User, Lock, Save, LogOut, Eye, EyeOff, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useApp, formatRupiah, getThisMonthTotals } from '../../context/AppContext';
import { Topbar } from '../layout/Topbar';
import { useIsMobile } from '../../hooks/useIsMobile';

export function Settings() {
  const { currentUser, updateUser, updatePassword, logout, transactions, budgets } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passResult, setPassResult] = useState<{ success?: boolean; error?: string } | null>(null);

  const { income, expense } = getThisMonthTotals(transactions);
  const totalBalance = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileSaving(true);
    await updateUser({ name: name.trim() });
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassResult(null);
    if (newPass.length < 6) { setPassResult({ error: 'Password baru minimal 6 karakter' }); return; }
    if (newPass !== confirmPass) { setPassResult({ error: 'Konfirmasi password tidak cocok' }); return; }
    setPassSaving(true);
    const result = await updatePassword(currentPass, newPass);
    setPassSaving(false);
    if (result.success) {
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
      setPassResult({ success: true });
      setTimeout(() => setPassResult(null), 3000);
    } else {
      setPassResult({ error: result.error });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
    borderRadius: 10, fontSize: 14, color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
  const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const isMobile = useIsMobile();

  return (
    <>
      <Topbar />
      <div style={{ padding: isMobile ? '16px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 800 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{currentUser?.name}</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{currentUser?.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Shield size={12} color="#16A34A" />
                    <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>Supabase Auth — Data tersimpan di cloud</span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={16} color="#2563EB" /> Informasi Profil
                </h3>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Nama Lengkap</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={currentUser?.email || ''} disabled style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8', cursor: 'not-allowed' }} />
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94A3B8' }}>Email tidak dapat diubah setelah pendaftaran.</p>
                  </div>
                  <button type="submit" disabled={profileSaving}
                    style={{ padding: '11px 20px', background: profileSaved ? '#16A34A' : '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: profileSaving ? 'wait' : 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'flex-start', transition: 'background 0.2s' }}>
                    {profileSaving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : profileSaved ? <CheckCircle size={15} /> : <Save size={15} />}
                    {profileSaving ? 'Menyimpan...' : profileSaved ? 'Tersimpan!' : 'Simpan Profil'}
                  </button>
                </form>
              </div>
            </div>

            {/* Password */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={16} color="#2563EB" /> Ubah Password
              </h3>
              {passResult?.error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#DC2626' }}>⚠️ {passResult.error}</div>
              )}
              {passResult?.success && (
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={14} /> Password berhasil diubah!
                </div>
              )}
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Password Saat Ini</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                      placeholder="Masukkan password saat ini" style={{ ...inputStyle, paddingRight: 42 }}
                      onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Password Baru</label>
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Minimal 6 karakter" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                </div>
                <div>
                  <label style={labelStyle}>Konfirmasi Password Baru</label>
                  <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Ulangi password baru" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                </div>
                <button type="submit" disabled={passSaving || !currentPass || !newPass || !confirmPass}
                  style={{ padding: '11px 20px', background: !currentPass || !newPass || !confirmPass ? '#CBD5E1' : '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: !currentPass || !newPass || !confirmPass ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'flex-start' }}>
                  {passSaving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                  {passSaving ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </form>
            </div>

            {/* Logout */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #FCA5A5' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#DC2626' }}>⚠️ Zona Berbahaya</h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>Data Anda tersimpan aman di Supabase cloud. Keluar tidak akan menghapus data.</p>
              <button onClick={logout}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#DC2626' }}>
                <LogOut size={16} /> Keluar dari Akun
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Statistik Akun</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Total Saldo', value: formatRupiah(totalBalance), color: '#2563EB', bg: '#EFF6FF', icon: '💰' },
                  { label: 'Pemasukan Bulan Ini', value: formatRupiah(income), color: '#16A34A', bg: '#F0FDF4', icon: '📈' },
                  { label: 'Pengeluaran Bulan Ini', value: formatRupiah(expense), color: '#DC2626', bg: '#FEF2F2', icon: '📉' },
                  { label: 'Total Transaksi', value: `${transactions.length} transaksi`, color: '#7C3AED', bg: '#F5F3FF', icon: '📊' },
                  { label: 'Budget Aktif', value: `${budgets.length} kategori`, color: '#D97706', bg: '#FFFBEB', icon: '🎯' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: s.bg, borderRadius: 12 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#EFF6FF', borderRadius: 16, padding: 20, border: '1px solid #BFDBFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Shield size={18} color="#2563EB" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF' }}>Powered by Supabase</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#1E40AF' }}>
                <div>✅ Auth JWT — login aman</div>
                <div>✅ PostgreSQL — data permanen</div>
                <div>✅ Row Level Security</div>
                <div>✅ Multi-device sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
