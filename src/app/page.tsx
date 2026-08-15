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
    <main className="min-h-[100dvh] bg-black text-pink-50 flex flex-col items-center justify-between p-4 relative font-sans">
      <QuickExitBtn />

      {/* Header com Logo Temática */}
      <header className="pt-6 pb-4 text-center flex flex-col items-center w-full max-w-sm">
        <div className="relative w-24 h-24 mb-2 drop-shadow-[0_0_15px_rgba(255,20,147,0.4)]">
          <Image
            src="/image-removebg-preview.png"
            alt="Logo Escudo Rosa"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-pink-300 text-xs font-medium uppercase tracking-widest">
          Canal Seguro de Apoio e Proteção
        </p>
      </header>

      {/* Conteúdo Dinâmico */}
      <section className="w-full max-w-sm my-auto py-2">
        {step === 'welcome' && (
          <div className="bg-neutral-950 border border-pink-500/30 p-6 rounded-3xl text-center shadow-[0_0_30px_rgba(255,20,147,0.15)] space-y-5">
            <h2 className="text-2xl font-black text-pink-500 tracking-tight">
              Você não está sozinha.
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Espaço 100% seguro e sigiloso para atendimento de emergência, acolhimento e orientação legal.
            </p>
            <button
              onClick={() => setStep('form')}
              className="w-full bg-pink-600 hover:bg-pink-500 text-black font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,20,147,0.4)] active:scale-95 cursor-pointer text-base uppercase tracking-wider"
            >
              Iniciar Atendimento
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmitForm} className="bg-neutral-950 border border-pink-500/30 p-5 rounded-3xl shadow-[0_0_30px_rgba(255,20,147,0.15)] space-y-3.5">
            <div className="text-center pb-1">
              <h2 className="text-xl font-black text-pink-500">Triagem Opicional</h2>
              <p className="text-[11px] text-pink-300/70">Nenhum campo é obrigatório. Preencha apenas o que se sentir confortável.</p>
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold text-pink-300 mb-1">Nome ou Apelido (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Maria"
                value={victimData.nome}
                onChange={(e) => setVictimData({ ...victimData, nome: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pink-300 mb-1">CPF (Opcional)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={victimData.cpf}
                onChange={(e) => setVictimData({ ...victimData, cpf: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pink-300 mb-1">Bairro ou Cidade (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Centro"
                value={victimData.bairro}
                onChange={(e) => setVictimData({ ...victimData, bairro: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pink-300 mb-1">Localização Atual GPS (Opcional)</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation || locationCaptured}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  locationCaptured
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                    : 'bg-neutral-900 border-neutral-800 hover:border-pink-500 text-pink-200'
                }`}
              >
                {gettingLocation ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></span>
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
              <label className="block text-[11px] font-semibold text-pink-300 mb-1">Tipo de Situação (Opcional)</label>
              <select
                value={victimData.tipoAgressao}
                onChange={(e) => setVictimData({ ...victimData, tipoAgressao: e.target.value as TipoAgressao })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
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
              className="w-full bg-pink-600 hover:bg-pink-500 text-black font-extrabold py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,20,147,0.3)] cursor-pointer uppercase text-sm tracking-wider pt-3"
            >
              Ir para o Chat Seguro
            </button>
          </form>
        )}

        {step === 'loading' && (
          <div className="bg-neutral-950 border border-pink-500/30 p-8 rounded-3xl text-center shadow-[0_0_30px_rgba(255,20,147,0.15)]">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-white mb-1">Abrindo Chat Seguro...</h3>
            <p className="text-xs text-neutral-400">Garantindo conexão privada via Back4App.</p>
          </div>
        )}

        {step === 'chat' && <ChatWidget victimData={victimData} />}
      </section>

      <footer className="pb-4 text-center text-[10px] text-neutral-600">
        &copy; Escudo Rosa — Apoio Emergencial à Mulher
      </footer>
    </main>
  );
}