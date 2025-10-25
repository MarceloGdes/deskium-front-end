import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, pipe, throwError} from 'rxjs';
import {CreateTicketRequest, Ticket} from '../model/ticket.model';

@Injectable({providedIn: 'root'})
export class TicketService {
  private apiUrl = 'http://localhost:8080/tickets';

  constructor(private client: HttpClient) {}

  create(request: CreateTicketRequest): Observable<Ticket>{
    return this.client.post<Ticket>(this.apiUrl, request)
    .pipe(
      catchError(err => this.handleError(err))
    )
  }

  getAllMyTickets(status: string): Observable<Ticket[]>{
    return this.client.get<Ticket[]>(
      `${this.apiUrl}/my-tickets`,
      {
        params: {
          status: status
        }
      })
      .pipe(
        catchError(err => this.handleError(err))
      )
  }

  private handleError(error: any): Observable<never>{
    let errorMessage = ''

    switch (error.status) {
      case 400:
        let errors = [];

        for (let errMsg of error.error?.errorList) {
          errMsg = errMsg
            .replace('motivoId', 'Motivo')
            .replace('descricaoHtml', 'Descrição')
            .replace('titulo', 'Título');

          errors.push(errMsg);
        }

        errorMessage = errors.join('; ');

        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;
      default:
        errorMessage = 'Ocorreu um erro interno. Tente novamente mais tarde';
    }

    return throwError(() => ({message: errorMessage}));
  }
}
