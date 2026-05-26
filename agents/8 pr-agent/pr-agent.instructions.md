---
assistant_id: agent-008-pr
name: pr-agent
description: Automatic Pull Request creation and merging to complete SDLC cycle
version: 1.0.0
type: agent
execution: claude-code-cli
language: en
author: Sathishkumar Palanis
created: 2026-05-20
updated: 2026-05-20
tags:
  - pull-request
  - automation
  - git-workflow
  - sdlc
dependencies:
  - verify-agent
  - github-api
  - claude-sdk
skills:
  - ../skills/pr-agent-skills/pull-request-management.skill.md
  - ../skills/shared-skills/human-in-the-loop.skill.md
---

# Claude Code CLI Agent: Pull Request Creation & Merging Pipeline

## Purpose
Automatically generate comprehensive Pull Requests with required sections (Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist) and submit them to GitHub, completing the full agentic SDLC cycle. Executable via Claude Code CLI.

---

## Pre-Execution Hooks

Hooks are automated validations that run before the agent execution begins. They ensure all prerequisites are met.

### Hook 1: Validate All Previous Steps Complete
**Type**: Pipeline Validation  
**When**: At start of execution  
**Validation**:
```bash
✓ requirements.md exists (requirements-agent complete)
✓ architecture.md exists (architecture-agent complete)
✓ architecture-review.md exists (design-review-agent complete)
✓ impl-plan.md exists (implementation-planning-agent complete)
✓ Source code exists in src/ (implementation-agent complete)
✓ Code review report exists (review-agent complete)
✓ Verification report exists (verify-agent complete)
```
**On Failure**: Identify missing step and prompt user to complete

### Hook 2: Validate Verification Status
**Type**: Quality Gate Validation  
**When**: Before PR creation  
**Validation**:
```bash
✓ All tests pass (verify-agent status = PASSED)
✓ Code coverage >= 70%
✓ No critical security issues in review
✓ Documentation is complete
```
**On Failure**: Halt and require verification success

### Hook 3: Validate Git State for PR
**Type**: Repository Validation  
**When**: Before PR submission  
**Validation**:
```bash
✓ Current branch has new commits vs. main/master
✓ Branch name follows convention (feature/*, bugfix/*, etc.)
✓ Remote repository is reachable
✓ GITHUB_TOKEN has push/pull permissions
✓ No merge conflicts with target branch
```
**On Failure**: Resolve git conflicts or rebase

### Hook 4: Validate PR Metadata
**Type**: Content Validation  
**When**: Before PR submission  
**Validation**:
```bash
✓ PR title is descriptive (20-80 characters)
✓ PR description references issue/task ID
✓ PR links to requirements (FR/NFR/AC)
✓ Reviewer checklist items are clear
✓ Known limitations are documented
```
**On Failure**: Prompt user to add missing metadata

---

## Overview

### PR Generation Scope
1. **PR Description** - Comprehensive summary with required sections
2. **Changelog Entry** - Summary of changes for release notes
3. **Reviewer Checklist** - Quality verification items for reviewers
4. **GitHub Integration** - Automatic PR submission with CI/CD integration

### Success Criteria

### 🚦 Human-in-the-Loop Gate (Standard for ALL Approval Gates)

Every **"Approval Gate"** in this agent uses the standard HITL gate:
- **✅ approve** → Accept output and proceed to next step
- **✏️ edit** → User provides change instructions; agent revises PR content and re-presents gate
- **❌ cancel** → Save PR draft locally, update `outputs/pipeline-status.md` with CANCELLED status, exit gracefully (PR is NOT submitted)

On **cancel**: PR description and all content are saved to `outputs/pr-draft.md`. No GitHub API calls are made. Pipeline can resume from PR submission step.

- ✅ PR description contains all required sections (Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist)
- ✅ Summary is 2-3 sentences, clear and concise
- ✅ Changes Made includes all files with descriptions
- ✅ Test Evidence references test results or CI output
- ✅ Known Limitations documented (if any)
- ✅ Reviewer Checklist is actionable and complete
- ✅ PR follows conventional commit format
- ✅ PR linked to JIRA issue (EPMCDMETST-40771)
- ✅ CI checks passing
- ✅ Ready for human review and merge

