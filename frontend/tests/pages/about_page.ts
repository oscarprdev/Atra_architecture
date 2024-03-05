import type { Locator, Page } from '@playwright/test';

export class AboutPage {
	readonly aboutImage: Locator;
	readonly aboutInformation: Locator;

	constructor(protected page: Page) {
		this.aboutImage = this.page.getByTestId('about-image');
		this.aboutInformation = this.page.getByTestId('about-info');
	}
}
