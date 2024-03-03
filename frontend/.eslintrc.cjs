// eslint-disable-next-line @typescript-eslint/no-var-requires
const { builtinModules } = require('module');

/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./packages/*/tsconfig.json', './tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier', 'no-only-tests'],
  rules: {
    // These off/configured-differently-by-default rules fit well for us
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-only-tests/no-only-tests': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    'no-console': 'warn',

    // Enforce separate type imports for type-only imports to avoid bundling unneeded code
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: false,
      },
    ],

    // These rules enabled by the preset configs don't work well for us
    '@typescript-eslint/await-thenable': 'off',
    'prefer-const': 'off',

    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
