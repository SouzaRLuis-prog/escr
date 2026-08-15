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
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_URL || 'https://chat.ndsouza.online';
    const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || 'shnBF1V8W4c6zavATq6VhAXr';

    // Injeta CSS para ajustar o modal em mobile
    const styleId = 'chatwoot-custom-style';
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

    // Função de preenchimento de dados
    const handleChatwootReady = () => {
      if (!window.$chatwoot) return;

      const userId = `victim_${Date.now()}`;
      const name = victimData.nome?.trim() ? victimData.nome : 'Anônima';

      const attributesPayload = {
        cpf: victimData.cpf || 'Não informado',
        bairro: victimData.bairro || 'Não informado',
        tipo_agressao: victimData.tipoAgressao || 'Não informado',
        localizacao_gps: victimData.locationUrl || 'Não fornecida',
      };

      // 1. Identifica o usuário e envia os custom attributes
      window.$chatwoot.setUser(userId, {
        name: name,
        custom_attributes: attributesPayload,
      });

      // 2. Reforça o envio dos atributos na sessão atual do widget
      window.$chatwoot.setCustomAttributes(attributesPayload);

      // 3. Abre a janela de atendimento
      setTimeout(() => {
        window.$chatwoot.toggle('open');
      }, 400);
    };

    window.addEventListener('chatwoot:ready', handleChatwootReady);

    // Injeção dinâmica da SDK
    const scriptId = 'chatwoot-sdk-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
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
        }
      };

      document.head.appendChild(script);
    } else if (window.$chatwoot) {
      handleChatwootReady();
    }

    return () => {
      window.removeEventListener('chatwoot:ready', handleChatwootReady);
    };
  }, [victimData]);

  return (
    <div className="bg-neutral-950 border border-pink-500/30 p-6 rounded-3xl text-center shadow-[0_0_30px_rgba(255,20,147,0.15)] space-y-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 border border-pink-500/30">
        <span className="text-2xl">🛡️</span>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-white">Canal Aberto</h2>
        <p className="text-xs text-neutral-400 mt-1">Conexão segura e sigilosa estabelecida.</p>
      </div>

      <div className="bg-neutral-900/80 p-3.5 rounded-2xl text-left text-xs space-y-1.5 border border-neutral-800">
        <p><strong className="text-pink-400">Nome:</strong> {victimData.nome || 'Anônima'}</p>
        <p><strong className="text-pink-400">CPF:</strong> {victimData.cpf || 'Não informado'}</p>
        <p><strong className="text-pink-400">Região:</strong> {victimData.bairro || 'Não informada'}</p>
        {victimData.locationUrl && (
          <p className="text-emerald-400 font-semibold">📍 GPS Enviado para a equipe</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => window.$chatwoot && window.$chatwoot.toggle('open')}
        className="w-full bg-pink-600 hover:bg-pink-500 text-black font-extrabold py-3 rounded-2xl transition-all uppercase text-xs tracking-wider cursor-pointer"
      >
        Abrir Janela de Mensagens
      </button>
    </div>
  );
}