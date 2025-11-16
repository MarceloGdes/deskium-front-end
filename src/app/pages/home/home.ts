import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from '../../layout/navbar/navbar';
import {AuthService} from '../../service/auth/auth.service';
import {NavItem} from '../../model/nav-item.model';
import {UsuarioModel} from '../../model/usuario.model';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    RouterOutlet,
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
          this.loadNavgation(this.user)
        },
        error: (error) => {
          this.authService.logout()
        }
      })
  }

  private loadNavgation(user: UsuarioModel){
    this.navItems.push({
      id: 1,
      name: 'Meus Tickets',
      icon: 'confirmation_number',
      route: 'my-tickets',
    })

    switch (user?.tipoUsuario){
      case 'SOLICITANTE':
        this.navItems.push(
          {
            id: 2,
            name: 'Novo Ticket',
            icon: 'add_box',
            route: 'new',
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
          }
        )
    }
  }

}
