/*
 * @Author: etong
 * @Date: 2021-10-27 17:24:03
 * @LastEditTime: 2021-11-10 17:56:46
 * @LastEditors: your name
 * @Description:
 * @FilePath: \jj-cli\bin\lib\create.js
 * Think first, Program later
 */
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const fsNode = require('fs');
const { ejsCompile } = require('../utils/ejsCompile')
const inquirer = require("inquirer");
const ora = require('ora')

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
async function writeFile (path,content,chartset='utf-8') {
    return fsNode.promises.writeFile(path, content);
    if (fs.existsSync(path)) {
        // 提示用户是否确认覆盖
        // const {chose} = await inquirer.prompt([ // 配置询问方式
        //     {
        //         name: 'chose',
        //         type: 'list', // 类型
        //         message: '此文件已存在是否覆盖?',
        //         choices: [
        //             {name: '覆盖', value: 'overwrite'},
        //             {name: '取消', value: false}
        //         ]
        //     }
        // ]); 

        // if (!chose) {
        //     return;
        // } else if (chose === 'overwrite'){
        //     return fsNode.promises.writeFile(path, content);
        // }
    } else {
        console.log('path',path)
        console.log('content',content)
        return fsNode.promises.writeFile(path, content);
    }
}

/**
 * @description: 写入文件流
 * @param {*} filePath 路由路径
 * @param {*} fileName 输入命令
 * @param {*} str 内容
 * @return {*}
 */
