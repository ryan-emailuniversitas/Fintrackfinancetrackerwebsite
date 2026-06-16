import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  useApp, formatRupiah, CATEGORY_COLORS, CATEGORY_EMOJI, Transaction,
} from '../../context/AppContext';
import { parseISO, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, subMonths, isWithinInterval, subYears, startOfYear, endOfYear, startOfDay, endOfDay, subDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { Topbar } from '../layout/Topbar';
import { useIsMobile } from '../../hooks/useIsMobile';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

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

function getChartData(transactions: Transaction[], period: Period) {
  const now = new Date();
  switch (period) {
    case 'daily': {
      const days = eachDayOfInterval({ start: subDays(now, 29), end: now });
      return days.map(day => {
        const dayTx = transactions.filter(t => {
          try {
            const d = parseISO(t.transactionDate);
            return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) });
          } catch { return false; }
        });
        return {
          label: format(day, 'dd MMM', { locale: idLocale }),
          pemasukan: dayTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          pengeluaran: dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
    }
    case 'weekly': {
      const months = eachMonthOfInterval({ start: subMonths(now, 2), end: now });
      const weeks: Date[] = [];
      months.forEach(m => {
        const ws = eachWeekOfInterval({ start: startOfMonth(m), end: endOfMonth(m) }, { locale: idLocale });
        weeks.push(...ws);
      });
      return weeks.slice(-12).map(week => {
        const start = startOfWeek(week, { locale: idLocale });
        const end = endOfWeek(week, { locale: idLocale });
        const weekTx = transactions.filter(t => {
          try {
            const d = parseISO(t.transactionDate);
            return isWithinInterval(d, { start, end });
          } catch { return false; }
        });
        return {
          label: `${format(start, 'dd', { locale: idLocale })}–${format(end, 'dd MMM', { locale: idLocale })}`,
          pemasukan: weekTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          pengeluaran: weekTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
    }
    case 'monthly': {
      const months = eachMonthOfInterval({ start: subMonths(now, 11), end: now });
      return months.map(month => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        const monthTx = transactions.filter(t => {
          try {
            const d = parseISO(t.transactionDate);
            return isWithinInterval(d, { start, end });
          } catch { return false; }
        });
        return {
          label: format(month, 'MMM yyyy', { locale: idLocale }),
          pemasukan: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          pengeluaran: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
    }
    case 'yearly': {
      const start = startOfYear(subYears(now, 2));
      const end = endOfYear(now);
      const months = eachMonthOfInterval({ start, end });
      return months.map(month => {
        const mStart = startOfMonth(month);
        const mEnd = endOfMonth(month);
        const monthTx = transactions.filter(t => {
          try {
            const d = parseISO(t.transactionDate);
            return isWithinInterval(d, { start: mStart, end: mEnd });
          } catch { return false; }
        });
        return {
          label: format(month, 'MMM yyyy', { locale: idLocale }),
          pemasukan: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          pengeluaran: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
    }
  }
}

function getPeriodTransactions(transactions: Transaction[], period: Period): Transaction[] {
  const now = new Date();
  let start: Date;
  let end: Date;
  switch (period) {
    case 'daily': start = subDays(now, 30); end = now; break;
    case 'weekly': start = subDays(now, 84); end = now; break;
    case 'monthly': start = subMonths(now, 12); end = now; break;
    case 'yearly': start = subYears(now, 3); end = now; break;
  }
  return transactions.filter(t => {
    try {
      const d = parseISO(t.transactionDate);
      return isWithinInterval(d, { start, end });
    } catch { return false; }
  });
}

export function Reports() {
  const { transactions } = useApp();
  const [period, setPeriod] = useState<Period>('monthly');
  const isMobile = useIsMobile();

  const chartData = useMemo(() => getChartData(transactions, period), [transactions, period]);
  const periodTx = useMemo(() => getPeriodTransactions(transactions, period), [transactions, period]);

  const totalIncome = periodTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = periodTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const categoryData = useMemo(() => {
    const expenseTx = periodTx.filter(t => t.type === 'expense');
    const totals: Record<string, number> = {};
    expenseTx.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [periodTx]);

  const incomeData = useMemo(() => {
    const incomeTx = periodTx.filter(t => t.type === 'income');
    const totals: Record<string, number> = {};
    incomeTx.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [periodTx]);

  // Yearly cashflow: group all transactions by year (oldest → newest, then reversed for display)
  const yearlyCashflowData = useMemo(() => {
    if (period !== 'yearly') return [];
    const yearMap: Record<string, { pemasukan: number; pengeluaran: number }> = {};
    transactions.forEach(t => {
      const yr = t.transactionDate.slice(0, 4);
      if (!yearMap[yr]) yearMap[yr] = { pemasukan: 0, pengeluaran: 0 };
      if (t.type === 'income') yearMap[yr].pemasukan += t.amount;
      else yearMap[yr].pengeluaran += t.amount;
    });
    return Object.entries(yearMap)
      .sort((a, b) => b[0].localeCompare(a[0])) // newest first
      .map(([year, { pemasukan, pengeluaran }]) => ({ label: year, pemasukan, pengeluaran }));
  }, [transactions, period]);

  // Rows limit per period: daily=31, weekly=all, monthly=12
  const periodRowLimit: Record<Period, number> = { daily: 31, weekly: 100, monthly: 12, yearly: 100 };
  const cashflowTableRows = period === 'yearly'
    ? yearlyCashflowData
    : [...chartData].reverse().slice(0, periodRowLimit[period]);

  const periodLabels: Record<Period, string> = {
    daily: '30 Hari Terakhir',
    weekly: '12 Minggu Terakhir',
    monthly: '12 Bulan Terakhir',
    yearly: '3 Tahun Terakhir',
  };

  return (
    <>
      <Topbar />
      <div style={{ padding: isMobile ? '16px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
        {/* Period selector */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Laporan Keuangan</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748B' }}>{periodLabels[period]}</p>
          </div>
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 12, padding: 4, gap: 2, width: isMobile ? '100%' : 'auto' }}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{
                  flex: isMobile ? 1 : undefined,
                  padding: isMobile ? '8px 4px' : '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: isMobile ? 12 : 13, fontWeight: 500,
                  background: period === p ? 'white' : 'transparent',
                  color: period === p ? '#0F172A' : '#64748B',
                  boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          {[
            { label: 'Total Pemasukan', value: formatRupiah(totalIncome), color: '#16A34A', bg: '#F0FDF4', icon: <TrendingUp size={20} /> },
            { label: 'Total Pengeluaran', value: formatRupiah(totalExpense), color: '#DC2626', bg: '#FEF2F2', icon: <TrendingDown size={20} /> },
            { label: 'Arus Kas Bersih', value: formatRupiah(balance), color: balance >= 0 ? '#16A34A' : '#DC2626', bg: balance >= 0 ? '#F0FDF4' : '#FEF2F2', icon: <DollarSign size={20} /> },
            { label: 'Tingkat Tabungan', value: `${savingsRate}%`, color: '#2563EB', bg: '#EFF6FF', icon: <Activity size={20} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
                </div>
                <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Area chart - cashflow */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Cashflow Overview</h3>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: '#94A3B8' }}>Pemasukan vs Pengeluaran - {periodLabels[period]}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rGradI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rGradE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tickFormatter={v => v > 0 ? `${(v / 1000000).toFixed(0)}jt` : '0'} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#2563EB" fill="url(#rGradI)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" fill="url(#rGradE)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Perbandingan Pemasukan & Pengeluaran</h3>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: '#94A3B8' }}>Bar chart untuk melihat selisih lebih jelas</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tickFormatter={v => v > 0 ? `${(v / 1000000).toFixed(0)}jt` : '0'} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="pemasukan" name="Pemasukan" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two pie charts */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Expense by category */}
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Distribusi Pengeluaran</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Per kategori</p>
            {categoryData.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[categoryData[i].name] || '#6B7280'} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {categoryData.slice(0, 6).map((d, i) => {
                    const total = categoryData.reduce((s, c) => s + c.value, 0);
                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[d.name] || '#6B7280', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#64748B', flex: 1 }}>{CATEGORY_EMOJI[d.name]} {d.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 13 }}>Tidak ada data</div>
            )}
          </div>

          {/* Top expenses analytics */}
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Pengeluaran Terbesar</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Ranking kategori pengeluaran</p>
            {categoryData.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {categoryData.slice(0, 6).map((d, i) => {
                  const total = categoryData.reduce((s, c) => s + c.value, 0);
                  const pct = total > 0 ? (d.value / total) * 100 : 0;
                  const catColor = CATEGORY_COLORS[d.name] || '#6B7280';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#94A3B8' }}>#{i + 1}</span>
                          <span style={{ fontSize: 14 }}>{CATEGORY_EMOJI[d.name] || '📦'}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>{formatRupiah(d.value)}</span>
                      </div>
                      <div style={{ width: '100%', height: 5, background: '#F1F5F9', borderRadius: 3 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: catColor, borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 13 }}>Tidak ada data</div>
            )}
          </div>
        </div>

        {/* Cashflow summary table */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Ringkasan Cashflow</h3>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              {period === 'yearly' ? 'Per tahun' : period === 'monthly' ? '10 bulan terakhir' : period === 'weekly' ? '10 minggu terakhir' : '10 hari terakhir'}
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Periode', 'Pemasukan', 'Pengeluaran', 'Selisih', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cashflowTableRows.map((row, i) => {
                  const diff = row.pemasukan - row.pengeluaran;
                  return (
                    <tr key={i}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', borderBottom: '1px solid #F8FAFC', fontWeight: period === 'yearly' ? 700 : 500 }}>{row.label}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#16A34A', borderBottom: '1px solid #F8FAFC', fontWeight: 600 }}>{formatRupiah(row.pemasukan)}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#DC2626', borderBottom: '1px solid #F8FAFC', fontWeight: 600 }}>{formatRupiah(row.pengeluaran)}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: diff >= 0 ? '#16A34A' : '#DC2626', borderBottom: '1px solid #F8FAFC', fontWeight: 700 }}>
                        {diff >= 0 ? '+' : ''}{formatRupiah(diff)}
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #F8FAFC' }}>
                        <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: diff >= 0 ? '#F0FDF4' : '#FEF2F2', color: diff >= 0 ? '#16A34A' : '#DC2626' }}>
                          {diff >= 0 ? '✅ Surplus' : '⚠️ Defisit'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
