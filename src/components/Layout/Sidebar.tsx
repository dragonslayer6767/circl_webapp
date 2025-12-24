import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../utils/colors';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/forum',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      id: 'network',
      label: 'Network',
      path: '/network',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      id: 'circles',
      label: 'Circles',
      path: '/circles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'growth',
      label: 'Growth Hub',
      path: '/growth',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/messages',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`hidden md:flex md:flex-col fixed left-0 top-16 bottom-0 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors z-50"
        style={{ color: COLORS.primary }}
      >
        <svg
          className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div 
          className="p-6 border-b border-white/20 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => navigate('/profile')}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {user?.fullname ? user.fullname.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.fullname || 'User'}
              </p>
              <p className="text-xs text-white/70 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 border-b border-white/20 flex justify-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: COLORS.yellow }}
            onClick={() => navigate('/profile')}
          >
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-all ${
                active 
                  ? 'bg-white/20 rounded-xl mx-3' 
                  : 'hover:bg-white/10'
              }`}
              style={{ color: 'white' }}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={isCollapsed ? 'mx-auto' : ''}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
