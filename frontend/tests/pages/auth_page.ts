import type { Locator, Page } from '@playwright/test';

export class AuthPage {
	readonly loginBtn: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly loadingIcon: Locator;

	constructor(protected page: Page) {
		this.loginBtn = this.page.getByRole('button', { name: 'Login' });
		this.emailInput = this.page.getByTestId('email-input');
		this.passwordInput = this.page.getByTestId('password-input');
		this.loadingIcon = this.page.getByTestId('login-loading-icon');
	}
}
