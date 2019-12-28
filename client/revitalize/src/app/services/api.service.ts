import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, ObservableInput, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import { ENDPOINTS } from '@network/endpoints.enum';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) {}

  get(urlFragment: ENDPOINTS, params?: { param: string, value: string }[]): Observable<any> {
    const url = this.getFullUrlWithPath(urlFragment);

    return this.http.get(
      url,
      { params: params ? this.addQueryParams(params) : undefined },
    ).pipe(
      catchError((err: Error): ObservableInput<any> => throwError(err)),
    );
  }

  post(urlFragment: ENDPOINTS, payload: any): Observable<any> {
    const url = this.getFullUrlWithPath(urlFragment);

    return this.http.post(url, payload);
  }

  private getFullUrlWithPath(urlFragment: string): string {
    return [environment.apiUrl, urlFragment].join('/');
  }

  private addQueryParams(payload: { param: string, value: string }[]): HttpParams {
    let params: HttpParams = new HttpParams();

    payload.forEach((el: { param: string, value: string }) =>
        params = params.keys().length ?
            params.set(el.param, el.value) :
            params.append(el.param, el.value)
    );

    return params;
  }

}