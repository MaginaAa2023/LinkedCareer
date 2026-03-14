class Interview {
  constructor() {
    this.step = 0
    this.data = {}
    // 基础信息字段定义，按匹配优先级排序
    this.basicInfoFields = [
      { key: 'phone', label: '联系电话', required: true, pattern: /1[3-9]\d{9}/ },
      { key: 'email', label: '邮箱', required: true, pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
      { key: 'gender', label: '性别', required: false, pattern: /(?:^|\s)(男|女)(?:$|\s)/ },
      { key: 'age', label: '年龄', required: false, pattern: /(?:^|\D)(\d{1,2})岁(?:$|\D)/i },
      { key: 'name', label: '姓名', required: true, pattern: /(?:叫|姓名|名字|我是)[：:]?\s*([\u4e00-\u9fa5]{2,4})(?:$|\s|，|。)/i },
      { key: 'city', label: '所在城市', required: true, pattern: /(?:在|住|城市|所在地)[：:]?\s*([\u4e00-\u9fa5]{2,10}?)(?:市|省|自治区|$|\s|，|。)/i }
    ]
    this.onboardingSteps = [
      { 
        key: 'basicInfoCollect', 
        question: `### 请提供你的基本信息：
你可以直接用一段话描述，我会自动提取信息：
- 姓名
- 联系电话
- 邮箱地址
- 所在城市
- 期望岗位方向
- （可选）性别、年龄

例如：我叫张三，电话13800138000，邮箱zhangsan@example.com，现在在北京，期望找产品经理岗位，今年35岁。`,
        field: ['_meta', 'basicInfoRaw']
      },
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
    // 用来存储缺失的基础信息字段
    this.missingBasicFields = []
  }

  // 从用户输入中提取基础信息
  extractBasicInfo(text) {
    const info = {}
    // 按优先级匹配字段，避免冲突
    for (const field of this.basicInfoFields) {
      const match = text.match(field.pattern)
      if (match) {
        if (field.key === 'age') {
          // 年龄只保留数字
          info[field.key] = match[1].replace(/\D/g, '')
        } else if (field.key === 'name' || field.key === 'city') {
          // 姓名和城市取捕获组，去除空白和前缀
          info[field.key] = match[1].trim()
          // 城市去掉可能的"在"、"住"等前缀残留
          info[field.key] = info[field.key].replace(/^(在|住)\s*/, '')
        } else {
          info[field.key] = match[0].trim()
        }
      }
    }
    // 特殊处理：岗位方向可能比较长，单独匹配
    const positionMatch = text.match(/(?:期望|想找|求职|是)(?:岗位|职业|方向|工作)[:：]?\s*([^\n，。；]+)/i) || text.match(/岗位方向[:：]?\s*([^\n，。；]+)/i)
    if (positionMatch) {
      info.expectedPosition = positionMatch[1].trim()
      // 去掉前面的"是"、"做"等前缀
      info.expectedPosition = info.expectedPosition.replace(/^(是|做|从事)\s*/, '')
    } else {
      // 如果没有明确的岗位关键词，找最长的职业相关描述
      const possiblePositions = text.match(/(?:产品经理|技术负责人|研发总监|运营总监|设计师|工程师|产品岗|技术岗|运营岗|管理岗)/i)
      if (possiblePositions) {
        info.expectedPosition = possiblePositions[0]
      }
    }
    return info
  }

  async startOnboarding() {
    this.step = 0
    this.data = {
      basicInfo: {},
      education: [],
      experiences: [],
      _meta: {}
    }
    this.missingBasicFields = []
    return this.onboardingSteps[0].question
  }

  async processAnswer(answer) {
    const currentStep = this.onboardingSteps[this.step]
    // 处理基础信息收集阶段（合并提问+智能提取+缺失追问）
    if (currentStep.key === 'basicInfoCollect' || this.missingBasicFields.length > 0) {
      // 提取用户输入的所有基础信息
      const extracted = this.extractBasicInfo(answer)
      // 合并到已有基础信息中
      this.data.basicInfo = { ...this.data.basicInfo, ...extracted }
      // 如果是第一次提交基础信息，检查必填字段是否缺失
      if (currentStep.key === 'basicInfoCollect') {
        this.missingBasicFields = this.basicInfoFields.filter(field => 
          field.required && !this.data.basicInfo[field.key]
        )
      } else {
        // 是补充缺失字段的回答，更新缺失列表
        this.missingBasicFields = this.missingBasicFields.filter(field => 
          field.required && !this.data.basicInfo[field.key]
        )
      }
      // 如果还有缺失字段，生成追问问题
      if (this.missingBasicFields.length > 0) {
        const missingLabels = this.missingBasicFields.map(f => f.label).join('、')
        return `请补充以下必填信息：${missingLabels}`
      } else {
        // 基础信息收集完成，进入下一步
        this.step++
        return this.onboardingSteps[this.step].question
      }
    }
    // 普通步骤的回答存储
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
