import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  shadow = 'medium',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const shadowClass = `card--shadow-${shadow}`;
  const clickableClass = onClick ? 'card--clickable' : '';
  
  const cardClass = [
    baseClass,
    variantClass,
    paddingClass,
    shadowClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
