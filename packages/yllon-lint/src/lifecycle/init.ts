import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import spawn from 'cross-spawn';
import update from './update';
import npmType from '../utils/npm-type';
import log from '../utils/log';
import conflictResolve from '../utils/conflict-resolve';
import generateTemplate from '../utils/generate-template';
import { PROJECT_TYPES, PKG_NAME } from '../utils/constants';
import type { InitOptions, PKG } from '../types';

let step = 0;

/**
 * 选择项目语言和框架
 * 思路：
 * 通过交互式的命令行信息收集器，
 * inquirer.prompt( questions, answers ) → promise 提示器
 * 接收预设交互问题配置( questions ), 预设回答( answers )。
 * 返回包含交互收集信息的 Promise 对象
 */
const chooseEslintType = async (): Promise<string> => {
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（Vue）类型：`,
        choices: PROJECT_TYPES,
    });

    return type;
};

/**
 * 选择是否启用 stylelint
 * @param defaultValue
 */
const chooseEnableStylelint = async (defaultValue: boolean): Promise<boolean> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
        default: defaultValue,
    });

    return enable;
};

/**
 * 选择是否启用 markdownlint
 */
const chooseEnableMarkdownLint = async (): Promise<boolean> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}. 是否需要使用 markdownlint（若没有 Markdown 文件则不需要）：`,
        default: true,
    });

    return enable;
};

/**
 * 选择是否启用 prettier
 */
const chooseEnablePrettier = async (): Promise<boolean> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}. 是否需要使用 Prettier 格式化代码：`,
        default: true,
    });

    return enable;
};

/** 初始化的一些启用项
 * @param options
 * 思路：
 * 1、是否检查升级版本，如果要升级，就调用update来更新，
 * 2、通过inquirer.prompt  命令行交互形式，用户自己来判断使用哪些功能
 * 3、检查并处理项目中可能存在的依赖和配置冲突
 * 4、判断是否有scan、fix的一些依赖，没有则添加
 * 5、判断有无commmit的钩子，没有则添加husky
 * 6、将2、3、4、5步骤获得的配置信息，通过ejs的形式，写入模板中，生成对应的文件
 */
export default async (options: InitOptions) => {
    const cwd = options.cwd || process.cwd(); // process是node的全局模块，作用比较直观,process.cwd()返回当前工作目录。如：调用node命令执行脚本时的目录。__dirname返回源代码所在的目录。
    const isTest = process.env.NODE_ENV === 'test';// 当前是否为测试环境
    const checkVersionUpdate = options.checkVersionUpdate || false;// 是否检查并升级 yl-lint 的版本
    const disableNpmInstall = options.disableNpmInstall || false; // 是否禁用自动在初始化完成后安装依赖
    const config: Record<string, any> = {}; // 配置。根据配置，完成模板的自动生成
    const pkgPath = path.resolve(cwd, 'package.json');
    let pkg: PKG = fs.readJSONSync(pkgPath);

    //  是否检查并升级版本
    if (!isTest && checkVersionUpdate) {
        await update(false);
    }

    // 初始化 `enableESLint`，默认为 true，无需让用户选择
    if (typeof options.enableESLint === 'boolean') {
        config.enableESLint = options.enableESLint;
    } else {
        config.enableESLint = true;
    }

    // 初始化 `eslintType`
    if (options.eslintType && PROJECT_TYPES.find((choice) => choice.value === options.eslintType)) {
        config.eslintType = options.eslintType;
    } else {
        config.eslintType = await chooseEslintType();
    }

    // 初始化 `enableStylelint`
    if (typeof options.enableStylelint === 'boolean') {
        config.enableStylelint = options.enableStylelint;
    } else {
        config.enableStylelint = await chooseEnableStylelint(!/node/.test(config.eslintType));
    }

    // 初始化 `enableMarkdownlint`
    if (typeof options.enableMarkdownlint === 'boolean') {
        config.enableMarkdownlint = options.enableMarkdownlint;
    } else {
        config.enableMarkdownlint = await chooseEnableMarkdownLint();
    }

    // 初始化 `enablePrettier`
    if (typeof options.enablePrettier === 'boolean') {
        config.enablePrettier = options.enablePrettier;
    } else {
        config.enablePrettier = await chooseEnablePrettier();
    }

    if (!isTest) {
        log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
        pkg = await conflictResolve(cwd, options.rewriteConfig);
        log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`);

        if(!disableNpmInstall){
            log.info(`Step ${++step}. 安装依赖`);
            const npm = await npmType;
            spawn.sync(
                npm,
                ['i', '-D', PKG_NAME],
                { stdio: 'inherit', cwd },
            );
            log.success(`Step ${step}. 安装依赖成功 :D`);
        }
    }

    // 更新 pkg.json
    pkg = fs.readJSONSync(pkgPath);
    // 在 `package.json` 中写入 `scripts`
    if (!pkg.scripts) {
        pkg.scripts = {};
    }
    if (!pkg.scripts[`${PKG_NAME}-scan`]) {
        pkg.scripts[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`;
    }
    if (!pkg.scripts[`${PKG_NAME}-fix`]) {
        pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`;
    }

    // 配置 commit 卡点
    log.info(`Step ${++step}. 配置 git commit 卡点`);
    if (!pkg.husky) pkg.husky = {};
    if (!pkg.husky.hooks) pkg.husky.hooks = {};
    pkg.husky.hooks['pre-commit'] = `${PKG_NAME} commit-file-scan`;
    pkg.husky.hooks['commit-msg'] = `${PKG_NAME} commit-msg-scan`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    log.success(`Step ${step}. 配置 git commit 卡点成功 :D`);

    log.info(`Step ${++step}. 写入配置文件`);
    generateTemplate(cwd, config);
    log.success(`Step ${step}. 写入配置文件成功 :D`);

    // 完成信息
    const logs = [`${PKG_NAME} 初始化完成 :D`].join('\r\n');
    log.success(logs);
};
