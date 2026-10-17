import React from 'react';
import { motion } from 'framer-motion';
import audioManager from '../../audio/AudioManager';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'magenta' | 'neutral' | 'danger';
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'cyan',
  className = '',
  disabled = false,
  id,
}) => {
  const handleHover = () => {
    if (!disabled) {
      audioManager.playSFX('button_hover');
    }
  };

  const handleClick = () => {
    if (!disabled) {
      audioManager.playSFX('button_click');
      if (onClick) onClick();
    }
  };

  const variantClasses = {
    cyan: 'bg-transparent text-[#00f0ff] border-2 border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:bg-[#00f0ff] hover:text-[#0a0718] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:border-[#00f0ff]',
    magenta: 'bg-transparent text-[#ff00ff] border-2 border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.1)] hover:bg-[#ff00ff] hover:text-[#0a0718] hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:border-[#ff00ff]',
    neutral: 'bg-white/10 text-white border border-white/20 hover:bg-white/25 hover:border-white/40',
    danger: 'bg-transparent text-red-500 border-2 border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
  };

  return (
    <motion.button
      id={id}
      disabled={disabled}
      onMouseEnter={handleHover}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`font-display font-bold tracking-wide uppercase px-6 py-3 rounded-xl transition-colors duration-200 focus:outline-none cursor-pointer ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
