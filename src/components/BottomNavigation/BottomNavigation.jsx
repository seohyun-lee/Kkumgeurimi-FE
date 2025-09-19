import React from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { BOTTOM_NAV_ITEMS } from '../../config/nav.jsx';
import './BottomNavigation.css';

const BottomNavigation = ({ onTabChange }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleTabClick = (item) => {
    onTabChange?.(item.id, item.path);
    navigate(item.path, { replace: false });
  };

  return (
    <nav className="bottom-navigation" role="navigation" aria-label="하단 내비게이션">
      <div className="bottom-navigation__container">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.id}
              className={`bottom-navigation__item ${active ? 'active' : ''}`}
              onClick={() => handleTabClick(item)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="bottom-navigation__icon">
                <Icon isActive={active} />
              </div>
              <span className="bottom-navigation__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
