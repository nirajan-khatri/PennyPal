import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Wallet, Plus, TrendingDown, TrendingUp, Target, DollarSign, Receipt, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
}

interface ExpenseTrackerProps {
  token: string;
  // onLogout prop removed as it is unused
}

const fetchTransactions = async (token: string): Promise<ExpenseRecord[]> => {
  const res = await fetch('/api/expenses', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const addTransaction = async ({ token, newTx }: { token: string; newTx: Omit<ExpenseRecord, 'id'> }) => {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newTx)
  });
  if (!res.ok) throw new Error('Failed to add');
  return res.json();
};

const deleteTransaction = async ({ token, id }: { token: string; id: string }) => {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete');
  return id;
};

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ token }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['transactions', token],
    queryFn: () => fetchTransactions(token),
  });

  const addMutation = useMutation({
    mutationFn: (newTx: Omit<ExpenseRecord, 'id'>) => addTransaction({ token, newTx }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', token] });
      setDescription('');
      setAmount('');
      setType('expense');
      toast.success("Transaction added successfully");
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to add record');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransaction({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', token] });
      toast.success("Transaction deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete record");
    },
  });

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    addMutation.mutate({ description, amount: parseFloat(amount), type });
  };

  const totalExpenses = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const totalIncomes = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const net = totalIncomes - totalExpenses;

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-hero rounded-full flex items-center justify-center shadow-elegant">
          <Wallet className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-income rounded-full flex items-center justify-center shadow-income">
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">No transactions yet</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Get started by adding your first income or expense transaction above. Track your financial journey with style!
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 py-8">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 shadow animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Expenses</p>
                  <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-rose-200 dark:bg-rose-800/40 rounded-full">
                  <TrendingDown className="w-6 h-6 text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Income</p>
                  <p className="text-3xl font-bold">${totalIncomes.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-emerald-200 dark:bg-emerald-800/40 rounded-full">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow animate-slide-up ${net >= 0 ? 'shadow-emerald-200' : 'shadow-rose-200'}`} style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Net Balance</p>
                  <p className={`text-3xl font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>${net.toFixed(2)}</p>
                </div>
                <div className={`p-3 rounded-full ${net >= 0 ? 'bg-emerald-200 dark:bg-emerald-800/40' : 'bg-rose-200 dark:bg-rose-800/40'}`}> 
                  <Target className={`w-6 h-6 ${net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Form */}
        <Card className="shadow-elegant mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Transaction
            </CardTitle>
            <CardDescription>
              Record your income and expenses to track your financial health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addRecord} className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={v => setType(v as 'expense' | 'income')}>
                  <SelectTrigger className="w-full h-10 mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">💸 Expense</SelectItem>
                    <SelectItem value="income">💰 Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Groceries, Salary"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className="h-10 mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="flex items-end w-full lg:w-auto">
                <Button 
                  type="submit" 
                  disabled={addMutation.isPending} 
                  className="w-full lg:w-auto h-10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                >
                  {addMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Transaction
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-elegant animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              View and manage all your financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : records.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${record.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-rose-100 dark:bg-rose-900/40'}`}> 
                        {record.type === 'income' ? (
                          <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{record.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.type === 'income' ? 'Income' : 'Expense'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold ${record.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                          {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(record.id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;