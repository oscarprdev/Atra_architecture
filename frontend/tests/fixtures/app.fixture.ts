import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { GalleryPage } from '../pages/gallery_page';

interface AppFixture {
	homePage: HomePage;
	galleryPage: GalleryPage;
	navigateToApp(): Promise<void>;
	navigateToGallery(): Promise<void>;
}

export const test = base.extend<AppFixture>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	galleryPage: async ({ page }, use) => {
		await use(new GalleryPage(page));
	},
	navigateToApp: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/`);
		});
	},
	navigateToGallery: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/gallery`);
		});
	},
});
