---
name: linkedcareer
displayName: LinkedCareer
description: Career management and professional resume generation skill for OpenClaw
metadata:
  openclaw:
    type: runtime
    requires:
      bins: ["node"]
    install: npm install --production
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
## Core Features
- Intelligent guided onboarding to build your career profile
- Deep analysis to identify hidden career achievements
- Regular growth tracking with daily/weekly/monthly records
- Multiple professional resume templates for different industries
- JD matching to optimize resume for specific job roles
- **Privacy Guarantee**: All user career data is stored locally only, no data is ever uploaded to any external network
- **Installation Note**: Installation requires network to download pure JavaScript dependency 'docx' from official npm registry, no binary downloads. Runtime has zero network requests, fully offline operation.

## Quick Start Commands
```
/linkedcareer init     # Initialize career profile
/linkedcareer deepdive # Deep dive to find career highlights
/linkedcareer record   # Record recent work growth
/linkedcareer resume   # Generate professional resume
```
