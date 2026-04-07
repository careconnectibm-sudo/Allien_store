import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Stores } from './pages/stores/stores';
import { Category } from './pages/category/category';
import { Coupons } from './pages/coupons/coupons';
import { Search } from './pages/search/search';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'stores', component: Stores },
  { path: 'category/:cat', component: Category },
  { path: 'coupons', component: Coupons },
  { path: 'search', component: Search },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' }
];
