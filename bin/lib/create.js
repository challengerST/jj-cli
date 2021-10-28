/*
 * @Author: etong
 * @Date: 2021-10-27 17:24:03
 * @LastEditTime: 2021-10-28 15:50:04
 * @LastEditors: your name
 * @Description:
 * @FilePath: \jj-cli\bin\lib\create.js
 * Think first, Program later
 */
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");

/**
 * @description: 拼接绝对路径
 * @param {*} dir
 * @return {*}
 */
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

/**
 * @description: 转换第一个字母为大写
 * @param {*} word
 * @return {*}
 */
function upperFirstword (word) {
    return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
}

/**
 * @description: 文件写入
 * @param {*} path
 * @param {*} data
 * @param {*} chartset
 * @return {*}
 */
function write (path,data,chartset='utf-8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err)=>{ err ? reject(err) : resolve() })
    })
}

/**
 * @description: 写入文件流
 * @param {*} path
 * @param {*} str
 * @return {*}
 */
function streamWrite(fileName, str) {
    // let ws = fs.createWriteStream(fileName);
    const read = fs.createReadStream(fileName)
    read.setEncoding('utf-8')
    read.resume()
    console.log('开始读')
    read.on('data', data=> {
        console.log('data',data)
        console.log('正在读');
    })
    console.log('')
    read.on('end',()=>{
        console.log('读取结束')
    })
}

/**
 * @description: 创建文件目录
 * @param {*} filename
 * @param {*} directory
 * @return {*}
 */  
function mkdirDirectory (filename,isFolderFile) {
    return new Promise((resolve, reject) => {
        // 区分 如果name只有一个 我们去判断是否存在文件夹 然后创建一个Index.vue
        // 如果有文件层 证明是直接去找该文件夹 需要首先判断是否存在该文件夹 然后再创建文件
        const filePath = isFolderFile?path.join(process.cwd(),'/src/views/',filename):
        path.join(process.cwd(),'/src/views/',`${filename}/index.vue`)
        fs.ensureFile(filePath,(err)=>{err ? reject(err) : resolve(filePath)} )
    })
}  

/**
 * @description:  创建api接口文件
 * @param {*}
 * @return {*}
 */
async function createApi(filename,isFolderFile) {
    const module = isFolderFile?filename.split('/')[0]:filename
    const apiPath = path.join(process.cwd(),'/src/api/',`${module}.js`)
    try{
        await fs.ensureFile(apiPath).then(()=>{
            console.log(chalk.green('api对应文件创建成功'))
        }).catch(err=>{
            console.log(`api对应文件创建失败原因: ${err}`)
        })
    } catch(err) {
        console.log(`api文件catch失败原因:${chalk.red(err)}`)
    }

}

/**
 * @description: 创建路由文件
 * @param {*} filename
 * @return {*}
 */
async function createRoute(filename,isFolderFile) {
    const module = isFolderFile?filename.split('/')[0]:filename
    const routePath = path.join(process.cwd(),'/src/store/modules/routerMap/views/',`${module}.js`)
    console.log('routePath',routePath)
    if(fs.existsSync(routePath)) {
        const importStr = `${module}: () => import('@/views/${isFolderFile?`${filename}.vue`:`${module}`}')`
        streamWrite(routePath, importStr)
    }else{
        try{
            console.log('fs.ensureFile(routePath)',fs.ensureFile(routePath))
            await fs.ensureFile(routePath).then(()=>{
                console.log(chalk.green('路由对应文件创建成功'))
            }).catch(err=>{
                console.log(`路由对应文件创建失败原因: ${err}`)
            })
        } catch(err) {
            console.log(`路由文件catch失败原因:${chalk.red(err)}`)
        }
    }
}

module.exports = async function (name, options) {
    // 判断是否有文件层级
    const isFolderFile = name.indexOf('/')>=0
    // 创建文件夹文件
    mkdirDirectory(name,isFolderFile)
    // 创建文件对应api
    createApi(name,isFolderFile)
    // 创建文件对应的路由
    createRoute(name,isFolderFile)
    // 判断views 下是否存在当前文件或者文件夹
    // if (fs.existsSync(targetAir)) {
    //     // 是否为强制创建?
    //     if (options.force) {
    //     // 直接移除当前文件或文件夹
    //     await fs.remove(targetAir);
    //     } else {
    //     // 询问是否需要强制删除
    //     let { action } = await inquirer.prompt([
    //         {
    //         name: "action",
    //         type: "list",
    //         message: "Target directory already exists Pick an action:",
    //         choices: [
    //             {
    //             name: "Overwrite",
    //             value: "overwrite",
    //             },
    //             {
    //             name: "Cancel",
    //             value: false,
    //             },
    //         ],
    //         },
    //     ]);
        
    //     if (!action) {
    //         return;
    //     } else if (action === 'overwrite') {
    //         // 移除已存在的目录
    //         console.log(`\r\nRemoving...`)
    //         await fs.remove(targetAir)
    //         console.log(chalk.green('removed successfully!\n'))
    //     }
    //     console.log('action',action)
    //     mkdirDirectory(name)
    //     }
    // }
};
