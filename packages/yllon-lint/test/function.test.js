import packageJson from "../package.json";

const assert = require('assert');
const path = require('path');
import fg from 'fast-glob';
var fs = require('fs');

describe('test/function.test.js', () => {
    it('Validate default', async () => {

        console.log("fg:",fg)
        const cwd = process.cwd();
        console.log("cwd:",cwd)
        // const cmd = process.chdir()
        // console.log("cmd:",cmd)
        // const pattern = join(
        //     options.include,
        //     `**/*.{${ESLINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`,
        // );
        let files = await fg(`**/*.{${['.js', '.jsx', '.ts', '.tsx', '.vue'].map((t) => t.replace(/^\./, '')).join(',')}}`, {
            cwd: cwd,
            ignore: ['node_modules/**'],
        })
        expect(files).toEqual('some data');
        // const eslint = new ESLint(getESLintConfig(options, options.pkg, options.config));
        // const reports = await eslint.lintFiles(files);
        // console.log("files:", files);


    })
})