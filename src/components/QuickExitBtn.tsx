'use client';

import { useEffect } from 'react';

export default function QuickExitBtn() {
  const handleQuickExit = () => {
    window.location.replace("www.google.com');
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
      className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg z-50 text-sm flex items-center gap-2 transition-all cursor-pointer"
      title="Pressione ESC para sair rapidamente"
    >
      🚨 SAÍDA RÁPIDA (ESC)
    </button>
  );
}