import type { Locator, Page } from '@playwright/test';

export class AppPage {
	readonly header: Locator;
	readonly nav: Locator;
	readonly homeLink: Locator;
	readonly galleryLink: Locator;
	readonly aboutLink: Locator;

	constructor(protected page: Page) {
		this.header = this.page.getByTestId('header');
		this.nav = this.page.getByTestId('nav');
		this.homeLink = this.page.getByTestId('nav-home');
		this.galleryLink = this.page.getByTestId('nav-gallery');
		this.aboutLink = this.page.getByTestId('nav-about');
	}
}
