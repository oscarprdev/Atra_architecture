import type { Locator, Page } from '@playwright/test';

export class HomePage {
	readonly header: Locator;
	readonly title: Locator;
	readonly description: Locator;

	constructor(protected page: Page) {
		this.header = this.page.getByRole('heading');
		this.title = this.page.getByTestId('home-title');
		this.description = this.page.getByText('Asistència tècnica en rehabilitació i arquitectura');
	}

	async getHeroImage(): Promise<Locator> {
		return this.page.getByRole('img').first();
	}

	async getAllProjectImages(): Promise<Locator[]> {
		return await this.page.getByTestId('project-image').all();
	}
}
