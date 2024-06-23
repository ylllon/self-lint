'use strict';

const rule = require('../no-use-rules/no-use-reactive');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-reactive', rule, {
  valid: [
    {
      code: "var test = ref('');",
    },
  ],

  invalid: [
    {
      code: 'var test = reactive({});',
      output: 'var test = reactive({});',
      errors: [
        {
          message: '禁止变量名、常量名、函数名、class名为 reactive、Reactive',
        },
      ],
    },
  ],
});
