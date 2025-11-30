import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbNav, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-people',
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavOutlet,
    NgbNavLinkButton
  ],
  templateUrl: './people.html',
  styleUrl: './people.css'
})
export class People {
  active = 1;
  isEditMode = false;

  @ViewChild('empresaModal') empresaModal!: TemplateRef<any>;
  @ViewChild('solicitanteModal') solicitanteModal!: TemplateRef<any>;
  @ViewChild('usuarioModal') usuarioModal!: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  openEmpresaModal() {
    this.modalService.open(this.empresaModal, {
      size: 'lg',
      centered: true
    });
  }

  openSolicitanteModal() {
    this.modalService.open(this.solicitanteModal, {
      size: 'lg',
      centered: true
    });
  }

  openUsuarioModal() {
    this.modalService.open(this.usuarioModal, {
      size: 'lg',
      centered: true
    });
  }
}
