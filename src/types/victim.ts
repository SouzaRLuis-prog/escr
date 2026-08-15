export type TipoAgressao =
  | 'fisica'
  | 'psicologica'
  | 'sexual'
  | 'patrimonial'
  | 'moral'
  | 'importunacao_sexual';

export interface VictimData {
  nome: string;
  bairro: string;
  tipoAgressao: TipoAgressao;
  locationUrl?: string;
}