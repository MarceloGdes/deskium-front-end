import {Empresa} from './empresa.model';

export interface Solicitante {
  id: number;
  nomeCompleto: string;
  email: string;
  celular: string;
  telefone: string;
  empresa: Empresa;
  cargo: string;
  setor: string;
  observacoes: string;
  ativo: boolean;
}
