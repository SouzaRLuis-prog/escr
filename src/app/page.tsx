'use client';

import { useState } from 'react';
import QuickExitBtn from '@/components/QuickExitBtn';
import ChatWidget from '@/components/ChatWidget';
import { VictimData } from '@/types/victim';

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'form' | 'loading' | 'chat'>('welcome');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const [victimData, setVictimData] = useState<VictimData>({
    nome: '',
    bairro: '',
    tipoAgressao: 'fisica',
    locationUrl: '',
  });

  // Função para obter localização GPS / Google Maps
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setVictimData((prev) => ({
          ...prev,
          locationUrl: mapsUrl,
        }));

        setGettingLocation(false);
        setLocationCaptured(true);
      },
      (error) => {
        setGettingLocation(false);
        alert('Não foi possível obter a localização exata. Por favor, digite o bairro manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => setStep('chat'), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative">
      <QuickExitBtn />

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-pink-500 tracking-tight mb-2">
          🛡️ Escudo Rosa
        </h1>
        <p className="text-slate-400 text-sm">Canal Seguro de Apoio e Proteção</p>
      </header>

      {step === 'welcome' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Você não está sozinha.</h2>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">
            Este é um espaço seguro e sigiloso para pedir ajuda, orientação ou atendimento de emergência.
          </p>
          <button
            onClick={() => setStep('form')}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-600/30 cursor-pointer"
          >
            Iniciar Atendimento Seguro
          </button>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmitForm} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-pink-400">Triagem Rápida</h2>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Como prefere ser chamada? (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Maria"
              value={victimData.nome}
              onChange={(e) => setVictimData({ ...victimData, nome: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Bairro / Região</label>
            <input
              type="text"
              required={!locationCaptured}
              placeholder="Ex: Centro"
              value={victimData.bairro}
              onChange={(e) => setVictimData({ ...victimData, bairro: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Botão de Localização Google Maps */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Localização Exata (Opcional / Seguro)</label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation || locationCaptured}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                locationCaptured
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 hover:border-pink-500 text-slate-300'
              }`}
            >
              {gettingLocation ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></span>
                  Obtendo GPS...
                </>
              ) : locationCaptured ? (
                <>📍 Localização enviada via Google Maps ✓</>
              ) : (
                <>📍 Compartilhar minha localização atual (GPS)</>
              )}
            </button>
          </div>

          <div>
  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Agressão / Situação</label>
  <select
    value={victimData.tipoAgressao}
    onChange={(e) => setVictimData({ ...victimData, tipoAgressao: e.target.value as TipoAgressao })}
    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500"
  >
    <option value="fisica">1 - Agressão Física</option>
    <option value="psicologica">2 - Violência Psicológica</option>
    <option value="sexual">3 - Violência Sexual</option>
    <option value="patrimonial">4 - Violência Patrimonial</option>
    <option value="moral">5 - Violência Moral</option>
    <option value="importunacao_sexual">6 - Importunação Sexual</option>
  </select>
</div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Conectar ao Atendimento
          </button>
        </form>
      )}

      {step === 'loading' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-white mb-2">Preparando canal seguro...</h3>
          <p className="text-xs text-slate-400">Aguarde enquanto localizamos um atendente disponível.</p>
        </div>
      )}

      {step === 'chat' && <ChatWidget victimData={victimData} />}
    </main>
  );
}