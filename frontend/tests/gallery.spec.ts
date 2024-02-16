import { expect } from '@playwright/test';
import { test } from './fixtures/app.fixture';

test.describe('Home', () => {
    test.beforeEach(async ({ navigateToGallery }) => {
        await navigateToGallery();
    });

    test('Should display an image on hero section', async ({ homePage }) => {
        const image = await homePage.getHeroImage();

        await expect(image.getAttribute('src')).not.toBeNull();
    });
});
