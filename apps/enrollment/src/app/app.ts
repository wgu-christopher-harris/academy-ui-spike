import {Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  imports: [RouterModule, ButtonModule, CardModule, ProgressSpinnerModule],
  selector: 'acad-enroll-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'enrollment';
}
