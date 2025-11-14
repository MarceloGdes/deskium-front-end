import {Component, inject, Input} from '@angular/core';
import {AcaoModel} from '../../../model/ticket.model';
import {DatePipe, NgClass} from '@angular/common';
import {ArquivoService} from '../../../service/arquivo.service';
import {unwrapSubstitutionsFromLocalizeCall} from '@angular/localize/tools';

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
  @Input({required:true}) tipoUsuario?: string;

  private arquivoService = inject(ArquivoService);

  onVisualizeAnexo(fileName: string) {
    var url = this.arquivoService.getFileViewURL(fileName)

    window.open(url, '_blank');
  }
}
