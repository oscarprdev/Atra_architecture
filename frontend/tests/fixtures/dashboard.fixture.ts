import { test as base } from './base.fixture';
import { AuthPage } from '../pages/auth_page';
import { DashboardPage } from '../pages/dashboard_page';
import type { FulfillResponse } from '../types/fulfill_response';
import { API_URL } from '../../src/constants';
import type { SetRouteInput } from '../types/route_input';

interface AppFixture {
	authPage: AuthPage;
	dashboardPage: DashboardPage;
	navigateToAuth(): Promise<void>;
	navigateToDashboard(): Promise<void>;

	setProjectsResponse(response: FulfillResponse): Promise<void>;
	setProjectDetailResponse(response: FulfillResponse): Promise<void>;

	setUpdateProjectResponse(response: FulfillResponse): Promise<void>;

	setCreateProjectResponse(input: SetRouteInput): Promise<void>;

	setRemoveProjectResponse(response: FulfillResponse): Promise<void>;
}

export const test = base.extend<AppFixture>({
	authPage: async ({ page }, use) => {
		await use(new AuthPage(page));
	},
	dashboardPage: async ({ page }, use) => {
		await use(new DashboardPage(page));
	},
	navigateToAuth: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/auth`);
		});
	},
	navigateToDashboard: async ({ page }, use) => {
		await use(async (): Promise<void> => {
			await page.goto(`/auth/dashboard`);
		});
	},
	setProjectsResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp(`${API_URL}/project/list`), response });
		});
	},
	setProjectDetailResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp(`${API_URL}/project/describe`), response });
		});
	},
	setUpdateProjectResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp(`${API_URL}/project/update`), response });
		});
	},
	setCreateProjectResponse: async ({ setRoute }, use) => {
		await use(async ({ url, response, assertBeforeRequest }): Promise<void> => {
			await setRoute({ url, response, assertBeforeRequest });
		});
	},

	setRemoveProjectResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp(`${API_URL}/project/delete`), response });
		});
	},
});
