'use strict';

const rule = require('../rules/ts-interface-uppercase');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('ts-interface-uppercase', rule, {
    valid: [
        {
            code: `interface User { }`
        }
    ],
    invalid: [
        {
            code: `
        interface myInterface {
          // interface content
        }
      `,
            errors: [{ message: 'Interface name should start with an uppercase letter' }]
        }
    ]
});
