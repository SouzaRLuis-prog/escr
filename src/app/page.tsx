'use client';

import { useState } from 'react';
import Image from 'next/image';
import QuickExitBtn from '@/components/QuickExitBtn';
import ChatWidget from '@/components/ChatWidget';
import { VictimData, TipoAgressao } from '@/types/victim';

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'form' | 'loading' | 'chat'>('welcome');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const [victimData, setVictimData] = useState<VictimData>({
    nome: '',
    cpf: '',
    bairro: '',
    tipoAgressao: 'nao_informado',
    locationUrl: '',
  });

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
      () => {
        setGettingLocation(false);
        alert('Não foi possível obter a localização. Preencha o bairro se preferir.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => setStep('chat'), 1000);
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-pink-50 via-rose-50/50 to-white text-zinc-800 flex flex-col items-center justify-between p-4 relative font-sans">
      <QuickExitBtn />

      {/* Topo / Header estilizado */}
      <header className="pt-6 pb-4 text-center flex flex-col items-center w-full max-w-sm">
        <div className="relative w-28 h-28 mb-3 bg-white p-3 rounded-full shadow-md shadow-pink-200/60 border border-pink-100 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo Escudo Rosa"
            width={112}
            height={112}
            className="object-contain w-full h-full"
            priority
            unoptimized
          />
        </div>
        <p className="text-pink-700 text-xs font-bold uppercase tracking-widest">
          Canal Seguro de Apoio e Proteção
        </p>
      </header>

      {/* Conteúdo Dinâmico */}
      <section className="w-full max-w-sm my-auto py-2">
        {step === 'welcome' && (
          <div className="bg-white/90 backdrop-blur-md border border-pink-200/80 p-6 rounded-3xl text-center shadow-xl shadow-pink-100 space-y-5">
            <h2 className="text-2xl font-black text-rose-600 tracking-tight">
              Você não está sozinha.
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Espaço 100% seguro e sigiloso para atendimento de emergência, acolhimento e orientação legal.
            </p>
            <button
              onClick={() => setStep('form')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-rose-200 active:scale-95 cursor-pointer text-base uppercase tracking-wider"
            >
              Iniciar Atendimento
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmitForm} className="bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 rounded-3xl shadow-xl shadow-pink-100 space-y-3.5">
            <div className="text-center pb-1">
              <h2 className="text-xl font-black text-rose-600">Triagem Opcional</h2>
              <p className="text-[11px] text-zinc-500">Nenhum campo é obrigatório. Preencha apenas o que se sentir confortável.</p>
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Nome ou Apelido (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Maria"
                value={victimData.nome}
                onChange={(e) => setVictimData({ ...victimData, nome: e.target.value })}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">CPF (Opcional)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={victimData.cpf}
                onChange={(e) => setVictimData({ ...victimData, cpf: e.target.value })}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bairro ou Cidade (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Centro"
                value={victimData.bairro}
                onChange={(e) => setVictimData({ ...victimData, bairro: e.target.value })}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Localização Atual GPS (Opcional)</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation || locationCaptured}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  locationCaptured
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : 'bg-pink-50/60 border-pink-200 hover:border-rose-400 text-rose-700'
                }`}
              >
                {gettingLocation ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></span>
                    Capturando GPS...
                  </>
                ) : locationCaptured ? (
                  <>📍 GPS Compartilhado com Sucesso ✓</>
                ) : (
                  <>📍 Enviar Localização Atual (GPS)</>
                )}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Tipo de Situação (Opcional)</label>
              <select
                value={victimData.tipoAgressao}
                onChange={(e) => setVictimData({ ...victimData, tipoAgressao: e.target.value as TipoAgressao })}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-sm text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
              >
                <option value="nao_informado">Preferiu não informar</option>
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
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer uppercase text-sm tracking-wider pt-3"
            >
              Ir para o Chat Seguro
            </button>
          </form>
        )}

        {step === 'loading' && (
          <div className="bg-white/90 backdrop-blur-md border border-pink-200/80 p-8 rounded-3xl text-center shadow-xl shadow-pink-100">
            <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-zinc-800 mb-1">Abrindo Chat Seguro...</h3>
            <p className="text-xs text-zinc-500">Garantindo conexão privada.</p>
          </div>
        )}

        {step === 'chat' && <ChatWidget victimData={victimData} />}
      </section>

      <footer className="pb-4 text-center text-[10px] text-zinc-500 font-medium">
        &copy; Escudo Rosa — Apoio Emergencial à Mulher
      </footer>
    </main>
  );
}