import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
	readonly nav: Locator;
	readonly header: Locator;
	readonly projectsTable: Locator;

	readonly createProjectBtn: Locator;

	readonly createProjectModal: Locator;
	readonly createProjectForm: Locator;
	readonly createProjectNameInput: Locator;
	readonly createProjectYearInput: Locator;
	readonly createProjectDescriptionTextarea: Locator;
	readonly createProjectMainImageInput: Locator;
	readonly createProjectImagesInput: Locator;

	readonly createProjectModalButton: Locator;

	readonly createProjectSuccessMessage: Locator;
	readonly createProjectLoadingMessage: Locator;

	constructor(protected page: Page) {
		this.nav = this.page.getByTestId('dashboard-nav');
		this.header = this.page.getByTestId('dashboard-header');
		this.projectsTable = this.page.getByTestId('dashboard-table');

		this.createProjectBtn = this.page.getByTestId('create-project-button');
		this.createProjectModal = this.page
			.locator('div')
			.filter({ hasText: 'Crear un nou projecteNom Any' })
			.nth(1);
		this.createProjectForm = this.page.getByTestId('create-project-form');
		this.createProjectNameInput = this.page.getByPlaceholder('Quin es el nom del projecte?');
		this.createProjectYearInput = this.page.getByPlaceholder("Selecciona l'any");
		this.createProjectDescriptionTextarea = this.page.getByPlaceholder('Escriu una descripció');

		this.createProjectMainImageInput = this.page.getByText('Selecciona una imatge');
		this.createProjectImagesInput = this.page
			.getByTestId('create-project-form')
			.locator('label')
			.nth(4);

		this.createProjectModalButton = this.page.getByTestId('create-project-modal-button');

		this.createProjectLoadingMessage = this.page.getByText('Creant projecte...');
		this.createProjectSuccessMessage = this.page.getByText('Projecte creat correctament');
	}

	async uploadImage(locator: Locator) {
		await locator.click();
		await locator.setInputFiles('../data/tiny_image.webp');
	}
}
