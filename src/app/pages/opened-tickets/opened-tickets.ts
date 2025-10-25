import {Component, inject, OnInit} from '@angular/core';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {TicketService} from '../../service/ticket.service';
import {CategoriaService} from '../../service/categoria.service';
import {MotivoService} from '../../service/motivo.service';
import {Ticket} from '../../model/ticket.model';
import {Categoria} from '../../model/categoria.model';
import {Motivo} from '../../model/motivo.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, NgClass} from '@angular/common';
import {SubStatusService} from '../../service/sub-status.service';
import {SubStatus} from '../../model/sub-status.model';

@Component({
  selector: 'app-opened-tickets',
  imports: [
    LoadingOverlay,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './opened-tickets.html',
  styleUrl: './opened-tickets.css'
})
export class OpenedTickets implements OnInit {
  private ticketService = inject(TicketService);
  private categoriaService = inject(CategoriaService);
  private motivoService = inject(MotivoService);
  private subStatusService = inject(SubStatusService);

  isLoadingTickets = false;
  isLoadingCategorias = false;
  isLoadingMotivos = false;
  isLoadingStatus = false;

  tickets: Ticket[] = [];
  categorias?: Categoria[];
  motivos?: Motivo[];
  subStatusList?: SubStatus[];
  selectedMotivo: Motivo | undefined;
  selectedCategoria: Categoria | undefined;
  selectedSubStatus: SubStatus | undefined;
  enteredNumTicket?: number;
  enteredAssuntoTicket?: string;
  enteredResponsavel?: string;

  ngOnInit(): void {
    this.isLoadingTickets = true;
    this.isLoadingCategorias = true;
    this.isLoadingMotivos = true;
    this.isLoadingStatus = true;

    this.loadCategorias();
    this.loadMotivos();
    this.loadStatus();
    this.loadTickets();
  }

  private loadCategorias() {
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          this.categorias = response;
          this.isLoadingCategorias = false;
        },
        error: (error) => {
          this.isLoadingCategorias = false;
        }
      })

  }

  private loadMotivos() {
    this.motivoService.getAll()
      .subscribe({
        next: (response) => {
          this.motivos = response;
          this.isLoadingMotivos = false;
        },
        error: (error) => {
          this.isLoadingMotivos = false;
        }
      })

  }

  private loadStatus() {
    this.subStatusService.getAll()
      .subscribe({
        next: (response) => {
          console.log()
          this.subStatusList = response;
          this.isLoadingStatus = false;
        },
        error: (error) => {
          this.isLoadingStatus = false;
        }
      })
  }

  private loadTickets() {
    this.ticketService.getAllMyTickets("ABERTO")
      .subscribe({
        next: (response) => {
          console.log(response);
          this.tickets = response;
          this.isLoadingTickets = false;
        },
        error: (error) => {
          console.log(error)
        }
      })
  }


}
