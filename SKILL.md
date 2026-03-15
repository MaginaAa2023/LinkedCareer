---
name: linkedcareer
description: Career management skill for OpenClaw, record growth, generate professional resumes
metadata:
  openclaw:
    requires: { bins: ["node"] }
    install: "npm install --production"
    commands:
      - name: init
        description: Initialize career profile
      - name: deepdive
        description: Deep dive to extract career highlights
      - name: record
        description: Record work growth
      - name: resume
        description: Generate professional resumes
      - name: import
        description: Import existing resume
---
# LinkedCareer
## Core Features
- Intelligent onboarding to build career profile
- Deep dive analysis to extract hidden achievements
- Regular growth recording to track progress
- Multi-template professional resume generation
- JD matching to improve application success rate
- 100% local data storage, no network requests

## Quick Start
```
/linkedcareer init     # Initialize your career profile
/linkedcareer deepdive # Deep dive to find career highlights
/linkedcareer record   # Record recent work growth
/linkedcareer resume   # Generate professional resume
```
