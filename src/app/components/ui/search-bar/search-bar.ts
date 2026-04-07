import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative w-full group">
      <input 
        type="text" 
        [(ngModel)]="query"
        (keyup.enter)="onSearch()"
        placeholder="Search stores, coupons or categories..." 
        class="w-full h-11 pl-12 pr-4 bg-white border border-brand-border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
      >
      <button (click)="onSearch()" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-blue transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `]
})
export class SearchBar {
  query = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.query.trim() } });
    }
  }
}
