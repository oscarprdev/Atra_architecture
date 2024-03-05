import { expect } from '@playwright/test';
import { test } from './fixtures/app.fixture';

test.describe('Home', () => {
	test.beforeEach(async ({ navigateToApp }) => {
		await navigateToApp();
	});

	test('Should display an image on hero section', async ({ homePage }) => {
		const image = await homePage.getHeroImage();

		expect(image.getAttribute('src')).not.toBeNull();
	});

	test('Should display project title and name', async ({ homePage }) => {
		await expect(homePage.title).toHaveText('ATRA');
		await expect(homePage.name).toHaveText('Jaume Pérez Llopis');
	});

	test('Should display hero description properly', async ({ homePage }) => {
		await expect(homePage.titleDescription).toBeVisible();
		await expect(homePage.description).toBeVisible();
		await expect(homePage.aboutLink).toBeVisible();
	});

	test('Should display top projects section properly', async ({ homePage }) => {
		const projectsImages = await homePage.getAllProjectImages();

		for (const img of projectsImages) {
			await expect(img).toBeVisible();
		}
	});

	test('Should display project details section properly', async ({ homePage }) => {
		const projectsInfo = await homePage.getAllProjectInfo();

		for (const info of projectsInfo) {
			await expect(info).toBeVisible();
		}
	});

	test('Should the nav work as expected', async ({ page, appPage }) => {
		await expect(appPage.header).toBeVisible();
		await expect(appPage.nav).toBeVisible();
		await expect(appPage.homeLink).toBeVisible();
		await expect(appPage.galleryLink).toBeVisible();
		await expect(appPage.aboutLink).toBeVisible();

		await appPage.galleryLink.click();

		expect(page.url()).toContain('/gallery');

		await expect(appPage.header).toBeVisible();
		await expect(appPage.nav).toBeVisible();

		await appPage.homeLink.click();

		expect(page.url()).toContain('/');

		await expect(appPage.header).toBeVisible();
		await expect(appPage.nav).toBeVisible();

		await appPage.aboutLink.click();

		expect(page.url()).toContain('/about');
	});

	test('Should display gallery projects properly', async ({ galleryPage, navigateToGallery }) => {
		await navigateToGallery();
		const projectsImages = await galleryPage.getAllProjectImages();

		for (const img of projectsImages) {
			await expect(img).toBeVisible();
		}
	});

	test('Should display about page properly', async ({ aboutPage, navigateToAbout }) => {
		await navigateToAbout();
		await expect(aboutPage.aboutImage).toBeVisible();
		await expect(aboutPage.aboutInformation).toBeVisible();

		await expect(aboutPage.aboutInformation).toContainText(
			'Asistència tècnica en rehabilitació i arquitectura'
		);
	});
});
