// src/app/services/store.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store, Coupon } from '../models/store.model';
import storesData from '../../data/stores.json';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private stores$: Observable<Store[]> | null = null;

  private sampleCoupons: Coupon[] = [
    {
      id: 1,
      label: '30% OFF',
      offer: 'Flat 30% OFF on all Fashion & Apparels',
      coupon_code: 'ALLIEN30',
      description: 'Minimum purchase of ₹999 required.',
      expire_date: '2026-12-31 23:59:59',
      url: 'https://inr.deals/track?id=all665437315&src=api&campaign=CPS&url=https%3A%2F%2Fwww.myntra.com',
      storelogo_id: 193,
      categories: 'Fashion',
      logo: { id: 193, store_name: 'Myntra' }
    },
    {
      id: 2,
      label: '₹500 OFF',
      offer: 'Get ₹500 Instant Discount on Smartphone purchase',
      coupon_code: 'MOBILE500',
      description: 'Valid on select models only.',
      expire_date: '2026-05-30 23:59:59',
      url: 'https://inr.deals/track?id=all665437315&src=api&campaign=CPS&url=https%3A%2F%2Fwww.amazon.in',
      storelogo_id: 1,
      categories: 'Electronics',
      logo: { id: 1, store_name: 'Amazon India' }
    }
  ];

  constructor() {}

  getStores(params?: { category?: string; type?: string; query?: string }): Observable<Store[]> {
    if (!this.stores$) {
      const raw = Array.isArray((storesData as any).stores) ? (storesData as any).stores : [];
      const mappedStores = raw
        .filter((s: any) => s.status?.toLowerCase() === 'active')
        .map((s: any) => this.mapToStore(s));
      this.stores$ = of(mappedStores).pipe(shareReplay(1));
    }

    return this.stores$.pipe(
      map(stores => {
        let filtered = [...stores];
        if (params?.category) {
          filtered = filtered.filter(s => s.category.toLowerCase().includes(params.category!.toLowerCase()));
        }
        if (params?.type) {
          filtered = filtered.filter(s => s.type === params.type!.toUpperCase());
        }
        if (params?.query) {
          const q = params.query.toLowerCase();
          filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        }
        return filtered;
      })
    );
  }

  private mapToStore(s: any): Store {
    return {
      id: String(s.id || ''),
      name: s.merchant || s.name || '',
      category: this.normalizeCategory(s.category),
      type: (s.type || '').toUpperCase(),
      payout: s.payout || '',
      link: s.url || '',
      logo: s.logo || '',
      domain: this.extractDomain(s.url || ''),
      status: 'active' as const,
      slug: this.slugify(s.merchant || s.name || '')
    };
  }

  getCoupons(params?: { query?: string; category?: string }): Observable<Coupon[]> {
    let filtered = [...this.sampleCoupons];
    if (params?.category) {
      filtered = filtered.filter(c => c.categories.toLowerCase().includes(params.category!.toLowerCase()));
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(c => c.offer.toLowerCase().includes(q) || c.logo.store_name.toLowerCase().includes(q));
    }
    return of(filtered);
  }

  // Helper methods
  private slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private extractDomain(url: string): string {
    try {
      const match = url.match(/url=([^&]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        return new URL(decoded).hostname.replace(/^www\./, '');
      }
    } catch {}
    return '';
  }

  private normalizeCategory(raw: string): string {
    if (!raw) return 'Others';
    const first = raw.split(',')[0].trim();
    const map: Record<string, string> = {
      'Fashion & Apparels': 'Fashion',
      'Medical & Healthcare': 'Health & Beauty',
      'Accessories': 'Fashion',
      'Gifting & Toys': 'Baby & Kids',
    };
    return map[first] || first;
  }
}
