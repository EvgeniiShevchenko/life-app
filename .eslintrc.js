module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:css-modules/recommended', 'plugin:prettier/recommended', 'plugin:vue/essential', 'eslint:recommended', '@vue/standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'css-modules/no-unused-class': [
      2,
      {
        camelCase: true,
      },
    ],
    'css-modules/no-undef-class': [
      2,
      {
        camelCase: true,
      },
    ],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-unused-vars': 'warn',
    'no-await-in-loop': 0,
    'no-empty': 0,
    'no-irregular-whitespace': 0,
    indent: 'off',
    'linebreak-style': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'prefer-const': [
      0,
      {
        destructuring: 'all',
      },
    ],
    'arrow-parens': [2, 'always'],
    'prefer-object-spread': 'warn',
    'prefer-spread': 'warn',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        tabWidth: 2,
        singleQuote: true,
        jsxSingleQuote: true,
        endOfLine: 'auto',
        printWidth: 200,
      },
    ],
  },
  plugins: ['prettier', 'css-modules'],
};