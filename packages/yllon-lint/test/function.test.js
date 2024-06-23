import packageJson from "../package.json";

const assert = require('assert');
const path = require('path');
import fg from 'fast-glob';

describe('test/function.test.js', () => {
    it('Validate default', async () => {
        let files = fg(`**/*.{${['.js', '.jsx', '.ts', '.tsx', '.vue'].map((t) => t.replace(/^\./, '')).join(',')}}`, {
            cwd: '/',
            ignore: [],
        }).then(r=>{
            console.log("111111111111111111111:", r);
            assert.ok(1===1);
        });
        // const eslint = new ESLint(getESLintConfig(options, options.pkg, options.config));
        // const reports = await eslint.lintFiles(files);
        // console.log("files:", files);


    })
})