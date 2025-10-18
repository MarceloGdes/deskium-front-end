import { Routes } from '@angular/router';
import {Login} from './login/login';
import {NewTicket} from './tickets/new-ticket/new-ticket';
import {App} from './app';

//Rotas
//https://angular.dev/guide/routing/define-routes
export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'tickets',
    component: App,
    children: [
      {path: 'new', component: NewTicket},
    ]
  }
];
