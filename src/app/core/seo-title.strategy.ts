import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_URL = 'https://parisnordelite.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/logo_pne.jpeg`;

@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;

    const title = route.data['title'] || 'Paris Nord Élite | Association et futsal à Paris Nord';
    const description =
      route.data['description'] ||
      'Paris Nord Élite accompagne les jeunes et les familles à travers le futsal, la solidarité et des actions locales dans les 18e et 19e arrondissements de Paris.';
    const noIndex = Boolean(route.data['noIndex']);
    const canonicalUrl = `${SITE_URL}${snapshot.url === '/' ? '' : snapshot.url.split('?')[0]}`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }
}
