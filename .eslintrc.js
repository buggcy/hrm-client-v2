module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'tailwindcss',
    'simple-import-sort',
  ],
  rules: {
    //*=========== Import Sort ===========
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'],
          // Lib and hooks
          ['^@/lib', '^@/hooks'],
          // components
          ['^@/components', '^@/container'],
          // Other imports
          ['^@/'],
          // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'],
          // {s}css files
          ['^.+\\.s?css$'],
          ['^'],
        ],
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
  overrides: [
    {
      files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      plugins: ['jest', 'jest-formatting', 'testing-library', 'jest-dom'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-formatting/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
      ],
    },
    {
      files: ['e2e/**'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
};
