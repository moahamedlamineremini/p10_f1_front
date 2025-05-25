import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-accent-950 text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 bg-accent-900 border-t border-accent-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="font-racing font-bold text-lg mr-2">F1 Bets</span>
              <span className="text-accent-400 text-sm">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-accent-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-accent-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-accent-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;