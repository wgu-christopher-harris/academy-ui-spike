import {inject, Injectable} from '@angular/core';
import {BffHttpClient} from "@academy/platform/http";
import {Observable} from "rxjs";
import {CatalogCourseDto} from "@academy/shared/models";
import {httpResource} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class EnrollmentCatalogService {
  private readonly bff = inject(BffHttpClient);

  getEnrollmentCatalog(): Observable<CatalogCourseDto[]> {
    return this.bff.get<CatalogCourseDto[]>('/catalog/courses');
  }

  catalogCourses = httpResource<CatalogCourseDto[]>(() => ({
    url: this.bff.config.bffBaseUrl + '/catalog/courses',
    method: 'GET',
    reportProgress: true
  }));
}
