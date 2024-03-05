import { test as base } from '@playwright/test';
import type { SetRouteInput } from '../types/route_input';
import type { FulfillResponse } from '../types/fulfill_response';
import { API_URL } from '../../src/constants';

interface BaseFixture {
	setRoute(input: SetRouteInput): Promise<void>;

	setLoginResponse(response: FulfillResponse): Promise<void>;
	setApiLoginResponse(response: FulfillResponse): Promise<void>;
}

export const test = base.extend<BaseFixture>({
	setRoute: async ({ page }, use) => {
		await use(async ({ url, response, assertBeforeRequest }): Promise<void> => {
			await page.route(url, async route => {
				if (assertBeforeRequest) {
					await assertBeforeRequest;
				}

				await route.fulfill(response);
			});
		});
	},
	setLoginResponse: async ({ setRoute }, use) => {
		await use(async (response: FulfillResponse): Promise<void> => {
			await setRoute({ url: new RegExp(`${API_URL}/auth/login`), response });
		});
	},
	setApiLoginResponse: async ({ setRoute }, use) => {
		await use(async (response): Promise<void> => {
			await setRoute({ url: new RegExp(`/api/login`), response });
		});
	},
});
