const assert = require('assert');
const eslint = require('eslint');
const path = require('path');
const sumBy = require('lodash/sumBy');

describe('Validate JS config', () => {
  it('Validate eslint-config-yllon', async () => {
    const configPath = './index.js';
    const filePath = path.join(__dirname, './testExamples/index.js');
    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false, // 如果不关这个参数，会将目录下的 eslintrc 与 overrideConfigFile merge
      ignore: false,
      fix: false,
    });

    // 验证导出的config OK?
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    console.log(`results1: ${sumBy(results, 'errorCount')}`);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);
  });

  it('Validate eslint-config-yllon/javascript/vue', async () => {
    const configPath = './javascript/vue.js';
    const filePath = path.join(__dirname, './testExamples/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 0);

    // 验证 eslint-plugin-vue 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('vue/') !== -1;
    });
    console.log(`results2: ${JSON.stringify(errorReportedByReactPlugin)}`);
    assert.notEqual(errorReportedByReactPlugin.length, 0);
  });
});

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}
