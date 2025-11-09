import {Component, inject, OnInit} from '@angular/core';
import {TicketService} from '../../service/ticket.service';
import {TicketModel} from '../../model/ticket.model';
import {DatePipe, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Motivo} from '../../model/motivo.model';
import {Categoria} from '../../model/categoria.model';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {ActivatedRoute, Router} from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import {Arquivo} from '../../model/arquivo.model';
import {Acao} from './acao/acao';
import {ArquivoService} from '../../service/arquivo.service';
import {AuthService} from '../../service/auth/auth.service';
import {UsuarioModel} from '../../model/usuario.model';
import {CategoriaService} from '../../service/categoria.service';
import {MotivoService} from '../../service/motivo.service';
import {StatusService} from '../../service/status.service';
import {Status} from '../../model/status.model';
import {SubStatus} from '../../model/sub-status.model';
import {SubStatusService} from '../../service/sub-status.service';
import {Prioridade} from '../../model/prioridade.model';
import {PrioridadeService} from '../../service/prioridade.service';

@Component({
  selector: 'app-ticket',
  imports: [
    DatePipe,
    FormsModule,
    LoadingOverlay,
    QuillEditorComponent,
    Acao,
    NgClass
  ],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket implements OnInit {
  private ticketService = inject(TicketService);
  private arquivoService = inject(ArquivoService);
  private authService = inject(AuthService);
  private categoriaService = inject(CategoriaService);
  private motivoService = inject(MotivoService);
  private statusService = inject(StatusService);
  private subStatusService = inject(SubStatusService);
  private prioridadeService = inject(PrioridadeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorMessage?: string;

  private ticketId = "";
  ticket?: TicketModel;
  usuario?: UsuarioModel;

  isLoadingTicket = false;
  isLoadingUsuario = false;
  isLoadingMotivos = false;
  isLoadingCategorias = false;
  isLoadingSubStatus = false;
  isLoadingStatus = false;
  isLoadingPrioridades = false;

  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  selectedSubStatus?: SubStatus;
  selectedPrioridade?: Prioridade;
  enteredDescricao = "";
  acaoInterna = false;

  anexos: File[] = [];
  motivos?: Motivo[];
  categorias?: Categoria[];
  statusList?: Status[];
  subStatusList?: SubStatus[];
  prioridades?: Prioridade[];

  ngOnInit(): void {
    //Recupera o id da rota e carrega o ticket
    this.isLoadingTicket = true;
    this.loadUsuario();

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
      },
    })
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
          this.isLoadingTicket = false;
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
          console.log(this.ticket);
          //chamando os métodos aqui por conta dos observables sincronos
          this.loadMotivos();
          this.loadCategorias();
          this.loadSubStatus();
          this.loadPrioridades()
          this.isLoadingTicket = false;
        },
        error: err => {
          this.router.navigate(['../'])
        }
      })
  }

  private loadUsuario() {
    this.isLoadingUsuario = true;
    this.errorMessage = ""

    this.authService.getAuthenticatedUser()
      .subscribe({
        next: (response) => {
          this.usuario = response;
          this.isLoadingUsuario = false;
          console.log(this.usuario);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingUsuario = false;
          this.authService.logout()
        }
      })
  }

  private loadMotivos() {
    this.isLoadingMotivos = true;
    this.errorMessage = ""
    this.motivoService.getAll()
      .subscribe({
        next: (response) => {
          this.motivos = response;
          this.selectedMotivo = this.motivos.find(m => m.id == this.ticket?.motivo.id)
          this.isLoadingMotivos = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingMotivos = false;
        }
      })

  }

  private loadCategorias() {
    this.isLoadingCategorias = true;
    this.errorMessage = ''
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          this.categorias = response;
          this.selectedCategoria = this.categorias.find(c => c.id === this.ticket?.categoria?.id)
          this.isLoadingCategorias = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingCategorias = false;
        }
      })

  }

  private loadSubStatus() {
    this.isLoadingSubStatus = true;
    this.errorMessage = ''
    this.subStatusService.getAll()
      .subscribe({
        next: (response) => {
          this.subStatusList = response;
          this.selectedSubStatus = this.subStatusList.find(s => s.id === this.ticket?.subStatus?.id)
          this.isLoadingSubStatus = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingSubStatus = false;
        }
      })

  }

  private loadPrioridades() {
    this.isLoadingPrioridades = true;
    this.errorMessage = ''
    this.prioridadeService.getAll()
      .subscribe({
        next: (response) => {
          this.prioridades = response;
          this.selectedPrioridade = this.prioridades.find(p => p.id === this.ticket?.prioridade?.id)
          this.isLoadingPrioridades = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingPrioridades = false;
        }
      })

  }

  onSubmit() {
    this.errorMessage = '';

    if(this.enteredDescricao === ""){
      this.errorMessage = 'Descrição não preenchida';
      return;
    }

    this.isLoadingTicket = true;

    if(this.anexos.length > 0){
      this.arquivoService.uploadFile(this.anexos)
        .subscribe({
          next: response => {
            this.addAcao(response);
          },
          error: err => {
            this.errorMessage = err.message;
            this.isLoadingTicket = false
            return
          }
        })
    }else {
      this.addAcao();
    }
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
