import {Empresa} from '../empresas/empresa.model';

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
