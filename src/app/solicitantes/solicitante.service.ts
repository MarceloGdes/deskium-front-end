import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Solicitante} from './solicitante.model';

@Injectable({providedIn: 'root'})
export class SolicitanteService{
  private apiUrl = 'http://localhost:8080/solicitantes';

  constructor(private client: HttpClient) {}

  getLoggedSolicitante(): Observable<Solicitante>{
    return this.client.get<Solicitante>(`${this.apiUrl}/me`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  private handleError(error: any):Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde."

    switch (error.status) {
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
      default:
        errorMessage = error.error?.message || errorMessage;
    }

    return throwError(() => ({message: errorMessage}));
  }

}
