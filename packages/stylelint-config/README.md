# yllon-stylelint-config

支持配套的 [stylelint 可共享配置](https://stylelint.io/user-guide/configure)。

## 安装

需要先行安装 [stylelint](https://www.npmjs.com/package/stylelint) 和 [stylelint-scss](https://www.npmjs.com/package/stylelint-scss)：

```bash
npm install yllon-stylelint-config stylelint stylelint-scss --save-dev
```

## 使用

在 `.stylelintrc` 中继承本包:<br/>
绝对路径：

```json
{
  "extends": "yllon-stylelint-config"
}
```

如果编译器不支持绝对路径导入报错，可更换成相对路径导入。<br/>
相对路径：
```json
{
  "extends": ["./node_modules/yllon-stylelint-config"]
}
```