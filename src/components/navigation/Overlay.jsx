import React from 'react';

export const Overlay = ({ isOpen, onClick }) => {
  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      className={`absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-40 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    />
  );
};

export default Overlay;
