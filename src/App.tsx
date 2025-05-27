import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Races from './pages/Races';
import TestGP from './pages/TestGP';
import CreateLeaguePage from './pages/CreateLeaguePage';
import LeaguesPage from './pages/LeaguesPage';
import LeagueDetailsPage from './pages/LeagueDetailsPage';
import TestLeagueUsersPage from './pages/TestLeagueUsersPage';
import Standing from './pages/Standing';
import Profile from './pages/Profile';
import BetPage from './pages/BetPage'; 

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home key={location.key} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/races" 
        element={
          <ProtectedRoute>
            <Races key={location.key} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/standings" 
        element={
          <ProtectedRoute>
            <Standing key={location.key} />
          </ProtectedRoute>
        } 
      />
      <Route path="/test-gp" element={<TestGP />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/leagues/create" element={<CreateLeaguePage />} />
      <Route path="/leagues" element={<LeaguesPage />} />
      <Route path="/leagues/:leagueId" element={<LeagueDetailsPage />} />
      <Route path="/test-league-users" element={<TestLeagueUsersPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/bet/:gpId" 
        element={
          <ProtectedRoute>
            <BetPage /> 
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
