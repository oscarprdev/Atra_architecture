import { test as base } from '@playwright/test';
import type { SetRouteInput } from '../types/route_input';
import type { FulfillResponse } from '../types/fulfill_response';

interface BaseFixture {
	setRoute(input: SetRouteInput): Promise<void>;
	setProjectsResponse(response: FulfillResponse): Promise<void>;
	setProjectDetailResponse(response: FulfillResponse): Promise<void>;
}

export const test = base.extend<BaseFixture>({
	setRoute: async ({ page }, use) => {
		await use(async ({ url, response }): Promise<void> => {
			await page.route(url, async route => {
				await route.fulfill(response);
			});
		});
	},
	setProjectsResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp('/project/list'), response });
		});
	},
	setProjectDetailResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp('/project/describe*'), response });
		});
	},
});
