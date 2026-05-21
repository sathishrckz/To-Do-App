# To-Do App: Complete Project Structure

## Overview

This project uses an 8-agent SDLC pipeline with supporting skills framework for intelligent, automated software development.

## Directory Structure

```
To-Do-App/
├── .env                                 # Environment configuration
├── .git/                                # Git repository
│
├── agents/                              # Agent definitions
│   ├── 1 requirement-agent/
│   │   └── requirement-agent.instructions.md
│   │
│   ├── 2 architecture-agent/
│   │   └── architecture-agent.instructions.md
│   │
│   ├── 3 design-review-agent/
│   │   └── design-review-agent.instructions.md
│   │
│   ├── 4 implementation-agent/
│   │   └── implementation-agent.instructions.md
│   │
│   ├── 5 implementation-planning-agent/
│   │   └── implementation-planning-agent.instructions.md
│   │
│   ├── 6 review-agent/
│   │   └── review-agent.instructions.md
│   │
│   ├── 7 verify-agent/
│   │   └── verify-agent.instructions.md
│   │
│   └── 8 pr-agent/
│       └── pr-agent.instructions.md
│
├── skills/                              # Reusable skills framework
│   ├── README.md                        # Skills catalog and documentation
│   │
│   ├── requirement-agent-skills/
│   │   ├── jira-integration.skill.md
│   │   ├── clarification-generation.skill.md
│   │   └── github-commit.skill.md
│   │
│   ├── architecture-agent-skills/
│   │   ├── requirements-parsing.skill.md
│   │   ├── architecture-design.skill.md
│   │   └── architecture-clarification.skill.md
│   │
│   ├── design-review-agent-skills/
│   │   └── architecture-review.skill.md
│   │
│   ├── implementation-planning-agent-skills/
│   │   └── implementation-planning.skill.md
│   │
│   ├── implementation-agent-skills/
│   │   └── code-generation.skill.md
│   │
│   ├── review-agent-skills/
│   │   └── code-review.skill.md
│   │
│   ├── verify-agent-skills/
│   │   └── testing-verification.skill.md
│   │
│   ├── pr-agent-skills/
│   │   └── pull-request-management.skill.md
│   │
│   └── shared-skills/
│       └── human-in-the-loop.skill.md
│
└── outputs/                             # Generated artifacts (created during execution)
    ├── pipeline-status.md              # HITL decision audit trail & resume state
    ├── requirements.md
    ├── architecture.md
    ├── architecture-review.md
    ├── impl-plan.md
    ├── src/                            # Generated source code
    ├── tests/                          # Generated test files
    ├── code-review.md
    └── verification-report.md
```

## Agent Pipeline

### 1. **Requirement Agent** → `requirements.md`
**Purpose**: Transform JIRA user stories into structured requirements  
**Skills**:
  - JIRA Integration (fetch issues)
  - Clarification Generation (interactive questions)
  - GitHub Commit (save to repo)

**Output**: `outputs/requirements.md`

### 2. **Architecture Agent** → `architecture.md`
**Purpose**: Design system architecture from requirements  
**Skills**:
  - Requirements Parsing
  - Architecture Design (components, tech stack, data flow)
  - Architecture Clarification (stakeholder feedback)

**Output**: `outputs/architecture.md`

### 3. **Design Review Agent** → `architecture-review.md`
**Purpose**: Validate and review architecture design  
**Skills**:
  - Architecture Review (risk analysis, compliance check)

**Output**: `outputs/architecture-review.md`

### 4. **Implementation Planning Agent** → `impl-plan.md`
**Purpose**: Create detailed implementation roadmap  
**Skills**:
  - Implementation Planning (task breakdown, sequencing, dependencies)

**Output**: `outputs/impl-plan.md`

### 5. **Implementation Agent** → Source Code + Tests
**Purpose**: Generate production-ready code from plan  
**Skills**:
  - Code Generation (per-task implementation)

**Output**: `outputs/src/`, test files

### 6. **Review Agent** → `code-review.md`
**Purpose**: Peer review generated code  
**Skills**:
  - Code Review (quality, security, test coverage assessment)

**Output**: `outputs/code-review.md`

### 7. **Verify Agent** → `verification-report.md`
**Purpose**: Comprehensive QA and verification  
**Skills**:
  - Testing & Verification (unit/integration tests, coverage validation)

**Output**: `outputs/verification-report.md`

### 8. **PR Agent** → Pull Request
**Purpose**: Create and merge PR to main branch  
**Skills**:
  - Pull Request Management (PR creation, review, merge)

**Output**: GitHub PR with all evidence

## File Naming Conventions

### Agents
- **Folder**: `{sequence} {agent-name}/`
- **File**: `{agent-name}.instructions.md`
- **Example**: `1 requirement-agent/requirement-agent.instructions.md`

### Skills
- **Folder**: `{agent-name}-skills/`
- **File**: `{skill-name}.skill.md`
- **Example**: `requirement-agent-skills/jira-integration.skill.md`

## Agent YAML Frontmatter

Each agent includes metadata:

