import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Arquivo} from '../model/arquivo.model';
import {AiResponse} from '../model/ai.model';

@Injectable({providedIn: 'root'})
export class AiService {
  private apiUrl = 'http://localhost:8080/ai';

  constructor(private client: HttpClient) {}

  transcribeAudio(ticketId: string, fileName: string): Observable<AiResponse> {
    return this.client.post<AiResponse>(`${this.apiUrl}/transcribe-audio/${ticketId}/${fileName}`, null)
      .pipe(
        catchError(error => this.handleError(error))
      )
  }

  generateEmail(ticketId: string, acaoId: number): Observable<AiResponse>{
    return this.client.post<AiResponse>(`${this.apiUrl}/generate-email/${ticketId}/${acaoId}`, null)
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
    }

    return throwError(() => ({message: errorMessage}));
  }
}
