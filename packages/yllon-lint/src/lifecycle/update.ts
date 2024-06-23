import { execSync } from 'child_process';
import ora from 'ora';
import log from '../utils/log';
import npmType from '../utils/npm-type';
import { PKG_NAME, PKG_VERSION } from '../utils/constants';

/**
 * 检查最新版本号
 * 思路：通过execSync执行npm view package version 查看最新的npm包的版本，
 * 再通过查看当前安装的本地文件的packages.json文件的vesion 版本
 * 再通过split('.')切割字符串，从左到右循环依次比较每一位大小，只要有一位小，就证明有新版本
 * 最后返回版本信息
 */
const checkLatestVersion = async (): Promise<string | null> => {
    const npm = await npmType;
    const latestVersion = execSync(`${npm} view ${PKG_NAME} version`).toString('utf-8').trim();

    if (PKG_VERSION === latestVersion) return null;

    const compareArr = PKG_VERSION.split('.').map(Number);
    const beComparedArr = latestVersion.split('.').map(Number);

    // 依次比较版本号每一位大小
    for (let i = 0; i < compareArr.length; i++) {
        if (compareArr[i] > beComparedArr[i]) {
            return null;
        } else if (compareArr[i] < beComparedArr[i]) {
            return latestVersion;
        }
    }
};

/**
 * 检查包的版本
 * @param install - 自动安装最新包
 * 思路：
 * 1、通过ora包开启loading效果，美化控制台，开启检查新版本
 * 2、通过npmType（其中通过command-exists包中commandExistsSync命令来获取的）获取当前的npm类型
 * 3、通过checkLatestVersion方法获取最新版本，方法具体功能可看其思路
 * 4、如果有最新版本，且需要更新，就通过execSync执行npm|pnpm install -g packageName安装最新版本的脚手架
 * 5、如果没有，就提示没有更新内容
 */
export default async (install = true) => {
    const checking = ora(`[${PKG_NAME}] 正在检查最新版本...`);// ora依赖包的作用就是用于node的控制台进度美化。自定义加载圈形状
    checking.start();

    try {
        const npm = await npmType;
        const latestVersion = await checkLatestVersion();
        checking.stop();

        if (latestVersion && install) {
            const update = ora(`[${PKG_NAME}] 存在新版本，将升级至 ${latestVersion}`);

            update.start();

            execSync(`${npm} i -g ${PKG_NAME}`);

            update.stop();
        } else if (latestVersion) {
            log.warn(
                `最新版本为 ${latestVersion}，本地版本为 ${PKG_VERSION}，请尽快升级到最新版本。\n你可以执行 ${npm} install -g ${PKG_NAME}@latest 来安装此版本\n`,
            );
        } else if (install) {
            log.info(`当前没有可用的更新`);
        }
    } catch (e) {
        checking.stop();
        log.error(e);
    }
};
