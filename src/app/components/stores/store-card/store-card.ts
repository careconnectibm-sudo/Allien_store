import { Component, Input } from '@angular/core';
import { Store } from '../../../models/store.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="group bg-white border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col h-full cursor-pointer"
      (click)="goToStore(store.link)"
    >
      <!-- Top Hover Accent -->
      <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-blue to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <!-- Logo & Info -->
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 rounded-lg border border-brand-border p-1 flex-shrink-0 bg-white group-hover:border-brand-blue-mid transition-colors flex items-center justify-center">
          <img [src]="store.logo" [alt]="store.name" class="w-full h-full object-contain rounded" onerror="this.src='https://ui-avatars.com/api/?name='+this.alt+'&background=2E9BD6&color=fff'">
        </div>
        <div class="flex-grow min-w-0">
          <h3 class="text-lg font-heading font-bold text-brand-slate-dark truncate group-hover:text-brand-blue transition-colors">{{ store.name }}</h3>
          <p class="text-xs text-brand-muted truncate">{{ store.category }}</p>
        </div>
      </div>

      <!-- Payout -->
      <div class="mb-6 flex flex-wrap gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue-light border border-brand-blue-mid text-brand-blue-dark text-xs font-semibold">
          💰 {{ store.payout }}
        </span>
        <span [class]="getTypeClass(store.type)">
          {{ store.type }}
        </span>
      </div>

      <!-- CTA -->
      <div class="mt-auto">
        <button class="w-full py-3 px-4 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors flex items-center justify-center gap-2">
          Get Deal
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class StoreCard {
  @Input({ required: true }) store!: Store;

  goToStore(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  getTypeClass(type: string): string {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ";
    switch (type.toUpperCase()) {
      case 'CPS': return base + "bg-green-100 text-green-700 border border-green-200";
      case 'CPA': return base + "bg-purple-100 text-purple-700 border border-purple-200";
      case 'CPL': return base + "bg-blue-100 text-blue-700 border border-blue-200";
      default: return base + "bg-gray-100 text-gray-700 border border-gray-200";
    }
  }
}
