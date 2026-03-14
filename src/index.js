#!/usr/bin/env node
const readline = require('readline/promises')
const Memory = require('./core/memory')
const Interview = require('./core/interview')
const Resume = require('./core/resume')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const memory = new Memory()
const interview = new Interview()
const resume = new Resume()
async function main() {
  const command = process.argv[2]
  switch (command) {
    case 'init':
      console.log('👋 欢迎使用LinkedCareer，现在开始初始化你的职业生涯档案...')
      console.log('我会通过几个问题帮你完善档案，你只需要根据提示回答即可。\n')
      let question = await interview.startOnboarding()
      while (true) {
        const answer = await rl.question(`\n${question}\n> `)
        if (answer.trim() === 'exit' || answer.trim() === 'quit') {
          console.log('已退出初始化，下次可以继续使用 /linkedcareer init 继续填写')
          break
        }
        question = await interview.processAnswer(answer)
        console.log('')
        if (question.includes('✅ 初始化完成')) {
          console.log(question)
          // 保存收集到的数据
          const data = interview.getCollectedData()
          await memory.save(data)
          break
        }
      }
      break
    case 'record':
      const frequency = process.argv[3] || 'weekly'
      const recordQuestion = await interview.getReminderQuestion(frequency)
      console.log('📝 开始记录近期工作成长...\n')
      const recordAnswer = await rl.question(`${recordQuestion}\n> `)
      // 读取现有数据，添加记录
      const data = await memory.load()
      if (!data.records) data.records = []
      data.records.push({
        date: new Date().toISOString().split('T')[0],
        frequency,
        content: recordAnswer
      })
      await memory.save(data)
      console.log('\n✅ 记录已保存！')
      break
    case 'found':
      const subCommand = process.argv[3]
      if (subCommand === 'job') {
        console.log('🔍 岗位匹配功能正在开发中，敬请期待~')
        console.log('后续将支持对接BOSS直聘、智联招聘、脉脉等平台，自动匹配适合你的岗位')
      } else {
        console.log('可用命令：/linkedcareer found job  匹配适合你的岗位')
      }
      break
    case 'resume':
      console.log('📄 开始生成简历，请选择模板类型：')
      console.log('1. 极简版（1页，适合初筛）')
      console.log('2. 适中版（1-2页，适合大部分场景）')
      console.log('3. 详细版（3-4页，适合终面）')
      const templateChoice = await rl.question('请输入选项（1/2/3，默认2）：\n> ')
      const templateMap = {
        '1': 'minimal',
        '2': 'balanced',
        '3': 'detailed'
      }
      const template = templateMap[templateChoice] || 'balanced'
      console.log('')
      console.log('请选择生成模式：')
      console.log('1. 通用模式（生成通用简历）')
      console.log('2. 定向模式（针对具体岗位JD生成适配简历）')
      const modeChoice = await rl.question('请输入选项（1/2，默认1）：\n> ')
      const mode = modeChoice === '2' ? 'targeted' : 'general'
      let jobJD = null
      let targetPosition = null
      if (mode === 'targeted') {
        targetPosition = await rl.question('请输入目标岗位名称：\n> ')
        jobJD = await rl.question('请粘贴岗位JD内容：\n> ')
      }
      console.log('')
      console.log('正在生成简历...\n')
      const careerData = await memory.load()
      let generatedResume
      if (mode === 'targeted' && jobJD) {
        // 定向生成，先计算匹配度
        const matchResult = await resume.calculateMatchScore(jobJD, careerData)
        console.log(`🎯 目标岗位：${targetPosition}`)
        console.log(`🎯 人岗匹配度：${matchResult.score}/100`)
        if (!matchResult.isRecommended) {
          console.log('⚠️  匹配度低于60分，不建议投递该岗位')
          const confirm = await rl.question('是否仍然继续生成简历？(y/N)\n> ')
          if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
            console.log('已取消生成')
            break
          }
        }
        console.log('匹配亮点：')
        matchResult.reasons.forEach(reason => console.log(`  ✅ ${reason}`))
        console.log('')
        generatedResume = await resume.generate(careerData, { mode, template, jobJD, targetPosition })
      } else {
        generatedResume = await resume.generate(careerData, { mode, template })
      }
      // 保存简历
      const outputPath = `./resume_${new Date().toISOString().split('T')[0]}.md`
      require('fs').writeFileSync(outputPath, generatedResume, 'utf8')
      console.log(`✅ 简历已生成并保存到：${outputPath}`)
      // 生成求职信
      if (mode === 'targeted' && jobJD) {
        const coverLetter = await resume.generateCoverLetter(careerData, jobJD, targetPosition)
        const coverLetterPath = `./cover_letter_${new Date().toISOString().split('T')[0]}.md`
        require('fs').writeFileSync(coverLetterPath, coverLetter, 'utf8')
        console.log(`✅ 配套求职信已生成并保存到：${coverLetterPath}`)
      }
      break
    case 'import':
      const filePath = process.argv[3]
      if (!filePath) {
        console.log('请提供简历文件路径：/linkedcareer import <简历文件路径>')
        break
      }
      console.log('📥 正在导入简历...')
      const content = require('fs').readFileSync(filePath, 'utf8')
      const parsedData = await memory.importResume(content, 'text')
      console.log('✅ 简历导入完成，已提取以下信息：')
      console.log(`  姓名：${parsedData.basicInfo.name || '未识别'}`)
      console.log(`  电话：${parsedData.basicInfo.phone || '未识别'}`)
      console.log(`  邮箱：${parsedData.basicInfo.email || '未识别'}`)
      console.log(`  工作经历：${parsedData.experiences.length} 段`)
      break
    default:
      console.log('📋 LinkedCareer 可用命令:')
      console.log('  /linkedcareer init              初始化职业生涯档案')
      console.log('  /linkedcareer record [daily/weekly/monthly]  记录工作成长')
      console.log('  /linkedcareer resume [general/targeted] [minimal/balanced/detailed] [JD内容]  生成简历')
      console.log('  /linkedcareer import <文件路径>  导入已有简历')
  }
  rl.close()
}
main().catch(err => {
  console.error('❌ 运行出错：', err)
  rl.close()
})