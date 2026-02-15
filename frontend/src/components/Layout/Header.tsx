import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            EcoSense Prep
          </Link>
          
          {isAuthenticated && (
            <nav className="flex items-center space-x-6">
              {user?.role === 'student' ? (
                <>
                  <Link to="/dashboard" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                  <Link to="/practice" className="hover:text-blue-200">
                    Practice
                  </Link>
                  <Link to="/progress" className="hover:text-blue-200">
                    Progress
                  </Link>
                  <Link to="/resume" className="hover:text-blue-200">
                    Resume
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                  <Link to="/admin/questions" className="hover:text-blue-200">
                    Questions
                  </Link>
                  <Link to="/admin/users" className="hover:text-blue-200">
                    Users
                  </Link>
                  <Link to="/admin/reports" className="hover:text-blue-200">
                    Reports
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
