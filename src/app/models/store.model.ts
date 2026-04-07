// src/app/models/store.model.ts

export type CampaignType = 'CPS' | 'CPA' | 'CPL' | 'CPM' | 'CPL_LEAD' | 'CPM_CAR' | 'CPR';

export interface Store {
  id: string;
  name: string;           // merchant name
  category: string;       // primary category
  type: string;           // CPS | CPA | CPL | CPM etc.
  payout: string;         // "Flat 36% / Sale" or "₹380 / Action"
  link: string;           // affiliate tracking URL
  logo?: string;          // logo URL from API or Clearbit
  domain?: string;        // extracted from link for Clearbit
  status: 'active' | 'inactive';
  slug: string;           // url-safe name: "flipkart", "myntra"
}

export interface Coupon {
  id: number;
  url: string;            // affiliate link
  label: string;          // "30% OFF"
  offer: string;          // full offer description
  coupon_code: string;    // the actual code to copy
  description: string;    // HTML string of terms
  expire_date: string;    // "2025-01-31 00:00:00"
  storelogo_id: number;   // store ID for Coupons API
  categories: string;     // "food", "fashion" etc
  logo: {
    id: number;
    store_name: string;
  };
}

export interface CategoryInfo {
  icon: string;
  count: number;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  'Health & Beauty':   { icon: '💄', count: 54 },
  'Fashion':           { icon: '👗', count: 46 },
  'Banking & Finance': { icon: '🏦', count: 29 },
  'Electronics':       { icon: '💻', count: 23 },
  'Travel':            { icon: '✈️', count: 17 },
  'Home & Kitchen':    { icon: '🏠', count: 13 },
  'Online Services':   { icon: '🌐', count: 11 },
  'Food & Grocery':    { icon: '🛒', count: 9  },
  'Domain & Hosting':  { icon: '🖥️', count: 8  },
  'Education':         { icon: '📚', count: 7  },
  'Sports & Fitness':  { icon: '🏋️', count: 6  },
  'Baby & Kids':       { icon: '🧸', count: 6  },
  'Jewelery':          { icon: '💍', count: 4  },
  'Others':            { icon: '🏷️', count: 4  },
  'Automobiles':       { icon: '🚗', count: 2  },
  'Entertainment':     { icon: '🎬', count: 2  },
  'Recharge':          { icon: '📱', count: 1  },
  'Books':             { icon: '📖', count: 1  },
  'Software':          { icon: '⚙️', count: 1  },
  'Services':          { icon: '🛠️', count: 1  },
};