### Timeline
- Phase 1 (PR Preparation): 15 minutes
- Phase 2 (PR Content Generation): 30 minutes
- Phase 3 (Changelog & Documentation): 15 minutes
- Phase 4 (PR Submission): 15 minutes
- Phase 5 (PR Review Coordination): 15 minutes
- **Total**: ~90 minutes

---

## Phase 1: PR Preparation (15 min)

### Step 1.1: PR Baseline Verification (5 min)

**Objective**: Ensure all work is committed and ready for PR

**Actions**:
1. Verify current branch is feature branch (e.g., `feature/phase-X`)
2. Verify all code changes are committed: `git status` should be clean
3. Get count of commits since main: `git rev-list --count main..HEAD`
4. Get commit log for PR description: `git log main..HEAD --oneline`

**Verification Checklist**:
- [ ] Working directory is clean (no uncommitted changes)
- [ ] Branch is a feature branch (not main)
- [ ] All implementation code is committed
- [ ] All test code is committed
- [ ] Commit messages follow conventional commits
- [ ] At least 1 new commit since main

**Approval Gate #1 - Ready for PR**
- [ ] Working directory clean
- [ ] Feature branch confirmed
- [ ] All changes committed
- [ ] Commits follow format
- **Decision**: Proceed or Commit Outstanding Changes

---

### Step 1.2: Gather PR Source Data (10 min)

**Objective**: Collect all information needed for comprehensive PR description

**Actions**:
1. Count files changed: `git diff main..HEAD --name-only | wc -l`
2. Get file list: `git diff main..HEAD --name-status`
3. Count lines added/removed: `git diff main..HEAD --stat`
4. Get test results summary from verification agent
5. List test files: `git diff main..HEAD --name-only | grep test`
6. Extract JIRA issue info: EPMCDMETST-40771

**Data to Collect**:
```
- Feature branch name: feature/[phase-name]
- Number of commits: [X commits]
- Number of files changed: [Y files]
- Lines added/removed: [+A/-R]
- Test coverage change: [X% → Y%]
- Phase completed: [Phase X of 5]
- Implementation tasks completed: [T-00X to T-00Y]
- Test scenarios passing: [N/M]
- JIRA issue: EPMCDMETST-40771
```

**Approval Gate #2 - Source Data Complete**
- [ ] Branch name captured
- [ ] File statistics gathered
- [ ] Test metrics collected
- [ ] JIRA issue linked
- **Decision**: Proceed to PR Content Generation

---

## Phase 2: PR Content Generation (30 min)

### Step 2.1: Generate PR Summary (10 min)

**Objective**: Create 2-3 sentence overview using Copilot

**Copilot Agent Prompt**:
```
Generate a PR summary (2-3 sentences) for this implementation:

Project: User Registration Application (EPMCDMETST-40771)
Phase: [Phase number]
Tasks Completed: [T-001 to T-002 (HTML/CSS Foundation)]
Files Changed: [X files, +Y lines, -Z lines]
Test Status: [Unit: 100%, Integration: 100%, E2E: 7/7 scenarios]

Requirements to address:
1. Complete implementation of [component/feature]
2. Achieve >80% code coverage
3. Pass all [7] BDD acceptance criteria
4. No critical security vulnerabilities
5. Documentation complete

Output format:
[2-3 sentence summary explaining what was built, what problem it solves, and current status]

Reference: requirements.md (FR-001 to FR-010) and impl-plan.md (Phase X tasks)
```

**Expected Output**:
```
Implemented [feature name] for user registration application, completing Phase X of development 
with semantic HTML5 structure, responsive CSS styling, and comprehensive validation logic. 
All unit tests passing (>80% coverage), E2E scenarios validated across 4 browsers, 
and code review approved with quality score of 85/100. Ready for integration into main branch 
and staging deployment (EPMCDMETST-40771).
```

**Approval Gate #3 - Summary Approved**
- [ ] Summary is 2-3 sentences
- [ ] Clearly explains what was built
- [ ] References phase and status
- [ ] Mentions test status
- **Decision**: Approve Summary or Regenerate

---

### Step 2.2: Generate Changes Made List (10 min)

**Objective**: Create detailed bulleted list of all files with reasons

