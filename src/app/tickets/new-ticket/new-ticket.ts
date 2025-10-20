import {Component, inject} from '@angular/core';
import {Navbar} from '../../shared/navbar/navbar';
import {FormsModule} from '@angular/forms';
//wrapper ngx-quill, que faz a integração Angular + Quill Editor
import {QuillModule} from 'ngx-quill';
import {Motivo} from '../../motivos/motivo.model';
import {MotivoService} from '../../motivos/motivo.service';
import {CategoriaService} from '../../categorias/categoria.service';
import {Categoria} from '../../categorias/categoria.model';
import {TicketService} from '../ticket.service';
import {SolicitanteService} from '../../solicitantes/solicitante.service';
import {Solicitante} from '../../solicitantes/solicitante.model';
import {ArquivoService} from '../../arquivos/arquivo.service';
import {Arquivo} from '../../arquivos/arquivo.model';
import {EMPTY} from 'rxjs';

@Component({
  selector: 'app-new-ticket',
  imports: [
    Navbar,
    FormsModule,
    QuillModule
  ],
  standalone: true,
  templateUrl: './new-ticket.html',
  styleUrl: './new-ticket.css'
})
export class NewTicket {
  private motivoService = inject(MotivoService);
  private categoriaService = inject(CategoriaService);
  private ticketService = inject(TicketService);
  private solicitanteService = inject(SolicitanteService);
  private arquivoService = inject(ArquivoService);

  enteredDescricao = "";
  enteredTitulo = "";
  isLoading: any;
  motivos: Motivo[] = [];
  categorias: Categoria[] = [];
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  solicitante?: Solicitante;
  anexos: File[] = [];
  errorMessage = '';

  constructor() {
     this.loadMotivos();
     this.loadCategorias();
     this.loadSolicitante();
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    let arquivos: Arquivo[] = []

    // console.log(this.selectedMotivo);
    // console.log(this.selectedCategoria);
    // console.log(this.anexos)

    for(let file of this.anexos){
      this.arquivoService.uploadFile(file)
        .subscribe({
          next: response => {
            arquivos.push(response);
          },
          error: err => {
            this.errorMessage = err.message || 'Ocorreu um erro. Tente novamente mais tarde.';
            this.isLoading = false
            return
          }
        })
    }

    if(arquivos.length == this.anexos.length){
      this.ticketService.create({
        titulo: this.enteredTitulo,
        descricaoHtml: this.enteredDescricao,
        motivoId: this.selectedMotivo?.id,
        categoriaId: this.selectedCategoria?.id,
        arquivos: arquivos
      })
        .subscribe({
          next: response =>{
            console.log(response)
            this.isLoading = false;
          },
          error: error=> {
            this.errorMessage = error.message;
            this.isLoading = false
          }
        })
    }
  }

  private loadMotivos() {
    this.motivoService.getAll()
      .subscribe({
        next: (response) => {
          this.motivos = response;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Ocorreu um erro. Tente novamente mais tarde.';
        }
      })
  }

  private loadCategorias(){
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          this.categorias = response;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Ocorreu um erro. Tente novamente mais tarde.';
        }
      })
  }

  private loadSolicitante() {
    this.solicitanteService.getLoggedSolicitante()
      .subscribe({
        next: (response) => {
          this.solicitante = response;
        }
      })
  }

  onFilesSelected(event: Event) {
    //Type Assertion - Declarando que esse evento generico vem de um input de arquivo.
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf'];


    for (let file of input.files) {
      if (!tiposPermitidos.includes(file.type)) {
        this.errorMessage = `O arquivo "${file.name}" não é um tipo permitido.`;
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = `O arquivo "${file.name}" excede o limite de 5MB.`;
        return;
      }

      this.anexos.push(file)
    }

  }

  removerAnexo(file: File) {
    this.anexos = this.anexos.filter(f => f !== file);
  }
}
