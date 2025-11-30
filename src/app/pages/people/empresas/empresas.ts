import {Component, EventEmitter, inject, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {EmpresaService} from '../../../service/empresa.service';
import {Empresa} from '../../../model/empresa.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-empresas',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './empresas.html',
  styleUrl: './empresas.css'
})
export class Empresas implements OnInit{
  isEditing = false;
  @Output() isLoadingEmpresas = new EventEmitter<boolean>();
  errorMessage = '';
  errorModalMessage = '';

  enteredCodigo?: number;
  enteredRazaoSocial?: string;
  enteredCnpj?: number;

  enteredModalRazao: string = '';
  enteredModalCnpj: string = '';
  enteredModalEmail: string = '';
  enteredModalTelefone: string = '';
  enteredModalObs?: string = '';

  empresas?: Empresa[];
  empresa?: Empresa;

  private empresaService = inject(EmpresaService);
  private modalService = inject(NgbModal);



  ngOnInit(): void {
    this.loadEmpresas();
  }

  closeModal(){
    this.empresa = undefined;
    this.enteredModalRazao = '';
    this.enteredModalCnpj = '';
    this.enteredModalEmail = '';
    this.enteredModalTelefone = '';
    this.enteredModalObs = '';

    this.errorModalMessage = '';

    this.modalService.dismissAll();
  }

  openEmpresaModal(content: TemplateRef<any>, empresa?:Empresa) {
    if (empresa) {
      this.empresa = empresa;

      this.enteredModalRazao = empresa.razaoSocial;
      this.enteredModalCnpj = empresa.cnpj;
      this.enteredModalEmail = empresa.email;
      this.enteredModalTelefone = empresa.telefone;
      this.enteredModalObs = empresa.observacoes;

      this.isEditing = true;

    } else {
      this.isEditing = false;
    }

    this.modalService.open(content, {size: 'lg',});
  }

  onLimparCampos() {
    this.enteredCodigo = undefined;
    this.enteredRazaoSocial = undefined;
    this.enteredCnpj = undefined;
  }

  loadEmpresas() {
    this.errorMessage = ""
    this.isLoadingEmpresas.emit(true);

    this.empresaService.getAll(
      this.enteredCodigo,
      this.enteredRazaoSocial,
      this.enteredCnpj
    ).subscribe({
        next: (response) => {
          this.empresas = response;
          this.isLoadingEmpresas.emit(false);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingEmpresas.emit(false);
        }
      })
  }

  onSubimit() {
    if(!this.enteredModalRazao){
      this.errorModalMessage = "Razão social é obrigatória."
      return;
    }

    if(!this.enteredModalCnpj){
      this.errorModalMessage = "CNPJ é obrigatório."
      return;
    }

    if(!this.enteredModalEmail){
      this.errorModalMessage = "Email é obrigatório."
      return;
    }

    if(!this.enteredModalTelefone){
      this.errorModalMessage = "Telefone é obrigatório."
      return;
    }

    this.isLoadingEmpresas.emit(true);

    if(this.isEditing) {
      this.empresaService.update({
        id: this.empresa?.id,
        observacoes: this.enteredModalObs,
        razaoSocial: this.enteredModalRazao,
        cnpj: this.enteredModalCnpj,
        email: this.enteredModalEmail,
        telefone: this.enteredModalTelefone,
        ativo: this.empresa?.ativo,
        criadoEm: this.empresa?.criadoEm
      })
        .subscribe({
          next: (response) => {
            this.closeModal()
            this.isEditing = false;
            this.loadEmpresas();

          },
          error: (error) => {
            this.errorModalMessage = error.message;
            this.isLoadingEmpresas.emit(false);
          }
        })

    }else {
      this.empresaService.create({
        observacoes: this.enteredModalObs,
        razaoSocial: this.enteredModalRazao,
        cnpj: this.enteredModalCnpj,
        email: this.enteredModalEmail,
        telefone: this.enteredModalTelefone,
      })
        .subscribe({
          next: (response) => {
            this.closeModal()
            this.isEditing = false;
            this.loadEmpresas();
          },
          error: (error) => {
            this.errorModalMessage = error.message;
            this.isLoadingEmpresas.emit(false);
          }
        })
    }
  }

  onChangeStatus(empresa: Empresa) {
    this.errorMessage = '';
    this.isLoadingEmpresas.emit(true);

    empresa.ativo = empresa.ativo
      ? empresa.ativo = false
      : empresa.ativo = true;

    this.empresaService.update(empresa)
      .subscribe({
        next: (response) => {
          this.loadEmpresas();
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoadingEmpresas.emit(false);
        }
      })
  }
}
