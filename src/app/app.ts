import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayout } from './components/layout/page-layout/page-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageLayout],
  template: `
    <app-page-layout>
      <router-outlet></router-outlet>
    </app-page-layout>
  `,
  styles: [],
})
export class App {}
