import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getIsActive = (itemPath) => {
    const path = location.pathname;
    if (itemPath === '/dashboard') return path === '/dashboard';
    if (itemPath === '/leads/add') return path === '/leads/add';
    if (itemPath === '/leads') return path.startsWith('/leads') && path !== '/leads/add';
    return false;
  };

  const navItemClass = (itemPath) => {
    const active = getIsActive(itemPath);
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
      active
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/leads',     label: 'All Leads', icon: '👥' },
    { to: '/leads/add', label: 'Add Lead',  icon: '➕' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            DZ
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">DZ Infotech</p>
            <p className="text-xs text-gray-500">Sales CRM</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navItemClass(item.to)}
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              DZ
            </div>
            <span className="font-semibold text-sm text-gray-900">DZ CRM</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;