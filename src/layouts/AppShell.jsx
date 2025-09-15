// src/layouts/AppShell.jsx
import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '../config/constants';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation.jsx'
import './AppShell.css';

const AppShell = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };


  const isAssistant = location.pathname.startsWith('/assistant');

  return (
  <div className="app-shell">
    {/* 헤더 (PC 전용) */}
    <header className="app-shell__header">
      <div className="app-shell__header-content">
        <div className="app-shell__logo">
          <Link to={ROUTES.HOME} className="brand-wordmark">꿈그리미</Link>
        </div>


        <div className="app-shell__actions">
          {isAuthenticated ? (
            <button className="app-shell__logout-btn" onClick={handleLogout}>로그아웃</button>
          ) : (
            <button className="app-shell__signin-btn" onClick={() => navigate(ROUTES.SIGNIN)}>로그인</button>
          )}
        </div>
      </div>
    </header>

    {/* 메인 */}
    <main className={`app-shell__main ${isAssistant ? 'app-shell__main--flush' : ''}`}>
      <Outlet />
    </main>

    {/* 모바일 하단 네비 (모바일 전용) */}
    <div className="app-shell__bottomnav">
      <BottomNavigation />
    </div>
  </div>
);
};

export default AppShell;
