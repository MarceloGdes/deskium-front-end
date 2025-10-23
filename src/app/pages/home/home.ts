import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from '../../layout/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    RouterOutlet,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor() {
  }

  private loadUser(){

  }
}
