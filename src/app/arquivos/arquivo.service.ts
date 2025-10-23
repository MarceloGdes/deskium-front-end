import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Arquivo} from './arquivo.model';

@Injectable({providedIn: 'root'})
export class ArquivoService {
  private apiUrl = 'http://localhost:8080/arquivos';

  constructor(private client: HttpClient) {}

  uploadFile(files: File[]): Observable<Arquivo[]> {
    const formData = new FormData();

    // enviando os arquivo no como multipart/form-data
    // Adicionando cada arquivo com a chave "file"
    files.forEach(file => {
      formData.append('file', file);
    })

    return this.client.post<Arquivo[]>(this.apiUrl, formData)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  private handleError(error: any): Observable<never>{
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
