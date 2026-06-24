import {Component, effect, inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import {EnrollmentCatalogService} from "@academy/enrollment/data-access";
import {ButtonModule} from "primeng/button";
import {JsonPipe} from "@angular/common";
import {CardModule} from "primeng/card";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  imports: [NxWelcome, RouterModule, ButtonModule, JsonPipe, CardModule, ProgressSpinnerModule],
  selector: 'acad-enroll-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'enrollment';
  catalogService = inject(EnrollmentCatalogService);
  catalogResource = this.catalogService.catalogCourses;

  constructor() {
    effect(() => {
      console.log(this.catalogResource.value());
    });
    this.catalogService.getEnrollmentCatalog().subscribe(console.log);
  }
}
