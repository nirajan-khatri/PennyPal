import React from 'react';
import Avatar, { AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

interface NavbarProps {
  appName: string;
  user?: { name?: string; email?: string };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ appName, user, onLogout }) => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-primary">{appName}</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{user.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">{user.name || user.email}</span>
          </div>
        )}
        <Button variant="outline" onClick={onLogout} className="ml-2">Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar; 