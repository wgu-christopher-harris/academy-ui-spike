import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ACADEMY_APP_CONFIG} from "@academy/platform/config";

type HttpGetOptions = Parameters<HttpClient['get']>[1];
type HttpPostOptions = Parameters<HttpClient['post']>[2];
type HttpPutOptions = Parameters<HttpClient['put']>[2];
type HttpPatchOptions = Parameters<HttpClient['patch']>[2];
type HttpDeleteOptions = Parameters<HttpClient['delete']>[1];

@Injectable({
  providedIn: 'root',
})
export class BffHttpClient {
  private readonly http = inject(HttpClient);
  config = inject(ACADEMY_APP_CONFIG);

  get<T>(path: string, options?: HttpGetOptions) {
    return this.http.get<T>(this.url(path), options);
  }

  post<T>(path: string, body: unknown, options?: HttpPostOptions) {
    return this.http.post<T>(this.url(path), body, options);
  }

  put<T>(path: string, body: unknown, options?: HttpPutOptions) {
    return this.http.put<T>(this.url(path), body, options);
  }

  patch<T>(path: string, body: unknown, options?: HttpPatchOptions) {
    return this.http.patch<T>(this.url(path), body, options);
  }

  delete<T>(path: string, options?: HttpDeleteOptions) {
    return this.http.delete<T>(this.url(path), options);
  }

  private url(path: string): string {
    return new URL(path, this.config.bffBaseUrl).toString();
  }

}
