import { APP_DI_CONFIG } from './../app-config.module';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq: HttpRequest<any> = req;
    const apiPrefix = req.url.indexOf('/api/');
    if (apiPrefix !== -1) {
      apiReq = req.clone({ url: `${APP_DI_CONFIG.API_URL}/${req.url.substring(apiPrefix + 5)}` });
    }
    // Intercept 401 & 403 codes
    return next.handle(apiReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api

        } else if (err.status === 403) {
          // if 403 response returned from api show toast to user
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
