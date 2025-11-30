import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {Empresas} from './empresas/empresas';
import {LoadingOverlay} from '../../layout/shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-people',
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavOutlet,
    NgbNavLinkButton,
    NgbNavContent,
    Empresas,
    LoadingOverlay
  ],
  templateUrl: './people.html',
  styleUrl: './people.css'
})
export class People {
  isLoadingEmpresas = false;
}
