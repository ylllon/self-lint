const assert = require('assert');
const stylelint = require('stylelint');
const path = require('path');

describe('test/rules-validate.test.javascript', () => {
  it('Validate default', async () => {
    const filePaths = [path.join(__dirname, './examples/index.css')];

    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.javascript'),
      files: filePaths,
      fix: true,
    });
    // console.log('result:',result.results[0].warnings);
    if(result?.results[0].warnings && result.results[0].warnings.length>0){
      const fileOutput = JSON.parse(result.output||[])||[];
      fileOutput.forEach(item=>{
        console.log('warnings',item);
      })
      assert.ok(fileOutput.length>0)
    }

  });


  it('Validate less', async () => {
    const filePaths = [path.join(__dirname, './examples/less-test.less')];

    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.javascript'),
      files: filePaths,
      fix: false,
    });

    if (result && result.errored) {
      const filesResult = JSON.parse(result.output || '[]') || [];
      filesResult.forEach((fileResult) => {
        console.log(`========= ${filePaths} ==========`);
        console.log(fileResult.warnings);
      });

      assert.ok(filesResult.length !== 0);
    }
  });
});
