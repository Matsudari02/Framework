import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      default:
        return 'btn';
    }
  };
  return (
    <button type={type} className={getVariantClass()} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;