import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

//wrapper ngx-quill, que faz a integração Angular + Quill Editor
import {QuillModule} from 'ngx-quill';
import {Motivo} from '../../model/motivo.model';
import {MotivoService} from '../../service/motivo.service';
import {CategoriaService} from '../../service/categoria.service';
import {Categoria} from '../../model/categoria.model';
import {TicketService} from '../../service/ticket.service';
import {SolicitanteService} from '../../service/solicitante.service';
import {Solicitante} from '../../model/solicitante.model';
import {ArquivoService} from '../../service/arquivo.service';
import {Arquivo} from '../../model/arquivo.model';
import {Router} from '@angular/router';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-new-ticket',
  imports: [
    FormsModule,
    QuillModule,
    LoadingOverlay
  ],
  standalone: true,
  templateUrl: './new-ticket.html',
  styleUrl: './new-ticket.css'
})
export class NewTicket implements OnInit{
  private motivoService = inject(MotivoService);
  private categoriaService = inject(CategoriaService);
  private ticketService = inject(TicketService);
  private solicitanteService = inject(SolicitanteService);
  private arquivoService = inject(ArquivoService);
  private router = inject(Router);

  isLoading = false;
  isLoadingSolicitante = false
  isLoadingMotivos = false
  isLoadingCategorias = false

  enteredDescricao = "";
  enteredTitulo = "";
  motivos: Motivo[] = [];
  categorias: Categoria[] = [];
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  solicitante?: Solicitante;
  anexos: File[] = [];
  errorMessage = '';

  constructor() {
    this.isLoadingSolicitante = true
    this.isLoadingMotivos = true
    this.isLoadingCategorias = true
  }

  ngOnInit(): void {
    //Requisições são assyncronas
    this.loadMotivos();
    this.loadCategorias();
    this.loadSolicitante();
  }

  onSubmit() {
    this.errorMessage = '';

    if(this.selectedMotivo === undefined){
      this.errorMessage = 'Motivo não selecionado';
      return;
    }

    if(this.enteredTitulo === ""){
      this.errorMessage = 'Titulo não preenchido';
      return;
    }

    if(this.enteredDescricao === ""){
      this.errorMessage = 'Descrição não preenchida';
      return;
    }

    this.isLoading = true;

    if(this.anexos.length > 0){
      this.arquivoService.uploadFile(this.anexos)
        .subscribe({
          next: response => {
            this.saveTicket(response);
          },
          error: err => {
            this.errorMessage = err.message;
            this.isLoading = false
            return
          }
        })
    }else {
      this.saveTicket();
    }
  }

  private saveTicket(fileNames?: Arquivo[] ){
    this.ticketService.create({
      titulo: this.enteredTitulo,
      descricaoHtml: this.enteredDescricao,
      motivoId: this.selectedMotivo?.id,
      categoriaId: this.selectedCategoria?.id,
      arquivos: fileNames
    })
      .subscribe({
        next: response =>{
          console.log(response)
          this.isLoading = false;
          this.router.navigate(['/opened']);
        },
        error: error=> {
          this.errorMessage = error.message;
          this.isLoading = false
        }
      })
  }

  private loadMotivos() {
    this.motivoService.getAll()
      .subscribe({
        next: (response) => {
          this.motivos = response;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoadingMotivos = false;
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
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoadingCategorias = false;
        }
      })
  }

  private loadSolicitante() {
    this.solicitanteService.getLoggedSolicitante()
      .subscribe({
        next: (response) => {
          this.solicitante = response;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoadingSolicitante = false;
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
