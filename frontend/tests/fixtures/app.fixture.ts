import { test as base } from './base.fixture';
import { HomePage } from '../pages/home_page';
import { GalleryPage } from '../pages/gallery_page';
import { AppPage } from '../pages/app_page';
import { AboutPage } from '../pages/about_page';
import { ProjectDetailPage } from '../pages/detail_page';

interface AppFixture {
	appPage: AppPage;
	homePage: HomePage;
	galleryPage: GalleryPage;
	aboutPage: AboutPage;
	detailPage: ProjectDetailPage;
	navigateToApp(): Promise<void>;
	navigateToGallery(): Promise<void>;
	navigateToAbout(): Promise<void>;
	navigateToProjectDetail(): Promise<void>;
}

export const test = base.extend<AppFixture>({
	appPage: async ({ page }, use) => {
		await use(new AppPage(page));
	},
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	galleryPage: async ({ page }, use) => {
		await use(new GalleryPage(page));
	},
	aboutPage: async ({ page }, use) => {
		await use(new AboutPage(page));
	},
	detailPage: async ({ page }, use) => {
		await use(new ProjectDetailPage(page));
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
	navigateToAbout: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/about`);
		});
	},
	navigateToProjectDetail: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/project/731dd6eb-0c3e-4ba9-837d-755c2286327e`);
		});
	},
});
