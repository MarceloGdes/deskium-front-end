import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Categoria} from '../model/categoria.model';

@Injectable({providedIn: 'root'})
export class CategoriaService{
  private apiUrl = 'http://localhost:8080/categorias';

  constructor(private client: HttpClient) {
  }

  getAll(): Observable<Categoria[]>{
    return this.client.get<Categoria[]>(this.apiUrl)
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
