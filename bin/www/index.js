#!/usr/bin/env node
/*
 * @Author: etong
 * @Date: 2021-10-26 11:28:19
 * @LastEditTime: 2021-10-27 18:34:33
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \jj-cli\bin\www\index.js
 * Think first, Program later
 */
// const testTiny = function(string) {
//     if (typeof string !== "string") throw new TypeError("Tiny wants a string!");
//     return string.replace(/\s/g, "");
// }
const inquirer = require('inquirer');
const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');

figlet.text('@etongduomi/jj-cli!', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

program
    // 定义命令和参数
    .command('create <file-name>')
    .description('Create a new file project')
    // -f or force 强制创建 目录存在则覆盖
    .option('-f, --force', 'overwrite target folder if it already exists')
    .action((name, options)=>{
        require('../lib/create.js')(name, options)
    })

program
    // 配置版本信息
    .version(`v${require('../../package.json').version}`)
    .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv);
/*
 第一步：询问创建的文件名
 第二步：生成对应的文件
*/
// inquirer.prompt({
//     type: 'input',
//     name: 'fileName',
//     message: '请输入需要创建的文件名称',
//     default: 'jj-cli-default'
// }).then((answer)=>{
//     console.log(answer)
// })