import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  useApp, Budget as BudgetType, EXPENSE_CATEGORIES, CATEGORY_EMOJI, CATEGORY_COLORS,
  formatRupiah, getBudgetUsed,
} from '../../context/AppContext';
import { Topbar } from '../layout/Topbar';

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  editBudget?: BudgetType | null;
  existingCategories: string[];
}

function BudgetModal({ open, onClose, editBudget, existingCategories }: BudgetModalProps) {
  const { addBudget, updateBudget } = useApp();
  const [category, setCategory] = useState(editBudget?.category || '');
  const [limitAmount, setLimitAmount] = useState(editBudget?.limitAmount?.toString() || '');

  const availableCategories = EXPENSE_CATEGORIES.filter(
    c => !existingCategories.includes(c) || c === editBudget?.category
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(limitAmount.replace(/\D/g, ''));
    if (!category || !amount || amount <= 0) return;
    if (editBudget) {
      updateBudget(editBudget.id, { category, limitAmount: amount });
    } else {
      addBudget({ category, limitAmount: amount });
    }
    onClose();
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
    borderRadius: 10, fontSize: 14, color: '#0F172A', background: 'white',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
            {editBudget ? 'Edit Budget' : 'Tambah Budget'}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, background: '#F1F5F9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Kategori</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {availableCategories.map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    style={{
                      padding: '10px 8px', border: `1.5px solid ${category === cat ? CATEGORY_COLORS[cat] || '#2563EB' : '#E2E8F0'}`,
                      borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: category === cat ? 700 : 500,
                      background: category === cat ? (CATEGORY_COLORS[cat] || '#2563EB') + '18' : 'white',
                      color: category === cat ? (CATEGORY_COLORS[cat] || '#2563EB') : '#64748B',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 20 }}>{CATEGORY_EMOJI[cat] || '📦'}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Batas Budget (Rp)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: 14 }}>Rp</span>
                <input type="text" required placeholder="0" value={limitAmount ? parseInt(limitAmount).toLocaleString('id-ID') : ''}
                  onChange={e => setLimitAmount(e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle, paddingLeft: 40 }}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>
              Batal
            </button>
            <button type="submit" disabled={!category || !limitAmount}
              style={{ flex: 2, padding: '12px', background: !category || !limitAmount ? '#CBD5E1' : '#2563EB', border: 'none', borderRadius: 10, cursor: !category || !limitAmount ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, color: 'white' }}>
              {editBudget ? 'Simpan' : 'Tambah Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Budget() {
  const { budgets, transactions, deleteBudget } = useApp();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<BudgetType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const budgetData = useMemo(() =>
    budgets.map(b => {
      const used = getBudgetUsed(transactions, b.category);
      const pct = b.limitAmount > 0 ? Math.min((used / b.limitAmount) * 100, 100) : 0;
      const remaining = Math.max(0, b.limitAmount - used);
      return { ...b, used, pct, remaining };
    }).sort((a, b) => b.pct - a.pct),
    [budgets, transactions]);

  const totalBudget = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalUsed = budgetData.reduce((s, b) => s + b.used, 0);
  const overBudget = budgetData.filter(b => b.pct >= 100).length;
  const warning = budgetData.filter(b => b.pct >= 75 && b.pct < 100).length;

  const existingCategories = budgets.map(b => b.category);

  const openAdd = () => { setEditBudget(null); setModalOpen(true); };
  const openEdit = (b: BudgetType) => { setEditBudget(b); setModalOpen(true); };

  return (
    <>
      <Topbar />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          {[
            { label: 'Total Budget', value: formatRupiah(totalBudget), color: '#2563EB', bg: '#EFF6FF', icon: '💰' },
            { label: 'Total Terpakai', value: formatRupiah(totalUsed), color: '#D97706', bg: '#FFFBEB', icon: '📊' },
            { label: 'Sisa Budget', value: formatRupiah(Math.max(0, totalBudget - totalUsed)), color: '#16A34A', bg: '#F0FDF4', icon: '✅' },
            { label: 'Kategori Kritis', value: `${overBudget} Kategori`, color: '#DC2626', bg: '#FEF2F2', icon: '⚠️' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Header + Add button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Pengaturan Budget</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
              {budgets.length} dari {EXPENSE_CATEGORIES.length} kategori memiliki budget
              {warning > 0 && <span style={{ color: '#D97706', fontWeight: 600 }}> · {warning} mendekati batas</span>}
              {overBudget > 0 && <span style={{ color: '#DC2626', fontWeight: 600 }}> · {overBudget} melebihi batas</span>}
            </p>
          </div>
          {existingCategories.length < EXPENSE_CATEGORIES.length && (
            <button onClick={openAdd}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
              <Plus size={16} /> Tambah Budget
            </button>
          )}
        </div>

        {/* Budget cards grid */}
        {budgetData.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: '60px 0', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Belum ada budget</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748B' }}>Buat budget per kategori untuk mengontrol pengeluaran Anda.</p>
            <button onClick={openAdd}
              style={{ padding: '12px 28px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
              Tambah Budget Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
            {budgetData.map(b => {
              const barColor = b.pct >= 100 ? '#DC2626' : b.pct >= 75 ? '#D97706' : '#16A34A';
              const bgColor = b.pct >= 100 ? '#FEF2F2' : b.pct >= 75 ? '#FFFBEB' : '#F0FDF4';
              return (
                <div key={b.id} style={{ background: 'white', borderRadius: 16, padding: 24, border: `1px solid ${b.pct >= 90 ? '#FCA5A5' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, background: (CATEGORY_COLORS[b.category] || '#6B7280') + '18', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        {CATEGORY_EMOJI[b.category] || '📦'}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{b.category}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                          Sisa: {formatRupiah(b.remaining)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {b.pct >= 100 && <AlertTriangle size={16} color="#DC2626" />}
                      {b.pct >= 75 && b.pct < 100 && <AlertTriangle size={16} color="#D97706" />}
                      {b.pct < 75 && <CheckCircle size={16} color="#16A34A" />}
                      <button onClick={() => openEdit(b)}
                        style={{ width: 30, height: 30, background: '#EFF6FF', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setDeleteConfirm(b.id)}
                        style={{ width: 30, height: 30, background: '#FEF2F2', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#64748B' }}>{formatRupiah(b.used)} terpakai</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{Math.round(b.pct)}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${b.pct}%`, height: '100%', borderRadius: 4,
                        background: b.pct >= 100 ? '#DC2626' : b.pct >= 75
                          ? `linear-gradient(90deg, #F59E0B, #D97706)` : '#16A34A',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Rp 0</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Limit: {formatRupiah(b.limitAmount)}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ background: bgColor, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: barColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {b.pct >= 100 ? (
                      <><AlertTriangle size={13} /> Batas budget terlampaui!</>
                    ) : b.pct >= 75 ? (
                      <><AlertTriangle size={13} /> Mendekati batas budget ({Math.round(b.pct)}%)</>
                    ) : (
                      <><CheckCircle size={13} /> Budget dalam kondisi baik</>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unset categories */}
        {EXPENSE_CATEGORIES.filter(c => !existingCategories.includes(c)).length > 0 && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px dashed #CBD5E1' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#64748B' }}>Kategori Belum Diatur</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {EXPENSE_CATEGORIES.filter(c => !existingCategories.includes(c)).map(cat => (
                <button key={cat} onClick={() => { setEditBudget(null); setModalOpen(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                    background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 10,
                    cursor: 'pointer', fontSize: 13, color: '#64748B', fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B'; }}>
                  <span style={{ fontSize: 16 }}>{CATEGORY_EMOJI[cat] || '📦'}</span>
                  {cat}
                  <Plus size={13} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setDeleteConfirm(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, padding: 32, maxWidth: 360, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Hapus Budget?</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>Budget ini akan dihapus secara permanen.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '11px', background: '#F1F5F9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Batal
              </button>
              <button onClick={() => { deleteBudget(deleteConfirm); setDeleteConfirm(null); }}
                style={{ flex: 1, padding: '11px', background: '#DC2626', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white' }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <BudgetModal open={modalOpen} onClose={() => setModalOpen(false)} editBudget={editBudget} existingCategories={existingCategories} />
    </>
  );
}
