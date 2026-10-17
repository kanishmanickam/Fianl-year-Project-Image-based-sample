import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'neutral';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  variant = 'cyan',
  className = '',
  onClick,
  id,
}) => {
  const baseClass = 'rounded-2xl transition-all duration-300 backdrop-blur-md';
  
  const variantClasses = {
    cyan: 'glass-panel border-[rgba(0,240,255,0.2)] hover:border-[rgba(0,240,255,0.4)] shadow-[0_0_15px_rgba(0,240,255,0.05)]',
    magenta: 'glass-panel-magenta border-[rgba(255,0,255,0.2)] hover:border-[rgba(255,0,255,0.4)] shadow-[0_0_15px_rgba(255,0,255,0.05)]',
    neutral: 'bg-black/40 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`${baseClass} ${variantClasses[variant]} ${className} ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
