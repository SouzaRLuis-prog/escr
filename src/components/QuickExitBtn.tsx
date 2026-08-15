'use client';

export default function QuickExitBtn() {
  const handleQuickExit = () => {
    // Redireciona imediatamente para um site neutro por segurança
    window.location.replace('https://www.g1.globo.com');
  };

  return (
    <button
      onClick={handleQuickExit}
      className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg z-50 text-sm flex items-center gap-2 transition-all cursor-pointer"
    >
      🚨 SAÍDA RÁPIDA
    </button>
  );
}