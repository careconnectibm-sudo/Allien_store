import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { SeoService } from '../../services/seo.service';
import { Store, CATEGORIES } from '../../models/store.model';
import { StoreCard } from '../../components/stores/store-card/store-card';
import { SearchBar } from '../../components/ui/search-bar/search-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, KeyValuePipe, StoreCard, SearchBar],
  template: `
    <div class="space-y-12 pb-16">
      <!-- Hero Section -->
      <section class="relative bg-brand-slate-dark pt-20 pb-32 overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#2E9BD6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div class="container mx-auto px-4 relative z-10 text-center">
          <h1 class="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Shop Smart, Earn on <span class="text-brand-blue">Every Purchase</span>
          </h1>
          <p class="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Get exclusive coupons, daily deals and up to 36% cashback from 245+ top Indian brands.
          </p>
          
          <div class="max-w-2xl mx-auto bg-white rounded-full p-1.5 shadow-2xl">
            <app-search-bar></app-search-bar>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-8 mt-16 text-white/80">
            <div class="text-center">
              <div class="text-3xl font-heading font-bold text-brand-blue">245+</div>
              <div class="text-sm">Verified Stores</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-heading font-bold text-brand-blue">20+</div>
              <div class="text-sm">Categories</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-heading font-bold text-brand-blue">36%</div>
              <div class="text-sm">Top Payout</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Bar -->
      <div class="container mx-auto px-4 -mt-12 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl border border-brand-border p-6 flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <span class="text-brand-slate font-semibold flex items-center gap-2">
            <svg class="text-brand-blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Powered by INRDeals
          </span>
          <span class="text-brand-slate font-semibold flex items-center gap-2">
            <svg class="text-green-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            245 Verified Brands
          </span>
          <span class="text-brand-slate font-semibold flex items-center gap-2">
            <svg class="text-orange-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Free to Use Forever
          </span>
        </div>
      </div>

      <!-- Categories Grid -->
      <section class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-heading font-bold text-brand-slate-dark">Shop by <span class="text-brand-blue">Category</span></h2>
          <a routerLink="/stores" class="text-brand-blue font-bold hover:underline">View All</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          @for (cat of categories | keyvalue; track cat.key) {
            <a [routerLink]="['/category', cat.key]" class="bg-white border border-brand-border rounded-xl p-6 text-center hover:border-brand-blue hover:shadow-md transition-all group">
              <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">{{ cat.value.icon }}</div>
              <div class="font-bold text-brand-slate-dark group-hover:text-brand-blue">{{ cat.key }}</div>
              <div class="text-xs text-brand-muted mt-1">{{ cat.value.count }} stores</div>
            </a>
          }
        </div>
      </section>

      <!-- Featured Stores -->
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-3xl font-heading font-bold text-brand-slate-dark mb-8">Featured <span class="text-brand-blue">Stores</span></h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          @for (store of featuredStores; track store.id) {
            <app-store-card [store]="store"></app-store-card>
          }
        </div>
      </section>

      <!-- How It Works -->
      <section class="bg-brand-blue-light py-20">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-heading font-bold text-brand-slate-dark mb-12">How AllienStore <span class="text-brand-blue">Works</span></h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="space-y-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">🔍</div>
              <h3 class="font-bold">1. Find a Deal</h3>
              <p class="text-sm text-brand-muted">Browse your favorite stores and pick the best offer.</p>
            </div>
            <div class="space-y-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">🖱️</div>
              <h3 class="font-bold">2. Click Link</h3>
              <p class="text-sm text-brand-muted">Click "Get Deal" to activate your tracking.</p>
            </div>
            <div class="space-y-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">🛍️</div>
              <h3 class="font-bold">3. Shop Normally</h3>
              <p class="text-sm text-brand-muted">The store pays us a commission for your purchase.</p>
            </div>
            <div class="space-y-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">💸</div>
              <h3 class="font-bold">4. You Earn</h3>
              <p class="text-sm text-brand-muted">We share that commission with you as cashback!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Home implements OnInit {
  categories = CATEGORIES;
  featuredStores: Store[] = [];

  constructor(
    private storeService: StoreService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.updateTitle();
    this.seoService.updateMetaTags({
      description: 'Get the latest coupons, exclusive deals, and up to 36% cashback from 245+ top Indian brands at AllienStore.'
    });

    this.storeService.getStores().subscribe(stores => {
      // Show top 8 stores on home
      this.featuredStores = stores.slice(0, 8);
    });
  }
}
