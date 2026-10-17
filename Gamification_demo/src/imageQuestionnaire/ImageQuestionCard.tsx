import React from 'react';
import { motion } from 'framer-motion';
import type { ImageOption } from './imageQuestions';

interface ImageQuestionCardProps {
    option: ImageOption;
    isSelected: boolean;
    onSelect: () => void;
}

const ImageQuestionCard: React.FC<ImageQuestionCardProps> = ({
    option,
    isSelected,
    onSelect,
}) => {
    return (
        <motion.div
            onClick={onSelect}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className={`
        relative flex flex-col rounded-2xl cursor-pointer overflow-hidden
        border-2 transition-all duration-300
        ${isSelected
                    ? 'border-[#00f0ff] shadow-[0_0_24px_rgba(0,240,255,0.4)] bg-[rgba(0,240,255,0.05)]'
                    : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,240,255,0.4)] bg-[rgba(15,10,30,0.6)]'
                }
      `}
            role="button"
            aria-pressed={isSelected}
            aria-label={`Option ${option.id}: ${option.label}`}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-900/60">
                <img
                    src={option.imageUrl}
                    alt={option.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                    }}
                />
                {/* Fallback shown only when image fails */}
                <div
                    className="absolute inset-0 hidden items-center justify-center bg-slate-900/80"
                    aria-hidden="true"
                >
                    <span className="text-4xl opacity-50">🖼️</span>
                </div>

                {/* Selected overlay shimmer */}
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent pointer-events-none"
                    />
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Badge */}
                <div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            text-xs font-black transition-all duration-300 border
            ${isSelected
                            ? 'bg-[#00f0ff] border-[#00f0ff] text-black shadow-[0_0_8px_#00f0ff]'
                            : 'bg-slate-800 border-slate-600 text-slate-300'
                        }
          `}
                >
                    {option.id}
                </div>

                {/* Label */}
                <p className={`text-sm leading-snug transition-colors duration-300 ${isSelected ? 'text-white font-medium' : 'text-slate-400'}`}>
                    {option.label}
                </p>

                {/* Check icon */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-[#00f0ff] flex-shrink-0"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 9l3.5 3.5L14 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ImageQuestionCard;
