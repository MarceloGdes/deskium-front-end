import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, pipe, throwError} from 'rxjs';
import {CreateTicketRequest, TicketModel} from '../model/ticket.model';
import {SubStatus} from '../model/sub-status.model';
import {Motivo} from '../model/motivo.model';
import {Categoria} from '../model/categoria.model';

@Injectable({providedIn: 'root'})
export class TicketService {
  private apiUrl = 'http://localhost:8080/tickets';

  constructor(private client: HttpClient) {}

  create(request: CreateTicketRequest): Observable<TicketModel>{
    return this.client.post<TicketModel>(this.apiUrl, request)
    .pipe(
      catchError(err => this.handleError(err))
    )
  }

  getById(id: number): Observable<TicketModel>{
    return this.client.get<TicketModel>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => this.handleError(err))
      )
  }

  getAllMyTickets(status: string,
                  ticketId?: number,
                  assunto?: string,
                  responsavel?: string,
                  subStatus?: SubStatus,
                  motivo?: Motivo,
                  categoria?: Categoria): Observable<TicketModel[]>{

    //Adicionando os parametros dinamicamente, conforme preenchido na tela.
    let params: any = { status };
    if (ticketId != null) params.ticketId = ticketId;
    if (assunto) params.assunto = assunto;
    if (responsavel) params.responsavel = responsavel;
    if (subStatus?.id != null) params.subStatus = subStatus.id;
    if (motivo?.id != null) params.motivoId = motivo.id;
    if (categoria?.id != null) params.categoriaId = categoria.id;

    return this.client.get<TicketModel[]>(
      `${this.apiUrl}/my-tickets`,
      {
        params: params
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
    console.log(error)
    return throwError(() => ({message: errorMessage}));
  }
}
