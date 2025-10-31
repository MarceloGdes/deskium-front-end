import {Component, Input} from '@angular/core';
import {AcaoModel} from '../../../model/ticket.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-acao',
  imports: [
    DatePipe
  ],
  templateUrl: './acao.html',
  styleUrl: './acao.css'
})
export class Acao {
  @Input({required:true}) acao?: AcaoModel;
}