function streamWrite(filePath, fileName, str) {
    // let ws = fs.createWriteStream(fileName);
    let strStream = '';
    const read = fs.createReadStream(filePath)
    read.setEncoding('utf-8')
    read.resume()
    console.log('开始读')
    read.on('data', data=> {
        strStream+=data.toString()
        console.log('正在读...');
    })
    read.on('end',()=>{
        const regex = /\{([^"]*)\}/ig
        const routerMapStr = regex.exec(strStream) || []
        strStream = strStream.replace(routerMapStr[1], joinRouterContent(routerMapStr[1], fileName))
        console.log('读取结束')
        writeStream(strStream, filePath)
    })
    console.log("程序执行完毕");
    
}

function writeStream(content,filePath) {
    let ws = fs.createWriteStream(filePath);
    ws.write(new Buffer(content, 'utf-8'));
    ws.end()
    console.log('写入结束')
}

/**
 * @description: 拼接路由内容
 * @param {*}
 * @return {*}
 */
function joinRouterContent(routerMapStr, fileName) {
    console.log('fileName',fileName)
    const filePathArr = fileName.split('/')
    const arrLen = filePathArr.length
    const isCreateIndex = fileName.indexOf('.')>=0
    console.log('routerMapStr',routerMapStr)
    const key = isCreateIndex?filePathArr[arrLen-1].split('.')[0]:filePathArr[arrLen-1]
    const content = `    ${key}: () => import('@/views/${fileName}') \r\n`
    const arr = routerMapStr.split(',')
    console.log('arr1',arr)
    const len = arr.length
    // 如果只有一个数据 新增加上逗号
    // if( len == 1 ) {
    //     arr[len-1] = strJoinDot(arr[len-1],arr[len-1].lastIndexOf(')'), ',')
    // }
    // 数组最后一位元素
    const arrLastItem = arr[len-1]
    // 判断如果最后一位中含有// 证明是注释
    const isNote = arrLastItem.indexOf('//')>=0
    // 最后一行有注释 也有路由
    const isNoteNotIncludeImport = isNote&&arrLastItem.indexOf('import')>=0
    // 是注释并且不包含import
    const lastItemIndex = (isNote && !isNoteNotIncludeImport) ? 2: 1
    // 判断原先文件中最后一句代码有逗号
    // 最后一位是注释
    const lastItem = arr[len-lastItemIndex]
    // 最后一位元素插入逗号
    // 最后一位不是注释 含有逗号
    // 最后一位不是注释 没有逗号
    let strJoinDotString = lastItem
    if(isNote) {
        if(isNoteNotIncludeImport&&routerMapStr.indexOf(content)<0) {
            strJoinDotString = strJoinDot(lastItem,lastItem.lastIndexOf(')'), ',')
        }
    } else {
        strJoinDotString = strJoinDot(lastItem,lastItem.lastIndexOf(')'), ',')
    }
    arr[len-lastItemIndex] = strJoinDotString
    return arr.join(',') + (routerMapStr.indexOf(content)>=0?'':content)
}

/**
 * @description: 为最后一位添加逗号
 * @param {*} source
 * @param {*} index
 * @param {*} newStr
 * @return {*}
 */
function strJoinDot(source, index, newStr) {
    console.log('source',source)
    const start = index + 1;
    return source.slice(0,start) + (source.indexOf(',')>=0?'':newStr) + source.slice(start)
}

/**
 * @description: 创建文件目录 views下面 vue文件
 * @param {*} filename
 * @param {*} directory
 * @return {*}
 */  
function mkdirVueDirectory (filename,isFolderFile) {
    return new Promise((resolve, reject) => {
        // 判断是否是创建Index文件还是创建对应的文件
        const isCreateIndex = filename.indexOf('.')>=0

        // 更改为无论 多少层没有.vue 就直接创建文件夹 然后在文件夹内部创建index.vue
        // 如果有文件层 证明是直接去找该文件夹 需要首先判断是否存在该文件夹 然后再创建文件
        const filePath = isCreateIndex?path.join(process.cwd(),'/src/views/',`${filename}`):
        path.join(process.cwd(),'/src/views/',`${filename}/index.vue`)
        fs.pathExists(filePath, (err, exists)=> {
                if(exists) {
                    console.log(`${chalk.red(`${filePath} 已经存在`)}`)
                }else{
                    const spinner = ora(`${chalk.green(`正在创建对应文件: ${filePath}`)}`)
                    spinner.start()
                    fs.ensureFile(filePath,(err)=>{
                        if(err) {
                            spinner.fail(err)
                            reject(err)
                        }else{
                            // 判断是否有文件层级
                            const isFolderFile = filename.indexOf('/')>=0
                            spinner.succeed(`${chalk.green(`${filePath} 创建成功`)}`)
                            // 创建文件对应vue文件 并写入内容
                            createPage(filename,isFolderFile)
                            resolve(filePath)
                        }
                    } )
                }
        })

    })
}  

/**
 * @description: 创建vue文件 写入文件内容
 * @param {*}
 * @return {*}
 */
const createPage = async (filename, isFolderFile) => {
    // 判断是否是创建Index文件还是创建对应的文件
    const isCreateIndex = filename.indexOf('.')>=0
    const templatePath = await path.resolve(__dirname, '../template/vue.ejs')
    const module = isFolderFile?filename.split('/')[0]:filename
    const targetPath = isCreateIndex?path.join(process.cwd(),'/src/views/',`${filename}`):
    path.join(process.cwd(),'/src/views/',`${filename}/index.vue`)
    
    // 需要一个ejs模版进行渲染
    const result = await ejsCompile(templatePath, {module, componentName: upperFirstword(module), moduleName: upperFirstword(module)});
    
    // 写入文件
    await writeFile(targetPath, result);

}

/**
 * @description:  创建api接口文件 需要区分是否存在原有文件
 * @param {*}
 * @return {*}
 */
async function createApi(filename,isFolderFile) {
    const module = isFolderFile?filename.split('/')[0]:filename
    const file_name = isFolderFile?filename.split('/')[1]:filename
    const filePathArr = filename.split('/')
    const len = filePathArr.length
    const isCreateIndex = filename.indexOf('.')>=0

    const key = isCreateIndex?filePathArr[len-1].split('.')[0]:filePathArr[len-1]
    const apiPath = path.join(process.cwd(),'/src/api/',`${module}/${key}.js`)
    const templatePath = await path.resolve(__dirname, '../template/api.ejs')
    if(fs.existsSync(apiPath)) {
        console.log(chalk.red('api对应文件已存在，需要手动添加对应方法'))
    }  else {
        try{
            await fs.ensureFile(apiPath).then(async ()=>{
                console.log(chalk.green('api对应文件创建成功'))
                // 需要一个ejs模版进行渲染
                const result = await ejsCompile(templatePath, {module, componentName: upperFirstword(module), moduleName: upperFirstword(module)});
                
                // 写入文件
                writeFile(apiPath, result);
            }).catch(err=>{
                console.log(`api对应文件创建失败原因: ${err}`)
            })
        } catch(err) {
            console.log(`api文件catch失败原因:${chalk.red(err)}`)
        }
    }

}

/**
 * @description: 创建路由文件
 * @param {*} filename
 * @return {*}
 */
async function createRoute(filename,isFolderFile) {
    // test
    // test/test1.vue
    // test/test2/test3.vue
    const filePathArr = filename.split('/')
    const len = filePathArr.length
    const isCreateIndex = filename.indexOf('.')>=0

    const key = isCreateIndex?filePathArr[len-1].split('.')[0]:filePathArr[len-1]
    const module = isFolderFile?filename.split('/')[0]:filename
    const routePath = path.join(process.cwd(),'/src/store/modules/routerMap/views/',`${module}.js`)
    const templatePath = await path.resolve(__dirname, '../template/route.ejs')
    const importStr = `${key}: () => import('@/views/${filename}')`

    if(fs.existsSync(routePath)) {
        streamWrite(routePath,filename, importStr)
    }else{
        try{
            await fs.ensureFile(routePath).then(async ()=>{
                console.log(chalk.green('路由对应文件创建成功'))
                // 需要一个ejs模版进行渲染
                const result = await ejsCompile(templatePath, {filename, key});
                
                // 写入文件
                writeFile(routePath, result);
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
    mkdirVueDirectory(name,isFolderFile)
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
