import {Component, inject} from '@angular/core';
import {Navbar} from '../../shared/navbar/navbar';
import {FormsModule} from '@angular/forms';
//wrapper ngx-quill, que faz a integração Angular + Quill Editor
import {QuillModule} from 'ngx-quill';
import {Motivo} from '../../motivos/motivo.model';
import {MotivoService} from '../../motivos/motivo.service';
import {Observable} from 'rxjs';
import {CategoriaService} from '../../categorias/categoria.service';
import {Categoria} from '../../categorias/categoria.model';
import {TicketService} from '../ticket.service';
import {SolicitanteService} from '../../solicitantes/solicitante.service';
import {Solicitante} from '../../solicitantes/solicitante.model';

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

  enteredDescricao = "";
  enteredTitulo = "";
  isLoading: any;
  motivos: Motivo[] = [];
  categorias: Categoria[] = [];
  selectedMotivo?: Motivo;
  selectedCategoria?: Categoria;
  solicitante?: Solicitante;

  constructor() {
    this.loadMotivos();
    this.loadCategorias();
    this.loadSolicitante();
  }

  onSubmit() {
    this.isLoading = true;

    console.log(this.selectedMotivo);
    console.log(this.selectedCategoria);

    this.ticketService.create({
      titulo: this.enteredTitulo,
      descricaoHtml: this.enteredDescricao,
      motivoId: this.selectedMotivo?.id,
      categoriaId: this.selectedCategoria?.id
    })
      .subscribe({
        next: response =>{
          console.log(response)
          this.isLoading = false;
        },
        error: error=> {
          console.log(error)
          this.isLoading = false;
        }
      })
  }

  private loadMotivos() {
    this.motivoService.getAll()
      .subscribe({
        next: (response) => {
          this.motivos = response;
          console.log(this.motivos);
        },
        error: (error) => {console.log(error);}
      })
  }

  private loadCategorias(){
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          this.categorias = response;
          console.log(this.categorias);
        },
        error: (error) => {console.log(error);}
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
}
