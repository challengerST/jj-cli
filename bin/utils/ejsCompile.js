/*
 * @Author: etong
 * @Date: 2021-11-01 10:30:48
 * @LastEditTime: 2021-11-01 10:30:50
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \jj-cli\bin\util\ejsCompile.js
 * Think first, Program later
 */
const ejs = require('ejs')

const ejsCompile = (templatepath, data={}, options = {}) => {

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatepath, {data}, options, (err, str) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(str)
        })
    })
    
}


module.exports = {
    ejsCompile
}