import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  imports: [],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.css'
})
export class LoadingOverlay {
  @Input({required: true}) descCarregamento!: string;
}
