import {Component, inject, OnInit} from '@angular/core';
import {TicketService} from '../../service/ticket.service';
import {TicketModel} from '../../model/ticket.model';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Motivo} from '../../model/motivo.model';
import {Categoria} from '../../model/categoria.model';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {ActivatedRoute} from '@angular/router';
import {ErrorOverlay} from '../../layout/shared/error-overlay/error-overlay';
import {QuillEditorComponent} from 'ngx-quill';
import {Arquivo} from '../../model/arquivo.model';

@Component({
  selector: 'app-ticket',
  imports: [
    DatePipe,
    FormsModule,
    LoadingOverlay,
    ErrorOverlay,
    QuillEditorComponent
  ],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket implements OnInit {
  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);

  errorMessage?: string;

  private ticketId?: string;
  ticket?: TicketModel;

  isLoading = false;
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  enteredDescricao?: string;
  anexos: File[] = [];


  constructor(route: ActivatedRoute) {
   //Resgata o id passado na rota.

  }

  ngOnInit(): void {
    //Recupera o id da rota e carrega o ticket
    this.isLoading = true;
    this.route.params.subscribe({
      next: (value) => {
        //Pega o valor da key id do objeto Params
        //[key: string]
        this.ticketId = value['id'];
        if (this.ticketId) {
          this.loadTicket(this.ticketId);
        }
      }
    })
  }

  private loadTicket(id: string) {
    this.ticketService.getById(id)
      .subscribe({
        next: (response) => {
          this.ticket = response;
          this.isLoading = false;
        },
        error: err => {}
      })
  }

  removerAnexo(file: File) {

  }

  onFilesSelected(event: Event) {
    //Type Assertion - Declarando que esse evento generico vem de um input de arquivo.
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf'];


    for (let file of input.files) {
      if (!tiposPermitidos.includes(file.type)) {
        this.errorMessage = `O arquivo "${file.name}" não é um tipo permitido.`;
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = `O arquivo "${file.name}" excede o limite de 5MB.`;
        return;
      }

      this.anexos.push(file)
    }

  }
}
