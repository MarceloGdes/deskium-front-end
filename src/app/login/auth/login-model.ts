export interface LoginRequest{
  email: string,
  senha: string
}

export interface LoginResponse {
  token: string
}

export interface LoginError {
  errorList: [string]
}
