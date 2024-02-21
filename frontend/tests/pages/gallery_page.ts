import type { Locator, Page } from '@playwright/test';

export class GalleryPage {
	constructor(protected page: Page) {}

	async getAllProjectImages(): Promise<Locator[]> {
		return await this.page.getByTestId('project-image').all();
	}
}
