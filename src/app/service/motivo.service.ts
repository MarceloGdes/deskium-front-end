import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Motivo} from '../model/motivo.model';

@Injectable({providedIn: 'root'})
export class MotivoService {
  private apiUrl = 'http://localhost:8080/motivos';

  constructor(private client: HttpClient) {
  }

  getAll(): Observable<Motivo[]>{
    return this.client.get<Motivo[]>(this.apiUrl)
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
