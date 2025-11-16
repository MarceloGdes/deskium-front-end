import {Component, inject, OnInit} from '@angular/core';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {TicketService} from '../../service/ticket.service';
import {CategoriaService} from '../../service/categoria.service';
import {MotivoService} from '../../service/motivo.service';
import {TicketModel} from '../../model/ticket.model';
import {Categoria} from '../../model/categoria.model';
import {Motivo} from '../../model/motivo.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NgbCollapse,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLinkButton, NgbNavOutlet,
  NgbPagination
} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, NgClass} from '@angular/common';
import {SubStatusService} from '../../service/sub-status.service';
import {SubStatus} from '../../model/sub-status.model';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {Status} from '../../model/status.model';
import {StatusService} from '../../service/status.service';
import {TicketsTable} from './tickets-table/tickets-table';
import {AuthService} from '../../service/auth/auth.service';
import {UsuarioModel} from '../../model/usuario.model';

@Component({
  selector: 'app-tickets',
  imports: [
    LoadingOverlay,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgbCollapse,
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    NgbNavOutlet,
    TicketsTable
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  private ticketService = inject(TicketService);
  private categoriaService = inject(CategoriaService);
  private motivoService = inject(MotivoService);
  private statusService = inject(StatusService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isLoadingTickets = false;
  isLoadingCategorias = false;
  isLoadingMotivos = false;
  isLoadingStatus = false;
  isLoadingUsuario = false;
  errorMessage = '';
  isCollapsed = true;

  usuario?: UsuarioModel;
  isAllTickets = false;

  ticketsAtendimento: TicketModel[] = [];
  ticketsNovos: TicketModel[] = [];
  ticketsAguardo: TicketModel[] = [];
  allTickets: TicketModel[] = [];

  categorias?: Categoria[];
  motivos?: Motivo[];
  statusList?: Status[];

  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  selectedSubStatus?: SubStatus;
  selectedStatus?: Status;
  //Variavel auxiliar, para que a tela tenha o layout alterado apenas quando o loadTickets setar selectedStatus;
  auxSelectedStatus?: Status;
  enteredNumTicket?: number;
  enteredAssuntoTicket?: string;
  enteredResponsavel?: string;
  enteredSolicitante?: string;
  enteredDataAberturaInicial?: string;
  enteredDataAberturaFinal?: string;
  enteredDataFechamentoInicial?: string;
  enteredDataFechamentoFinal?: string;

  ngOnInit(): void {
    let path = this.route.snapshot.routeConfig?.path;

    if(path === 'my-tickets'){
      this.isAllTickets = false;
    }else if(path === 'all-tickets'){
      this.isAllTickets = true;
    }

    this.loadUsuario()
    this.loadCategorias();
    this.loadMotivos();
    this.loadStatus();
    this.loadTickets();
  }

  private loadCategorias() {
    this.isLoadingCategorias = true;
    this.errorMessage = ''
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          this.categorias = response;
          this.isLoadingCategorias = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingCategorias = false;
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
          this.isLoadingMotivos = false;

        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingMotivos = false;
        }
      })

  }

  private loadStatus() {
    this.isLoadingStatus = true;
    this.errorMessage = ""
    this.statusService.getAll()
      .subscribe({
        next: (response) => {
          this.statusList = response;
          this.selectedStatus = this.statusList.find(s => s.id === 'ABERTO');
          this.auxSelectedStatus = this.selectedStatus;
          this.isLoadingStatus = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingStatus = false;
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

  loadTickets(){
    this.errorMessage = ""
    this.isLoadingTickets = true;

    this.ticketService.getTickets(
      this.auxSelectedStatus?.id || "ABERTO",
      this.isAllTickets,
      this.enteredNumTicket,
      this.enteredAssuntoTicket,
      this.enteredResponsavel,
      undefined,
      this.selectedMotivo,
      this.selectedCategoria,
      this.enteredSolicitante,
      this.enteredDataAberturaInicial,
      this.enteredDataAberturaFinal,
      this.enteredDataFechamentoInicial,
      this.enteredDataFechamentoFinal
    )
    .subscribe({
      next: (response) => {
        //Todos os tickets, para quando for selecionado tickets com status de resolvido ou fechado.
        this.allTickets = response;

        // Separação por substatus
        this.ticketsNovos = response.filter(t => t.subStatus?.id === 'NOVO');
        this.ticketsAtendimento = response.filter(t => t.subStatus?.id === 'EM_ATENDIMENTO');
        this.ticketsAguardo = response.filter(t => t.subStatus?.id === 'AGUARDANDO_RETORNO');

        //Apenas altera o layout da pagina ao clicar no botão filtrar.
        //this.selectedStatus é passado no input do componente table-tickets
        this.selectedStatus = this.auxSelectedStatus;

        this.isLoadingTickets = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoadingTickets = false;
      }
    })
  }

  onLimparCampos() {
    this.selectedMotivo = undefined;
    this.selectedCategoria = undefined;
    this.selectedSubStatus = undefined;
    this.enteredNumTicket = undefined;
    this.enteredAssuntoTicket = undefined;
    this.enteredResponsavel = undefined;
    this.selectedStatus = undefined;
    this.enteredDataAberturaInicial = undefined;
    this.enteredDataAberturaFinal = undefined;
    this.enteredDataFechamentoInicial = undefined;
    this.enteredDataFechamentoFinal = undefined;
  }
}
