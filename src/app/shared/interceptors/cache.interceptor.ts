import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheRequestService } from '../services/cache-request.service';

const TTL = 70;

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cache: CacheRequestService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cachedResponse = this.cache.get(req.url);
        return cachedResponse
            ? of(cachedResponse)
            : this.sendRequest(req, next);
    }

    sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        this.cache.set(req.url, event, TTL);
                    }
                }));
    }
}
