'use client';

import { useEffect } from 'react';

export default function QuickExitBtn() {
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleQuickExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      onClick={handleQuickExit}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 sm:px-4 rounded-full shadow-lg z-50 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-300"
      title="Pressione ESC para sair rapidamente"
    >
      🚨 <span className="hidden sm:inline">SAÍDA RÁPIDA (ESC)</span>
      <span className="sm:hidden">SAIR</span>
    </button>
  );
}