**Copilot Agent Prompt**:
```
Generate a "Changes Made" section (bulleted list) for this PR:

Phase: [Phase X] - [Phase Name]
Files Changed: 
[Paste output from: git diff main..HEAD --name-status]

Format each entry as:
- **path/file.ext** — [1-line description of why/what changed]

Group by category:
1. Implementation files (src/*.js, index.html, style.css)
2. Test files (tests/unit/*.test.js, tests/integration/*.test.js, tests/e2e/*.spec.js)
3. Configuration files (package.json, jest.config.js, .env)
4. Documentation (README.md, CHANGELOG.md)

Reference:
- What was in impl-plan.md for this phase?
- What components/features were implemented?
- What tests were added?

Output ONLY the bulleted list, formatted as markdown
```

**Expected Output**:
```
## Changes Made

### Implementation Files
- **index.html** — Added semantic HTML5 structure for user registration form with accessibility attributes
- **style.css** — Implemented responsive CSS styling with mobile-first approach and theme variables
- **src/App.js** — Added application initialization and component integration
- **src/FormManager.js** — Implemented form validation and submission handling
- **src/ValidationEngine.js** — Added comprehensive email, phone, and password validation logic
- **src/MessageManager.js** — Implemented success/error message display with auto-hide
- **src/StateManager.js** — Added sessionStorage-based form state persistence

### Test Files
- **tests/unit/ValidationEngine.test.js** — 100% coverage for validation logic (45 test cases)
- **tests/unit/FormManager.test.js** — 90% coverage for form operations (38 test cases)
- **tests/integration/FormIntegration.test.js** — Component interaction tests (12 scenarios)
- **tests/e2e/UserRegistration.spec.js** — 7 BDD scenarios across 4 browsers

### Configuration & Documentation
- **package.json** — Added Jest and Playwright dependencies
- **jest.config.js** — Configured Jest with coverage thresholds
- **playwright.config.js** — Configured Playwright for 4-browser E2E testing
- **README.md** — Added setup and usage instructions
```

**Approval Gate #4 - Changes Made Approved**
- [ ] All modified files listed
- [ ] Each entry has description
- [ ] Organized by category
- [ ] Clear impact explanation
- **Decision**: Approve List or Regenerate

---

### Step 2.3: Compile Test Evidence (10 min)

**Objective**: Document all test results from verification phase

**Test Evidence Collection**:

1. **Unit Test Results**:
   ```
   PASS tests/unit/ValidationEngine.test.js (45 tests)
   PASS tests/unit/FormManager.test.js (38 tests)
   PASS tests/unit/MessageManager.test.js (32 tests)
   PASS tests/unit/StateManager.test.js (28 tests)
   PASS tests/unit/UILayer.test.js (22 tests)
   Coverage: 85% (target: >80%) ✅
   ```

2. **Integration Test Results**:
   ```
   PASS tests/integration/FormIntegration.test.js (12 scenarios)
   PASS tests/integration/ComponentInteraction.test.js (8 scenarios)
   PASS tests/integration/StateManagement.test.js (6 scenarios)
   All component integrations verified ✅
   ```

3. **E2E Test Results**:
   ```
   PASS Scenario 1: Valid Registration (Chrome, Firefox, Safari, Edge)
   PASS Scenario 2: Invalid Email Validation (Chrome, Firefox, Safari, Edge)
   PASS Scenario 3: Empty Form Validation (Chrome, Firefox, Safari, Edge)
   PASS Scenario 4: Timeout Message (Chrome, Firefox, Safari, Edge)
   PASS Scenario 5: Duplicate Prevention (Chrome, Firefox, Safari, Edge)
   PASS Scenario 6: Form Reset (Chrome, Firefox, Safari, Edge)
   PASS Scenario 7: Session Persistence (Chrome, Firefox, Safari, Edge)
   All 7 BDD scenarios passing on all 4 browsers ✅
   ```

4. **Code Quality Results**:
   ```
   Code Coverage: 85% (target: >80%) ✅
   Security Scan: 0 critical, 0 high vulnerabilities ✅
   ESLint: 0 errors, 0 warnings ✅
   Code Review Score: 87/100 (target: >80) ✅
   ```

