import {Component, inject, OnInit} from '@angular/core';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {TicketService} from '../../service/ticket.service';
import {CategoriaService} from '../../service/categoria.service';
import {MotivoService} from '../../service/motivo.service';
import {TicketModel} from '../../model/ticket.model';
import {Categoria} from '../../model/categoria.model';
import {Motivo} from '../../model/motivo.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbCollapse, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, NgClass} from '@angular/common';
import {SubStatusService} from '../../service/sub-status.service';
import {SubStatus} from '../../model/sub-status.model';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Status} from '../../model/status.model';
import {StatusService} from '../../service/status.service';

@Component({
  selector: 'app-tickets',
  imports: [
    LoadingOverlay,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    NgClass,
    RouterLink,
    RouterLinkActive,
    NgbCollapse
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  private ticketService = inject(TicketService);
  private categoriaService = inject(CategoriaService);
  private motivoService = inject(MotivoService);
  private subStatusService = inject(SubStatusService);
  private statusService = inject(StatusService);

  isLoadingTickets = false;
  isLoadingCategorias = false;
  isLoadingMotivos = false;
  isLoadingStatus = false;
  isLoadingSubStatus = false;

  tickets: TicketModel[] = [];
  categorias?: Categoria[];
  motivos?: Motivo[];
  subStatusList?: SubStatus[];
  statusList?: Status[];
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  selectedSubStatus?: SubStatus;
  selectedStatus?: Status;
  enteredNumTicket?: number;
  enteredAssuntoTicket?: string;
  enteredResponsavel?: string;
  errorMessage = '';
  isCollapsed = true;


  ngOnInit(): void {
    this.loadCategorias();
    this.loadMotivos();
    this.loadSubStatus();
    this.loadTickets();
    this.loadStatus()
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
        },
        complete: () => {
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
        },
        complete: () => {
          this.isLoadingMotivos = false;
        }
      })

  }

  private loadSubStatus() {
    this.isLoadingSubStatus = true;
    this.errorMessage = ""
    this.subStatusService.getAll()
      .subscribe({
        next: (response) => {
          this.subStatusList = response;
          this.isLoadingStatus = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoadingStatus = false;
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
          this.selectedStatus = this.statusList[0]
          this.isLoadingStatus = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoadingStatus = false;
        }
      })
  }

  loadTickets() {
    this.isLoadingTickets = true;
    this.errorMessage = ""
    this.ticketService.getAllMyTickets(this.selectedStatus?.id || "ABERTO", this.enteredNumTicket, this.enteredAssuntoTicket,
      this.enteredResponsavel, this.selectedSubStatus, this.selectedMotivo, this.selectedCategoria)
      .subscribe({
        next: (response) => {
          this.tickets = response;
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
  }
}
