import {Component, ElementRef, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AiService} from '../../service/ai.service';
import {Observable} from 'rxjs';

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
  private aiService = inject(AiService);

  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketId = "";

  @ViewChild('cardActions') cardActions!: ElementRef;
  errorMessage?: string;
  ticket?: TicketModel;
  usuario?: UsuarioModel;

  isLoadingTicket = false;
  isLoadingUsuario = false;
  isLoadingMotivos = false;
  isLoadingCategorias = false;
  isLoadingSubStatus = false;
  isLoadingStatus = false;
  isLoadingPrioridades = false;
  isTrancribing = false;
  isGeneratingAcao = false;

  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  selectedSubStatus?: SubStatus;
  selectedPrioridade?: Prioridade;
  selectedStatus?: Status;
  enteredDescricao = "";
  acaoInterna = false;
  enteredDataAtendimento?: string;
  enteredInicioAtendimento?: string;
  enteredFimAtendimento?: string;

  selectedFiles: File[] = [];
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

    this.apontarInicioAtendimento();
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.enteredDescricao === "") {
      this.errorMessage = 'Descrição não preenchida';
      return;
    }

    this.isLoadingTicket = true;

    if (this.selectedFiles.length > 0) {
      this.arquivoService.uploadFile(this.selectedFiles)
        .subscribe({
          next: response => {
            this.addAcao(response);
          },
          error: err => {
            this.errorMessage = err.message;
            this.isLoadingTicket = false
            this.scrollToTop();
          }
        })
    } else {
      this.addAcao();
    }
  }

  onUpdateTicket() {
    this.isLoadingTicket = true;

    this.ticketService.update(this.ticketId, {
      categoriaId: this.selectedCategoria?.id,
      motivoId: this.selectedMotivo!.id,
      subStatusId: this.selectedSubStatus!.id,
      prioridadeId: this.selectedPrioridade?.id
    })
      .subscribe({
        next: (response) => {
          this.isLoadingTicket = false;
        },
        error: err => {
          this.errorMessage = err.message;
          this.isLoadingTicket = false;
          this.scrollToTop();
        }
      })
  }

  onRemoveAnexo(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onSelectAudioFileToTranscribe(event: any){
    const input = event.target
    if (!input.files) return;
    let file: File = input.files[0]; // sempre pega o primeiro arquivo, pois o input n permite varios arquivos.

    const maxSize = 25 * 1024 * 1024; // 35 MB
    const tiposPermitidos = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];

    if (!tiposPermitidos.includes(file.type)) {
      this.errorMessage = `O arquivo "${file.name}" não é um tipo permitido.`;
      this.scrollToTop();
      return;
    }

    if (file.size > maxSize) {
      this.errorMessage = `O arquivo "${file.name}" excede o limite de 35MB.`;
      this.scrollToTop();
      return;
    }

    this.isTrancribing = true;
    this.arquivoService.uploadFile([file]) //Upload file recebe um Array
      .subscribe({
        next: response => {
          this.trancribe(response[0]);
        },
        error: err => {
          this.errorMessage = err.message;
          this.isTrancribing = false
          this.scrollToTop();
        }
      })

    //Resetar para aceitar o mesmo arquivo novamente
    input.value = '';
  }

  onFilesSelected(event: any) {
    const input = event.target
    if (!input.files) return;

    const maxSize = 25 * 1024 * 1024; // 35 MB
    const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf', 'audio/mpeg', 'audio/wav',
      'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];

    for (let file of input.files) {
      if (!tiposPermitidos.includes(file.type)) {
        this.errorMessage = `O arquivo "${file.name}" não é um tipo permitido.`;
        this.scrollToTop();
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = `O arquivo "${file.name}" excede o limite de 35MB.`;
        this.scrollToTop();
        return;
      }

      this.selectedFiles.push(file)
    }

    //Resetar para aceitar o mesmo arquivo novamente
    input.value = '';
  }

  onGenerateAcao(acaoId: number){
    this.isGeneratingAcao = true;
    this.errorMessage = '';
    this.aiService.generateEmail(this.ticketId, acaoId)
      .subscribe({
        next: response => {
          this.isGeneratingAcao = false;
          this.enteredDescricao = response.text;
          this.scrollToTop()
        },
        error: err => {
          this.isGeneratingAcao = false;
          this.errorMessage = err.message;
          this.scrollToTop()
        }
      })
  }

  private addAcao(anexos?: Arquivo[], isTranscricao?: boolean) {
    if (this.ticketId) {
      //Valida se o fim de atendimento foi preenchido, se não coloca a data atual.
      this.enteredFimAtendimento = this.enteredFimAtendimento || new Date().toLocaleTimeString().substring(0, 5)
      //Data de atendimento só é considerada pelo back-end se o usuário autor for o suporte.

      this.ticketService.addAcao(this.ticketId, {
        acaoInterna: this.acaoInterna,
        acaoTranscricao: isTranscricao ||  false,
        statusId: this.selectedStatus!.id,
        html: this.enteredDescricao,
        dataAtendimento: this.enteredDataAtendimento,
        inicioAtendimento: this.enteredInicioAtendimento,
        fimAtendimento: this.enteredFimAtendimento,
        anexos: anexos
      })
        .subscribe({
          next: (response) => {
            this.loadTicket(this.ticketId);
            this.resetCampos();
            this.apontarInicioAtendimento();
          },
          error: err => {
            //Remove os arquivos preeviamente armazenados em caso de erro
            if (anexos) {
              this.deleteUploadedAnexos(anexos);
            }

            if(isTranscricao){
              this.resetCampos();
            }

            this.errorMessage = err.message
            this.isLoadingTicket = false;
            this.scrollToTop();
          }
        })
    }

  }

  private trancribe(audio: Arquivo) {
    this.aiService.transcribeAudio(this.ticketId, audio.fileName)
      .subscribe({
        next: (response) => {
          this.enteredDescricao = response.text;
          this.acaoInterna = true;
          this.isTrancribing = false;
          this.isLoadingTicket = true;
          this.addAcao([audio],true);
        },
        error: err => {
          //Remove os arquivos preeviamente armazenados em caso de erro
          this.deleteUploadedAnexos([audio]);
          this.errorMessage = err.message
          this.isTrancribing = false;
          this.scrollToTop();
        }
      })
  }

  private deleteUploadedAnexos(anexo: Arquivo[]) {
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
          console.log(response)
          //chamando os métodos aqui por conta dos observables sincronos
          this.loadMotivos();
          this.loadCategorias();
          this.loadSubStatus();
          this.loadPrioridades();
          this.loadStatus();
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

  private loadStatus() {
    this.isLoadingStatus = true;
    this.errorMessage = ''
    this.statusService.getAll()
      .subscribe({
        next: (response) => {
          this.statusList = response;
          this.selectedStatus = this.statusList.find(s => s.id === this.ticket?.status?.id)
          this.isLoadingStatus = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingStatus = false;
        }
      })

  }

  //Metodo para scrolar a div de ações para o inicio.
  private scrollToTop(){
    this.cardActions.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private resetCampos(){
    this.enteredDescricao = "";
    this.selectedFiles = [];
    this.acaoInterna = false;
    this.enteredFimAtendimento = undefined
  }

  openModal(content: TemplateRef<any>, size: string) {
    this.modalService.open(content, { size: size, modalDialogClass: '.modal-content-bg'});
  }

  private apontarInicioAtendimento() {
    let now = new Date();
    this.enteredDataAtendimento = now.toISOString().split('T')[0]; //Gera a data no padrão yyyy-mm-dd, removendo o horario.
    this.enteredInicioAtendimento = now.toLocaleTimeString().substring(0, 5); //Ignora os milisegundo, ficando compativel com o input de horas do boostratop.
  }
}
