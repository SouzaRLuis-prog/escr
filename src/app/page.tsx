'use client';

import { useState } from 'react';
import Image from 'next/image';
import QuickExitBtn from '@/components/QuickExitBtn';
import ChatWidget from '@/components/ChatWidget';
import { VictimData, TipoAgressao } from '@/types/victim';
import { themes, ACTIVE_THEME, themeToCSSVars } from '@/config/theme';

// Tema aplicado a toda a página via CSS variables (--primary, --ink, etc.).
// Para trocar o esquema de cores do site, edite `src/config/theme.ts`.
const theme = themeToCSSVars(themes[ACTIVE_THEME]);

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
    <main
      style={theme}
      className="min-h-[100dvh] bg-[var(--surface-tint)] text-[var(--ink)] flex flex-col items-center justify-between p-4 relative font-sans"
    >
      <QuickExitBtn />

      {/* Cabeçalho */}
      <header className="pt-7 pb-5 text-center flex flex-col items-center w-full max-w-sm">
        <div className="relative w-24 h-24 mb-4 bg-[var(--surface-card)] p-2.5 rounded-full shadow-lg shadow-[var(--primary-soft)]/25 border border-[var(--border)] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo Escudo Rosa"
            width={96}
            height={96}
            className="object-contain w-full h-full"
            priority
            unoptimized
          />
        </div>

        <h1 className="text-xl font-black tracking-tight text-[var(--ink)]">Escudo Rosa</h1>
        <p className="text-[var(--primary)] text-[11px] font-bold uppercase tracking-widest mt-1">
          Canal Seguro de Apoio e Proteção
        </p>

        {/* Selo de confiança — reforça segurança e legitimidade do canal */}
        <div className="flex items-center gap-1.5 mt-4">
          <TrustBadge icon="lock" label="Sigiloso" />
          <TrustBadge icon="heart" label="Gratuito" />
          <TrustBadge icon="clock" label="24 horas" />
        </div>
      </header>

      {/* Conteúdo dinâmico */}
      <section className="w-full max-w-sm my-auto py-2">
        {step === 'welcome' && (
          <div className="bg-[var(--surface-card)] border border-[var(--border)] p-6 rounded-3xl text-center shadow-xl shadow-[var(--primary-soft)]/15 space-y-5">
            <h2 className="text-2xl font-black text-[var(--primary)] tracking-tight leading-snug">
              Você não está sozinha.
            </h2>
            <p className="text-[var(--ink-muted)] text-sm leading-relaxed">
              Espaço 100% seguro e sigiloso para atendimento de emergência, acolhimento e
              orientação legal.
            </p>
            <button
              onClick={() => setStep('form')}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[var(--primary-soft)]/40 active:scale-95 cursor-pointer text-base uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/30"
            >
              Iniciar Atendimento
            </button>
            <p className="text-[10px] text-[var(--ink-muted)]">
              Em caso de perigo imediato, ligue <span className="font-bold">190</span>.
            </p>
          </div>
        )}

        {step === 'form' && (
          <form
            onSubmit={handleSubmitForm}
            className="bg-[var(--surface-card)] border border-[var(--border)] p-5 rounded-3xl shadow-xl shadow-[var(--primary-soft)]/15 space-y-5"
          >
            <div className="text-center pb-1">
              <h2 className="text-xl font-black text-[var(--primary)]">Triagem Opcional</h2>
              <p className="text-[11px] text-[var(--ink-muted)] mt-1">
                Nenhum campo é obrigatório. Preencha apenas o que se sentir confortável.
              </p>
            </div>

            <fieldset className="space-y-3.5">
              <legend className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Seus dados
              </legend>

              <Field label="Nome ou Apelido (Opcional)">
                <input
                  type="text"
                  placeholder="Ex: Maria"
                  value={victimData.nome}
                  onChange={(e) => setVictimData({ ...victimData, nome: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="CPF (Opcional)">
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={victimData.cpf}
                  onChange={(e) => setVictimData({ ...victimData, cpf: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </fieldset>

            <fieldset className="space-y-3.5">
              <legend className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Situação e localização
              </legend>

              <Field label="Bairro ou Cidade (Opcional)">
                <input
                  type="text"
                  placeholder="Ex: Centro"
                  value={victimData.bairro}
                  onChange={(e) => setVictimData({ ...victimData, bairro: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="Localização Atual GPS (Opcional)">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation || locationCaptured}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    locationCaptured
                      ? 'bg-[var(--success-soft)] border-[var(--success)] text-[var(--success)]'
                      : 'bg-[var(--surface-tint)] border-[var(--border)] hover:border-[var(--primary)] text-[var(--primary)]'
                  }`}
                >
                  {gettingLocation ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                      Capturando GPS...
                    </>
                  ) : locationCaptured ? (
                    <>📍 GPS Compartilhado com Sucesso ✓</>
                  ) : (
                    <>📍 Enviar Localização Atual (GPS)</>
                  )}
                </button>
              </Field>

              <Field label="Tipo de Situação (Opcional)">
                <select
                  value={victimData.tipoAgressao}
                  onChange={(e) =>
                    setVictimData({ ...victimData, tipoAgressao: e.target.value as TipoAgressao })
                  }
                  className={inputClass}
                >
                  <option value="nao_informado">Preferiu não informar</option>
                  <option value="fisica">1 - Agressão Física</option>
                  <option value="psicologica">2 - Violência Psicológica</option>
                  <option value="sexual">3 - Violência Sexual</option>
                  <option value="patrimonial">4 - Violência Patrimonial</option>
                  <option value="moral">5 - Violência Moral</option>
                  <option value="importunacao_sexual">6 - Importunação Sexual</option>
                </select>
              </Field>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md shadow-[var(--primary-soft)]/40 cursor-pointer uppercase text-sm tracking-wider focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/30"
            >
              Ir para o Chat Seguro
            </button>
          </form>
        )}

        {step === 'loading' && (
          <div className="bg-[var(--surface-card)] border border-[var(--border)] p-8 rounded-3xl text-center shadow-xl shadow-[var(--primary-soft)]/15">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">Abrindo Chat Seguro...</h3>
            <p className="text-xs text-[var(--ink-muted)]">Garantindo conexão privada.</p>
          </div>
        )}

        {step === 'chat' && <ChatWidget victimData={victimData} />}
      </section>

      <footer className="pb-4 text-center text-[10px] text-[var(--ink-muted)] font-medium">
        &copy; Escudo Rosa — Apoio Emergencial à Mulher
      </footer>
    </main>
  );
}

/** Rótulo + campo, com espaçamento e tipografia consistentes em todo o formulário. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[var(--ink)]/80 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-[var(--surface-tint)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/70 focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--surface-card)] transition-colors';

/** Selo curto de confiança (sigilo, gratuidade, disponibilidade) exibido no topo. */
function TrustBadge({ icon, label }: { icon: 'lock' | 'heart' | 'clock'; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink-muted)] text-[10px] font-semibold px-2.5 py-1 rounded-full">
      <TrustIcon icon={icon} />
      {label}
    </span>
  );
}

function TrustIcon({ icon }: { icon: 'lock' | 'heart' | 'clock' }) {
  const common = { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--primary)', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (icon === 'lock') {
    return (
      <svg {...common}>
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }
  if (icon === 'heart') {
    return (
      <svg {...common}>
        <path d="M12 20.5s-7.5-4.6-9.7-9.1C.6 8 2 4.5 5.6 3.9c2-.3 3.8.7 4.9 2.4C11.6 4.6 13.4 3.6 15.4 3.9c3.6.6 5 4.1 3.3 7.5C16.5 15.9 12 20.5 12 20.5Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
