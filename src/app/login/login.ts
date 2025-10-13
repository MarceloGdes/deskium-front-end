import {Component, inject} from '@angular/core';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth/auth-service';


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

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({
        email: this.enteredEmail,
        senha: this.enteredSenha
      })
      .subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso', response);
          // Redirecionar para dashboard ou página principal
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
          this.isLoading = false;
        }
      });
  }
}
