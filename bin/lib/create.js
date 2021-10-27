/*
 * @Author: etong
 * @Date: 2021-10-27 17:24:03
 * @LastEditTime: 2021-10-27 19:13:16
 * @LastEditors: your name
 * @Description:
 * @FilePath: \jj-cli\bin\lib\create.js
 * Think first, Program later
 */
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");

// 拼接绝对路径
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = async function (name, options) {
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  console.log('resolve',resolve('src'))
  console.log("cwd", cwd);
  console.log("targetAir", targetAir);
  console.log(fs.existsSync(targetAir))
  // 判断views 下是否存在当前文件或者文件夹
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建?
    if (options.force) {
      // 直接移除当前文件或文件夹
      debugger
      await fs.remove(targetAir);
    } else {
      // 询问是否需要强制删除
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Target directory already exists Pick an action:",
          choices: [
            {
              name: "Overwrite",
              value: "overwrite",
            },
            {
              name: "Cancel",
              value: false,
            },
          ],
        },
      ]);
      
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
        console.log(chalk.green('removed successfully!\n'))
      }
      console.log('action',action)
    }
  }
  console.log(">>> create.js", chalk.green(name), options);
};
