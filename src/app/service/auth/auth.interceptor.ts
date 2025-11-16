import {AuthService} from './auth.service';
import {catchError, EMPTY, Observable, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpStatusCode} from '@angular/common/http';
import {Router} from '@angular/router';

//interceptor passado no appConfig
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
  // Injetando o AuthService
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const router = inject(Router);

  let newReq;

  //Clonando a requisição e adicionando o token no header
  if(authToken){
    newReq = req.clone({
      headers: req.headers.append('Authorization', authToken),
    })

  }else if (req.url === 'http://localhost:8080/auth/login') {
    newReq = req;

  } else {
    router.navigate(['login']);
    //Finaliza o ciclo de vida do observable
    return EMPTY
  }

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        // Token inválido, expirado  > logout
        authService.logout();

      }else if(error.status === HttpStatusCode.Forbidden){
        //acesso negado a um recurso da api da pagina.
        router.navigate(['/tickets'])
        return EMPTY
      }
      return throwError(() => error);
    })
  );
}
