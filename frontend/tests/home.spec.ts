import { expect } from '@playwright/test';
import { test } from './fixtures/app.fixture';

test.describe('Home', () => {
    test.beforeEach(async ({ navigateToApp }) => {
        await navigateToApp();
    });

    test('Should display an image on hero section', async ({ homePage }) => {
        const image = await homePage.getHeroImage();

        await expect(image.getAttribute('src')).not.toBeNull();
    });

    test('Should display project title and description', async ({ homePage }) => {
        await expect(homePage.title).toHaveText('ATRA');
        await expect(homePage.description).toBeVisible();
    });

    test('Should display project images', async ({ homePage }) => {
        const projectImages = await homePage.getAllProjectImages();

        expect(projectImages.length).toBeGreaterThan(0);
    });
});
