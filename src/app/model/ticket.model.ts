import {Motivo} from './motivo.model';
import {Categoria} from './categoria.model';
import {Solicitante} from './solicitante.model';
import {Arquivo} from './arquivo.model';
import {SubStatus} from './sub-status.model';
import {UsuarioModel} from './usuario.model';

export interface CreateTicketRequest {
  titulo: string,
  motivoId: number | undefined,
  categoriaId: number | undefined,
  descricaoHtml: string,
  arquivos: Arquivo[] | undefined
}

export interface TicketModel {
  id: number;
  criadoEm: Date;
  titulo: string;
  previsaoResolucao?: string;
  dataResolucao?: string;
  previsaoPrimeiraResposta?: string;
  dataPrimeiraResposta?: string;
  horasApontadas?: number;
  status: string;
  solicitante: Solicitante;
  suporte: Suporte;
  motivo: Motivo;
  categoria?: Categoria;
  subStatus: SubStatus;
  prioridade?: string;
  acoes?: AcaoModel[];
}


export interface Suporte {
  id: number;
  nomeCompleto: string;
  email: string;
  tipoUsuario: string;
  ativo: boolean;
}

export interface AcaoModel {
  numAcao: number;
  criadoEm: string;
  acaoInterna: boolean;
  dataAtendimento: string | null;
  inicioAtendimento: string | null;
  fimAtendimento: string | null;
  autor: UsuarioModel;
  html: string;
  origemAcao: string;
  anexos?: Arquivo[]
}

export interface AddAcaoModel {
  acaoInterna: boolean,
  html: string,
  anexos?: Arquivo[]
}
