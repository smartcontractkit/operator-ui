const pluginJs = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

const commonGlobals = {
  process: 'readonly',
  module: 'readonly',
  require: 'readonly',
  __dirname: 'readonly',
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
}

const jestGlobals = {
  jest: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeAll: 'readonly',
  beforeEach: 'readonly',
  afterAll: 'readonly',
  afterEach: 'readonly',
}

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/generated/**',
      '**/dist/**',
      '**/coverage/**',
      '**/artifacts/**',
      '**/public/**',
      '**/build/**',
      '**/fixtures/**',
      '**/lib/**',
      '**/schema/**',
    ],
  },
  pluginJs.configs.recommended,
  tsPlugin.configs['flat/eslint-recommended'],
  ...tsPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: commonGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'no-undef': 'off',
      radix: ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, typedefs: false },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/__mocks__/**/*.js',
    ],
    languageOptions: {
      globals: jestGlobals,
    },
  },
]
