<!--
 * @Author: etong
 * @Date: 2021-10-26 18:20:11
 * @LastEditTime: 2021-11-11 15:50:03
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \jj-cli\README.md
 * Think first, Program later
-->
# jj-cli

[![GitHub issues](https://img.shields.io/github/issues/challengerST/jj-cli)](https://github.com/challengerST/jj-cli/issues)

[![GitHub forks](https://img.shields.io/github/forks/challengerST/jj-cli)](https://github.com/challengerST/jj-cli/network)

[![GitHub stars](https://img.shields.io/github/stars/challengerST/jj-cli)](https://github.com/challengerST/jj-cli/stargazers)

![npm (scoped)](https://img.shields.io/npm/v/@etongduomi/jj-cli)

![npm bundle size (scoped version)](https://img.shields.io/bundlephobia/min/@etongduomi/jj-cli/1.0.0)

## Install

```
$ npm i @etongduomi/jj-cli
```

## Usage

```
只传入文件夹名
jj-cli create test

传入多层文件夹名
jj-cli create test/test

传入多层文件夹下的文件名
jj-cli create test/test.vue
```
## 目前实现
#####单个文件夹或者多层文件夹
- 1、页面文件：
        在src/views下创建对应文件夹 同时会创建一个index.vue，多层文件夹同理
- 2、api文件：
        在src/api下创建对应第一层文件夹对应的js，举例 jj-cli create test的话是test.js 多层文件夹的话,jj-cli create test/test1 就会生成test1.js
- 3、路由文件：
        在src/store/modules/routerMap/views下创建对应第一层文件夹对应的js文件，如test或者test/test1 都是创建test.js，同时生成test：()=> import('@/views/test/test1')类似
#####多层文件夹对应的文件
- 1、页面文件：
        在src/views下创建对应文件夹 同时会创建对应的文件，eg: test/test.vue，会在views文件夹下创建test.vue文件
- 2、api文件：
        在src/api下创建对应第一层文件夹对应的js，举例 jj-cli create test/test1.vue，会在api文件夹下生成test1.js 
- 3、路由文件：
        在src/store/modules/routerMap/views下创建对应第一层文件夹对应的js文件，如test或者test/test1 都是创建test.js，同时生成test：()=> import('@/views/test/test1')类似
## 技术栈
node fs fs-extra ora等cli 相关依赖
## 后续

```
会引入命令拓展属性 及优化现有命令行的交互动画等
```