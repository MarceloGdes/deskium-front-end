import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TicketModel} from '../../../model/ticket.model';

@Component({
  selector: 'app-tickets-table',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  templateUrl: './tickets-table.html',
  styleUrl: './tickets-table.css'
})
export class TicketsTable {
  @Input({required:true}) tickets?: TicketModel[];
  @Input({required:true}) tipoUsuario?: string;
  @Input({required:true}) statusId?: string;
}
