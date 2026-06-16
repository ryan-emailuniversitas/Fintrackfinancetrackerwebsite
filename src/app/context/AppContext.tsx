import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// ── Types ────────────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES = ['Makanan','Transportasi','Belanja','Hiburan','Tagihan','Kesehatan','Pendidikan'];
export const INCOME_CATEGORIES = ['Gaji','Freelance','Investasi','Lainnya'];
export const PAYMENT_METHODS = ['Tunai','Transfer Bank','Kartu Kredit','Kartu Debit','E-Wallet','QRIS'];

export const CATEGORY_COLORS: Record<string, string> = {
  Makanan:'#F59E0B', Transportasi:'#3B82F6', Belanja:'#8B5CF6', Hiburan:'#EC4899',
  Tagihan:'#EF4444', Kesehatan:'#10B981', Pendidikan:'#06B6D4',
  Gaji:'#22C55E', Freelance:'#84CC16', Investasi:'#F97316', Lainnya:'#6B7280',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  Makanan:'🍽️', Transportasi:'🚗', Belanja:'🛍️', Hiburan:'🎮',
  Tagihan:'💡', Kesehatan:'🏥', Pendidikan:'📚',
  Gaji:'💼', Freelance:'💻', Investasi:'📈', Lainnya:'📦',
};

// ── Formatters ────────────────────────────────────────────────────────────────
export const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0, maximumFractionDigits:0 }).format(amount);

export const formatDate = (dateStr: string): string => {
  try { return format(parseISO(dateStr), 'dd MMM yyyy', { locale: idLocale }); }
  catch { return dateStr; }
};

// ── Analytics helpers ─────────────────────────────────────────────────────────
export const getMonthlyData = (transactions: Transaction[]) => {
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const monthTx = transactions.filter(t => {
      try { return isWithinInterval(parseISO(t.transactionDate), { start, end }); } catch { return false; }
    });
    return {
      month: format(month, 'MMM', { locale: idLocale }),
      pemasukan: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      pengeluaran: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });
};

export const getCategoryData = (transactions: Transaction[], type: TransactionType = 'expense') => {
  const now = new Date();
  const monthTx = transactions.filter(t => {
    if (t.type !== type) return false;
    try { return isWithinInterval(parseISO(t.transactionDate), { start: startOfMonth(now), end: endOfMonth(now) }); } catch { return false; }
  });
  const totals: Record<string, number> = {};
  monthTx.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
};

export const getThisMonthTotals = (transactions: Transaction[]) => {
  const now = new Date();
  const monthTx = transactions.filter(t => {
    try { return isWithinInterval(parseISO(t.transactionDate), { start: startOfMonth(now), end: endOfMonth(now) }); } catch { return false; }
  });
  return {
    income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  };
};

export const getBudgetUsed = (transactions: Transaction[], category: string): number => {
  const now = new Date();
  return transactions.filter(t => {
    if (t.type !== 'expense' || t.category !== category) return false;
    try { return isWithinInterval(parseISO(t.transactionDate), { start: startOfMonth(now), end: endOfMonth(now) }); } catch { return false; }
  }).reduce((s, t) => s + t.amount, 0);
};

// ── DB converters ─────────────────────────────────────────────────────────────
const dbToTx = (row: any): Transaction => ({
  id: row.id, userId: row.user_id, type: row.type, amount: Number(row.amount),
  category: row.category, note: row.note || '', paymentMethod: row.payment_method || '',
  transactionDate: row.transaction_date, createdAt: row.created_at,
});

const dbToBudget = (row: any): Budget => ({
  id: row.id, userId: row.user_id, category: row.category, limitAmount: Number(row.limit_amount),
});

