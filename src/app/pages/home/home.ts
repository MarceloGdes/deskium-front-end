import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from '../../layout/navbar/navbar';
import {AuthService} from '../../service/auth/auth.service';
import {AuthenticatedUser} from '../../model/login.model';
import {NavItem, Tab} from '../../model/tab';
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
export class Home implements OnInit {
  private authService = inject(AuthService);
  isLoading = false;
  user: AuthenticatedUser | undefined
  navItems: NavItem[];

  constructor() {
    this.navItems = []
  }

  ngOnInit(): void {
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

  addTab(navItemId: number, tab: Tab){

  }

  get navItens(){
    return this.navItems;
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


    this.isLoading = false;
  }

}
