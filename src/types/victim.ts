export type TipoAgressao = 
  | 'fisica' 
  | 'psicologica' 
  | 'sexual' 
  | 'patrimonial' 
  | 'moral' 
  | 'importunacao_sexual'
  | 'nao_informado';

export interface VictimData {
  nome?: string;
  cpf?: string;
  bairro?: string;
  tipoAgressao?: TipoAgressao;
  locationUrl?: string;
}