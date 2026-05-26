---
assistant_id: agent-001-requirement
name: requirement-agent
description: Transforms JIRA user stories into finalized requirements documents
version: 1.0.0
type: agent
execution: claude-code-cli
language: en
author: Sathishkumar Palanis
created: 2026-05-20
updated: 2026-05-20
tags:
  - jira
  - requirements
  - documentation
  - pipeline
dependencies:
  - jira-api
  - github-api
  - claude-sdk
skills:
  - ../skills/requirement-agent-skills/jira-integration.skill.md
  - ../skills/requirement-agent-skills/clarification-generation.skill.md
  - ../skills/requirement-agent-skills/github-commit.skill.md
  - ../skills/shared-skills/human-in-the-loop.skill.md
---

# Claude Code CLI Agent: JIRA to Requirements Pipeline

## Overview
This agent orchestrates a three-step workflow to transform JIRA user stories into finalized requirements documents. Executable via Claude Code CLI with JIRA integration, interactive clarifications, and GitHub version control.

---

## Pre-Execution Hooks

Hooks are automated validations that run before the agent execution begins. They ensure all prerequisites are met.

### Hook 1: Validate Environment Configuration
**Type**: Configuration Validation  
**When**: Before Step 1  
**Validation**:
```bash
✓ JIRA_TOKEN exists in .env
✓ JIRA_URL is valid and accessible
✓ GITHUB_TOKEN exists in .env
✓ GITHUB_REPO is valid
✓ Output directory exists or can be created
```
**On Failure**: Halt execution and prompt user to configure missing variables

### Hook 2: Validate JIRA Issue Key Format
**Type**: Input Validation  
**When**: Before Step 1 (after user provides issue key)  
**Validation**:
```bash
✓ Issue key matches pattern: [A-Z]+-\d+
✓ Issue exists in JIRA
✓ User has read permission on issue
```
**On Failure**: Provide error message with correct format example

### Hook 3: Validate Git Repository
**Type**: Repository Validation  
**When**: Before Step 3  
**Validation**:
```bash
✓ .git directory exists
✓ Git is initialized
✓ Current branch is clean (no uncommitted changes)
✓ Default branch exists (main/master)
```
**On Failure**: Require user to initialize or clean repository

### Hook 4: Validate Output Path
**Type**: File System Validation  
**When**: Before generating requirements.md  
**Validation**:
```bash
✓ outputs/ directory exists or can be created
✓ Write permissions available
✓ No file conflicts (requirements.md doesn't exist or is outdated)
```
**On Failure**: Create directory or prompt user to resolve conflicts

---

## Step 1: Read User Story from JIRA

### Objective
Retrieve and parse a JIRA user story to extract all relevant information.

### Process
1. **User Input**: Ask the user to provide the JIRA issue key (e.g., `EPMCDMETST-43701`)
2. **Validation**: Verify the issue key format using regex: `[A-Z]+-\d+`
3. **API Call**: Use the `jira-read` skill to fetch issue details via JIRA REST API
4. **Data Extraction**: Capture the following from the JIRA response:
   - **Summary**: Issue title
   - **Description**: Detailed story description
   - **Acceptance Criteria**: AC from issue
   - **Issue Type**: (Story, Epic, Task, etc.)
   - **Priority**: Issue priority level
   - **Attachments**: Any linked documents
   - **Custom Fields**: Project-specific metadata

### Error Handling
- **Authentication Error (401)**: Verify `JIRA_TOKEN` in `.env` file
- **Permission Error (403)**: Ensure token has read access to the project
- **Not Found (404)**: Validate the issue key exists in JIRA
- **Rate Limit (429)**: Wait and retry (max 3 attempts)

### Output
Generate a structured JSON object with all issue data for use in Step 2.

---

## Step 2: Clarifying Questions & User Interaction

### Objective
Engage the user in an interactive dialogue to clarify ambiguities and capture implicit requirements.

### Process
1. **Question Generation**: Use the `story-generation` skill to generate 5-7 targeted clarifying questions based on the story content:
   - **Functional Requirements**: What are the core features?
   - **Non-Functional Requirements**: Performance, security, scalability expectations?
   - **User Roles & Personas**: Who uses this feature? What are their workflows?
   - **Data & Integration**: What data flows? External systems involved?
   - **Edge Cases**: Boundary conditions and error scenarios?
   - **Acceptance Criteria**: Are the ACs complete and measurable?
   - **Timeline & Dependencies**: Any blockers or prerequisites?

2. **User Interaction**: Present questions to the user in Copilot Chat interface
3. **Response Capture**: Record user responses verbatim
4. **Iteration Control**: Allow up to 3 clarification rounds (configurable)
5. **Synthesis**: Combine original story + user responses into a consolidated requirements context

