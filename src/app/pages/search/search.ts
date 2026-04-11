import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { SeoService } from '../../services/seo.service';
import { Store, Coupon } from '../../models/store.model';
import { StoreCard } from '../../components/stores/store-card/store-card';
import { CouponCard } from '../../components/coupons/coupon-card/coupon-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, StoreCard, CouponCard],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-heading font-bold mb-8 text-brand-slate-dark">
        Search Results for <span class="text-brand-blue">"{{ query }}"</span>
      </h1>

      <div class="space-y-12">
        <!-- Stores Section -->
        <section>
          <div class="flex items-center justify-between mb-6 border-b border-brand-border pb-4">
            <h2 class="text-xl font-heading font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 10V7"/></svg>
              Matching Stores ({{ matchingStores.length }})
            </h2>
          </div>
          @if (matchingStores.length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              @for (store of matchingStores; track store.id) {
                <app-store-card [store]="store"></app-store-card>
              }
            </div>
          } @else {
            <div class="bg-gray-50 border border-brand-border rounded-xl p-8 text-center text-brand-muted italic">
              No matching stores found.
            </div>
          }
        </section>

        <!-- Coupons Section -->
        <section>
          <div class="flex items-center justify-between mb-6 border-b border-brand-border pb-4">
            <h2 class="text-xl font-heading font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket"><path d="m4.5 8 10.58-5.06a2 2 0 0 1 2.63.96L21.89 12a2 2 0 0 1-.96 2.63l-10.58 5.06a2 2 0 0 1-2.63-.96L3.54 10.63a2 2 0 0 1 .96-2.63Z"/><path d="m14 10 2 2"/><path d="m10 8 2 2"/><path d="m6 6 2 2"/></svg>
              Matching Coupons ({{ matchingCoupons.length }})
            </h2>
          </div>
          @if (matchingCoupons.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (coupon of matchingCoupons; track coupon.id) {
                <app-coupon-card [coupon]="coupon"></app-coupon-card>
              }
            </div>
          } @else {
            <div class="bg-gray-50 border border-brand-border rounded-xl p-8 text-center text-brand-muted italic">
              No matching coupons found.
            </div>
          }
        </section>
      </div>

      @if (matchingStores.length === 0 && matchingCoupons.length === 0) {
        <div class="py-20 text-center">
          <div class="text-6xl mb-6">🔍</div>
          <h3 class="text-2xl font-bold mb-4">Oops! Nothing matched your search.</h3>
          <p class="text-brand-muted mb-8 max-w-md mx-auto italic">
            Double check your spelling or try searching for a more general term like "fashion" or "deals".
          </p>
          <a routerLink="/" class="inline-block px-8 py-3 bg-brand-blue text-white rounded-full font-bold shadow-lg hover:bg-brand-blue-dark transition-all">Go back Home</a>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Search implements OnInit {
  query = '';
  matchingStores: Store[] = [];
  matchingCoupons: Coupon[] = [];

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      
      this.seoService.updateTitle(`Search results for "${this.query}"`);
      this.seoService.updateMetaTags({
        description: `Find the best deals and coupons for "${this.query}" at AllienStore.`
      });

      if (this.query) {
        this.performSearch();
      }
    });
  }

  performSearch() {
    this.storeService.getStores({ query: this.query }).subscribe(stores => {
      this.matchingStores = stores;
    });
    this.storeService.getCoupons({ query: this.query }).subscribe(coupons => {
      this.matchingCoupons = coupons;
    });
  }
}
