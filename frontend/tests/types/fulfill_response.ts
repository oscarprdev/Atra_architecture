import type { Route } from '@playwright/test';

export type FulfillResponse = Parameters<Route['fulfill']>[0];
