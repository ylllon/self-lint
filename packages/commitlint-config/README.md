# `commitlint-config-yllon`

> Git 规范

支持配套的 [commitlint 配置](https://commitlint.js.org/#/concepts-shareable-config)，用于对 `git commit message` 进行校验。

## 安装

使用时，需要安装 [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)：

```bash
npm install commitlint-config-yllon @commitlint/cli --save-dev
```

## 使用

在 `commitlint.config.js` 中集成本包:<br/>
绝对路径：
```javascript
module.exports = {
	extends: ['commitlint-config-yllon'],
};
```

如果编译器不支持绝对路径导入报错，可更换成相对路径导入。<br/>
相对路径：
```json
{
  "extends": ["./node_modules/commitlint-config-yllon"]
}
```

## 设置 git hook

可通过 [husky](https://www.npmjs.com/package/husky) 设置在 `git commit` 时触发 `commitlint`。

首先安装 husky：

```bash
npm install husky --save-dev
```

然后执行添加`commit-msg`:

```bash
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

更多信息可参考 [commitlint 文档](https://commitlint.js.org/#/guides-local-setup?id=install-husky)。
