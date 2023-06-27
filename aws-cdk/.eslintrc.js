module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'airbnb-base'],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'max-len': ['error', { code: 120 }],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