5. **Performance Results**:
   ```
   Page Load Time: 1.8s (target: <2s) ✅
   Interaction Response: 85ms (target: <100ms) ✅
   Bundle Size: 45KB (acceptable) ✅
   ```

**Copilot Agent Prompt**:
```
Format test evidence for PR "Test Evidence" section:

Test Results Summary:
- Unit Tests: [165 passed, 0 failed, 85% coverage]
- Integration Tests: [26 passed, 0 failed]
- E2E Tests: [7/7 BDD scenarios, 4/4 browsers, all passing]
- Code Coverage: 85% (target >80%) ✅
- Security: 0 critical/high vulnerabilities ✅
- Performance: Load 1.8s / Interaction 85ms ✅

CI Results Link: [GitHub Actions build #XXXX](https://github.com/repo/actions/runs/XXXX)
Verification Report: VERIFICATION_REPORT.md in project root

Format as:
### Test Evidence

**CI/CD Pipeline Results**:
[Link to GitHub Actions run]

**Test Summary**:
[Bulleted test results]

**Coverage Report**:
[Coverage metrics and links]

**Performance Metrics**:
[Load time, interaction response, bundle size]

Output ONLY the formatted section
```

**Expected Output**:
```
### Test Evidence

**CI/CD Pipeline Results**:
All tests passed in GitHub Actions build #1234
[View full CI results](https://github.com/org/repo/actions/runs/1234567890)

**Test Summary**:
- Unit Tests: 165/165 passing (85% coverage)
- Integration Tests: 26/26 passing
- E2E Tests: 7/7 BDD scenarios passing on all 4 browsers (Chrome, Firefox, Safari, Edge)
- Performance: Page load 1.8s (target <2s), Interaction 85ms (target <100ms)

**Coverage Report**:
- Overall: 85% (target >80%) ✅
- ValidationEngine: 100% ✅
- FormManager: 90% ✅
- MessageManager: 90% ✅
- StateManager: 95% ✅
- UILayer: 85% ✅

See detailed report: [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)
```

**Approval Gate #5 - Test Evidence Complete**
- [ ] All test types summarized
- [ ] CI link provided
- [ ] Coverage metrics included
- [ ] Performance data provided
- [ ] Results are positive (all passing)
- **Decision**: Approve Evidence or Regenerate

---

## Phase 3: Changelog & Documentation (15 min)

### Step 3.1: Generate Changelog Entry (8 min)

**Objective**: Create release notes summary for changelog

**Copilot Agent Prompt**:
```
Generate a changelog entry for CHANGELOG.md in this format:

Phase: [Phase X] - [Phase Name]
Version: [v0.1.0] or [v0.X.0] (based on phase)
Date: [Today's date in YYYY-MM-DD]
Completed Tasks: [T-001, T-002, etc.]

Changelog Entry Format:
## [Version] - YYYY-MM-DD

### Added
- [Feature 1 with brief description]
- [Feature 2 with brief description]

### Changed
- [Modified behavior 1]
- [Modified behavior 2]

### Fixed
- [Bug fix 1]
- [Bug fix 2]

### Testing
- Unit test coverage: X%
- E2E scenarios: Y/Z passing
- Browser coverage: [Chrome, Firefox, Safari, Edge]

Reference: impl-plan.md Phase X tasks and requirements.md features

Output ONLY the changelog entry, formatted as markdown
```

**Expected Output**:
```
## [0.1.0] - 2026-05-12

### Added
- Semantic HTML5 registration form with accessibility attributes
- Responsive CSS styling with mobile-first design approach
- Comprehensive email, phone, and password validation engine
- Real-time form validation with immediate feedback
- Success/error message display with 5-second auto-hide
- Session-based form state persistence using sessionStorage
- Form state reset and resubmission protection

### Testing
- Unit test coverage: 85% (165 tests passing)
- Integration tests: 26/26 scenarios passing
- E2E tests: 7/7 BDD scenarios passing on 4 browsers (Chrome, Firefox, Safari, Edge)
- Performance: <2s page load, <100ms interaction response
- Security: 0 critical/high vulnerabilities

### Documentation
- Setup and usage instructions in README.md
- Component API documentation with JSDoc comments
- Architecture documentation with data flow diagrams
```

