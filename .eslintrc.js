// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'init-declarations': 0,
    'quotes': 0,
    'no-extra-semi': 0,
    'indent': 0,
    'spaced-comment': 0,
    'semi': 0,
    'key-spacing': 0,
    'no-array-constructor': 0,
    'eqeqeq': 0,
    'keyword-spacing': 0,
    'space-before-blocks': 0,
    'no-undef': 0,
    'padded-blocks': 0,
    'new-cap': 0,
    'one-var': 0,
    'no-redeclare': 0,
    'comma-spacing': 0,
    'no-multi-str': 'off',
    'no-multi-spaces': 'off',
    'no-shadow-restricted-names': 'off'
  }
}
