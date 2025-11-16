import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {LoginRequest, LoginResponse} from '../../model/login.model';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {UsuarioModel} from '../../model/usuario.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private apiUrl = "http://localhost:8080/auth";
  private router = inject(Router);
  //Usando o client nativo do Angular para fazer as requisições
  private client = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.client.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if(response.token) {
            this.saveToken(response.token);
          }
        }),
        //Interrompe o fluxo e entrega um Observable de erro
        catchError(error => this.handleError(error)
      )
    );
  }

  getAuthenticatedUser(): Observable<UsuarioModel> {
    return this.client.get<UsuarioModel>(this.apiUrl)
  }

  private saveToken(token: string){
    localStorage.setItem('auth_token', `Bearer ${token}`);
  }

  getToken(): string | null{
    return localStorage.getItem('auth_token');
  }

  logout(){
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  //error: any - o objeto de erro que o Angular entrega quando algo falha em uma requisição HTTP
  //Observable<never>: esse método retorna um Observable que nunca emite um valor válido, apenas um erro.
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';

    if (error.error?.errorList?.length > 0) {
      switch (error.status) {
        case 400:
          errorMessage = error.error.errorList.join(', ');
          break;
        case 500:
          errorMessage = 'Erro no servidor. Tente mais tarde.';
          break;
      }
    }

    //cria um Observable que lança um erro imediatamente. Classe que chamou o .Subscribe que trata
    return throwError(() => ({
      message: errorMessage
    }));
  }
}
