---
assistant_id: agent-006-review
name: review-agent
description: Comprehensive code review and quality assurance before PR creation
version: 1.0.0
type: agent
execution: claude-code-cli
language: en
author: Sathishkumar Palanis
created: 2026-05-20
updated: 2026-05-20
tags:
  - code-review
  - quality-assurance
  - security
  - testing
dependencies:
  - implementation-agent
  - github-api
  - claude-sdk
skills:
  - ../skills/review-agent-skills/code-review.skill.md
  - ../skills/shared-skills/human-in-the-loop.skill.md
---

# Claude Code CLI Agent: Code Review Pipeline
**EPMCDMETST-40771: User Registration Application - Core Functionality**

## Purpose
Perform comprehensive code review of implementation using Claude as a peer reviewer before creating Pull Requests. The Review Agent evaluates code quality, security, test coverage, and compliance with requirements using a structured review checklist. Executable via Claude Code CLI.

## Agent Type
**Quality Assurance Agent with Copilot-Assisted Review**

---

## Pre-Execution Hooks

Hooks are automated validations that run before the agent execution begins. They ensure all prerequisites are met.

### Hook 1: Validate Code Exists to Review
**Type**: Dependency Validation  
**When**: At start of execution  
**Validation**:
```bash
✓ Source code files exist in src/ directory
✓ At least 1 .js, .ts, .java, or equivalent code file exists
✓ Code is committed to git (not in staging area only)
✓ Current branch has new commits vs. main/master
```
**On Failure**: Prompt user to run implementation-agent first

### Hook 2: Validate Test Suite Exists
**Type**: Content Validation  
**When**: Before code review  
**Validation**:
```bash
✓ test/ or __tests__/ directory exists
✓ At least 1 test file present (.test.js, .spec.ts, etc.)
✓ Test files reference source code
✓ Tests are executable (valid syntax)
```
**On Failure**: Warn user of missing tests; continue with code review only

### Hook 3: Validate Requirements Alignment
**Type**: Consistency Validation  
**When**: Before review checklist  
**Validation**:
```bash
✓ outputs/requirements.md exists (for validation checklist)
✓ outputs/impl-plan.md exists (to verify task completion)
✓ Current git branch name suggests feature/task ID
```
**On Failure**: Warn user; allow override for emergency reviews

### Hook 4: Validate Review Output Path
**Type**: File System Validation  
**When**: Before generating review report  
**Validation**:
```bash
✓ reviews/ directory exists or can be created
✓ Write permissions available
✓ No unresolved review conflicts
```
**On Failure**: Create directory or prompt user to resolve

---

## Workflow Overview

The Review Agent operates as a **continuous quality gate** throughout and after implementation, evaluating code across **7 review areas** using GitHub Copilot Chat for intelligent analysis.

```
Code Ready for Review
        ↓
    Phase Review (after each phase)
        ↓
    Copilot Correctness Review ──→ Issues found? → Request changes
    Copilot Security Review ─────→ Issues found? → Request fixes
    Copilot Error Handling Review → Issues found? → Request handling
    Copilot Test Coverage Review ─→ Gaps found? → Write tests
    Copilot Code Clarity Review ──→ Issues found? → Refactor
    Copilot DRY Review ───────────→ Duplication? → Extract functions
    Copilot Dependency Review ────→ Vulnerabilities? → Update packages
        ↓
    All Reviews Passed?
        ├─ YES → Generate Review Report
        │         Approve for PR/Commit
        │         ↓
        │     Create Pull Request (optional)
        │     ↓
        │     Merge to Main
        └─ NO → Create Issue List
                 Request Developer Fixes
                 Re-review after changes
```

---

### 🚦 Human-in-the-Loop Gate (Standard for ALL Approval Points)

Every point marked **"Approval Required"** in this agent uses the standard HITL gate:
- **✅ approve** → Accept review findings and proceed to next review area or handoff to verify-agent
- **✏️ edit** → User provides instructions to revise review findings; agent updates and re-presents gate
- **❌ cancel** → Save current review progress to `outputs/code-review-draft.md`, update `outputs/pipeline-status.md` with CANCELLED status, exit gracefully

