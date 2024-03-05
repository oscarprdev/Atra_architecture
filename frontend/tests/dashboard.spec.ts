import { expect } from '@playwright/test';
import { test } from './fixtures/dashboard.fixture';
import { LoginResponse } from './responses/login_response';
import { ValidateResponse } from './responses/validate_response';
import { createProjectResponse } from './responses/create_project.response';

test.describe('Dashboard', () => {
	test.beforeEach(async ({ context }) => {
		await context.addCookies([
			{
				name: 'jwt',
				value: ValidateResponse.data,
				domain: 'localhost',
				httpOnly: true,
				path: '/',
			},
		]);
	});

	test('Should the user be able to login', async ({
		authPage,
		navigateToDashboard,
		navigateToAuth,
		setLoginResponse,
		setApiLoginResponse,
	}) => {
		await navigateToAuth();

		await setLoginResponse({
			json: LoginResponse,
			status: 201,
		});

		await setApiLoginResponse({
			json: LoginResponse,
			status: 201,
		});

		await expect(authPage.loginBtn).toBeVisible();
		await expect(authPage.emailInput).toBeVisible();
		await expect(authPage.passwordInput).toBeVisible();

		await authPage.emailInput.fill('random@email.com');
		await authPage.passwordInput.fill('randompassword');
		await authPage.loginBtn.click();

		await navigateToDashboard();
	});

	test('Should dashboard display properly', async ({ dashboardPage, navigateToDashboard }) => {
		await navigateToDashboard();

		await expect(dashboardPage.header).toBeVisible();
		await expect(dashboardPage.nav).toBeVisible();
		await expect(dashboardPage.projectsTable).toBeVisible();

		await expect(dashboardPage.createProjectBtn).toBeVisible();
	});

	test('Should user be able to create a project', async ({
		dashboardPage,
		navigateToDashboard,
		setCreateProjectResponse,
	}) => {
		await setCreateProjectResponse({
			url: new RegExp(`/api/create-project`),
			response: {
				json: createProjectResponse,
				status: 201,
			},
			assertBeforeRequest: expect(dashboardPage.createProjectLoadingMessage).toBeVisible(),
		});
		await navigateToDashboard();

		await expect(dashboardPage.header).toBeVisible();
		await expect(dashboardPage.projectsTable).toBeVisible();

		await expect(dashboardPage.createProjectBtn).toBeVisible();

		await dashboardPage.createProjectBtn.click();

		await expect(dashboardPage.createProjectModal).toBeVisible();
		await expect(dashboardPage.createProjectForm).toBeVisible();

		await expect(dashboardPage.createProjectNameInput).toBeVisible();
		await dashboardPage.createProjectNameInput.fill('Random name');

		await expect(dashboardPage.createProjectYearInput).toBeVisible();
		await dashboardPage.createProjectYearInput.fill('2024');

		await expect(dashboardPage.createProjectDescriptionTextarea).toBeVisible();
		await dashboardPage.createProjectDescriptionTextarea.fill('Random description');

		await dashboardPage.uploadImage(dashboardPage.createProjectImagesInput);
		await dashboardPage.uploadImage(dashboardPage.createProjectMainImageInput);

		await expect(dashboardPage.createProjectModalButton).toBeVisible();
		await dashboardPage.createProjectModalButton.click();

		await expect(dashboardPage.createProjectSuccessMessage).toBeVisible();
	});
});
