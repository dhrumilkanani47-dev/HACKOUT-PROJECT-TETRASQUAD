import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingAiButton = ({ onClick, text = "Ask GreenCharge AI" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/ai');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest text-white shadow-elevated hover:bg-forest-600 transition-colors border border-emerald-400/30 font-heading font-semibold text-sm cursor-pointer group"
      aria-label="Ask GreenCharge AI"
    >
      <div className="relative">
        <Sparkles className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>
      <span>{text}</span>
    </motion.button>
  );
};