On **cancel**: All review findings generated so far are preserved. Pipeline can resume from the last completed review area.

---

## Review Agent Workflow

### PHASE 1: PRE-REVIEW SETUP
**Duration**: ~30 minutes  
**Objective**: Prepare code, gather metrics, list all files to review

#### Step 1.1: Code Ready Assessment
- **Check**: Is phase implementation complete?
- **Action**: Gather list of modified/created files
- **Output**: File manifest for review
- **Approval Required**: ✅ Human confirms code ready for review

#### Step 1.2: Environment Setup
- **Action**: Prepare review environment
- **Tasks**:
  - Run tests to get baseline metrics
  - Generate code coverage report
  - List all dependencies
  - Check git diff for changes
- **Output**: Baseline metrics and file list
- **Tools**:
  - `npm test` (unit tests)
  - `npx jest --coverage` (coverage report)
  - `npm list` (dependencies)
  - `git diff main` (changes from main)

#### Step 1.3: Copilot Chat Configuration
- **Action**: Prepare Copilot for review
- **Setup**:
  - Open GitHub Copilot Chat in VS Code
  - Prepare review prompt templates
  - Configure file references
- **Output**: Copilot ready for review
- **Note**: Copilot will analyze code in context of architecture and requirements

---

### PHASE 2: STRUCTURED CODE REVIEW (7 Review Areas)

#### Area 1: CORRECTNESS REVIEW
**Duration**: ~45 minutes  
**Objective**: Verify code matches requirements and architecture

##### Step 2.1.1: Correctness Review Process
- **Review Question**: Does each component behave as specified in requirements.md?

- **Copilot Chat Prompt**:
  ```
  Review the following component for correctness against requirements.md:
  
  Component: {{component_name}}
  Reference: outputs/requirements.md (FR-001 to FR-010)
  Architecture: outputs/architecture.md ({{component_section}})
  
  Checklist:
  ✓ Component initializes correctly
  ✓ All public methods present and implemented
  ✓ Component behavior matches requirement specification
  ✓ Component integrates correctly with other components
  ✓ No missing functionality from specification
  ✓ Data flow matches architecture diagram
  
  Questions to ask Copilot:
  - Does this component fully implement its responsibilities from architecture?
  - Are all required methods present and functional?
  - Does the component interact correctly with dependencies?
  - Are there any missing features from the requirements?
  - Does error handling match expected behavior?
  ```

- **Review Checklist**:
  - ✅ Each component implements all specified methods
  - ✅ Component behavior matches architecture specification
  - ✅ All requirements (FR-001 to FR-010) satisfied
  - ✅ Component integrations working as designed
  - ✅ Data flow matches architecture diagrams
  - ✅ No missing functionality
  - ✅ Edge cases handled per specification

- **Issues Found**: Document any discrepancies with requirements
- **Human Action**: Approve correctness or request developer fixes

##### Step 2.1.2: Functional Testing Validation
- **Copilot Chat Prompt**:
  ```
  Analyze test coverage for {{component}}:
  - Are all functional paths tested?
  - Do tests validate correct behavior per requirements?
  - Are tests documented and clear?
  - Do tests cover the "happy path" scenarios?
  ```

- **Output**: Correctness review report with findings
- **Approval Required**: ✅ All correctness issues resolved before proceeding

---

#### Area 2: SECURITY REVIEW
**Duration**: ~30 minutes  
**Objective**: Verify no security vulnerabilities or data exposure

##### Step 2.2.1: Security Vulnerabilities Check
- **Review Question**: Are secrets excluded from output? Is user input validated?

