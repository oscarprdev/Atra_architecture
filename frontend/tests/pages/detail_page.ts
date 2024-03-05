import type { Locator, Page } from '@playwright/test';

export class ProjectDetailPage {
	readonly heroImage: Locator;
	readonly projectTitle: Locator;

	constructor(protected page: Page) {
		this.heroImage = this.page.getByRole('figure');
		this.projectTitle = this.page.getByTestId('project-title');
	}

	async getAllProjectImages(): Promise<Locator[]> {
		return await this.page.getByTestId('project-image').all();
	}
}
