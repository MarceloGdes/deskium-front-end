import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, pipe, throwError} from 'rxjs';
import {AddAcaoModel, CreateTicketRequest, TicketModel, UpdateTicketModel} from '../model/ticket.model';
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

  getById(id: string): Observable<TicketModel>{
    return this.client.get<TicketModel>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => this.handleError(err))
      )
  }

  getTickets(status: string,
             allTickets: boolean,
             ticketId?: number,
             assunto?: string,
             responsavel?: string,
             subStatusId?: string,
             motivo?: Motivo,
             categoria?: Categoria,
             solicitante?: string,
             dataAberturaInicio?: string,
             dataAberturaFim?: string,
             dataFechamentoInicio?: string,
             dataFechamentoFim?: string): Observable<TicketModel[]>{

    //Adicionando os parametros dinamicamente, conforme preenchido na tela.
    //Angular mapeia chave e valor.
    let params: any = { status, allTickets };
    if (ticketId) params.ticketId = ticketId;
    if (assunto) params.assunto = assunto;
    if (responsavel) params.responsavel = responsavel;
    if (solicitante) params.solicitante = solicitante;
    if (subStatusId) params.subStatus = subStatusId;
    if (motivo?.id) params.motivoId = motivo.id;
    if (categoria?.id) params.categoriaId = categoria.id;
    if (dataAberturaInicio) params.dataAberturaInicio = `${dataAberturaInicio}T00:00:00`;
    if (dataAberturaFim) params.dataAberturaFim = `${dataAberturaFim}T23:59:59`;
    if (dataFechamentoInicio) params.dataFechamentoInicio = `${dataFechamentoInicio}T00:00:00`;
    if (dataFechamentoFim) params.dataFechamentoFim = `${dataFechamentoFim}T23:59:59`;

    return this.client.get<TicketModel[]>(
      this.apiUrl,
      {
        params: params
      })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  update(ticketId: string, request: UpdateTicketModel): Observable<any>{
    return this.client.put(`${this.apiUrl}/${ticketId}`, request)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  addAcao(ticketId: string, acao: AddAcaoModel): Observable<any>{
    return this.client.post<AddAcaoModel>(`${this.apiUrl}/${ticketId}/acoes`, acao)
      .pipe(
        catchError(err => this.handleError(err))
      );
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
            .replace('titulo', 'Título')
            .replace('html', 'Descrição');

          errors.push(errMsg);
        }

        errorMessage = errors.join('; ');
        break;

      case 500:
        errorMessage = 'Erro no servidor. Tente mais tarde.';
        break;


    }
    return throwError(() => ({message: errorMessage}));
  }
}
