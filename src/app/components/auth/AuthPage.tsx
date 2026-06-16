import { useState } from 'react';
import { Eye, EyeOff, Wallet, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthPageProps {
  onBack: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthPage({ onBack, defaultTab = 'login' }: AuthPageProps) {
  const { login, register } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    if (!result.success) setError(result.error ?? 'Login gagal');
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!registerForm.name.trim()) { setError('Nama tidak boleh kosong'); return; }
    if (!registerForm.email.includes('@')) { setError('Format email tidak valid'); return; }
    if (registerForm.password.length < 6) { setError('Password minimal 6 karakter'); return; }
    if (registerForm.password !== registerForm.confirm) { setError('Password tidak cocok'); return; }
    setLoading(true);
    const result = await register(registerForm.name, registerForm.email, registerForm.password);
    if (!result.success) setError(result.error ?? 'Registrasi gagal');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10,
    fontSize: 14, color: '#0F172A', background: 'white', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F7FF 0%, #F8FAFC 50%, #F0FDF4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 14, fontWeight: 500, marginBottom: 32, padding: 0 }}>
          <ArrowLeft size={16} /> Kembali ke beranda
        </button>

        <div style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={22} color="white" />
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>FinTrack</span>
            </div>
            <p style={{ fontSize: 14, color: '#64748B' }}>{tab === 'login' ? 'Selamat datang kembali 👋' : 'Buat akun baru Anda'}</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{ flex: 1, padding: '8px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 8, background: tab === t ? 'white' : 'transparent', color: tab === t ? '#0F172A' : '#64748B', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                {t === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10, color: '#DC2626', fontSize: 13 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required placeholder="nama@email.com" style={inputStyle}
                  value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" style={{ ...inputStyle, paddingRight: 42 }}
                    value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '12px', background: loading ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input type="text" required placeholder="Nama lengkap Anda" style={inputStyle}
                  value={registerForm.name} onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required placeholder="nama@email.com" style={inputStyle}
                  value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 6 karakter" style={{ ...inputStyle, paddingRight: 42 }}
                    value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Konfirmasi Password</label>
                <input type="password" required placeholder="Ulangi password" style={inputStyle}
                  value={registerForm.confirm} onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')} onBlur={e => (e.target.style.borderColor = '#E2E8F0')} />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '12px', background: loading ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {loading ? 'Mendaftar...' : 'Buat Akun'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
