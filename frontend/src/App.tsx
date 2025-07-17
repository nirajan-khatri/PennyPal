import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ExpenseTracker from './components/Tracker/ExpenseTracker';
import Navbar from './components/Navbar';
import { jwtDecode } from 'jwt-decode';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  // Persist token in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('jwt_token');
    if (stored) {
      setToken(stored);
      try {
        const decoded = jwtDecode<{ name?: string; username?: string; email?: string }>(stored);
        setUser({ name: decoded.name || decoded.username, email: decoded.email || decoded.username });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('jwt_token', jwt);
    try {
      const decoded = jwtDecode<{ name?: string; username?: string; email?: string }>(jwt);
      setUser({ name: decoded.name || decoded.username, email: decoded.email || decoded.username });
    } catch {
      setUser(null);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
  };

  const handleSwitchToRegister = () => setShowRegister(true);
  const handleSwitchToLogin = () => setShowRegister(false);
  const handleRegister = () => setShowRegister(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {token && (
        <Navbar appName="PennyPal" user={user || undefined} onLogout={handleLogout} />
      )}
      {!token ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showRegister ? (
            <RegisterForm onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />
          ) : (
            <LoginForm onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
          )}
        </div>
      ) : (
        <ExpenseTracker token={token} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;