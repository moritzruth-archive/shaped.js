module.exports = {
  "root": true,
  "env": {
    browser: true,
    es6: true
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "extends": [
    "@moritzruth"
  ],
  rules: {
    "no-unused-vars": "warn",
    "unicorn/prevent-abbreviations": ["warn", { "whitelist": { ctx: true }}]
  }
};
