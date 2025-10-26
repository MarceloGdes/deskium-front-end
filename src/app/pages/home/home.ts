import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from '../../layout/navbar/navbar';
import {AuthService} from '../../service/auth/auth.service';
import {AuthenticatedUser} from '../../model/login.model';
import {NavItem} from '../../model/nav.model';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';

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
export class Home {
  private authService = inject(AuthService);
  isLoading = false;
  user: AuthenticatedUser | undefined
  navItems: NavItem[];

  constructor() {
    this.isLoading = true;
    this.navItems = []

    this.isLoading = true;
    this.loadUser()
  }

  private loadUser(){
    this.authService.getAuthenticatedUser()
      .subscribe({
        next: (response) => {
          this.user = response
          this.loadComponents(this.user)
        }
      })
  }

  private loadComponents(user: AuthenticatedUser | undefined){
    console.log(user)
    switch (user?.tipoUsuario){
      case 'SOLICITANTE':
        this.navItems.push(
          {
            id: 1,
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
    }
    this.navItems.push({
        id: 2,
        name: 'Tickets Abertos',
        icon: 'confirmation_number',
        route: 'opened',
        tabs: [
          {
            id: 1,
            content: null,
            title: 'Tickets Abertos',
            closable: false
          }
        ]
      })
    this.navItems.push({
        id: 3,
        name: 'Tickets Fechados',
        icon: 'select_check_box',
        route: 'closed',
        tabs: [
          {
            id: 1,
            content: null,
            title: 'Tickets Fechados',
            closable: false
          }
        ]
      })

    this.isLoading = false;
  }

}