```yaml
---
name: agent-id              # unique identifier
description: brief description
version: 1.0.0             # semantic versioning
type: agent
execution: claude-code-cli
language: en
author: Name
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:                      # searchable tags
  - tag1
  - tag2
dependencies:              # external dependencies
  - api
  - library
skills:                    # relative paths to skills
  - ../skills/.../skill.md
---
```

## Pre-Execution Hooks

Each agent includes pre-execution hooks that validate:

1. **Configuration Validation** - Environment variables, API tokens
2. **Dependency Validation** - Previous agent outputs exist
3. **Content Validation** - Required sections and structure
4. **File System Validation** - Paths, permissions, conflicts
5. **Quality Gates** - Passing tests, coverage, security checks

## Environment Configuration

Create `.env` file in project root:

```env
# JIRA Configuration
JIRA_URL=https://jiraeu.epam.com
JIRA_TOKEN=your_token

# GitHub Configuration
GITHUB_REPO=your_repo_url
GITHUB_TOKEN=your_token
GITHUB_USER_NAME=your_name
GITHUB_USER_EMAIL=your_email

# Application Settings
NODE_ENV=development
APP_PORT=3000
```

## Execution Flow

### 🚦 Human-in-the-Loop (HITL) Decision Gates

Every agent-to-agent transition includes a mandatory decision gate. Before committing artifacts and handing off to the next agent, the pipeline pauses and asks the user:

| Action | Behavior |
|--------|----------|
| **✅ approve** | Accept output, commit artifacts, proceed to next agent |
| **✏️ edit** | Provide change instructions; agent revises and re-presents gate |
| **❌ cancel** | Stop pipeline gracefully — all progress is saved, `outputs/pipeline-status.md` is updated, no further agents run |

**On Edit**: The agent applies requested changes, shows a summary/diff, and re-opens the same gate. Up to 5 edit cycles per gate.

**On Cancel**: 
1. All generated artifacts are preserved (never deleted)
2. `outputs/pipeline-status.md` is updated with cancellation details and resume instructions
3. Pipeline exits cleanly — can be resumed later from the cancelled step

**Shared Skill**: `skills/shared-skills/human-in-the-loop.skill.md`

```
1. User provides JIRA issue key
   ↓
2. requirement-agent runs
   → Fetches from JIRA
   → Generates clarifying questions
   → Produces requirements.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
3. architecture-agent runs
   → Parses requirements
   → Designs architecture
   → Clarifies with stakeholders
   → Produces architecture.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
4. design-review-agent runs
   → Reviews architecture
   → Identifies risks
   → Produces architecture-review.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
5. implementation-planning-agent runs
   → Creates task breakdown
   → Analyzes dependencies
   → Produces impl-plan.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
6. implementation-agent runs
   → Generates code per task (with per-phase gates)
   → Creates unit tests
   → Commits to git
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
7. review-agent runs
   → Reviews code quality
   → Checks security
   → Validates test coverage
   → Produces code-review.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
8. verify-agent runs
   → Runs full test suite
   → Validates coverage
   → Produces verification-report.md
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
9. pr-agent runs
   → Creates Pull Request
   → Links all evidence
   → Requests review
   ↓
   🚦 DECISION GATE: approve | edit | cancel
   ↓
   → Merges to main
   ↓
✅ SDLC cycle complete
```

> ❌ At ANY gate, user can type `cancel` to stop the pipeline. Progress is saved and resumable.

## Skills Framework Benefits

- **Modularity**: Each skill is independently testable
- **Reusability**: Skills can be used by multiple agents
- **Maintainability**: Easy to update or extend skills
- **Documentation**: Clear capability definitions
- **Versioning**: Track skill evolution
- **Composition**: Agents composed of multiple skills

## Quick Start

### 1. Setup Environment
```bash
cd To-Do-App
# Copy .env template and configure
cp .env.example .env
# Edit with your JIRA and GitHub tokens
```

### 2. Run Full Pipeline
```bash
claude agent run requirement-agent --config .env
claude agent run architecture-agent --config .env
# ... continue through all agents
```

### 3. Run Specific Agent
```bash
claude agent run architecture-agent \
  --config .env \
  --interactive
```

### 4. Verify Skills are Loaded
```bash
# Each agent automatically loads skills from YAML frontmatter
# Skills are used during agent execution for specific capabilities
```

## Extending the System

### Add New Agent
1. Create folder: `agents/{N} {new-agent}/`
2. Create file: `agents/{N} {new-agent}/{new-agent}.instructions.md`
3. Add skills: `skills/{new-agent}-skills/`
4. Create skill files with capability definitions
5. Reference skills in agent YAML

### Add New Skill
1. Create file: `skills/{agent-name}-skills/{skill-name}.skill.md`
2. Define capabilities with function signatures
3. Document inputs, outputs, and error handling
4. Reference in agent YAML `skills` list

## Support

For questions or issues:
- Check agent/skill documentation
- Review .env configuration
- Check pre-execution hooks validation
- Review Claude CLI logs

---

**Last Updated**: May 20, 2026  
**Status**: Ready for Claude Code CLI Execution  
**Version**: 1.0.0
