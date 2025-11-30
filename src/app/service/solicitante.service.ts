import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {SolicitanteInsert, SolicitanteModel, SolicitanteUpdate} from '../model/solicitante.model';

@Injectable({providedIn: 'root'})
export class SolicitanteService{
  private apiUrl = 'http://localhost:8080/solicitantes';

  constructor(private client: HttpClient) {}

  create(solicitante: SolicitanteInsert): Observable<SolicitanteModel> {
    return this.client.post<SolicitanteModel>(this.apiUrl, solicitante)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }


  getLoggedSolicitante(): Observable<SolicitanteModel>{
    return this.client.get<SolicitanteModel>(`${this.apiUrl}/me`)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  getById(id: number): Observable<SolicitanteModel> {
    return this.client.get<SolicitanteModel>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getAll(id?: number, nome?: string, email?: string): Observable<SolicitanteModel[]> {
    let params = new HttpParams();

    if (id) params = params.set('id', id.toString());
    if (nome) params = params.set('nome', nome);
    if (email) params = params.set('email', email);

    return this.client.get<SolicitanteModel[]>(this.apiUrl, {params})
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  update(id: number, solicitante: SolicitanteUpdate): Observable<SolicitanteModel> {
    return this.client.put<SolicitanteModel>(`${this.apiUrl}/${id}`, solicitante)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde."

    switch (error.status) {
      case 400:
        errorMessage = error.error.errorList ? error.error.errorList.join(', ') : 'Dados inválidos';
        break;
      case 404:
        errorMessage = 'Solicitante não encontrado';
        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
    }

    return throwError(() => ({message: errorMessage}));
  }
}
