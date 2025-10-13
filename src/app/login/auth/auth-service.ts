import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {LoginError, LoginRequest, LoginResponse} from './login-model';
import {catchError, Observable, tap, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private apiUrl = "http://localhost:8080/auth";

  //Usando o client nativo do Angular para fazer as requisições
  constructor(private client: HttpClient) {
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.client.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap({
          next: (response) => {
            // Salva o token no localstorage
            console.log(response);
            localStorage.setItem('auth_token', `Bearer ${response.token}`);
          }
        }),
        catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Tente novamente.';

    if (error.status) {
      switch (error.status) {
        case 400:
          // se o backend mandou uma lista de erros
          if (error.error?.errorList?.length) {
            errorMessage = error.error.errorList.join(', ');
          } else {
            errorMessage = 'E-mail ou senha inválidos';
          }
          break;

        default:
          // tenta extrair mensagens personalizadas
          if (error.error?.errorList?.length) {
            errorMessage = error.error.errorList.join(', ');
          } else {
            errorMessage = error.error?.message || errorMessage;
          }
          break;
      }
    }

    return throwError(() => ({
      message: errorMessage,
      status: error.status
    }));
  }


}
