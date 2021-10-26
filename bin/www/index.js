#!/usr/bin/env node
/*
 * @Author: etong
 * @Date: 2021-10-26 11:28:19
 * @LastEditTime: 2021-10-26 15:14:44
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \clidemo\bin\www\index.js
 * Think first, Program later
 */
const testTiny = function(string) {
    if (typeof string !== "string") throw new TypeError("Tiny wants a string!");
    return string.replace(/\s/g, "");
}