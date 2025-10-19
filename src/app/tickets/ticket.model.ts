import {Motivo} from '../motivos/motivo.model';
import {Categoria} from '../categorias/categoria.model';
import {Solicitante} from '../solicitantes/solicitante.model';

export interface CreateTicketRequest {
  titulo: string,
  motivoId: number | undefined,
  categoriaId: number | undefined,
  descricaoHtml: string,
  arquivos: Arquivo[] | undefined
}

export interface Arquivo{
  fileName: string
}

export interface Ticket {
  id: number;
  criadoEm: string;
  titulo: string;
  previsaoResolucao: string | null;
  dataResolucao: string | null;
  previsaoPrimeiraResposta: string | null;
  dataPrimeiraResposta: string | null;
  horasApontadas: number | null;
  status: string;
  solicitante: Solicitante;
  suporte: Suporte;
  motivo: Motivo;
  categoria: Categoria;
  subStatus: string;
  prioridade: string | null;
  acoes: Acao[];
}


export interface Suporte {
  id: number;
  nomeCompleto: string;
  email: string;
  tipoUsuario: string;
  ativo: boolean;
}

export interface Acao {
  numAcao: number;
  criadoEm: string;
  acaoInterna: boolean;
  dataAtendimento: string | null;
  inicioAtendimento: string | null;
  fimAtendimento: string | null;
  autor: string;
  html: string;
  origemAcao: string;
}
