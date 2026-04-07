import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Coupon, CATEGORIES } from '../../models/store.model';
import { CouponCard } from '../../components/coupons/coupon-card/coupon-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, CouponCard, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-brand-slate-dark">Latest <span class="text-brand-blue">Coupons</span></h1>
        
        <div class="relative w-full md:w-96">
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="filterCoupons()"
            placeholder="Search coupons or stores..." 
            class="w-full h-11 pl-10 pr-4 bg-white border border-brand-border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (coupon of filteredCoupons; track coupon.id) {
          <app-coupon-card [coupon]="coupon"></app-coupon-card>
        } @empty {
          <div class="col-span-full bg-white rounded-2xl border border-brand-border p-20 text-center">
            <div class="text-5xl mb-4">🏷️</div>
            <h3 class="text-xl font-bold mb-2">No coupons found</h3>
            <p class="text-brand-muted">Try a different search query or check back later.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Coupons implements OnInit {
  allCoupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  searchQuery = '';

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.storeService.getCoupons().subscribe(coupons => {
      this.allCoupons = coupons;
      this.filteredCoupons = coupons;
    });
  }

  filterCoupons() {
    this.filteredCoupons = this.allCoupons.filter(coupon => {
      const q = this.searchQuery.toLowerCase();
      return coupon.offer.toLowerCase().includes(q) || 
             coupon.logo.store_name.toLowerCase().includes(q) ||
             coupon.coupon_code.toLowerCase().includes(q);
    });
  }
}
