import type { Page } from '@playwright/test';
import type { FulfillResponse } from './fulfill_response';

export type RouteUrl = Parameters<Page['route']>[0];

export interface SetRouteInput {
    url: RouteUrl;
    response: FulfillResponse;
}
