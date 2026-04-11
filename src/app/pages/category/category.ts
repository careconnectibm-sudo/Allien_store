import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { SeoService } from '../../services/seo.service';
import { Store, CATEGORIES } from '../../models/store.model';
import { StoreCard } from '../../components/stores/store-card/store-card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, StoreCard],
  template: `
    <div class="pb-16">
      <!-- Category Header -->
      <section class="bg-brand-blue-light py-12 border-b border-brand-blue-mid/30">
        <div class="container mx-auto px-4 text-center">
          <div class="text-5xl mb-4">{{ currentCategoryIcon }}</div>
          <h1 class="text-4xl font-heading font-bold text-brand-slate-dark mb-4">
            Best <span class="text-brand-blue">{{ categoryName }}</span> Coupons & Cashback
          </h1>
          <p class="text-brand-muted max-w-2xl mx-auto">
            Find the best deals and exclusive offers from {{ stores.length }} verified stores in the {{ categoryName }} category.
          </p>
        </div>
      </section>

      <!-- Stores Grid -->
      <section class="container mx-auto px-4 py-12">
        @if (stores.length > 0) {
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            @for (store of stores; track store.id) {
              <app-store-card [store]="store"></app-store-card>
            }
          </div>
        } @else {
          <div class="bg-white rounded-2xl border border-brand-border p-20 text-center">
            <h3 class="text-xl font-bold mb-2">No stores found in this category</h3>
            <p class="text-brand-muted mb-6">We're working on adding more stores here soon!</p>
            <a routerLink="/stores" class="text-brand-blue font-bold hover:underline">Browse all stores</a>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Category implements OnInit {
  categoryName = '';
  currentCategoryIcon = '🏷️';
  stores: Store[] = [];

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = params['cat'];
      this.currentCategoryIcon = CATEGORIES[this.categoryName]?.icon || '🏷️';
      
      this.seoService.updateTitle(`Best ${this.categoryName} Coupons`);
      this.seoService.updateMetaTags({
        description: `Get the best deals and exclusive offers from verified stores in the ${this.categoryName} category at AllienStore.`
      });

      this.loadCategoryStores();
    });
  }

  loadCategoryStores() {
    this.storeService.getStores({ category: this.categoryName }).subscribe(stores => {
      this.stores = stores;
    });
  }
}
