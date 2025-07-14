import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
}

interface ExpenseTrackerProps {
  token: string;
  onLogout: () => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ token, onLogout }) => {
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/expenses', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, [token]);

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!description || !amount) return;
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ description, amount: parseFloat(amount), type })
    });
    if (res.ok) {
      const newRecord = await res.json();
      setRecords([...records, newRecord]);
      setDescription('');
      setAmount('');
      setType('expense');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to add record');
    }
  };

  const deleteRecord = async (id: string) => {
    setError('');
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setRecords(records.filter(e => e.id !== id));
    } else {
      setError('Failed to delete record');
    }
  };

  const totalExpenses = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const totalIncomes = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const net = totalIncomes - totalExpenses;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expense & Income Tracker</h2>
        <Button variant="destructive" onClick={onLogout}>Logout</Button>
      </div>
      <form onSubmit={addRecord} className="flex gap-2 mb-4">
        <select value={type} onChange={e => setType(e.target.value as 'expense' | 'income')} className="border rounded px-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <Input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <Button type="submit">Add</Button>
      </form>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {loading ? <p>Loading...</p> : (
        <ul className="list-none p-0 mb-4">
          {records.map(e => (
            <li key={e.id} className="flex justify-between items-center mb-2">
              <span className={e.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                <b>{e.type === 'income' ? '+' : '-'}${e.amount.toFixed(2)}</b> {e.description} [{e.type}]
              </span>
              <Button variant="outline" size="sm" onClick={() => deleteRecord(e.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-1">
        <div>Total Expenses: <span className="text-red-600">${totalExpenses.toFixed(2)}</span></div>
        <div>Total Incomes: <span className="text-green-600">${totalIncomes.toFixed(2)}</span></div>
        <div className="font-bold">Net: ${net.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ExpenseTracker; 