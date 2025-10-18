import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, pipe, throwError} from 'rxjs';
import {CreateTicketRequest, Ticket} from './ticket.model';

@Injectable({providedIn: 'root'})
export class TicketService {
  private apiUrl = 'http://localhost:8080/tickets';

  constructor(private client: HttpClient) {}

  create(request: CreateTicketRequest): Observable<any>{
    return this.client.post(this.apiUrl, request)
    .pipe(
      catchError(err => this.handleError(err))
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