- **Copilot Chat Prompt**:
  ```
  Perform security review for the implementation:
  
  Security Checklist:
  ✓ No hardcoded secrets (API keys, tokens) in code
  ✓ No passwords or credentials in config files
  ✓ No PII (personally identifiable information) logged
  ✓ User input properly validated before use
  ✓ Input sanitized to prevent XSS attacks
  ✓ CSRF protection if applicable
  ✓ Secure storage (sessionStorage - scope correct)
  
  Questions:
  - Are any secrets exposed in the codebase?
  - Is all user input validated and sanitized?
  - Are there any XSS vulnerabilities?
  - Is data stored securely per specification?
  - Are authentication/authorization correct (if applicable)?
  ```

- **Security Checks**:
  - ✅ No API keys or tokens in code
  - ✅ No passwords in plain text
  - ✅ No sensitive data in logs
  - ✅ User input validated (email format, phone digits, etc.)
  - ✅ Input sanitized (no script injection)
  - ✅ Data stored in sessionStorage only (not localStorage or cookies)
  - ✅ No CORS issues
  - ✅ No unsafe eval() or Function() calls

- **Output**: Security review report
- **Approval Required**: ✅ All security issues resolved before proceeding

##### Step 2.2.2: Dependency Vulnerability Check (see Area 7)

---

#### Area 3: ERROR HANDLING REVIEW
**Duration**: ~30 minutes  
**Objective**: Verify graceful handling of failures and edge cases

##### Step 2.3.1: Error Handling Analysis
- **Review Question**: Are all API failures, missing files, and empty repos handled gracefully?

- **Copilot Chat Prompt**:
  ```
  Review error handling in the implementation:
  
  Error Handling Checklist:
  ✓ All try-catch blocks where needed
  ✓ User-friendly error messages (not stack traces)
  ✓ Validation errors provide specific feedback
  ✓ Edge cases handled (empty inputs, null values, etc.)
  ✓ Form validation prevents invalid submissions
  ✓ Message timeouts handled correctly
  ✓ sessionStorage errors handled gracefully
  ✓ All promise rejections caught
  
  Questions:
  - What happens if a field is empty?
  - What happens if validation fails?
  - Are error messages clear and helpful?
  - Do components handle missing data?
  - Are there any unhandled promise rejections?
  - Is there a fallback for sessionStorage unavailable?
  ```

- **Error Handling Checks**:
  - ✅ Form validation validates all fields before submit
  - ✅ Error messages specific to field (not generic)
  - ✅ Empty fields caught and reported
  - ✅ Invalid email format caught
  - ✅ Phone number format validated (10 digits)
  - ✅ Message display handles failures gracefully
  - ✅ sessionStorage unavailable handled
  - ✅ No unhandled rejections
  - ✅ Timeout errors handled

- **Output**: Error handling review report
- **Approval Required**: ✅ All error handling adequate before proceeding

---

#### Area 4: TEST COVERAGE REVIEW
**Duration**: ~45 minutes  
**Objective**: Verify comprehensive test coverage including edge cases

##### Step 2.4.1: Coverage Analysis
- **Review Question**: Do tests cover the happy path AND the 'Not Found' / missing-field edge cases?

- **Copilot Chat Prompt**:
  ```
  Analyze test coverage for the implementation:
  
  Coverage Checklist:
  ✓ Unit tests cover all public methods
  ✓ Happy path scenarios tested
  ✓ Edge cases tested:
    - Empty field validation
    - Invalid email format
    - Phone number not 10 digits
    - Missing required fields
    - Form cleared after submit
    - Message auto-cleared after timeout
    - Manual message dismiss
  ✓ Integration tests verify component interactions
  ✓ E2E tests cover all 7 user scenarios
  ✓ Performance tests measure metrics
  ✓ Browser compatibility tests passing
  
  Coverage Target: >80% overall
  
  Questions:
  - What is the current code coverage percentage?
  - Which functions/paths lack test coverage?
  - Are edge cases covered?
  - Are all validation rules tested?
  - Are all timeout scenarios tested?
  - Are integration points tested?
  ```

