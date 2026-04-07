import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Coupon } from '../../../models/store.model';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border-2 border-dashed border-brand-blue-mid rounded-xl overflow-hidden flex flex-col sm:flex-row relative group hover:border-brand-blue transition-colors">
      <!-- Left Gradient Accent -->
      <div class="w-1.5 bg-gradient-to-b from-brand-blue to-brand-purple absolute left-0 top-0 h-full"></div>

      <!-- Content -->
      <div class="p-5 flex-grow flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xl font-heading font-bold text-brand-blue">{{ coupon.label }}</span>
          <span class="text-xs text-brand-muted font-medium">{{ coupon.logo.store_name }}</span>
        </div>
        
        <h3 class="text-brand-slate-dark font-bold mb-3 line-clamp-2 leading-snug">{{ coupon.offer }}</h3>
        
        <!-- Code / Note -->
        <div class="mt-auto">
          @if (coupon.coupon_code) {
            <div class="flex items-center gap-2 mb-4">
              <div class="flex-grow bg-brand-blue-light/50 border border-dashed border-brand-blue-mid rounded-lg px-3 py-2 text-center uppercase font-mono font-bold text-brand-purple text-sm">
                {{ coupon.coupon_code }}
              </div>
              <button 
                (click)="copyCode(coupon.coupon_code)"
                class="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-purple/90 transition-colors shrink-0"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          } @else {
            <div class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-4 text-xs text-center text-brand-muted italic">
              No code needed — auto-applied at checkout
            </div>
          }

          <div class="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/50">
            <span [class]="getExpiryClass(coupon.expire_date)">
              {{ getExpiryText(coupon.expire_date) }}
            </span>
            <a [href]="coupon.url" target="_blank" class="text-brand-blue font-bold text-sm hover:underline flex items-center gap-1">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CouponCard {
  @Input({ required: true }) coupon!: Coupon;
  copied = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  copyCode(code: string) {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(code);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
      // As per spec: "After copy -> opens coupon.url in new tab"
      window.open(this.coupon.url, '_blank');
    }
  }

  getExpiryText(dateStr: string): string {
    const expiry = new Date(dateStr).getTime();
    const now = Date.now();
    const days = Math.ceil((expiry - now) / 86400000);
    if (days <= 0) return 'Expired';
    if (days === 1) return 'Expires tomorrow';
    if (days < 7) return `Expires in ${days} days`;
    return `${days} days left`;
  }

  getExpiryClass(dateStr: string): string {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    const base = "text-[10px] font-bold uppercase py-1 px-2 rounded ";
    if (days <= 0) return base + "bg-red-50 text-red-600";
    if (days <= 3) return base + "bg-orange-50 text-orange-600";
    return base + "bg-green-50 text-green-600";
  }
}
