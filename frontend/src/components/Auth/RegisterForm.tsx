import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegisterFormProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{username?: string, password?: string, confirm?: string}>({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const newFieldErrors: typeof fieldErrors = {};
    if (!validateEmail(username)) newFieldErrors.username = 'Enter a valid email address.';
    if (!validatePassword(password)) newFieldErrors.password = 'Password must be at least 6 characters and contain a letter and a number.';
    if (password !== confirm) newFieldErrors.confirm = 'Passwords do not match.';
    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        setUsername('');
        setPassword('');
        setConfirm('');
        setTimeout(() => {
          setSuccess('');
          onRegister();
        }, 1000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Register</h2>
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
      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {fieldErrors.confirm && <div className="text-red-500 text-xs mt-1">{fieldErrors.confirm}</div>}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Registering...' : 'Register'}</Button>
      <div className="text-sm text-center mt-2">
        Already have an account?{' '}
        <Button type="button" variant="link" onClick={onSwitchToLogin} className="p-0 h-auto align-baseline">Login</Button>
      </div>
    </form>
  );
};

export default RegisterForm; 