import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../../models/store.model';
import { CommonModule, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, KeyValuePipe],
  template: `
    <footer class="bg-brand-slate-dark text-white pt-12 pb-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Logo & Description -->
          <div class="space-y-6">
            <a routerLink="/" class="inline-block">
              <img src="/logo.png" alt="AllienStore" class="h-[36px] w-auto">
            </a>
            <p class="text-white/60 leading-relaxed max-w-sm">
              AllienStore is India's leading destination for exclusive coupons, offers, and cashback from 245+ top brands. Shop smart and earn on every purchase.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-heading font-semibold mb-6">Quick Links</h4>
            <ul class="space-y-4 text-white/60">
              <li><a routerLink="/stores" class="hover:text-brand-blue transition-colors">All Stores</a></li>
              <li><a routerLink="/coupons" class="hover:text-brand-blue transition-colors">Daily Coupons</a></li>
              <li><a routerLink="/dashboard" class="hover:text-brand-blue transition-colors">Dashboard</a></li>
              <li><a href="#" class="hover:text-brand-blue transition-colors">About Us</a></li>
            </ul>
          </div>

          <!-- Top Categories -->
          <div class="lg:col-span-2">
            <h4 class="text-lg font-heading font-semibold mb-6">Top Categories</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              @for (cat of topCategories | keyvalue; track cat.key) {
                <a [routerLink]="['/category', cat.key]" class="text-white/60 hover:text-brand-blue transition-colors flex items-center gap-2">
                  <span>{{ cat.value.icon }}</span>
                  <span>{{ cat.key }}</span>
                </a>
              }
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2026 AllienStore. Powered by INRDeals.</p>
          <div class="flex items-center gap-6">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Footer {
  topCategories = CATEGORIES;
}
