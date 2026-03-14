class Interview {
  constructor() {
    this.step = 0
    this.data = {}
    this.onboardingSteps = [
      { key: 'name', question: '请问你的姓名是什么？', field: ['basicInfo', 'name'] },
      { key: 'phone', question: '请问你的联系电话是多少？', field: ['basicInfo', 'phone'] },
      { key: 'email', question: '请问你的邮箱地址是什么？', field: ['basicInfo', 'email'] },
      { key: 'city', question: '请问你现在所在的城市是哪里？', field: ['basicInfo', 'city'] },
      { key: 'expectedPosition', question: '请问你期望的岗位方向是什么？', field: ['basicInfo', 'expectedPosition'] },
      { key: 'educationStart', question: '接下来我们来记录教育经历，请问你最高学历的学校名称是什么？', field: ['education', 0, 'school'] },
      { key: 'educationMajor', question: '请问你所学的专业是什么？', field: ['education', 0, 'major'] },
      { key: 'educationTime', question: '请问你入学和毕业的时间是？（格式：2016-09 - 2020-06）', field: ['education', 0, 'time'] },
      { key: 'experienceStart', question: '接下来我们来记录工作经历，请问你最近一份工作的公司名称是什么？', field: ['experiences', 0, 'company'] },
      { key: 'experiencePosition', question: '请问你在这家公司担任的岗位是什么？', field: ['experiences', 0, 'position'] },
      { key: 'experienceTime', question: '请问你入职和离职的时间是？（格式：2020-07 - 至今）', field: ['experiences', 0, 'time'] },
      { key: 'experienceDesc', question: '请简单描述下你在这家公司的主要工作职责？', field: ['experiences', 0, 'description'] },
      { key: 'experienceAchievements', question: '请问你在这家公司取得的主要业绩有哪些？（可以分点说明）', field: ['experiences', 0, 'achievements'] },
      { key: 'addMoreExperience', question: '请问你还有其他工作经历需要记录吗？（是/否）', field: ['_meta', 'addMoreExperience'] }
    ]
  }

  async startOnboarding() {
    this.step = 0
    this.data = {
      basicInfo: {},
      education: [],
      experiences: [],
      _meta: {}
    }
    return this.onboardingSteps[0].question
  }

  async processAnswer(answer) {
    const currentStep = this.onboardingSteps[this.step]
    // 存储回答
    if (currentStep.field.length === 2) {
      this.data[currentStep.field[0]][currentStep.field[1]] = answer.trim()
    } else if (currentStep.field.length === 3) {
      if (!this.data[currentStep.field[0]][currentStep.field[1]]) {
        this.data[currentStep.field[0]][currentStep.field[1]] = {}
      }
      this.data[currentStep.field[0]][currentStep.field[1]][currentStep.field[2]] = answer.trim()
    }

    this.step++

    // 判断是否还有下一步
    if (this.step < this.onboardingSteps.length) {
      // 处理添加更多工作经历的逻辑
      if (currentStep.key === 'addMoreExperience') {
        if (answer.trim() === '是' || answer.trim() === 'yes') {
          const expIndex = this.data.experiences.length
          // 插入新的工作经历步骤
          this.onboardingSteps.splice(this.step, 0,
            { key: `experience_${expIndex}_company`, question: `请问你第${expIndex+1}份工作的公司名称是什么？`, field: ['experiences', expIndex, 'company'] },
            { key: `experience_${expIndex}_position`, question: `请问你在这家公司担任的岗位是什么？`, field: ['experiences', expIndex, 'position'] },
            { key: `experience_${expIndex}_time`, question: `请问你入职和离职的时间是？`, field: ['experiences', expIndex, 'time'] },
            { key: `experience_${expIndex}_desc`, question: `请简单描述下你在这家公司的主要工作职责？`, field: ['experiences', expIndex, 'description'] },
            { key: `experience_${expIndex}_achievements`, question: `请问你在这家公司取得的主要业绩有哪些？`, field: ['experiences', expIndex, 'achievements'] },
            { key: 'addMoreExperience', question: '请问你还有其他工作经历需要记录吗？（是/否）', field: ['_meta', 'addMoreExperience'] }
          )
        } else {
          // 结束引导
          return '✅ 初始化完成！你的职业生涯档案已经建立好了，你可以随时使用 /linkedcareer record 记录工作成长，或者 /linkedcareer resume 生成简历。'
        }
      }
      return this.onboardingSteps[this.step].question
    }

    return '✅ 初始化完成！'
  }

  async getReminderQuestion(frequency = 'weekly') {
    const questions = {
      daily: '今天你完成了哪些重要工作？有没有掌握新的技能或者取得什么成果？',
      weekly: '本周你完成了哪些重要项目？有没有技能提升或者值得记录的业绩？遇到了什么挑战，是怎么解决的？',
      monthly: '本月你在工作上取得了哪些进展？能力上有什么提升？职业规划上有没有什么调整？'
    }
    return questions[frequency] || questions.weekly
  }

  getCollectedData() {
    // 移除元数据
    const { _meta, ...cleanData } = this.data
    return cleanData
  }
}

module.exports = Interview
