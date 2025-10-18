import {Component, Input} from '@angular/core';
import {NgbNav, NgbNavItem, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {TabModel} from './tab.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    NgbNavItem,
    NgbNav,
    NgbNavOutlet,
    NgClass
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  tab: TabModel | undefined;
  @Input({required:true}) tabs: TabModel[] = [];
  counter = this.tabs.length + 1;
  active = 1;

  close(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs.filter((tab) => tab.id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // add(event: MouseEvent) {
  //   if()
  //   this.tabs.push(this.tab);
  //   event.preventDefault();
  // }
}
