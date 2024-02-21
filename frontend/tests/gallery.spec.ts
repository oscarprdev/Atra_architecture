import { expect } from '@playwright/test';
import { test } from './fixtures/app.fixture';

test.describe('Home', () => {
	test.beforeEach(async ({ navigateToGallery }) => {
		await navigateToGallery();
	});

	test('Should display an image on hero section', async ({ galleryPage }) => {
		const images = await galleryPage.getAllProjectImages();

		for (const image of images) {
			await expect(image).toBeVisible();
		}
	});
});
