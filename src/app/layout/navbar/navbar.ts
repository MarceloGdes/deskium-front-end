import {Component, inject, Input, TemplateRef} from '@angular/core';
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
    NgbNavOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  tabs: Tab[] | undefined;
  @Input({required:true}) navItems: NavItem[] | undefined;
  // counter = this.tab.length + 1;
  active = 1;

  constructor(route: ActivatedRoute) {

  }


  private offcanvasService = inject(NgbOffcanvas);
  private authService = inject(AuthService);

  closeTab(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs?.filter((tab) => tab.id !== toRemove);
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

  onRouterLinkActive(isActive: boolean, tabs: Tab[]) {
    console.log(isActive);
    if(isActive) {
      this.tabs = tabs;
    }
  }
}
