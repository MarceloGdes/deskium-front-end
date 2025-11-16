import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {NewTicket} from './pages/new-ticket/new-ticket';
import {App} from './app';
import {Home} from './pages/home/home';
import {Tickets} from './pages/tickets/tickets';
import {Ticket} from './pages/ticket/ticket';

//Rotas
//https://angular.dev/guide/routing/define-routes
export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'tickets',
    component: Home,
    children: [
      { path: '', redirectTo: 'my-tickets', pathMatch: 'full' },
      {
        path: 'new',
        component: NewTicket
      },
      {
        path: 'my-tickets',
        component: Tickets,
      },
      {
        path: 'all-tickets',
        component: Tickets,
      },
      {
        path: ':id',
        component: Ticket,
      }
    ]
  },
  { path: '**', redirectTo: 'tickets' }

];
