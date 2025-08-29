import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../config/constants.js';
import './AuthLayout.css';

const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout">
      <div className="auth-layout__container">
        {/* 로고 영역 */}
        <div className="auth-layout__header">
          <div className="auth-layout__logo" onClick={() => navigate(ROUTES.HOME)}>
            <Link className="brand-wordmark">꿈그리미</Link>
          </div>
        </div>

        {/* 인증 폼 영역 */}
        <div className="auth-layout__content">
          <Outlet />
        </div>

        {/* 푸터 */}
        <div className="auth-layout__footer">
          <p className="auth-layout__footer-text">
            © 2025 꿈그리미. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
