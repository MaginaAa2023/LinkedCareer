---
name: linkedcareer
description: 职业生涯管理和简历生成工具，帮助你记录职业成长，智能生成适配岗位的简历
metadata:
  openclaw:
    requires: { bins: ["node"] }
    commands:
      - name: init
        description: 初始化职业生涯档案，引导填写基础信息
      - name: record
        description: 记录近期工作进展和成长
      - name: resume
        description: 生成简历，支持通用/定向模式，多模板多格式导出
      - name: import
        description: 导入已有简历，快速补全档案信息
---
# LinkedCareer - 职业生涯管理工具
## 功能
- 📝 职业生涯记录：定期记录工作成长、项目经验、技能提升
- 📄 智能简历生成：基于真实记录生成简历，支持岗位定向适配
- 🔒 数据完全本地存储，用户100%可控
- 🤝 兼容OpenClaw、Claude Code、Codex平台
## 使用方法
- `/linkedcareer init` 初始化你的职业生涯档案
- `/linkedcareer record` 记录近期工作情况
- `/linkedcareer resume` 生成简历