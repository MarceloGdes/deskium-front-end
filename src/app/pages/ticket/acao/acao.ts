import {Component, inject, Input} from '@angular/core';
import {AcaoModel} from '../../../model/ticket.model';
import {DatePipe, NgClass} from '@angular/common';
import {ArquivoService} from '../../../service/arquivo.service';

@Component({
  selector: 'app-acao',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './acao.html',
  styleUrl: './acao.css'
})
export class Acao {
  @Input({required:true}) acao?: AcaoModel;

  private arquivoService = inject(ArquivoService);

  onVisualizeAnexo(fileName: string) {
    this.arquivoService.viewFileByFileName(fileName)
  }
}
