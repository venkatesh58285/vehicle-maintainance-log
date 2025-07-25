import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const base = 'px-5 py-2.5 border-none rounded-md text-base cursor-pointer transition-colors duration-300 font-medium';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-800',
    secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-900',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary}`}
    >
      {children}
    </button>
  );
};

export default Button; 