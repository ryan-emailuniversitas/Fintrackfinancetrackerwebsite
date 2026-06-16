import { useState, useMemo } from 'react';
import { Plus, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  useApp, Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES,
  formatRupiah, formatDate, CATEGORY_EMOJI, CATEGORY_COLORS,
} from '../../context/AppContext';
import { TransactionModal } from './TransactionModal';
import { Topbar } from '../layout/Topbar';

const PAGE_SIZE = 10;

type SortField = 'transactionDate' | 'amount' | 'category';
type SortDir = 'asc' | 'desc';

export function Transactions() {
  const { transactions, deleteTransaction } = useApp();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('transactionDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.note.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        formatRupiah(t.amount).toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (filterCategory) result = result.filter(t => t.category === filterCategory);
    if (filterMonth) result = result.filter(t => t.transactionDate.startsWith(filterMonth));

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'transactionDate') cmp = a.transactionDate.localeCompare(b.transactionDate);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, search, filterType, filterCategory, filterMonth, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
  };

  const openAdd = () => { setEditTx(null); setModalOpen(true); };
  const openEdit = (tx: Transaction) => { setEditTx(tx); setModalOpen(true); };

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const thStyle: React.CSSProperties = {
    padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748B',
    textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
    whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
  };

  const tdStyle: React.CSSProperties = {
    padding: '14px 16px', fontSize: 13, color: '#0F172A',
    borderBottom: '1px solid #F8FAFC', verticalAlign: 'middle',
  };

  return (
    <>
      <Topbar
        onAddTransaction={openAdd}
        searchValue={search}
        onSearchChange={v => { setSearch(v); setPage(1); }}
      />

      <div style={{ padding: isMobile ? '12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? 8 : 16 }}>
          {[
            { label: 'Total Transaksi', value: filtered.length.toString(), color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Total Pemasukan', value: formatRupiah(totalIncome), color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Total Pengeluaran', value: formatRupiah(totalExpense), color: '#DC2626', bg: '#FEF2F2' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Type filter */}
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 10, padding: 4, gap: 2 }}>
              {[{ id: 'all', label: 'Semua' }, { id: 'income', label: 'Pemasukan' }, { id: 'expense', label: 'Pengeluaran' }].map(opt => (
                <button key={opt.id} onClick={() => { setFilterType(opt.id as any); setPage(1); }}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: filterType === opt.id ? 'white' : 'transparent',
                    color: filterType === opt.id ? '#0F172A' : '#64748B',
                    boxShadow: filterType === opt.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
              style={{ padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: '#0F172A', background: 'white', cursor: 'pointer', outline: 'none' }}>
              <option value="">Semua Kategori</option>
              {allCategories.map(c => <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>)}
            </select>

            {/* Month filter */}
            <input type="month" value={filterMonth} onChange={e => { setFilterMonth(e.target.value); setPage(1); }}
              style={{ padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: filterMonth ? '#0F172A' : '#94A3B8', background: 'white', outline: 'none', cursor: 'pointer' }} />

            {/* Clear filters */}
            {(filterType !== 'all' || filterCategory || filterMonth) && (
              <button onClick={() => { setFilterType('all'); setFilterCategory(''); setFilterMonth(''); setPage(1); }}
                style={{ padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
                Reset Filter
              </button>
            )}

            <div style={{ marginLeft: 'auto' }}>
              <button onClick={openAdd}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                <Plus size={15} /> Tambah Transaksi
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {paginated.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94A3B8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Tidak ada transaksi ditemukan</div>
              <div style={{ fontSize: 13 }}>Coba ubah filter atau tambah transaksi baru</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle }} onClick={() => handleSort('transactionDate')}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Tanggal <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th style={thStyle}>Keterangan</th>
                    <th style={{ ...thStyle }} onClick={() => handleSort('category')}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Kategori <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th style={thStyle}>Metode</th>
                    <th style={thStyle}>Jenis</th>
                    <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('amount')}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        Nominal <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th style={{ ...thStyle, textAlign: 'center', width: 80 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx, i) => (
                    <tr key={tx.id}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{formatDate(tx.transactionDate)}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, background: '#F1F5F9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                            {CATEGORY_EMOJI[tx.category] || '📦'}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.note || tx.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: (CATEGORY_COLORS[tx.category] || '#6B7280') + '18',
                          color: CATEGORY_COLORS[tx.category] || '#6B7280',
                        }}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: '#64748B' }}>{tx.paymentMethod}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: tx.type === 'income' ? '#F0FDF4' : '#FEF2F2',
                          color: tx.type === 'income' ? '#16A34A' : '#DC2626',
                        }}>
                          {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: tx.type === 'income' ? '#16A34A' : '#DC2626' }}>
                          {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button onClick={() => openEdit(tx)}
                            style={{ width: 30, height: 30, background: '#EFF6FF', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm(tx.id)}
                            style={{ width: 30, height: 30, background: '#FEF2F2', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>
                Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} transaksi
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 32, height: 32, background: page === 1 ? '#F8FAFC' : 'white', border: '1px solid #E2E8F0', borderRadius: 8, cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: page === 1 ? '#CBD5E1' : '#64748B' }}>
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5 && page > 3) p = page - 2 + i;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: 32, height: 32, background: page === p ? '#2563EB' : 'white', border: `1px solid ${page === p ? '#2563EB' : '#E2E8F0'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: page === p ? 'white' : '#64748B' }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 32, height: 32, background: page === totalPages ? '#F8FAFC' : 'white', border: '1px solid #E2E8F0', borderRadius: 8, cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: page === totalPages ? '#CBD5E1' : '#64748B' }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setDeleteConfirm(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ width: 56, height: 56, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Hapus Transaksi?</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>
              Transaksi ini akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '11px', background: '#F1F5F9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '11px', background: '#DC2626', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white' }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editTransaction={editTx} />
    </>
  );
}
