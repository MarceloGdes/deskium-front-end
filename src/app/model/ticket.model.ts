import {Motivo} from './motivo.model';
import {Categoria} from './categoria.model';
import {SolicitanteModel} from './solicitante.model';
import {Arquivo} from './arquivo.model';
import {SubStatus} from './sub-status.model';
import {UsuarioModel} from './usuario.model';
import {Status} from './status.model';
import {Prioridade} from './prioridade.model';

export interface CreateTicketRequest {
  titulo: string,
  motivoId: number | undefined,
  categoriaId: number | undefined,
  descricaoHtml: string,
  arquivos: Arquivo[] | undefined
}

export interface TicketModel {
  id: number;
  criadoEm: string;
  titulo: string;
  previsaoResolucao?: string;
  dataResolucao?: string;
  previsaoPrimeiraResposta?: string;
  dataPrimeiraResposta?: string;
  horasApontadas: string;
  status: Status;
  solicitante: SolicitanteModel;
  suporte: Suporte;
  motivo: Motivo;
  categoria?: Categoria;
  subStatus: SubStatus;
  prioridade?: Prioridade;
  acoes?: AcaoModel[];
  prazoReabertura?: string;
}

export interface UpdateTicketModel {
  motivoId: number,
  categoriaId?: number,
  subStatusId: string,
  prioridadeId?: number
}

export interface Suporte {
  id: number;
  nomeCompleto: string;
  email: string;
  tipoUsuario: string;
  ativo: boolean;
}

export interface AcaoModel {
  id: number
  numAcao: number;
  criadoEm: string;
  acaoInterna: boolean;
  acaoTranscricao: boolean;
  autor: UsuarioModel;
  html: string;
  origemAcao: string;
  anexos?: Arquivo[]
}

export interface AddAcaoModel {
  acaoInterna: boolean,
  acaoTranscricao: boolean;
  statusId: string;
  html: string,
  dataAtendimento?: string,
  inicioAtendimento?: string,
  fimAtendimento?: string,
  anexos?: Arquivo[]
}
