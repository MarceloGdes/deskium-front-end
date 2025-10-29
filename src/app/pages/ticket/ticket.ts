import {Component, inject, OnInit} from '@angular/core';
import {TicketService} from '../../service/ticket.service';
import {TicketModel} from '../../model/ticket.model';

@Component({
  selector: 'app-ticket',
  imports: [],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket implements OnInit {
  private ticketService = inject(TicketService);

  ticket?: TicketModel;

  isLoading = false;

  ngOnInit(): void {

  }

  private loadTicket(id: number) {
    this.ticketService.getById(id)
      .subscribe({
        next: (response) => {
          this.ticket = response;
          this.isLoading = false;
        },
        error: err => {}
      })
  }
}
