module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended', 'plugin:storybook/recommended'],
  plugins: ['testing-library'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
