import {Component, inject, OnInit} from '@angular/core';
import {TicketService} from '../../service/ticket.service';
import {TicketModel} from '../../model/ticket.model';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Motivo} from '../../model/motivo.model';
import {Categoria} from '../../model/categoria.model';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {ActivatedRoute, Router} from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import {Arquivo} from '../../model/arquivo.model';
import {Acao} from './acao/acao';
import {ArquivoService} from '../../service/arquivo.service';

@Component({
  selector: 'app-ticket',
  imports: [
    DatePipe,
    FormsModule,
    LoadingOverlay,
    QuillEditorComponent,
    Acao
  ],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket implements OnInit {
  private ticketService = inject(TicketService);
  private arquivoService = inject(ArquivoService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorMessage?: string;

  private ticketId = "";
  ticket?: TicketModel;

  isLoading = false;
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  enteredDescricao = "";
  acaoInterna = false;
  anexos: File[] = [];


  ngOnInit(): void {
    //Recupera o id da rota e carrega o ticket
    this.isLoading = true;
    this.route.params.subscribe({
      next: (value) => {
        //Pega o valor da chave "id" do objeto Params
        //[key: string]
        this.ticketId = value['id'];
        this.loadTicket(this.ticketId);
      },
      error: (error) => {
        console.log(error);
        this.router.navigate(['../my-tickets'])
      }
    })
  }

  onSubmit() {
    this.errorMessage = '';

    if(this.enteredDescricao === ""){
      this.errorMessage = 'Descrição não preenchida';
      return;
    }

    this.isLoading = true;

    if(this.anexos.length > 0){
      this.arquivoService.uploadFile(this.anexos)
        .subscribe({
          next: response => {
            this.addAcao(response);
          },
          error: err => {
            this.errorMessage = err.message;
            this.isLoading = false
            return
          }
        })
    }else {
      this.addAcao();
    }
  }

  private addAcao(anexos?: Arquivo[]) {
    if(this.ticketId){
      this.ticketService.addAcao(this.ticketId, {
        acaoInterna: this.acaoInterna,
        html: this.enteredDescricao,
        anexos: anexos
      })
      .subscribe({
        next: (response) => {
          this.loadTicket(this.ticketId);
          this.enteredDescricao = "";
          this.anexos = [];
        },
        error: err => {
          //Remove os arquivos preeviamente armazenados em caso de erro
          if(anexos){
            this.deleteUploadedAnexos(anexos);
          }
          this.errorMessage = err.message
          this.isLoading = false;
        }
      })
    }

  }

  private deleteUploadedAnexos(anexo: Arquivo[]){
    anexo.forEach(a => {
      this.arquivoService.removeByFileNames(a.fileName)
        .subscribe({
          error: err => {
            console.log(err)
          }
        })
    })
  }

  private loadTicket(id: string) {
    this.ticketService.getById(id)
      .subscribe({
        next: (response) => {
          this.ticket = response;
          this.isLoading = false;
        },
        error: err => {
          this.router.navigate(['../'])
        }
      })
  }

  onRemoveAnexo(file: File) {
    this.anexos = this.anexos.filter(f => f !== file);
  }

  onFilesSelected(event: Event) {
    //Type Assertion - Declarando que esse evento generico vem de um input de arquivo.
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf', 'audio/mpeg'];


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
