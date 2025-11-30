import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Empresa} from '../model/empresa.model';

@Injectable({providedIn: 'root'})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/empresas';

  constructor(private client: HttpClient) {
  }

  create(empresa: Empresa): Observable<Empresa> {
    return this.client.post<Empresa>(this.apiUrl, empresa)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getAll(id?: number, razaoSocial?: string, cnpj?: number): Observable<Empresa[]> {
    let params = new HttpParams();

    if (id) params = params.set('id', id.toString());
    if (razaoSocial) params = params.set('razaoSocial', razaoSocial);
    if (cnpj) params = params.set('cnpj', cnpj);

    return this.client.get<Empresa[]>(this.apiUrl, {params})
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getById(id: number): Observable<Empresa> {
    return this.client.get<Empresa>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  update(empresa: Empresa): Observable<void> {
    return this.client.put<void>(`${this.apiUrl}/${empresa.id}`, empresa)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro interno. Tente novamente mais tarde';

    switch (error.status) {
      case 400:
       let errMsg = error.error?.errorList[0]
            .replace('razaoSocial', 'razão social')
            .replace('email', 'e-mail')
            .replace('titulo', 'Título')
            .replace('html', 'Descrição')

        errorMessage = errMsg;
        break;
      case 404:
        errorMessage = 'Empresa não encontrada';
        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
    }

    return throwError(() => ({message: errorMessage}));
  }
}
