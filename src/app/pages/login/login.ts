import {Component, inject} from '@angular/core';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';
import {Router} from '@angular/router';
import {routes} from '../../app.routes';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  errorMessage = '';
  isLoading = false;
  enteredEmail = '';
  enteredSenha = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({
        email: this.enteredEmail,
        senha: this.enteredSenha
      })
      //Fluxo assyncrono, semelhante ao promisse. Nativo do http client do angular
      //.subscribe executa o Observable retornado pelo metodo login do authservice
      .subscribe({
        next: (response) => {
          this.router.navigate(['/tickets']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Ocorreu um erro. Tente novamente mais tarde.';
          this.isLoading = false
        },
        complete: () => {this.isLoading = false}
      });
  }
}
