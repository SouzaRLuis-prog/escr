import type { CSSProperties } from 'react';

/**
 * ─────────────────────────────────────────────────────────────
 *  PALETA DE CORES — Escudo Rosa
 * ─────────────────────────────────────────────────────────────
 *  Este arquivo é o ÚNICO lugar que precisa ser editado para
 *  trocar o esquema de cores do site inteiro no futuro.
 *
 *  Como trocar a paleta:
 *  1. Duplique um dos temas abaixo (ex: copie "rosa" e cole com
 *     outro nome, ex: "azul").
 *  2. Troque os valores hexadecimais.
 *  3. Mude ACTIVE_THEME para o nome do novo tema.
 *
 *  Nada mais no site precisa ser tocado — todos os componentes
 *  consomem essas variáveis via CSS custom properties.
 * ─────────────────────────────────────────────────────────────
 */

export interface ThemeTokens {
  /** Nome de exibição do tema (uso interno/documentação) */
  name: string;
  /** Cor principal — CTAs, destaques, ícone ativo */
  primary: string;
  /** Cor principal no hover/active */
  primaryHover: string;
  /** Cor secundária — links, elementos de apoio */
  primarySoft: string;
  /** Fundo geral da página (tom bem suave) */
  surfaceTint: string;
  /** Fundo dos cards (branco ou quase-branco) */
  surfaceCard: string;
  /** Texto de alto contraste (títulos) */
  ink: string;
  /** Texto secundário (parágrafos, legendas) */
  inkMuted: string;
  /** Bordas de inputs e cards */
  border: string;
  /** Cor do anel de foco (acessibilidade de teclado) */
  ring: string;
  /** Verde semântico — confirmações (ex: GPS capturado) */
  success: string;
  successSoft: string;
}

export const themes: Record<string, ThemeTokens> = {
  // Paleta padrão — extraída da identidade visual enviada (Adobe Color)
  rosa: {
    name: 'Rosa (padrão)',
    primary: '#F2359D',
    primaryHover: '#C6297F',
    primarySoft: '#F272B8',
    surfaceTint: '#FDF3FA',
    surfaceCard: '#FFFFFF',
    ink: '#0D0D0D',
    inkMuted: '#6B5C68',
    border: '#F2D8EE',
    ring: '#F2359D',
    success: '#059669',
    successSoft: '#ECFDF5',
  },

  // Exemplo de tema alternativo — troque ACTIVE_THEME para "escudoEscuro"
  // para testar, ou use como modelo para uma paleta nova.
  escudoEscuro: {
    name: 'Escuro (exemplo)',
    primary: '#F2359D',
    primaryHover: '#F272B8',
    primarySoft: '#F272B8',
    surfaceTint: '#160B13',
    surfaceCard: '#221420',
    ink: '#FDF3FA',
    inkMuted: '#C9A8C0',
    border: '#3A2434',
    ring: '#F272B8',
    success: '#34D399',
    successSoft: '#0F2A22',
  },
};

/** Tema ativo no site. Troque aqui para mudar o esquema de cores globalmente. */
export const ACTIVE_THEME: keyof typeof themes = 'rosa';

/** Converte um ThemeTokens em CSS custom properties para aplicar via `style`. */
export function themeToCSSVars(theme: ThemeTokens): CSSProperties {
  return {
    '--primary': theme.primary,
    '--primary-hover': theme.primaryHover,
    '--primary-soft': theme.primarySoft,
    '--surface-tint': theme.surfaceTint,
    '--surface-card': theme.surfaceCard,
    '--ink': theme.ink,
    '--ink-muted': theme.inkMuted,
    '--border': theme.border,
    '--ring': theme.ring,
    '--success': theme.success,
    '--success-soft': theme.successSoft,
  } as CSSProperties;
}