- **Test Coverage Checks**:
  - ✅ Code coverage >80%
  - ✅ Each component has unit tests
  - ✅ Validation tests all rules
  - ✅ Happy path tested
  - ✅ Missing field validation tested
  - ✅ Invalid email rejected
  - ✅ Phone number format validated
  - ✅ Form clearing tested
  - ✅ Message auto-clear timeout tested
  - ✅ Manual dismiss tested
  - ✅ Integration tests component interactions
  - ✅ E2E tests all 7 scenarios
  - ✅ Performance targets verified
  - ✅ All browsers tested

- **Output**: Coverage analysis report with metrics
- **Run Commands**:
  ```bash
  npm test -- --coverage           # View coverage report
  npx jest --verbose               # Run tests with details
  npx playwright test               # Run E2E tests
  npm run test:e2e -- --headed     # E2E with browser
  ```

- **Approval Required**: ✅ Coverage >80%, all tests passing

---

#### Area 5: CODE CLARITY REVIEW
**Duration**: ~30 minutes  
**Objective**: Verify code is readable and self-documenting

##### Step 2.5.1: Code Readability Analysis
- **Review Question**: Are function names self-explanatory? Is logic easy to follow without comments?

- **Copilot Chat Prompt**:
  ```
  Review code clarity and readability:
  
  Code Clarity Checklist:
  ✓ Function/variable names are descriptive
  ✓ Logic is easy to follow
  ✓ Complex logic has comments explaining intent
  ✓ JSDoc comments on all public functions
  ✓ Parameter names are clear
  ✓ Return types documented
  ✓ No confusing abbreviations
  ✓ Consistent naming conventions
  ✓ Proper indentation and formatting
  ✓ No excessively long functions
  
  Questions:
  - Are function names self-explanatory?
  - Is business logic easy to understand?
  - Are comments helpful without being obvious?
  - Are variable names clear?
  - Is formatting consistent?
  - Are there any overly complex code sections?
  ```

- **Code Clarity Checks**:
  - ✅ Functions named clearly (e.g., validateEmail not checkMail)
  - ✅ Variables named descriptively (e.g., emailInput not ei)
  - ✅ Logic flow easy to follow
  - ✅ Comments explain WHY, not WHAT
  - ✅ JSDoc on all public functions
  - ✅ No excessively long functions (>50 lines)
  - ✅ Consistent formatting and style
  - ✅ No magic numbers (use constants)
  - ✅ No confusing nested conditionals

- **Output**: Code clarity review with recommendations
- **Approval Required**: ✅ Code readable and well-documented

---

#### Area 6: DRY PRINCIPLE REVIEW
**Duration**: ~30 minutes  
**Objective**: Identify and refactor duplicate code

##### Step 2.6.1: Duplication Detection
- **Review Question**: Is there duplicated logic that Copilot can refactor into a shared function?

- **Copilot Chat Prompt**:
  ```
  Identify code duplication and refactoring opportunities:
  
  DRY Analysis:
  ✓ No duplicated validation logic
  ✓ No duplicated DOM element selection
  ✓ No duplicated event handler patterns
  ✓ No duplicated message formatting
  ✓ Shared utilities extracted where appropriate
  ✓ No copy-paste code blocks
  
  Questions:
  - Are there duplicated validation checks?
  - Is DOM selection repeated multiple times?
  - Are similar event handlers combined?
  - Can any functions be abstracted?
  - Is message formatting repeated?
  - Can utilities be extracted to shared module?
  ```

- **DRY Checks**:
  - ✅ Validation logic centralized
  - ✅ DOM queries cached (not repeated)
  - ✅ Event handlers not duplicated
  - ✅ Common utility functions extracted
  - ✅ No copy-paste code blocks
  - ✅ Shared constants defined
  - ✅ Message formatting centralized

- **Refactoring Prompts** (if duplication found):
  ```
  I found duplicated logic in {{location}}.
  
  Duplication:
  {{code_snippet_1}}
  {{code_snippet_2}}
  
  Suggested refactoring:
  - Extract to shared function: {{function_name}}
  - Call from both locations
  
  Generate the refactored code.
  ```

