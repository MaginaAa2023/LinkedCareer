#!/usr/bin/env node
async function main() {
  const command = process.argv[2]
  switch (command) {
    case 'init':
      console.log('欢迎使用LinkedCareer，开始初始化你的职业生涯档案...')
      // 调用interview模块启动引导
      break
    case 'record':
      console.log('开始记录近期工作情况...')
      // 调用interview模块启动记录流程
      break
    case 'resume':
      console.log('开始生成简历...')
      // 调用resume模块生成简历
      break
    case 'import':
      console.log('开始导入已有简历...')
      // 调用memory模块导入简历
      break
    default:
      console.log('可用命令: init, record, resume, import')
  }
}
main().catch(console.error)