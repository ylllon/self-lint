# eslint-plugin-yllon

## 安装

除了本包，你需要同时安装 [ESlint](https://eslint.org/)

```shell
$ npm install eslint-plugin-yllon eslint --save-dev
```

## 使用

### 引入插件

```js
// .eslintrc.cjs
module.exports = {
  plugin: ['eslint-config-yllon'],
  rules: {
    'eslint-plugin-yllon/no-http-url': 'warn',
  },
};
```

### 使用 presets

```js
// .eslintrc.cjs
module.exports = {
  extends: 'plugin:eslint-plugin-yllon/commands',
};
```

## 支持的规则

- [`no-http-url`](https://encode-studio-fe.github.io/fe-spec/plugin/no-http-url.html) 使用 HTTPS 协议头的 URL，而不是 HTTP

