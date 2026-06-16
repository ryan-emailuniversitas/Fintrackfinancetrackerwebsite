import { useMemo } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, DollarSign, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { useApp, formatRupiah, formatDate, getMonthlyData, getThisMonthTotals, getBudgetUsed, CATEGORY_EMOJI } from '../../context/AppContext';
import { useIsMobile } from '../../hooks/useIsMobile';

function StatCard({ title, value, change, changeLabel, icon, color, bg, compact }: {
  title: string; value: string; change?: number; changeLabel?: string;
  icon: React.ReactNode; color: string; bg: string; compact?: boolean;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: compact ? '14px 16px' : 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: compact ? 8 : 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: compact ? 11 : 13, color: '#64748B', fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: compact ? 16 : 22, fontWeight: 800, color: '#0F172A', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
        </div>
        <div style={{ width: compact ? 36 : 44, height: compact ? 36 : 44, background: bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {compact ? <span style={{ fontSize: 16 }}>{icon}</span> : icon}
        </div>
      </div>
      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: isPositive ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change)}%
          </span>
          <span style={{ color: '#94A3B8' }}>{changeLabel || 'vs bulan lalu'}</span>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: '#64748B' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{formatRupiah(p.value)}</span>
        </div>
      ))}
    </div>
  );
};


export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { transactions, budgets } = useApp();
  const isMobile = useIsMobile();

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const { income: thisMonthIncome, expense: thisMonthExpense } = useMemo(() => getThisMonthTotals(transactions), [transactions]);

  const totalBalance = useMemo(() =>
    transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0),
    [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => b.transactionDate.localeCompare(a.transactionDate)).slice(0, 5),
    [transactions]);

  const budgetProgress = useMemo(() =>
    budgets.slice(0, 4).map(b => {
      const used = getBudgetUsed(transactions, b.category);
      const pct = b.limitAmount > 0 ? Math.min((used / b.limitAmount) * 100, 100) : 0;
      return { ...b, used, pct };
    }),
    [budgets, transactions]);

  const prevMonthData = monthlyData[monthlyData.length - 2];
  const currMonthData = monthlyData[monthlyData.length - 1];
  const incomeChange = prevMonthData?.pemasukan > 0
    ? Math.round(((currMonthData?.pemasukan - prevMonthData.pemasukan) / prevMonthData.pemasukan) * 100)
    : 0;
  const expenseChange = prevMonthData?.pengeluaran > 0
    ? Math.round(((currMonthData?.pengeluaran - prevMonthData.pengeluaran) / prevMonthData.pengeluaran) * 100)
    : 0;

  const pad = isMobile ? '16px' : '24px 28px';

  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>
      {/* Mobile: greeting banner */}
      {isMobile && (
        <div style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 16, padding: '16px 20px', color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Selamat datang 👋</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{transactions.length > 0 ? 'Total Saldo' : 'Mulai catat keuangan Anda'}</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>{formatRupiah(totalBalance)}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.75 }}>Pemasukan</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>+{formatRupiah(thisMonthIncome)}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
            <div>
              <div style={{ fontSize: 10, opacity: 0.75 }}>Pengeluaran</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>-{formatRupiah(thisMonthExpense)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
        {isMobile ? (
          // Mobile: 2x2 compact cards
          <>
            <StatCard title="Total Saldo" value={formatRupiah(totalBalance)} icon="💰" color="#2563EB" bg="#EFF6FF" compact />
            <StatCard title="Pemasukan" value={formatRupiah(thisMonthIncome)} change={incomeChange} icon="📈" color="#16A34A" bg="#F0FDF4" compact />
            <StatCard title="Pengeluaran" value={formatRupiah(thisMonthExpense)} change={-Math.abs(expenseChange)} icon="📉" color="#DC2626" bg="#FEF2F2" compact />
            <StatCard title="Sisa Bulan" value={formatRupiah(Math.max(0, thisMonthIncome - thisMonthExpense))} icon="💵" color="#D97706" bg="#FFFBEB" compact />
          </>
        ) : (
          // Desktop: 4-column
          <>
            <StatCard title="Total Saldo" value={formatRupiah(totalBalance)} icon={<Wallet size={20} />} color="#2563EB" bg="#EFF6FF" />
            <StatCard title="Pemasukan Bulan Ini" value={formatRupiah(thisMonthIncome)} change={incomeChange} icon={<ArrowUpRight size={20} />} color="#16A34A" bg="#F0FDF4" />
            <StatCard title="Pengeluaran Bulan Ini" value={formatRupiah(thisMonthExpense)} change={-Math.abs(expenseChange)} icon={<ArrowDownRight size={20} />} color="#DC2626" bg="#FEF2F2" />
            <StatCard title="Sisa Bulan Ini" value={formatRupiah(Math.max(0, thisMonthIncome - thisMonthExpense))} icon={<DollarSign size={20} />} color="#D97706" bg="#FFFBEB" />
          </>
        )}
      </div>

      {/* Chart — full width */}
      <div style={{ background: 'white', borderRadius: 16, padding: isMobile ? '16px' : 24, border: '1px solid #E2E8F0' }}>
        <div style={{ marginBottom: isMobile ? 12 : 20 }}>
          <h3 style={{ margin: 0, fontSize: isMobile ? 14 : 15, fontWeight: 700, color: '#0F172A' }}>Pemasukan vs Pengeluaran</h3>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>6 bulan terakhir</div>
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
          <AreaChart data={monthlyData} margin={{ top: 4, right: isMobile ? 4 : 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#2563EB" fill="url(#gradIncome)" strokeWidth={2.5} dot={{ r: isMobile ? 2 : 4, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" fill="url(#gradExpense)" strokeWidth={2.5} dot={{ r: isMobile ? 2 : 4, fill: '#EF4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? 14 : 16 }}>
        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: 16, padding: isMobile ? 16 : 24, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Transaksi Terbaru</h3>
            <button onClick={() => onNavigate('transactions')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Lihat semua <ChevronRight size={14} />
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: 14 }}>
              Belum ada transaksi. Tambahkan transaksi pertama Anda!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentTransactions.map(tx => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: '#F1F5F9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {CATEGORY_EMOJI[tx.category] || '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.note || tx.category}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                      {tx.category} · {formatDate(tx.transactionDate)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: tx.type === 'income' ? '#16A34A' : '#DC2626' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </div>
                    {!isMobile && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{tx.paymentMethod}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div style={{ background: 'white', borderRadius: 16, padding: isMobile ? 16 : 24, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Progress Budget</h3>
            <button onClick={() => onNavigate('budget')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Kelola <ChevronRight size={14} />
            </button>
          </div>
          {budgetProgress.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 14 }}>
              Belum ada budget. Buat budget pertama Anda!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {budgetProgress.map(b => {
                const barColor = b.pct >= 90 ? '#DC2626' : b.pct >= 75 ? '#D97706' : '#16A34A';
                return (
                  <div key={b.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{CATEGORY_EMOJI[b.category] || '📦'}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{b.category}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>
                            {formatRupiah(b.used)} / {formatRupiah(b.limitAmount)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{Math.round(b.pct)}%</div>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${b.pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                    {b.pct >= 75 && (
                      <div style={{ fontSize: 11, color: barColor, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⚠️ {b.pct >= 90 ? 'Budget hampir habis!' : 'Mendekati batas budget'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
