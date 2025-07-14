import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{username?: string, password?: string}>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newFieldErrors: typeof fieldErrors = {};
    if (!validateEmail(username)) newFieldErrors.username = 'Enter a valid email address.';
    if (!password) newFieldErrors.password = 'Password is required.';
    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <div>
        <Input
          placeholder="Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          type="email"
        />
        {fieldErrors.username && <div className="text-red-500 text-xs mt-1">{fieldErrors.username}</div>}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {fieldErrors.password && <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Login'}</Button>
      <div className="text-sm text-center mt-2">
        Don't have an account?{' '}
        <Button type="button" variant="link" onClick={onSwitchToRegister} className="p-0 h-auto align-baseline">Register</Button>
      </div>
    </form>
  );
};

export default LoginForm; 