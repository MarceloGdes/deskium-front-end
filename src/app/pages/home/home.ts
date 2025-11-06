import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from '../../layout/navbar/navbar';
import {AuthService} from '../../service/auth/auth.service';
import {NavItem, Tab} from '../../model/tab';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';
import {UsuarioModel} from '../../model/usuario.model';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    RouterOutlet,
    LoadingOverlay,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private authService = inject(AuthService);
  user?: UsuarioModel
  navItems: NavItem[];

  constructor() {
    this.navItems = []
  }

  ngOnInit(): void {
    this.loadUser()
  }

  private loadUser(){
    this.authService.getAuthenticatedUser()
      .subscribe({
        next: (response) => {
          this.user = response
          this.loadComponents(this.user)
        },
        error: (error) => {
          this.authService.logout()
        }
      })
  }

  private loadComponents(user: UsuarioModel | undefined){
    this.navItems.push({
      id: 1,
      name: 'Meus Tickets',
      icon: 'confirmation_number',
      route: 'my-tickets',
      tabs: [
        {
          id: 1,
          content: null,
          title: 'Meus tickets',
          closable: false
        }
      ]
    })

    switch (user?.tipoUsuario){
      case 'SOLICITANTE':
        this.navItems.push(
          {
            id: 2,
            name: 'Novo Ticket',
            icon: 'add_box',
            route: 'new',
            tabs: [
              {
                id: 1,
                content: null,
                title: 'Novo Ticket',
                closable: false
              }
            ]
          }
        )
        break;
      case 'SUPORTE':
        this.navItems.push(
          {
            id: 2,
            name: 'Todos os Tickets',
            icon: 'all_inbox',
            route: 'all-tickets',
            tabs: [
              {
                id: 1,
                content: null,
                title: 'Todos os Tickets',
                closable: false
              }
            ]
          }
        )
    }
  }

}
