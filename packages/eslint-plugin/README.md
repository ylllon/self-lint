# yllon-eslint-plugin

## 安装

除了本包，你需要同时安装 [ESlint](https://eslint.org/)

```shell
$ npm install yllon-eslint-plugin eslint --save-dev
```

## 使用

### 引入插件

```js
// .eslintrc.cjs
module.exports = {
  plugin: ['yllon-eslint-config'],
  rules: {
    'yllon-eslint-plugin/no-http-url': 'warn',
  },
};
```

### 使用 presets

```js
// .eslintrc.cjs
module.exports = {
  extends: 'plugin:yllon-eslint-plugin/commands',
};
```

## 支持的规则

- [`no-http-url`](https://encode-studio-fe.github.io/fe-spec/plugin/no-http-url.html) 使用 HTTPS 协议头的 URL，而不是 HTTP