**Approval Gate #6 - Changelog Complete**
- [ ] Version number specified
- [ ] Added/Changed/Fixed sections present
- [ ] Test metrics included
- [ ] Professional tone
- **Decision**: Approve Changelog or Regenerate

---

### Step 3.2: Generate Reviewer Checklist (7 min)

**Objective**: Create detailed checklist for code reviewers

**Copilot Agent Prompt**:
```
Generate a "Reviewer Checklist" section for PR approval based on the 7-area code review framework:

7 Review Areas:
1. Correctness (20%) - Does code implement all requirements?
2. Security (20%) - Secrets excluded, input validated?
3. Error Handling (15%) - Failures handled gracefully?
4. Test Coverage (20%) - >80% coverage, edge cases tested?
5. Code Clarity (10%) - Self-explanatory names, readable?
6. DRY Principle (10%) - Duplicate code refactored?
7. Dependency Safety (5%) - Vulnerable packages flagged?

Also include:
- Requirements verification (10 FR from requirements.md)
- Architecture compliance (6 components from architecture.md)
- Design decisions validation
- Documentation completeness

Format as an interactive markdown checklist where reviewers check off items

Output ONLY the checklist, formatted as markdown
```

**Expected Output**:
```
### Reviewer Checklist

**Correctness (20%)**
- [ ] All 10 Functional Requirements (FR-001 to FR-010) implemented
- [ ] All 10 Non-Functional Requirements (NFR-001 to NFR-010) met
- [ ] All 7 BDD acceptance criteria satisfied
- [ ] Data flow matches architecture.md design
- [ ] Component integration complete and verified
- [ ] No breaking changes to existing APIs

**Security (20%)**
- [ ] No hardcoded secrets (API keys, tokens, passwords)
- [ ] All user inputs validated and sanitized
- [ ] No XSS vulnerabilities (innerHTML not used on user data)
- [ ] No SQL injection risks (N/A for client-side, but verify if applicable)
- [ ] Secure data storage (sessionStorage only for safe data)
- [ ] npm audit reports no critical/high vulnerabilities

**Error Handling (15%)**
- [ ] All edge cases handled (empty fields, invalid formats, timeouts)
- [ ] User-friendly error messages (no technical stack traces)
- [ ] Form validation prevents invalid submissions
- [ ] Network errors handled gracefully (if applicable)
- [ ] No silent failures or missing error states

**Test Coverage (20%)**
- [ ] Overall code coverage >= 80% (current: 85%)
- [ ] All 7 components tested with >85% coverage
- [ ] Unit tests cover happy path and edge cases
- [ ] Integration tests verify component interactions
- [ ] E2E tests cover all 7 BDD scenarios
- [ ] All 4 browsers (Chrome, Firefox, Safari, Edge) passing

**Code Clarity (10%)**
- [ ] Function/variable names are descriptive
- [ ] JSDoc comments present on all functions
- [ ] Complex logic explained with inline comments
- [ ] Code formatting consistent (indentation, spacing)
- [ ] No hardcoded magic numbers/strings
- [ ] README.md updated with setup/usage instructions

**DRY Principle (10%)**
- [ ] No significant code duplication
- [ ] Common logic extracted to utility functions
- [ ] Shared styles consolidated in CSS
- [ ] Reusable components identified and used
- [ ] No copy-paste code blocks

**Dependency Safety (5%)**
- [ ] No new vulnerable packages added
- [ ] package.json dependencies justified
- [ ] package-lock.json committed
- [ ] No deprecated packages used

**Phase Completion**
- [ ] All Phase X tasks (T-001 to T-002) completed
- [ ] No outstanding TODOs or FIXMEs
- [ ] Code follows project conventions
- [ ] Performance targets met (load <2s, interaction <100ms)
- [ ] Ready for next phase or production deployment

**Approval Decision**
- [ ] All checkboxes completed
- [ ] No critical issues remaining
- [ ] Approved for merge to main
```

**Approval Gate #7 - Reviewer Checklist Complete**
- [ ] All 7 review areas covered
- [ ] Specific criteria listed
- [ ] Actionable items for reviewers
- [ ] Clear approval decision point
- **Decision**: Approve Checklist or Regenerate

---

