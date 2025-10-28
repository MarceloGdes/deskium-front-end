import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Categoria} from '../model/categoria.model';
import {SubStatus} from '../model/sub-status.model';
import {Status} from '../model/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = 'http://localhost:8080/status';

  constructor(private client: HttpClient) {
  }

  getAll(): Observable<Status[]>{
    return this.client.get<Status[]>(this.apiUrl)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro interno. Tente novamente mais tarde';

    switch (error.status) {
      case 400:
        errorMessage = error.error.errorList.join(', ');
        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
      default:
        errorMessage = error.error?.message || errorMessage;
    }

    return throwError(() => ({message: errorMessage}));
  }
}
