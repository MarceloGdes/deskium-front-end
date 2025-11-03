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
    this.arquivoService.getFileByFileName(fileName)
      .subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
  }
}
