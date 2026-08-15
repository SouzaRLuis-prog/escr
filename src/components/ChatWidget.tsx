'use client';

import { useEffect } from 'react';
import { VictimData } from '@/types/victim';

declare global {
  interface Window {
    chatwootSettings: any;
    chatwootSDK: any;
    $chatwoot: any;
  }
}

export default function ChatWidget({ victimData }: { victimData: VictimData }) {
  useEffect(() => {
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'pt_BR',
      type: 'expanded_bubble',
    };

    const formatAgressao = (tipo: string) => {
      const mapa: Record<string, string> = {
        fisica: '1 - Física',
        psicologica: '2 - Psicológica',
        sexual: '3 - Sexual',
        patrimonial: '4 - Patrimonial',
        moral: '5 - Moral',
        importunacao_sexual: '6 - Importunação Sexual',
      };
      return mapa[tipo] || tipo;
    };

    const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '');

    (function (d, t) {
      var g = d.createElement(t) as HTMLScriptElement;
      var s = d.getElementsByTagName(t)[0];
      
      g.src = `${BASE_URL}/packs/js/sdk.js`;
      g.defer = true;
      g.async = true;
      s.parentNode?.insertBefore(g, s);

      g.onload = function () {
        window.chatwootSDK.run({
          websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '',
          baseUrl: BASE_URL,
        });

        window.addEventListener('chatwoot:ready', () => {
          if (window.$chatwoot) {
            const tipoDesc = formatAgressao(victimData.tipoAgressao);
            const bairroDesc = victimData.bairro || 'Não informado';
            const locationDesc = victimData.locationUrl 
              ? ` | GPS: ${victimData.locationUrl}` 
              : '';

            window.$chatwoot.setUser(Date.now().toString(), {
              name: victimData.nome || 'Anônima',
              description: `Bairro: ${bairroDesc} | Violência: ${tipoDesc}${locationDesc}`,
            });

            window.$chatwoot.toggle('open');
          }
        });
      };
    })(document, "script");
  }, [victimData]);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl text-center shadow-2xl border border-pink-500/20 max-w-md w-full">
      <h3 className="text-xl font-bold text-pink-400 mb-2">Conectando ao Atendimento...</h3>
      <p className="text-slate-300 text-sm mb-4">
        Sua conversa é <strong>100% privada e segura</strong>. O chat de atendimento foi aberto no canto da tela.
      </p>
      <div className="animate-pulse text-pink-500 font-semibold text-sm flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-pink-500"></span>
        Atendimento Ativo
      </div>
    </div>
  );
}