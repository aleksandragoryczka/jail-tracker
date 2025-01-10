import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Unauthorized login attempt');
          this.toastr.error(
            'You provided wrong e-mail or password',
            'Wrong credentials'
          );
          return throwError(() => error);
        } else if (error.status === 403) {
          console.log('Forbidden action');
          this.toastr.error(
            'You do not have permission to perform this action',
            'Forbidden');
        } else {
          this.toastr.error(error.error, 'Error');
        }
        return throwError(() => error);
      })
    );
  }
}
