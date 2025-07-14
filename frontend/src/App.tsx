import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ExpenseTracker from './components/Tracker/ExpenseTracker';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // Persist token in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('jwt_token');
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('jwt_token', jwt);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  const handleSwitchToRegister = () => setShowRegister(true);
  const handleSwitchToLogin = () => setShowRegister(false);
  const handleRegister = () => setShowRegister(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {!token ? (
        showRegister ? (
          <RegisterForm onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
        )
      ) : (
        <ExpenseTracker token={token} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;