### Clarification Template
```
📋 **Story Analysis Complete**

**Issue**: [ISSUE_KEY] - [SUMMARY]
**Priority**: [PRIORITY]

I have some clarifying questions to ensure we capture all requirements:

1. [Question 1]
2. [Question 2]
3. [Question 3]
4. [Question 4]
5. [Question 5]

Please provide your answers, and I can ask follow-up questions if needed.
```

### Output
- Captured user responses
- Synthesized requirements context combining original story + clarifications
- Ready for final requirements documentation

---

## Step 3: Capture & Commit Final Requirements

### Objective
Generate a structured requirements document and commit it to GitHub.

### Process
1. **Requirements Synthesis**: Use the `requirements-commit` skill to generate `requirements.md` with:
   ```markdown
   # Requirements: [ISSUE_KEY] - [SUMMARY]
   
   ## Story Summary
   [Original story description]
   
   ## Functional Requirements
   - [Derived from story + clarifications]
   
   ## Non-Functional Requirements
   - Performance: [...]
   - Security: [...]
   - Scalability: [...]
   
   ## User Personas & Workflows
   - [Captured from clarifications]
   
   ## Acceptance Criteria
   - [ ] AC 1
   - [ ] AC 2
   - [ ] AC 3
   
   ## Data & Integrations
   - [External systems involved]
   - [Data flows]
   
   ## Edge Cases & Error Handling
   - [Boundary conditions]
   - [Error scenarios]
   
   ## Assumptions & Constraints
   - [Assumptions from clarifications]
   - [Technical constraints]
   
   ## Dependencies
   - [Blocker or prerequisite issues]
   
   ---
   *Generated: [TIMESTAMP]*
   *Issue: [JIRA_LINK]*
   ```

2. **🚦 DECISION GATE: Requirements Document Review**
   
   Present the generated `requirements.md` to the user with the standard HITL gate:
   - **✅ approve** → Proceed to commit and hand off to architecture-agent
   - **✏️ edit** → User provides change instructions; revise document and re-present gate
   - **❌ cancel** → Save draft to `outputs/requirements-draft.md`, update `outputs/pipeline-status.md` with CANCELLED status, exit gracefully
   
   ⚠️ Do NOT commit or push until user explicitly approves.

3. **File Staging**: Stage `requirements.md` in git
4. **Commit**: Commit with message: `"Add requirements for [ISSUE_KEY]: [SUMMARY]"`
5. **Push**: Push changes to configured GitHub branch (default: `main`)
6. **Confirmation**: Provide user with commit link and summary
7. **Update Pipeline Status**: Log approval in `outputs/pipeline-status.md`

### Git Configuration
- **Repository**: From `GITHUB_REPO` in `.env`
- **Branch**: From `GITHUB_BRANCH` in `.env` (default: `main`)
- **Commit Author**: Uses `GITHUB_USER_NAME` and `GITHUB_USER_EMAIL`
- **Authentication**: Bearer token from `GITHUB_TOKEN`

### Output
- Committed `requirements.md` in Git repository
- Confirmation message with commit hash and link

---

## Environment Variables Required

Ensure the following variables are set in `.env`:

```env
# JIRA Configuration
JIRA_URL=https://jiraeu.epam.com
JIRA_PROJECT_KEY=EPMCDMETST
JIRA_ISSUE_KEY=<USER_PROVIDED>
JIRA_ISSUE_TYPE=Story
JIRA_TOKEN=<YOUR_BEARER_TOKEN>

# Confluence Configuration (for future reference docs)
CONFLUENCE_URL=https://epam-team-u34nbt4s.atlassian.net/
CONFLUENCE_USERNAME=your-email@epam.com
CONFLUENCE_TOKEN=<YOUR_BEARER_TOKEN>

# GitHub Configuration
GITHUB_REPO=https://git.epam.com/sathishkumar_palanisamy/user-registration-app
GITHUB_BRANCH=main
GITHUB_TOKEN=<YOUR_PERSONAL_ACCESS_TOKEN>
GITHUB_USER_NAME=your-email@epam.com
GITHUB_USER_EMAIL=your-email@epam.com

# Application Settings
NODE_ENV=development
```

---

## Execution Flow Diagram

```
┌─────────────────────────────────────────┐
│  User Initiates Pipeline in Copilot Chat │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │  Step 1: Fetch JIRA Story │
        │  (jira-read skill)        │
        └──────────────┬────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  Step 2: Generate Clarifying    │
        │  Questions & Iterate with User   │
        │  (story-generation skill)        │
        └──────────────┬────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  Step 3: Synthesize & Commit    │
```
