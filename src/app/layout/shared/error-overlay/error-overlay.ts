import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-error-overlay',
  imports: [],
  templateUrl: './error-overlay.html',
  styleUrl: './error-overlay.css'
})
export class ErrorOverlay {
  @Input() message = 'Ocorreu um erro.';
  @Output() back = new EventEmitter<void>();
}
