import chalk from "chalk";

// 定义不同日志级别的颜色
const log = {
  success: (msg: string, ...args) =>
    console.log(chalk.green.bold(`[SUCCESS] ${msg}`), ...args),
  info: (msg: string, ...args) =>
    console.log(chalk.blue.bold(`[INFO] ${msg}`), ...args),
  warn: (msg: string, ...args) =>
    console.log(chalk.yellow.bold(`[WARN] ${msg}`), ...args),
  error: (msg: string, ...args) =>
    console.log(chalk.red.bold(`[ERROR] ${msg}`), ...args),
}

export default log
