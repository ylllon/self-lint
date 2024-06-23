# markdownlint-config

> 文档 规范

支持配套的 [markdownlint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)。

## 安装

需要先行安装 [markdownlint](https://www.npmjs.com/package/markdownlint)：

```bash
npm install markdownlint-config-yllon markdownlint --save-dev
```

## 使用

在 `.markdownlint.json` 中继承本包:<br/>
绝对路径:
```json
{
	"extends": "markdownlint-config-yllon"
}
```

如果编译器不支持绝对路径导入报错，可更换成相对路径导入。<br/>
相对路径：
```json
{
  "extends": ["./node_modules/markdownlint-config-yllon"]
}
```
