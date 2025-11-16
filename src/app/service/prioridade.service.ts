import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Motivo} from '../model/motivo.model';
import {Prioridade} from '../model/prioridade.model';

@Injectable({providedIn: 'root'})
export class PrioridadeService {
  private apiUrl = 'http://localhost:8080/prioridades';
  private client = inject(HttpClient);

  getAll(): Observable<Prioridade[]>{
    return this.client.get<Prioridade[]>(this.apiUrl)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  private handleError(error: any):Observable<never> {
    let errorMessage = 'Ocorreu um erro interno. Tente novamente mais tarde';

    switch (error.status) {
      case 400:
        errorMessage = error.error.errorList.join(', ');
        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
    }

    return throwError(() => ({message: errorMessage}));
  }
}
