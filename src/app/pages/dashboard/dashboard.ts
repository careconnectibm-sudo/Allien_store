import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-brand-slate-dark">User <span class="text-brand-blue">Dashboard</span></h1>
        
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium px-4 py-2 bg-brand-blue-light text-brand-blue border border-brand-blue-mid rounded-lg">Last 30 Days</span>
          <button class="px-4 py-2 bg-white border border-brand-border rounded-lg text-sm font-bold shadow-sm hover:border-brand-blue transition-colors">Export CSV</button>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        @for (metric of metrics; track metric.label) {
          <div class="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
            <p class="text-sm text-brand-muted mb-2">{{ metric.label }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-heading font-bold text-brand-slate-dark">{{ metric.value }}</span>
              <span [class]="metric.trend >= 0 ? 'text-green-500' : 'text-red-500'" class="text-xs font-bold">
                {{ metric.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Recent Transactions Table -->
      <div class="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div class="p-6 border-b border-brand-border flex items-center justify-between">
          <h2 class="text-xl font-heading font-bold text-brand-slate-dark">Recent Transactions</h2>
          <button class="text-brand-blue font-bold text-sm hover:underline">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-brand-off border-b border-brand-border">
              <tr>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">Store</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">Date</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">Amount</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">Commission</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border">
              @for (tx of transactions; track tx.id) {
                <tr class="hover:bg-brand-off/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-brand-slate-dark">{{ tx.store }}</td>
                  <td class="px-6 py-4 text-sm text-brand-slate">{{ tx.date }}</td>
                  <td class="px-6 py-4 text-sm text-brand-slate">₹{{ tx.amount }}</td>
                  <td class="px-6 py-4 font-bold text-brand-blue">₹{{ tx.commission }}</td>
                  <td class="px-6 py-4">
                    <span [class]="statusClasses[tx.status]" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                      {{ tx.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Dashboard implements OnInit {
  Math = Math;
  
  metrics = [
    { label: 'Total Earnings', value: '₹14,250', trend: 12 },
    { label: 'Pending Payout', value: '₹3,420', trend: -4 },
    { label: 'Total Clicks', value: '1,248', trend: 28 },
    { label: 'Conversion Rate', value: '4.2%', trend: 2 },
  ];

  transactions = [
    { id: 1, store: 'Amazon India', date: '2026-04-05', amount: 1250, commission: 150, status: 'verified' },
    { id: 2, store: 'Myntra', date: '2026-04-04', amount: 3400, commission: 306, status: 'pending' },
    { id: 3, store: 'Ajio', date: '2026-04-03', amount: 899, commission: 116, status: 'verified' },
    { id: 4, store: 'Flipkart', date: '2026-04-01', amount: 15499, commission: 1240, status: 'rejected' },
    { id: 5, store: '1mg', date: '2026-03-30', amount: 560, commission: 140, status: 'verified' },
  ];

  statusClasses: Record<string, string> = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    rejected: 'bg-red-100 text-red-700',
  };

  constructor() {}

  ngOnInit() {}
}
