---
name: linkedcareer
description: OpenClaw skill for career management and professional resume generation
metadata:
  openclaw:
    requires:
      bins: ["node"]
    install: "npm install --production"
    commands:
      - name: init
        description: Initialize your career profile
      - name: deepdive
        description: Deep dive to extract career highlights
      - name: record
        description: Record work growth and achievements
      - name: resume
        description: Generate professional resume in multiple formats
      - name: import
        description: Import existing resume to populate profile
---
# LinkedCareer
## Features
- Guided onboarding to build your career profile
- Deep analysis to identify hidden achievements
- Regular growth tracking with daily/weekly/monthly records
- Multiple professional resume templates for different industries
- JD matching to optimize resume for specific roles
- **隐私保护：所有个人职业数据完全本地存储，无任何网络上传行为**
- **安装说明：安装时需要网络从npm官方仓库下载纯JS依赖`docx`（无二进制/Chromium下载），运行时无任何网络请求**

## Quick Start
```
/linkedcareer init     # Initialize career profile
/linkedcareer deepdive # Deep dive to find career highlights
/linkedcareer record   # Record work growth
/linkedcareer resume   # Generate professional resume
```
