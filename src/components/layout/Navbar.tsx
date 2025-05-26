import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { 
  Flag, 
  Trophy, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  User,
  Home 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-accent-950 border-b border-accent-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Flag size={24} className="text-primary-600 mr-2" />
              <span className="font-racing font-bold text-xl">F1 Bets</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/home"
                  className="text-accent-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Home size={18} className="mr-1" />
                  Home
                </Link>
                <Link 
                  to="/races"
                  className="text-accent-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Flag size={18} className="mr-1" />
                  Races
                </Link>
                <Link 
                  to="/leagues"
                  className="text-accent-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Users size={18} className="mr-1" />
                  Leagues
                </Link>
                <Link 
                  to="/standings"
                  className="text-accent-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Trophy size={18} className="mr-1" />
                  Standings
                </Link>
                <Link
                  to="/profile"
                  className="text-accent-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center mr-2"
                >
                  <User size={18} className="mr-1" />
                  Profil
                </Link>

                <div className="pl-4 ml-4 border-l border-accent-800 flex items-center">
                  <div className="mr-3">
                    <div className="text-sm font-medium text-white">
                      {user?.firstname} {user?.lastname}
                    </div>
                    <div className="text-xs text-accent-400">
                      {user?.email}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-accent-400 hover:text-white"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-accent-400 hover:text-white hover:bg-accent-900 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-accent-900 border-t border-accent-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-b border-accent-800">
                  <div className="flex items-center">
                    <User size={18} className="text-accent-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user?.firstname} {user?.lastname}
                      </div>
                      <div className="text-xs text-accent-400 truncate max-w-[200px]">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/home"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Home size={18} className="mr-2" />
                    Home
                  </div>
                </Link>
                <Link
                  to="/races"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Flag size={18} className="mr-2" />
                    Races
                  </div>
                </Link>
                <Link
                  to="/leagues"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Users size={18} className="mr-2" />
                    Leagues
                  </div>
                </Link>
                <Link
                  to="/standings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Trophy size={18} className="mr-2" />
                    Standings
                  </div>
                </Link>
                <Link
  to="/profile"
  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
  onClick={() => setMobileMenuOpen(false)}
>
  <div className="flex items-center">
    <User size={18} className="mr-2" />
    Profil
  </div>
</Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-accent-800"
                >
                  <div className="flex items-center text-primary-500">
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" fullWidth>
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;