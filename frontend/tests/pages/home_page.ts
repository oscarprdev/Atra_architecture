import type { Locator, Page } from '@playwright/test';

export class HomePage {
	readonly title: Locator;
	readonly name: Locator;
	readonly titleDescription: Locator;
	readonly description: Locator;
	readonly aboutLink: Locator;

	constructor(protected page: Page) {
		this.title = this.page.getByTestId('home-title');
		this.name = this.page.getByTestId('home-name');
		this.titleDescription = this.page.getByText(
			'Asistència tècnica en rehabilitació i arquitectura'
		);
		this.description = this.page.getByTestId('description');
		this.aboutLink = this.page.getByTestId('about-link');
	}

	async getHeroImage(): Promise<Locator> {
		return this.page.getByRole('img').first();
	}

	async getAllProjectImages(): Promise<Locator[]> {
		return await this.page.getByTestId('project-image').all();
	}

	async getAllProjectInfo(): Promise<Locator[]> {
		return await this.page.getByTestId('project-info').all();
	}
}
