import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { useNotification } from '../../context/NotificationContext';
import { COLORS } from '../../utils/colors';
import QuickTaskWidget from './QuickTaskWidget';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const {
    getMessagesBadgeCount,
    getCirclesBadgeCount,
  } = useNotification();

  const navItems: NavItem[] = [
    {
      id: 'circles',
      label: 'Circles',
      path: '/circles',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="7" cy="7" r="3.5" />
          <circle cx="17" cy="7" r="3.5" />
          <circle cx="7" cy="17" r="3.5" />
          <circle cx="17" cy="17" r="3.5" />
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

  const getBadgeCount = (itemId: string): number => {
    switch (itemId) {
      case 'messages':
        return getMessagesBadgeCount();
      case 'circles':
        return getCirclesBadgeCount();
      default:
        return 0;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`hidden md:flex md:flex-col fixed left-0 top-16 bottom-0 transition-all duration-300 z-30 border-r border-white/20 ${
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

      {/* Navigation Items */}
      <nav className="flex-1 py-2 mt-8">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const badgeCount = getBadgeCount(item.id);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-2 px-4 py-2 transition-all relative ${
                active 
                  ? 'bg-white/20 rounded-xl mx-2' 
                  : 'hover:bg-white/10'
              }`}
              style={{ color: 'white' }}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`relative ${isCollapsed ? 'mx-auto' : ''}`}>
                {item.icon}
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span className="font-medium flex-1 text-sm">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Task Widget */}
      <QuickTaskWidget isCollapsed={isCollapsed} />

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
