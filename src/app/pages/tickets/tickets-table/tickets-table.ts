import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf, NgStyle} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TicketModel} from '../../../model/ticket.model';

@Component({
  selector: 'app-tickets-table',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './tickets-table.html',
  styleUrl: './tickets-table.css'
})
export class TicketsTable {
  @Input({required:true}) tickets?: TicketModel[];
  @Input({required:true}) tipoUsuario?: string;
  @Input({required:true}) statusId?: string;
  @Input({required:true}) isAllTickets?: boolean;
}
