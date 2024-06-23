'use strict';

const rule = require('../rules/no-http-url');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      code: "var test = 'https://yllon.com';",
    },
  ],

  invalid: [
    {
      code: "var test = 'http://yllon.com';",
      output: "var test = 'http://yllon.com';",
      errors: [
        {
          message: 'Recommended "http://yllon.com" switch to HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://yllon.com' />",
      output: "<img src='http://yllon.com' />",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: 'Recommended "http://yllon.com" switch to HTTPS',
        },
      ],
    },
  ],
});