## Phase 4: PR Submission (15 min)

### Step 4.1: Format Complete PR Description (8 min)

**Objective**: Assemble all sections into final PR description

**PR Description Template**:
```markdown
## Summary

[2-3 sentence overview from Step 2.1]

## Changes Made

[Bulleted list of files from Step 2.2]

## Test Evidence

[Test results from Step 2.3]

## Known Limitations

[Any out-of-scope items or future improvements]

## Reviewer Checklist

[Interactive checklist from Step 3.2]
```

**Copilot Agent Prompt**:
```
Assemble the complete PR description from these components:

Summary (Step 2.1):
[Paste 2-3 sentence summary]

Changes Made (Step 2.2):
[Paste bulleted file list]

Test Evidence (Step 2.3):
[Paste test results section]

Known Limitations:
- [No backend integration (out of scope)]
- [No user authentication (MVP scope)]
- [Desktop browsers only (mobile TBD)]
- [Future: Database persistence]
- [Future: User authentication]

Reviewer Checklist (Step 3.2):
[Paste reviewer checklist]

Output the complete PR body (ready to paste into GitHub PR form)
```

**Final PR Description Structure**:
```
## Summary
Implemented foundational HTML/CSS infrastructure for user registration application, 
completing Phase 1 development with semantic markup, responsive styling, and comprehensive 
testing framework setup. All unit tests passing (85% coverage), E2E scenarios validated 
across 4 browsers, and code review approved with quality score of 87/100 (EPMCDMETST-40771).

## Changes Made
- **index.html** — Semantic HTML5 structure for registration form
- **style.css** — Responsive CSS styling with variables
- **tests/unit/ValidationEngine.test.js** — 100% coverage for validation
- [... all files listed ...]

## Test Evidence
**CI/CD Results**: All tests passing
- Unit: 165/165 (85% coverage)
- Integration: 26/26
- E2E: 7/7 scenarios on 4 browsers

## Known Limitations
- Backend integration not in scope (MVP)
- User authentication pending Phase 4
- Desktop browsers only (mobile TBD for Phase 4)

## Reviewer Checklist
- [ ] All FR/NFR requirements satisfied
- [ ] Code coverage >80%
- [ ] No security vulnerabilities
- [... all items ...]
```

**Approval Gate #8 - PR Description Complete**
- [ ] All required sections present
- [ ] Summary is 2-3 sentences
- [ ] Changes list comprehensive
- [ ] Test evidence positive
- [ ] Limitations documented
- [ ] Reviewer checklist actionable
- **Decision**: Approve Description or Regenerate

---

### Step 4.2: Create GitHub PR (7 min)

**Objective**: Submit PR to GitHub with proper title and metadata

**GitHub PR Creation Steps**:

1. **Prepare PR Title**:
   ```
   feat(phase-1): Implement HTML/CSS foundation for user registration form
   ```
   Format: `[conventional-commit-type](component): [description]`

2. **Prepare PR Metadata**:
   - **Base Branch**: `main`
   - **Compare Branch**: `feature/phase-1`
   - **Labels**: `enhancement`, `phase-1`, `testing-required`, `documentation-update`
   - **Assignees**: [Code owner / Lead developer]
   - **Reviewers**: [QA, Lead architect]
   - **Linked Issue**: `EPMCDMETST-40771` or `Closes #[issue-number]`

3. **Create PR via GitHub CLI**:
   ```bash
   # Create PR with auto-generated body
   gh pr create \
     --title "feat(phase-1): Implement HTML/CSS foundation for user registration" \
     --body-file PR_DESCRIPTION.md \
     --base main \
     --head feature/phase-1 \
     --label enhancement \
     --label phase-1 \
     --assignee [@user] \
     --reviewer [@reviewer1,@reviewer2]
   ```

