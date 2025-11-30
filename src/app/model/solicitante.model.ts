import {Empresa} from './empresa.model';

export interface SolicitanteModel {
  id?: number;
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

export interface SolicitanteInsert {
  nomeCompleto: string;
  email: string;
  senha: string;
  celular: string;
  telefone: string;
  empresaId: number;
  cargo: string;
  setor: string;
  observacoes?: string;
}

export interface SolicitanteUpdate {
  nomeCompleto: string;
  email: string;
  senha?: string;
  celular: string;
  telefone: string;
  empresaId: number;
  cargo: string;
  setor: string;
  observacoes?: string;
  ativo: boolean;
}
