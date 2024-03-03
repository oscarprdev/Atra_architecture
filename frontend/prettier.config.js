/** @type {import("prettier").Config} */
export default {
	printWidth: 100,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	useTabs: true,
	plugins: ['prettier-plugin-astro'],
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	astroAllowShorthand: false,
	singleAttributePerLine: true,
	allowImportingTsExtensions: true,
	overrides: [
		{
			files: ['.*', '*.json', '*.md', '*.toml', '*.yml'],
			options: {
				useTabs: false,
			},
		},
		{
			files: ['**/*.astro'],
			options: {
				parser: 'astro',
			},
		},
	],
};
