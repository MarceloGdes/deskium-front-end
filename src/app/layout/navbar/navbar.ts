import {Component, EventEmitter, inject, Input, Output, TemplateRef} from '@angular/core';
import {NgbNav, NgbNavItem, NgbNavOutlet, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {NavItem, Tab} from '../../model/tab';
import {NgClass} from '@angular/common';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../service/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    NgbNavItem,
    NgbNav,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input({required:true}) navItems: NavItem[] | undefined;

  private offcanvasService = inject(NgbOffcanvas);
  private authService = inject(AuthService);

  openSidebar(sidebar: TemplateRef<any>) {
    this.offcanvasService.open(sidebar, {
      panelClass: 'offcanvas'
    });
  }

  onLogout(){
    this.authService.logout();
  }
}
