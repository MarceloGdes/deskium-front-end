export interface LoginRequest{
  email: string,
  senha: string
}

export interface LoginResponse {
  token: string
}

export interface AuthenticatedUser {
  nomeCompleto: string,
  email: string,
  tipoUsuario: string
}
