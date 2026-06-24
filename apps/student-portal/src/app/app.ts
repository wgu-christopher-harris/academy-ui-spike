import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";

@Component({
  imports: [RouterModule, ButtonModule, DividerModule],
  selector: 'acad-student-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'student-portal';
}
