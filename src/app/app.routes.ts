import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {NewTicket} from './pages/new-ticket/new-ticket';
import {App} from './app';
import {Home} from './pages/home/home';
import {OpenedTickets} from './pages/opened-tickets/opened-tickets';

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
      { path: '', redirectTo: 'opened', pathMatch: 'full' },
      {
        path: 'new',
        component: NewTicket
      },
      {
        path: 'opened',
        component: OpenedTickets
      },
      // {
      //   path: 'closed',
      //   component:
      // }
    ]
  },
  { path: '**', redirectTo: 'tickets' }

];
