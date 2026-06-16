import { useState } from 'react';
import {
  TrendingUp, Shield, Zap, BarChart2, ArrowRight, Check,
  DollarSign, Users, Star, ChevronRight, Wallet, PieChart,
  Bell, Search, Menu, X,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <BarChart2 size={24} />,
      color: '#2563EB',
      bg: '#EFF6FF',
      title: 'Analisis Cerdas',
      desc: 'Visualisasi data keuangan dengan grafik interaktif. Pahami pola pengeluaran dan optimalkan tabungan.',
    },
    {
      icon: <Shield size={24} />,
      color: '#16A34A',
      bg: '#F0FDF4',
      title: 'Keamanan Terjamin',
      desc: 'Data keuangan Anda tersimpan aman dengan enkripsi tingkat tinggi dan proteksi berlapis.',
    },
    {
      icon: <Zap size={24} />,
      color: '#D97706',
      bg: '#FFFBEB',
      title: 'Pencatatan Cepat',
      desc: 'Catat transaksi dalam hitungan detik. Interface yang intuitif memudahkan pengelolaan keuangan harian.',
    },
    {
      icon: <TrendingUp size={24} />,
      color: '#7C3AED',
      bg: '#F5F3FF',
      title: 'Budget Planner',
      desc: 'Rencanakan anggaran per kategori dan dapatkan notifikasi saat mendekati batas pengeluaran.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Pengguna Aktif' },
    { value: 'Rp 2T+', label: 'Transaksi Tercatat' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9★', label: 'Rating Pengguna' },
  ];

  const pricingFeatures = [
    'Pencatatan transaksi unlimited',
    'Grafik & laporan keuangan',
    'Budget planner per kategori',
    'Export laporan PDF/Excel',
    'Notifikasi budget',
    'Sinkronisasi multi-device',
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>FinTrack</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
            <a href="#features" style={{ padding: '8px 16px', color: '#64748B', textDecoration: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0F172A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
              Fitur
            </a>
            <a href="#pricing" style={{ padding: '8px 16px', color: '#64748B', textDecoration: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0F172A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
              Harga
            </a>
            <button onClick={onLogin}
              style={{ padding: '8px 20px', color: '#0F172A', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
              Masuk
            </button>
            <button onClick={onGetStarted}
              style={{ padding: '8px 20px', color: 'white', background: '#2563EB', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Mulai Gratis <ArrowRight size={14} />
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', padding: 8, background: 'transparent', border: 'none', cursor: 'pointer' }} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: 'white', borderTop: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={onLogin} style={{ padding: '12px', color: '#0F172A', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
              Masuk
            </button>
            <button onClick={onGetStarted} style={{ padding: '12px', color: 'white', background: '#2563EB', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Mulai Gratis
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 120, paddingBottom: 80, background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="flex flex-col lg:grid">
            {/* Left content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', color: '#2563EB', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 24, border: '1px solid #BFDBFE' }}>
                <Star size={12} fill="#2563EB" /> Dipercaya 50,000+ pengguna
              </div>
              <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, marginBottom: 20 }}>
                Kelola Keuangan<br />
                <span style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Lebih Cerdas
                </span>
              </h1>
              <p style={{ fontSize: 18, color: '#64748B', lineHeight: 1.7, marginBottom: 36 }}>
                FinTrack membantu Anda mencatat pemasukan dan pengeluaran, merencanakan budget, dan memahami pola keuangan dengan mudah dan menyenangkan.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={onGetStarted}
                  style={{ padding: '14px 28px', color: 'white', background: '#2563EB', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                  Mulai Gratis Sekarang <ArrowRight size={16} />
                </button>
                <button onClick={onLogin}
                  style={{ padding: '14px 28px', color: '#0F172A', background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 500 }}>
                  Sudah punya akun?
                </button>
              </div>
              <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
                {[
                  { icon: <Check size={14} />, text: 'Gratis selamanya' },
                  { icon: <Check size={14} />, text: 'Tanpa kartu kredit' },
                  { icon: <Check size={14} />, text: 'Setup dalam 2 menit' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13 }}>
                    <span style={{ color: '#16A34A' }}>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard mockup */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                overflow: 'hidden', border: '1px solid #E2E8F0',
              }}>
                {/* Mockup topbar */}
                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                  <div style={{ flex: 1, marginLeft: 8, background: '#E2E8F0', borderRadius: 6, height: 24, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                    <Search size={12} color="#94A3B8" />
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#94A3B8' }}>fintrack.app/dashboard</span>
                  </div>
                </div>
                {/* Mockup content */}
                <div style={{ padding: 16, background: '#F8FAFC' }}>
                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'Total Saldo', value: 'Rp 28,4 Jt', color: '#2563EB', bg: '#EFF6FF' },
                      { label: 'Pemasukan', value: 'Rp 9,5 Jt', color: '#16A34A', bg: '#F0FDF4' },
                      { label: 'Pengeluaran', value: 'Rp 3,3 Jt', color: '#DC2626', bg: '#FEF2F2' },
                      { label: 'Sisa Budget', value: 'Rp 6,2 Jt', color: '#D97706', bg: '#FFFBEB' },
                    ].map((stat, i) => (
                      <div key={i} style={{ background: 'white', borderRadius: 10, padding: 12, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{stat.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ marginTop: 4, width: '60%', height: 3, background: stat.bg, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${[75, 60, 45, 80][i]}%`, background: stat.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Chart mockup */}
                  <div style={{ background: 'white', borderRadius: 10, padding: 12, border: '1px solid #E2E8F0', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Pemasukan vs Pengeluaran</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
                      {[40, 70, 55, 80, 65, 90].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                          <div style={{ width: '45%', height: h * 0.6, background: '#2563EB', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
                          <div style={{ width: '45%', height: h * 0.3, background: '#EF4444', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#64748B' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: '#2563EB' }} /> Pemasukan
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#64748B' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: '#EF4444' }} /> Pengeluaran
                      </div>
                    </div>
                  </div>
                  {/* Recent transactions */}
                  <div style={{ background: 'white', borderRadius: 10, padding: 12, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Transaksi Terbaru</div>
                    {[
                      { emoji: '💼', name: 'Gaji Bulanan', cat: 'Gaji', amount: '+Rp 8,0 Jt', green: true },
                      { emoji: '🍽️', name: 'Belanja Makanan', cat: 'Makanan', amount: '-Rp 450K', green: false },
                      { emoji: '💡', name: 'Tagihan Listrik', cat: 'Tagihan', amount: '-Rp 600K', green: false },
                    ].map((tx, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', marginBottom: i < 2 ? 8 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{tx.emoji}</div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A' }}>{tx.name}</div>
                            <div style={{ fontSize: 9, color: '#94A3B8' }}>{tx.cat}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: tx.green ? '#16A34A' : '#DC2626' }}>{tx.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{ position: 'absolute', top: -16, right: -16, background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, background: '#F0FDF4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Saldo naik</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>+12.5%</div>
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: 40, left: -20, background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={16} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Budget Makanan</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>⚠ 80% terpakai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#2563EB', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }} className="grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#BFDBFE', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '96px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', color: '#2563EB', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              Fitur Unggulan
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
              Semua yang Anda butuhkan
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              FinTrack hadir dengan fitur lengkap untuk membantu Anda mengelola keuangan pribadi secara efektif.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="grid-cols-1 md:grid-cols-2">
            {features.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #E2E8F0', transition: 'box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ width: 48, height: 48, background: f.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F0FDF4', color: '#16A34A', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16, border: '1px solid #BBF7D0' }}>
            100% Gratis Selamanya
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
            Mulai Kelola Keuangan Anda Hari Ini
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', marginBottom: 48, lineHeight: 1.7 }}>
            Tidak ada biaya tersembunyi. Akses semua fitur secara gratis.
          </p>

          <div style={{ background: 'white', borderRadius: 20, padding: 40, border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 48 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, textAlign: 'left', marginBottom: 32 }}>
              {pricingFeatures.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} color="#2563EB" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <button onClick={onGetStarted}
              style={{ width: '100%', padding: '16px', color: 'white', background: '#2563EB', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
              Daftar Gratis Sekarang <ArrowRight size={18} />
            </button>
          </div>

          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Sudah punya akun?{' '}
            <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Masuk sekarang
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={20} color="white" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>FinTrack</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Fitur', 'Tentang', 'Kebijakan Privasi', 'Kontak'].map(link => (
                <a key={link} href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1E293B', paddingTop: 24, textAlign: 'center', color: '#475569', fontSize: 13 }}>
            © 2026 FinTrack. Dibuat dengan ❤️ untuk membantu Anda mencapai kebebasan finansial.
          </div>
        </div>
      </footer>
    </div>
  );
}
