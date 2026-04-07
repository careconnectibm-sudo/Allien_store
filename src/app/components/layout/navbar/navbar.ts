import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchBar } from '../../ui/search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SearchBar],
  template: `
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border h-16 flex items-center">
      <div class="container mx-auto px-4 flex items-center justify-between gap-4">
        <!-- Logo -->
        <a routerLink="/" class="flex-shrink-0 flex items-center">
          <img src="/logo.png" alt="AllienStore" class="h-[44px] w-auto">
        </a>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-grow max-w-xl mx-4">
          <app-search-bar class="w-full"></app-search-bar>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-6">
          <a routerLink="/stores" routerLinkActive="text-brand-blue" class="text-brand-slate font-medium hover:text-brand-blue transition-colors">Stores</a>
          <a routerLink="/coupons" routerLinkActive="text-brand-blue" class="text-brand-slate font-medium hover:text-brand-blue transition-colors">Coupons</a>
          <a routerLink="/dashboard" class="hidden sm:block text-brand-slate font-medium hover:text-brand-blue transition-colors">Dashboard</a>
          
          <button class="md:hidden text-brand-slate">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Navbar {}
