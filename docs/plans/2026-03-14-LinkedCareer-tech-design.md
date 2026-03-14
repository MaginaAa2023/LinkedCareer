# LinkedCareer 技术设计文档
## 技术栈选型
| 模块 | 技术选型 | 说明 |
| --- | --- | --- |
| 插件核心 | Node.js + JavaScript | 兼容OpenClaw/Claude Code/Codex平台，无额外依赖 |
| 数据存储 | JSON + Markdown | 双格式存储，兼顾AI处理和用户可读 |
| 格式导出 | 集成现有OpenClaw技能 | PDF/Word导出复用现有能力，不重复造轮子 |
| 简历模板 | Markdown模板 | 易扩展、易修改，用户可自定义 |
## 项目目录结构
```
LinkedCareer/
├── SKILL.md                    # OpenClaw技能配置文件
├── package.json                # 依赖管理（无第三方依赖）
├── README.md                   # 项目说明文档
├── src/
│   ├── core/
│   │   ├── memory.js           # 职业生涯记录读写、导入、解析逻辑
│   │   ├── interview.js        # 对话引导、追问、互动逻辑
│   │   ├── resume.js           # 简历生成、人岗匹配、模板渲染逻辑
│   │   ├── export.js           # 多格式导出（Markdown/PDF/Word）逻辑
│   │   └── validator.js        # 数据校验、格式验证逻辑
│   └── index.js                # 技能入口文件，处理用户指令分发
├── templates/
│   ├── resume_minimal.md       # 极简版简历模板
│   ├── resume_balanced.md      # 适中版简历模板
│   ├── resume_detailed.md      # 详细版简历模板
│   └── cover_letter.md         # 求职信模板
├── user_data/                  # 用户数据目录（gitignore）
│   ├── career_data.json        # 结构化职业数据
│   └── career_records.md       # 可读版职业记录
├── tests/                      # 单元测试（TDD）
│   ├── memory.test.js
│   ├── resume.test.js
│   └── export.test.js
└── docs/                       # 项目文档
    ├── plans/                  # 设计和规划文档
    └── usage.md                # 使用说明文档
```
## 核心模块设计
### 1. Memory 模块
#### 功能
- 读写结构化JSON数据和可读Markdown数据
- 支持导入已有简历（文本/Markdown/Word/PDF），自动解析结构化信息
- 数据版本管理，支持回滚到历史版本
#### 接口
```javascript
// 保存职业数据
saveCareerData(data) => Promise<boolean>
// 读取职业数据
getCareerData() => Promise<Object>
// 导入简历文件
importResume(filePath, fileType) => Promise<Object>
// 导出可读职业记录
exportCareerRecords() => Promise<string>
```
### 2. Interview 模块
#### 功能
- 首次初始化引导对话流程
- 定期记录提醒对话流程
- 智能追问逻辑，根据用户回答自动生成后续问题
- 自然语言交互，解析用户输入的结构化信息
#### 接口
```javascript
// 开始初始化引导
startOnboarding() => Promise<string>
// 处理用户回答，返回下一个问题
processAnswer(answer) => Promise<string>
// 生成定期记录提醒问题
getReminderQuestion(frequency) => Promise<string>
```
### 3. Resume 模块
#### 功能
- 人岗匹配度计算
- 简历内容生成，支持通用/定向两种模式
- 模板渲染，支持3套模板切换
- 求职信生成
#### 接口
```javascript
// 计算人岗匹配度
calculateMatchScore(jobJD, careerData) => Promise<{score: number, reasons: string[]}>
// 生成简历内容
generateResume(careerData, options = {mode: 'general', template: 'balanced', jobJD: null}) => Promise<string>
// 生成求职信
generateCoverLetter(careerData, jobJD) => Promise<string>
```
### 4. Export 模块
#### 功能
- Markdown格式原生导出
- PDF格式导出（集成OpenClaw现有技能）
- Word格式导出（集成OpenClaw现有技能）
#### 接口
```javascript
// 导出为Markdown
exportToMarkdown(content, outputPath) => Promise<boolean>
// 导出为PDF
exportToPDF(markdownContent, outputPath) => Promise<boolean>
// 导出为Word
exportToWord(markdownContent, outputPath) => Promise<boolean>
```
## 兼容性设计
### OpenClaw 平台
- 完全遵循OpenClaw技能规范，使用标准SKILL.md配置
- 支持OpenClaw的消息推送、定时任务等原生能力
### Claude Code / Codex 平台
- 不使用OpenClaw独有API，核心逻辑完全独立
- 提供命令行调用入口，支持在其他平台直接运行
## 安全和隐私设计
1. **本地运行**：所有功能完全在用户本地运行，不需要联网即可使用核心功能
2. **数据隔离**：用户数据存储在独立目录，gitignore配置确保不会意外提交到代码仓库
3. **无数据收集**：代码中没有任何数据上报、埋点、网络请求（除了用户主动导出/分享）
4. **开源透明**：所有代码完全开源，接受社区审计，没有隐藏逻辑
## TDD 开发规范
1. 每个功能模块先写单元测试，再写实现代码
2. 测试用例覆盖核心场景、边界情况、异常处理
3. 每次提交前必须通过所有测试用例
4. 测试用例和代码一起提交到GitHub仓库
## 部署和发布
1. GitHub开源仓库：MaginaAa2023/LinkedCareer
2. 发布到ClawHub平台，支持用户一键安装
3. 版本号遵循语义化版本规范：主版本号.次版本号.修订号
