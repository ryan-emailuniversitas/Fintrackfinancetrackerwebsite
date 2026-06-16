import { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import {
  useApp, Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES,
  PAYMENT_METHODS, CATEGORY_EMOJI, formatRupiah,
} from '../../context/AppContext';
import { format } from 'date-fns';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
  borderRadius: 10, fontSize: 14, color: '#0F172A', background: 'white',
  outline: 'none', boxSizing: 'border-box', appearance: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
};

export function TransactionModal({ open, onClose, editTransaction }: TransactionModalProps) {
  const { addTransaction, updateTransaction } = useApp();

  const today = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    note: '',
    paymentMethod: 'Transfer Bank',
    transactionDate: today,
  });

  useEffect(() => {
    if (editTransaction) {
      setForm({
        type: editTransaction.type,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        note: editTransaction.note,
        paymentMethod: editTransaction.paymentMethod,
        transactionDate: editTransaction.transactionDate,
      });
    } else {
      setForm({ type: 'expense', amount: '', category: '', note: '', paymentMethod: 'Transfer Bank', transactionDate: today });
    }
  }, [editTransaction, open]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount.replace(/\D/g, ''));
    if (!amount || amount <= 0) return;
    if (!form.category) return;

    const data = {
      type: form.type,
      amount,
      category: form.category,
      note: form.note,
      paymentMethod: form.paymentMethod,
      transactionDate: form.transactionDate,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const formatAmountInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return digits ? parseInt(digits).toLocaleString('id-ID') : '';
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
            {editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, background: '#F1F5F9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Type selector */}
            <div>
              <label style={labelStyle}>Jenis Transaksi</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['income', 'expense'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t, category: '' }))}
                    style={{
                      padding: '12px', border: `2px solid ${form.type === t ? (t === 'income' ? '#16A34A' : '#DC2626') : '#E2E8F0'}`,
                      borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: form.type === t ? (t === 'income' ? '#F0FDF4' : '#FEF2F2') : 'white',
                      color: form.type === t ? (t === 'income' ? '#16A34A' : '#DC2626') : '#64748B',
                      fontWeight: form.type === t ? 700 : 500, fontSize: 14,
                      transition: 'all 0.15s',
                    }}>
                    {t === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                    {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label style={labelStyle}>Nominal (Rp)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: 14, fontWeight: 500 }}>Rp</span>
                <input
                  type="text" required placeholder="0"
                  value={form.amount ? formatAmountInput(form.amount) : ''}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value.replace(/\D/g, '') }))}
                  style={{ ...inputStyle, paddingLeft: 40 }}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Kategori</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {categories.map(cat => (
                  <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                    style={{
                      padding: '8px 4px', border: `1.5px solid ${form.category === cat ? '#2563EB' : '#E2E8F0'}`,
                      borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: form.category === cat ? 700 : 500,
                      background: form.category === cat ? '#EFF6FF' : 'white',
                      color: form.category === cat ? '#2563EB' : '#64748B',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 16 }}>{CATEGORY_EMOJI[cat] || '📦'}</span>
                    <span style={{ lineHeight: 1.2, textAlign: 'center' }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Payment method - 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Tanggal</label>
                <input type="date" required value={form.transactionDate}
                  onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))}
                  max={today} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
              <div>
                <label style={labelStyle}>Metode Pembayaran</label>
                <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  style={{ ...inputStyle }}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label style={labelStyle}>Catatan (opsional)</label>
              <input type="text" placeholder="Tambahkan catatan..." value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>
              Batal
            </button>
            <button type="submit" disabled={!form.category || !form.amount}
              style={{
                flex: 2, padding: '12px', background: !form.category || !form.amount ? '#CBD5E1' : '#2563EB',
                border: 'none', borderRadius: 10, cursor: !form.category || !form.amount ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 700, color: 'white',
              }}>
              {editTransaction ? 'Simpan Perubahan' : 'Tambah Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
