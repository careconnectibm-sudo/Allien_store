import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseTitle = 'AllienStore';

  constructor(private title: Title, private meta: Meta) {}

  updateTitle(newTitle?: string) {
    if (newTitle) {
      this.title.setTitle(`${newTitle} | ${this.baseTitle}`);
    } else {
      this.title.setTitle(`${this.baseTitle} | Best Coupons, Daily Deals & Cashback Offers`);
    }
  }

  updateMetaTags(config: { description?: string, keywords?: string, image?: string, url?: string }) {
    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ property: 'twitter:description', content: config.description });
    }
    
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ property: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.meta.updateTag({ property: 'twitter:url', content: config.url });
      this.meta.updateTag({ rel: 'canonical', href: config.url } as any);
    }
  }
}
