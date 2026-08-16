'use client';

import { useEffect } from 'react';
import { VictimData } from '@/types/victim';

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot: {
      setUser: (
        identifier: string,
        userObject: {
          name?: string;
          custom_attributes?: Record<string, unknown>;
        }
      ) => void;
      setCustomAttributes: (attributes: Record<string, unknown>) => void;
      toggle: (state?: string) => void;
    };
  }
}

interface ChatWidgetProps {
  victimData: VictimData;
}

export default function ChatWidget({ victimData }: ChatWidgetProps) {
  useEffect(() => {
    // 1. URLs e Tokens apontando diretamente para o seu domínio oficial
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_URL || 'https://chat.ndsouza.online';
    const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || 'shnBF1V8W4c6zavATq6VhAXr';

    // 2. Injeta CSS para garantir exibição total no mobile
    const styleId = 'chatwoot-mobile-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media (max-width: 667px) {
          .woot-widget-holder {
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
          .woot--bubble-holder {
            bottom: 20px !important;
            right: 20px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // 3. Evita duplicar a injeção do SDK se ele já existir no DOM
    const scriptId = 'chatwoot-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const setupChatwootUser = () => {
      const userId = `victim_${Date.now()}`;
      const name = victimData.nome?.trim() ? victimData.nome : 'Anônima';

      if (window.$chatwoot) {
        window.$chatwoot.setUser(userId, {
          name: name,
          custom_attributes: {
            cpf: victimData.cpf || 'Não informado',
            bairro: victimData.bairro || 'Não informado',
            tipo_agressao: victimData.tipoAgressao || 'Não informado',
            localizacao_gps: victimData.locationUrl || 'Não fornecida',
          },
        });

        setTimeout(() => {
          window.$chatwoot.toggle('open');
        }, 300);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `${baseUrl}/packs/js/sdk.js`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken,
            baseUrl,
          });

          window.addEventListener('chatwoot:ready', setupChatwootUser);
        }
      };

      document.head.appendChild(script);
    } else if (window.$chatwoot) {
      setupChatwootUser();
    }
  }, [victimData]);

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border)] p-6 rounded-3xl text-center shadow-xl shadow-[var(--primary-soft)]/15 space-y-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface-tint)] text-[var(--primary)] border border-[var(--border)]">
        <span className="text-2xl">🛡️</span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[var(--ink)]">Canal Aberto</h2>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          Conexão segura e sigilosa estabelecida.
        </p>
      </div>

      <div className="bg-[var(--surface-tint)] p-3.5 rounded-2xl text-left text-xs space-y-1.5 border border-[var(--border)]">
        <p>
          <strong className="text-[var(--primary)]">Nome:</strong> {victimData.nome || 'Anônima'}
        </p>
        <p>
          <strong className="text-[var(--primary)]">CPF:</strong> {victimData.cpf || 'Não informado'}
        </p>
        <p>
          <strong className="text-[var(--primary)]">Região:</strong>{' '}
          {victimData.bairro || 'Não informada'}
        </p>
        {victimData.locationUrl && (
          <p className="text-[var(--success)] font-semibold">📍 GPS Enviado para a equipe</p>
        )}
      </div>

      <button
        onClick={() => window.$chatwoot && window.$chatwoot.toggle('open')}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold py-3 rounded-2xl transition-all uppercase text-xs tracking-wider focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/30"
      >
        Abrir Janela de Mensagens
      </button>
    </div>
  );
}