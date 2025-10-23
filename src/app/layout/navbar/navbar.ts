import {Component, inject, Input, TemplateRef} from '@angular/core';
import {NgbNav, NgbNavItem, NgbNavOutlet, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {TabModel} from './tab.model';
import {NgClass} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    NgbNavItem,
    NgbNav,
    NgbNavOutlet,
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  tab: TabModel | undefined;
  @Input({required:true}) tabs: TabModel[] = [];
  counter = this.tabs.length + 1;
  active = 1;

  private offcanvasService = inject(NgbOffcanvas);
  private authService = inject(AuthService);

  closeTab(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs.filter((tab) => tab.id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // add(event: MouseEvent) {
  //   if()
  //   this.tabs.push(this.tab);
  //   event.preventDefault();
  // }
  openSidebar(sidebar: TemplateRef<any>) {
    this.offcanvasService.open(sidebar, {
      panelClass: 'offcanvas'
    });
  }

  onLogout(){
    this.authService.logout();
  }
}