- **Output**: DRY analysis with refactoring recommendations
- **Approval Required**: ✅ Duplicate code refactored or approved as-is

---

#### Area 7: DEPENDENCY SAFETY REVIEW
**Duration**: ~20 minutes  
**Objective**: Check for vulnerable packages and outdated versions

##### Step 2.7.1: Vulnerability Scanning
- **Review Question**: Does Copilot flag any known-vulnerable package versions?

- **Dependency Check Commands**:
  ```bash
  npm audit                         # Check for vulnerabilities
  npm audit --production            # Production dependencies only
  npm outdated                      # Check for outdated packages
  npm list                          # Full dependency tree
  ```

- **Copilot Chat Prompt**:
  ```
  Review dependency security:
  
  Dependency Safety Checklist:
  ✓ No vulnerable packages detected
  ✓ All packages up to date
  ✓ No known security issues in dependencies
  ✓ Pinned versions in package-lock.json
  ✓ No unnecessary dependencies
  ✓ Minimal dependency footprint
  
  Questions:
  - Are there any CVE vulnerabilities?
  - Are package versions up to date?
  - Are any packages deprecated?
  - Are there unused dependencies?
  - Is the dependency tree clean?
  ```

- **Safety Checks**:
  - ✅ npm audit shows no vulnerabilities
  - ✅ All packages current versions
  - ✅ No deprecated packages
  - ✅ package-lock.json committed
  - ✅ No unused dependencies
  - ✅ Minimal dependency count

- **Output**: Dependency vulnerability report
- **Actions if vulnerabilities found**:
  1. Run `npm audit fix` for automatic fixes
  2. Review breaking changes
  3. Update version manually if needed
  4. Re-run tests after updates

- **Approval Required**: ✅ No vulnerabilities or remediation plan approved

---

### PHASE 3: REVIEW REPORT GENERATION
**Duration**: ~30 minutes  
**Objective**: Create comprehensive review report and determine approval status

#### Step 3.1: Compile Review Findings
- **Action**: Aggregate all review results
- **Output**: Review findings document with:
  - ✅ Passed checks (green)
  - ⚠️ Warnings (yellow)
  - ❌ Failed checks (red)
  - 📋 Recommendations

#### Step 3.2: Generate Review Report
- **File**: `outputs/review-{{phase}}.md`
- **Sections**:
  1. Review Summary (pass/fail)
  2. Correctness Review (findings)
  3. Security Review (findings)
  4. Error Handling Review (findings)
  5. Test Coverage Review (metrics)
  6. Code Clarity Review (issues)
  7. DRY Review (duplications)
  8. Dependency Review (vulnerabilities)
  9. Overall Quality Score
  10. Recommendations
  11. Approval Decision

#### Step 3.3: Overall Quality Score
- **Calculation**: Based on review areas
  - Correctness: 20%
  - Security: 20%
  - Error Handling: 15%
  - Test Coverage: 20%
  - Code Clarity: 10%
  - DRY Principle: 10%
  - Dependency Safety: 5%

- **Scoring**:
  - 90-100: Excellent (Approved)
  - 80-89: Good (Approved with recommendations)
  - 70-79: Fair (Request changes before approval)
  - <70: Poor (Request significant changes)

#### Step 3.4: Approval Decision
- **Pass Criteria**:
  - ✅ All critical issues resolved (correctness, security, error handling)
  - ✅ Test coverage >80%
  - ✅ No known vulnerabilities
  - ✅ Code clarity acceptable
  - ✅ Quality score ≥80

- **If Approved**:
  - Proceed to Pull Request creation
  - Create PR with review report attached
  - Request human review if needed
  - Merge after final approval

- **If Not Approved**:
  - Create GitHub issue with required changes
  - Request developer fixes
  - Schedule re-review after changes

---