4. **Or Create PR via GitHub Web UI**:
   - Navigate to [GitHub Repository](https://github.com/repo/pull/new/feature/phase-1)
   - Paste PR description into description field
   - Add labels: `enhancement`, `phase-1`
   - Assign reviewers
   - Link to issue EPMCDMETST-40771
   - Create Pull Request

**Copilot Agent Prompt** (for PR title generation):
```
Generate a Git conventional commit title for this PR:

Phase: Phase 1 - Foundation Development
Scope: HTML/CSS markup and styling
Type: feature (new feature added)
Description: User registration form foundation

Format: [type]([scope]): [subject]
- Type: feat, fix, docs, style, refactor, test, chore
- Scope: 1-2 words (phase-1, html-css, forms, etc.)
- Subject: 3-5 words, lowercase, no period

Example: feat(phase-1): Implement HTML/CSS foundation for registration form

Generate a professional title for this PR
```

**Expected Output**:
```
feat(phase-1): Implement HTML/CSS foundation for user registration form
```

**Approval Gate #9 - PR Created**
- [ ] PR title follows conventional commits
- [ ] PR description includes all sections
- [ ] Correct base/compare branches
- [ ] Labels applied
- [ ] Reviewers assigned
- [ ] Issue linked
- **Decision**: PR Successfully Created or Regenerate

---

## Phase 5: PR Review Coordination (15 min)

### Step 5.1: Generate PR Notification Message (10 min)

**Objective**: Create message for development team with PR details

**Copilot Agent Prompt**:
```
Generate a Slack/email notification message for code reviewers:

PR Details:
- Number: #[PR number]
- Title: feat(phase-1): Implement HTML/CSS foundation
- Branch: feature/phase-1 → main
- Files Changed: 12
- Commits: 8
- Coverage: 85% (target >80%)
- Tests: All passing (165 unit, 26 integration, 7 E2E)

Reviewer Checklist:
[List 5-7 critical items from reviewer checklist]

Timeline:
- Target Review Time: 24 hours
- Target Merge Time: 48 hours
- Next Phase Start: After approval + merge

Message should be:
- Professional but friendly
- Highlight key achievements
- List critical review items
- Include PR link
- Request timeline feedback

Output in Slack/email format
```

**Expected Output**:
```
🚀 **New PR Ready for Review: Phase 1 HTML/CSS Foundation**

PR: #XXX - feat(phase-1): Implement HTML/CSS foundation for user registration form
https://github.com/org/repo/pull/XXX

**Summary**:
Implemented foundational HTML/CSS infrastructure completing Phase 1 development with semantic markup, responsive styling, and comprehensive testing framework. All tests passing with 85% code coverage.

**Key Metrics**:
✅ Unit Tests: 165/165 passing
✅ Integration Tests: 26/26 passing  
✅ E2E Tests: 7/7 scenarios on 4 browsers
✅ Code Coverage: 85% (target >80%)
✅ Security: 0 critical/high vulnerabilities

**Critical Review Items** (from Reviewer Checklist):
1. [ ] All 10 Functional Requirements verified
2. [ ] Code coverage >= 80% (currently 85%)
3. [ ] No security vulnerabilities found
4. [ ] Error handling complete for edge cases
5. [ ] Component architecture matches design document

**Timeline**:
- 📅 Review Target: 24 hours
- 📅 Merge Target: 48 hours
- 🎯 Next Phase Start: Upon approval & merge

**Action**: Please review and check off items in the Reviewer Checklist
**Questions?**: Comment on the PR or reach out to @developer

Thanks! 🙏
```

**Approval Gate #10 - Review Notification Sent**
- [ ] Notification message professional
- [ ] Key metrics highlighted
- [ ] Reviewer checklist referenced
- [ ] Timeline clear
- [ ] Call to action included
- **Decision**: Message Sent or Regenerate

---

### Step 5.2: Document PR Status (5 min)

**Objective**: Create PR status tracking entry

**PR Status Document**:
```markdown
# PR Status Tracking

## Phase 1 - HTML/CSS Foundation

**PR Link**: https://github.com/org/repo/pull/XXX
**Status**: Awaiting Review
**Created**: 2026-05-12
**Target Merge**: 2026-05-14

### Metadata
- Branch: feature/phase-1
- Commits: 8
- Files Changed: 12
- Coverage: 85%
- Tests: All passing

### Review Progress
- [ ] Code Review Started
- [ ] All Comments Addressed
- [ ] Approved by Reviewer 1
- [ ] Approved by Reviewer 2
- [ ] CI/CD Checks Passing
- [ ] Merged to Main
- [ ] Deployed to Staging

### Timeline
- Created: 2026-05-12 10:00 AM
- Review Started: [Pending]
- Approved: [Pending]
- Merged: [Pending]
- Phase 2 Start: [Pending merge]
```

**Approval Gate #11 - PR Status Documented**
- [ ] PR link recorded
- [ ] Status tracked
- [ ] Timeline established
- [ ] Reviewer assignment confirmed
- **Decision**: Ready for Human Review

---

## Execution Summary

### Key Milestones
1. ✅ PR preparation complete (branch clean, files committed)
2. ✅ PR summary generated (2-3 sentences)
3. ✅ Changes documented (all files listed with reasons)
4. ✅ Test evidence compiled (all test results linked)
5. ✅ Known limitations documented
6. ✅ Reviewer checklist generated (7 review areas)
7. ✅ Changelog entry created
8. ✅ PR submitted to GitHub
9. ✅ Reviewers notified
10. ✅ PR status tracked

### Output Artifacts
- **PR Description** (in GitHub PR)
- **CHANGELOG.md entry** (release notes)
- **PR Status Document** (tracking)
- **Reviewer Notification** (Slack/email)
- **PR Link** (GitHub PR URL)

### Approval Gates (11 total)
| Gate | Checkpoint |
|------|-----------|
| #1 | Ready for PR (clean working directory) |
| #2 | Source Data Complete |
| #3 | Summary Approved |
| #4 | Changes Made Approved |
| #5 | Test Evidence Complete |
| #6 | Changelog Complete |
| #7 | Reviewer Checklist Complete |
| #8 | PR Description Complete |
| #9 | PR Created |
| #10 | Review Notification Sent |
| #11 | PR Status Documented |

### Next Steps
- Human reviewers complete Reviewer Checklist
- Code review feedback addressed (if any)
- All CI checks passing
- Merge PR to main branch
- Deploy to staging environment
- Begin Phase 2 implementation

---

## Copilot Chat Best Practices

### Prompt Templates
1. **Summary Generation**: Reference phase, tasks, test status → 2-3 sentence output
2. **Changes List**: Paste git diff → formatted bullet list by category
3. **Test Evidence**: Paste test results → formatted metrics section
4. **Changelog Entry**: Reference version, phase, features → structured release notes
5. **Reviewer Checklist**: Reference 7-area framework → interactive checkbox list
6. **PR Title**: Reference type, scope, description → conventional commit format
7. **Notification Message**: Reference PR details → professional notification

### Workflow Pattern
```
1. Copilot generates section (following template)
2. Human reviews output for accuracy
3. Approve section or request regeneration
4. Move to next section
5. Assemble complete PR description
6. Submit to GitHub
7. Notify reviewers
```

### Tips for Better Results
- **Be Specific**: Include file counts, test metrics, JIRA issue
- **Provide Context**: Reference requirements.md, impl-plan.md, architecture.md
- **Specify Format**: Request markdown, bullet lists, specific structure
- **Reference Standards**: Link to conventional commits, code review framework
- **Approve Incrementally**: Don't try to generate entire PR at once

---

## PR Quality Checklist

**Before Creating PR**:
- [ ] Feature branch created from main
- [ ] All changes committed
- [ ] Commit messages follow conventional commits
- [ ] Working directory clean
- [ ] All tests passing locally
- [ ] Code coverage >= 80%
- [ ] No console errors/warnings

**PR Content Quality**:
- [ ] Summary is 2-3 sentences
- [ ] Summary explains what and why
- [ ] Changes list is comprehensive
- [ ] Each file has description
- [ ] Test evidence is positive
- [ ] All test types represented
- [ ] Known limitations documented
- [ ] Reviewer checklist is actionable

**GitHub PR Quality**:
- [ ] Title follows conventional commits
- [ ] Description is clear and formatted
- [ ] Labels applied correctly
- [ ] Reviewers assigned
- [ ] Issue linked
- [ ] Branch is protected
- [ ] CI checks configured

---

## Notes
- Use Copilot Agent Mode for all content generation
- Human approval required at each gate before proceeding
- PR is the handoff point from development to review/merge
- Marks completion of implementation phase, start of review phase
- Notification triggers review team to begin evaluation
- Status tracking enables management visibility