// ── Context type ──────────────────────────────────────────────────────────────
interface AppContextType {
  currentUser: User | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: { name?: string; avatar?: string }) => Promise<void>;
  updatePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  transactions: Transaction[];
  isLoadingData: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  budgets: Budget[];
  addBudget: (b: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  updateBudget: (id: string, b: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ── Load user data from Supabase ──
  const loadData = useCallback(async (userId: string) => {
    setIsLoadingData(true);
    try {
      const [txRes, budgetRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId).order('transaction_date', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', userId),
      ]);

      setTransactions((txRes.data || []).map(dbToTx));
      setBudgets((budgetRes.data || []).map(dbToBudget));
    } catch (e) {
      console.error('loadData error:', e);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const sessionToUser = async (session: Session): Promise<User> => {
    const supabaseUser = session.user;
    // Try to get profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).single();
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.name || supabaseUser.user_metadata?.name || 'User',
      avatar: profile?.avatar || '',
      createdAt: supabaseUser.created_at,
    };
  };

  // ── Initialize auth ──
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        try {
          const user = await sessionToUser(session);
          setCurrentUser(user);
          await loadData(user.id);
        } catch (e) {
          console.error('Session restore error:', e);
        }
      }
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setTransactions([]);
        setBudgets([]);
        setCurrentPage('dashboard');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadData]);

  // ── Auth actions ──
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return { success: false, error: 'Email atau password salah' };
    const user = await sessionToUser(data.session);
    setCurrentUser(user);
    await loadData(user.id);
    return { success: true };
  }, [loadData]);

  const loginDemo = useCallback(async () => {
    const demoEmail = 'demo@fintrack.id';
    const demoPass = 'demo123';
    // Try sign in first
    const { data, error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass });
    if (!error && data.session) {
      const user = await sessionToUser(data.session);
      setCurrentUser(user);
      await loadData(user.id);
      return { success: true };
    }
    // Try sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: demoEmail, password: demoPass,
      options: { data: { name: 'Budi Santoso' } },
    });
    if (signUpError) return { success: false, error: 'Demo login gagal: ' + signUpError.message };
    // Sign in after signup
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass });
    if (signInError || !signInData.session) return { success: false, error: 'Demo login gagal' };
    const user = await sessionToUser(signInData.session);
    setCurrentUser(user);
    await loadData(user.id);
    return { success: true };
  }, [loadData]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    if (error) {
      const msg = error.message.toLowerCase().includes('already') ? 'Email sudah terdaftar' : error.message;
      return { success: false, error: msg };
    }
    if (!data.session) {
      return { success: false, error: 'Konfirmasi email diperlukan. Cek inbox email Anda atau nonaktifkan Email Confirmation di Supabase.' };
    }
    const user = await sessionToUser(data.session);
    setCurrentUser(user);
    await loadData(user.id);
    return { success: true };
  }, [loadData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setTransactions([]);
    setBudgets([]);
    setCurrentPage('dashboard');
  }, []);

  const updateUser = useCallback(async (updates: { name?: string; avatar?: string }) => {
    if (!currentUser) return;
    await supabase.from('profiles').upsert({
      id: currentUser.id,
      name: updates.name ?? currentUser.name,
      avatar: updates.avatar ?? currentUser.avatar,
    });
    if (updates.name) await supabase.auth.updateUser({ data: { name: updates.name } });
    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
  }, [currentUser]);

  const updatePassword = useCallback(async (currentPass: string, newPass: string) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    // Verify current password
    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: currentUser.email, password: currentPass });
    if (verifyErr) return { success: false, error: 'Password saat ini salah' };
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, [currentUser]);

  // ── Transaction CRUD ──
  const addTransaction = useCallback(async (t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const row = {
      user_id: currentUser.id, type: t.type, amount: t.amount, category: t.category,
      note: t.note, payment_method: t.paymentMethod, transaction_date: t.transactionDate,
    };
    const { data, error } = await supabase.from('transactions').insert(row).select().single();
    if (!error && data) setTransactions(prev => [dbToTx(data), ...prev]);
  }, [currentUser]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!currentUser) return;
    const row: any = {};
    if (updates.type !== undefined) row.type = updates.type;
    if (updates.amount !== undefined) row.amount = updates.amount;
    if (updates.category !== undefined) row.category = updates.category;
    if (updates.note !== undefined) row.note = updates.note;
    if (updates.paymentMethod !== undefined) row.payment_method = updates.paymentMethod;
    if (updates.transactionDate !== undefined) row.transaction_date = updates.transactionDate;
    const { error } = await supabase.from('transactions').update(row).eq('id', id).eq('user_id', currentUser.id);
    if (!error) setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [currentUser]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', currentUser.id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  }, [currentUser]);

  // ── Budget CRUD ──
  const addBudget = useCallback(async (b: Omit<Budget, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const row = { user_id: currentUser.id, category: b.category, limit_amount: b.limitAmount };
    const { data, error } = await supabase.from('budgets').insert(row).select().single();
    if (!error && data) setBudgets(prev => [...prev, dbToBudget(data)]);
  }, [currentUser]);

  const updateBudget = useCallback(async (id: string, updates: Partial<Budget>) => {
    if (!currentUser) return;
    const row: any = {};
    if (updates.category !== undefined) row.category = updates.category;
    if (updates.limitAmount !== undefined) row.limit_amount = updates.limitAmount;
    const { error } = await supabase.from('budgets').update(row).eq('id', id).eq('user_id', currentUser.id);
    if (!error) setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, [currentUser]);

  const deleteBudget = useCallback(async (id: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', currentUser.id);
    if (!error) setBudgets(prev => prev.filter(b => b.id !== id));
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser, isInitializing,
      login, loginDemo, register, logout, updateUser, updatePassword,
      transactions, isLoadingData,
      addTransaction, updateTransaction, deleteTransaction,
      budgets, addBudget, updateBudget, deleteBudget,
      currentPage, setCurrentPage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