### PHASE 4: PR CREATION & MERGE
**Duration**: ~30 minutes  
**Objective**: Create Pull Request with review results and request final approval

#### Step 4.1: PR Creation
- **When**: Only if review passes (quality score ≥80)
- **Action**: Create GitHub Pull Request
- **PR Template**:
  ```markdown
  ## Review Status
  ✅ Code Review Passed
  Quality Score: {{score}}/100
  Review Date: {{date}}
  
  ## Changes Summary
  - {{change_1}}
  - {{change_2}}
  
  ## Review Findings
  See attached review-{{phase}}.md for full details
  
  ## Checklist
  - [x] Correctness verified
  - [x] Security verified
  - [x] Error handling verified
  - [x] Test coverage >80%
  - [x] Code clarity approved
  - [x] No duplicated code
  - [x] Dependencies secure
  - [x] All tests passing
  
  ## Reviewer
  GitHub Copilot Code Review Agent
  ```

#### Step 4.2: Request Final Approval
- **Action**: Request human review and approval
- **Approval Required**: ✅ Human approves PR and merges to main

#### Step 4.3: Merge to Main
- **Action**: Merge PR after approval
- **Post-merge**:
  - Delete feature branch
  - Update status tracking
  - Proceed to next phase

---

## Review Integration Points

### Per-Phase Reviews
After each phase implementation, trigger review:
- **After Phase 1** (T-001, T-002): Review HTML/CSS
- **After Phase 2** (T-003-T-009): Review components & integration
- **After Phase 3** (T-010-T-014): Review tests & coverage
- **After Phase 4** (T-015-T-023): Review optimization & docs
- **After Phase 5** (T-024-T-026): Review deployment & final code

### Continuous Review
- Review any time code changes are committed
- Use Copilot to quickly assess changes
- Flag issues immediately

---

## Copilot Chat Usage Patterns

### Pattern 1: Single Component Review
```
Review this component for correctness:
[Paste component code]
Reference: requirements.md FR-005 (validation)
Does it implement the requirement correctly?
```

### Pattern 2: Test Coverage Review
```
Analyze test coverage:
Coverage Report:
[Paste coverage output]
Missing paths:
[List untested paths]
Generate tests for missing paths.
```

### Pattern 3: Security Review
```
Security audit for user input handling:
[Paste input validation code]
Is all user input validated?
Are there XSS vulnerabilities?
Is data stored securely?
```

### Pattern 4: DRY Analysis
```
Find code duplication:
[Paste codebase or section]
Identify any duplicated patterns.
Suggest refactorings to reduce duplication.
```

---

## Review Checklist Summary

| Review Area | Review Question | Pass Criteria | Tools |
|---|---|---|---|
| **Correctness** | Does code match requirements? | All components implement specs | Copilot, requirements.md |
| **Security** | Secrets excluded, input validated? | No vulnerabilities, input sanitized | Copilot, manual check |
| **Error Handling** | Failures handled gracefully? | All edge cases handled | Copilot, test results |
| **Test Coverage** | Happy path AND edge cases? | Coverage >80%, all tests pass | npm test, coverage report |
| **Code Clarity** | Functions self-explanatory? | Clear names, good documentation | Copilot, code inspection |
| **DRY Principle** | Duplicated logic refactored? | No duplicate code blocks | Copilot, code inspection |
| **Dependencies** | Vulnerable packages flagged? | No CVEs, versions current | npm audit |

---

## Success Criteria

**Review Complete When:**
- ✅ All 7 review areas evaluated
- ✅ Correctness verified against requirements
- ✅ No security vulnerabilities
- ✅ Error handling adequate
- ✅ Test coverage >80%
- ✅ Code clarity acceptable
- ✅ No significant code duplication
- ✅ Dependencies secure
- ✅ Quality score ≥80
- ✅ Review report generated
- ✅ PR created (if approved)
- ✅ Human approval obtained

---

**Document Version**: 1.0  
**Agent Version**: Review-Agent v1.0  
**Status**: Ready for Code Review Integration
