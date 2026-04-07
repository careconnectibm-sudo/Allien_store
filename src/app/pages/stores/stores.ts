import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Store, CATEGORIES } from '../../models/store.model';
import { StoreCard } from '../../components/stores/store-card/store-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule, KeyValuePipe, StoreCard, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-brand-slate-dark">All <span class="text-brand-blue">Stores</span></h1>
        
        <!-- Local Search -->
        <div class="relative w-full md:w-96">
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="filterStores()"
            placeholder="Search stores by name..." 
            class="w-full h-12 pl-12 pr-4 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
          >
          <svg class="absolute left-4 top-1/2 -track-y-1/2 text-brand-muted" style="top: 50%; transform: translateY(-50%)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <aside class="space-y-8">
          <div>
            <h3 class="font-heading font-bold text-lg mb-4 text-brand-slate-dark">Categories</h3>
            <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <button 
                (click)="selectedCategory = ''; filterStores()"
                [class]="!selectedCategory ? 'text-brand-blue font-bold bg-brand-blue-light' : 'text-brand-slate hover:bg-gray-50'"
                class="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between"
              >
                <span>All Categories</span>
              </button>
              @for (cat of categories | keyvalue; track cat.key) {
                <button 
                  (click)="selectedCategory = cat.key; filterStores()"
                  [class]="selectedCategory === cat.key ? 'text-brand-blue font-bold bg-brand-blue-light' : 'text-brand-slate hover:bg-gray-50'"
                  class="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between"
                >
                  <span class="flex items-center gap-2">
                    <span>{{ cat.value.icon }}</span>
                    <span>{{ cat.key }}</span>
                  </span>
                </button>
              }
            </div>
          </div>

          <div>
            <h3 class="font-heading font-bold text-lg mb-4 text-brand-slate-dark">Campaign Type</h3>
            <div class="flex flex-wrap gap-2">
              @for (type of types; track type) {
                <button 
                  (click)="selectedType = (selectedType === type ? '' : type); filterStores()"
                  [class]="selectedType === type ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-brand-slate border-brand-border hover:border-brand-blue'"
                  class="px-3 py-1.5 border rounded-lg text-xs font-bold transition-all"
                >
                  {{ type }}
                </button>
              }
            </div>
          </div>
        </aside>

        <!-- Stores Grid -->
        <div class="lg:col-span-3">
          @if (filteredStores.length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (store of filteredStores; track store.id) {
                <app-store-card [store]="store"></app-store-card>
              }
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-brand-border p-20 text-center">
              <div class="text-5xl mb-4">🔍</div>
              <h3 class="text-xl font-bold mb-2">No stores found</h3>
              <p class="text-brand-muted">Try adjusting your filters or search query.</p>
              <button (click)="resetFilters()" class="mt-6 text-brand-blue font-bold hover:underline underline-offset-4">Reset all filters</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
  `]
})
export class Stores implements OnInit {
  categories = CATEGORIES;
  types = ['CPS', 'CPA', 'CPL', 'CPR'];
  
  allStores: Store[] = [];
  filteredStores: Store[] = [];
  
  searchQuery = '';
  selectedCategory = '';
  selectedType = '';

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.storeService.getStores().subscribe(stores => {
      this.allStores = stores;
      this.filteredStores = stores;
    });
  }

  filterStores() {
    this.filteredStores = this.allStores.filter(store => {
      const matchSearch = !this.searchQuery || store.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchCategory = !this.selectedCategory || store.category.includes(this.selectedCategory);
      const matchType = !this.selectedType || store.type === this.selectedType;
      return matchSearch && matchCategory && matchType;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.filterStores();
  }
}
