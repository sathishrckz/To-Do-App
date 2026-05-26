---
assistant_id: agent-005-implementation
name: implementation-agent
description: Transforms implementation plan into production-ready code with human approval loops
version: 1.0.0
type: agent
execution: claude-code-cli
language: en
author: Sathishkumar Palanis
created: 2026-05-20
updated: 2026-05-20
tags:
  - implementation
  - code-generation
  - human-in-the-loop
  - production-ready
dependencies:
  - implementation-planning-agent
  - github-api
  - claude-sdk
skills:
  - ../skills/implementation-agent-skills/code-generation.skill.md
  - ../skills/shared-skills/human-in-the-loop.skill.md
---

# Claude Code CLI Agent: Implementation Execution Pipeline
**EPMCDMETST-40771: User Registration Application - Core Functionality**

## Purpose
Transform the detailed implementation plan (impl-plan.md) into production-ready code through a structured, human-in-the-loop workflow that executes tasks sequentially, obtains approval at key gates, and commits verified code to GitHub. Executable via Claude Code CLI.

## Agent Type
**Execution Agent with Human Approval Loops**

---

## Pre-Execution Hooks

Hooks are automated validations that run before the agent execution begins. They ensure all prerequisites are met.

### Hook 1: Validate Implementation Plan Exists
**Type**: Dependency Validation  
**When**: At start of execution  
**Validation**:
```bash
✓ outputs/impl-plan.md exists
✓ impl-plan.md has required sections:
  - Task breakdown (Task-001, Task-002, etc.)
  - Dependencies mapping
  - Sequencing/Priority
  - Effort estimates
✓ impl-plan.md is valid and not empty
```
**On Failure**: Prompt user to run implementation-planning-agent first

### Hook 2: Validate Git Repository State
**Type**: Repository Validation  
**When**: Before first code commit  
**Validation**:
```bash
✓ .git directory exists (repo initialized)
✓ Current working directory is clean (no uncommitted changes)
✓ Default branch exists and is checked out
✓ GITHUB_TOKEN has write permissions
✓ Remote origin is configured
```
**On Failure**: Initialize repo or clean working directory

### Hook 3: Validate Development Environment
**Type**: Configuration Validation  
**When**: Before code generation  
**Validation**:
```bash
✓ NODE_ENV = development or production
✓ Required dev dependencies available (npm, node, etc.)
✓ .gitignore exists or will be created
✓ src/ and test/ directories exist or can be created
```
**On Failure**: Set up development environment

### Hook 4: Validate Task Sequencing
**Type**: Content Validation  
**When**: Before Step 2  
**Validation**:
```bash
✓ First task can be completed independently (no blocking dependencies)
✓ All tasks have clear acceptance criteria
✓ Task dependencies don't form cycles
✓ Total tasks count >= 1
```
**On Failure**: Warn user of potential sequencing issues; allow override

---

## Workflow Overview

The Implementation Agent operates in **6 major phases**, executing tasks phase-by-phase with human approval at completion of each phase. The agent uses GitHub Copilot Chat to suggest code implementations, waits for human approval, and commits verified code.

### 🚦 Human-in-the-Loop Gate (Standard for ALL Approval Points)

Every point marked **"Approval Required"** in this agent uses the standard HITL gate:
- **✅ approve** → Accept output and proceed to next step
- **✏️ edit** → User provides change instructions; agent revises and re-presents the same gate
- **❌ cancel** → Save all progress, update `outputs/pipeline-status.md` with CANCELLED status, exit gracefully without proceeding to next phase/agent

On **cancel**: All generated code files are preserved (not deleted), task-status.md is updated with last completed task, and pipeline can be resumed from that point.

```
Phase 1: Prepare        Phase 2: Execute         Phase 3: Review & Approve    Phase 4: Verify
├─ Read impl-plan      ├─ Generate code        ├─ Human reviews code       ├─ Run tests
├─ Parse tasks         ├─ Create/update files  ├─ Approve/request changes  ├─ Check quality
├─ Set up branches     ├─ Unit test coverage   ├─ Address feedback         ├─ Performance check
├─ Stage 1 kickoff     └─ Update task status   └─ Final verification       └─ Sign-off
└─ Wait for approval   
                                                Phase 5: Commit & Progress
                                                ├─ Commit to GitHub
                                                ├─ Update documentation
                                                ├─ Push to repository
                                                └─ Plan next phase
```

---

## Phase-by-Phase Execution Workflow

### PHASE 1: PROJECT PREPARATION (Preparation)
**Duration**: ~1 hour  
**Objective**: Set up project structure, review plan, prepare for development

#### Step 1.1: Review Implementation Plan
- **Action**: Read `outputs/impl-plan.md` completely
- **Focus Areas**:
  - Task breakdown (26 tasks across 5 phases)
  - Dependencies and critical path
  - Resource allocation (1-2 person team)
  - Success criteria and quality gates
  - Risk assessment
- **Output**: Summary of plan understanding
- **Approval Required**: ✅ Human confirms plan is clear, no clarifications needed

#### Step 1.2: Parse Task Structure
- **Action**: Extract and organize all 26 tasks by phase
- **Process**:
  - Identify Phase 1 tasks (T-001, T-002)
  - Identify all dependencies
  - Create task execution order
  - Calculate expected timeline
- **Output**: Task execution checklist
- **Approval Required**: ✅ Human confirms task list accuracy

#### Step 1.3: Project Setup
- **Action**: Prepare development environment
- **Tasks**:
  - Create `src/` directory for source files (if not exists)
  - Create `tests/` directory for test files (if not exists)
  - Create `docs/` directory for documentation (if not exists)
  - Initialize git branches: `feature/phase-1`, `feature/phase-2`, etc.
  - Create task tracking file: `outputs/task-status.md`
- **Output**: Directory structure and branch names
- **Approval Required**: ✅ Human confirms environment ready

#### Step 1.4: Phase 1 Kickoff (T-001 & T-002)
- **Action**: Prepare Phase 1 tasks
- **Review**:
  - T-001: HTML Structure & Markup (4 hours)
  - T-002: CSS Styling & Theme (6 hours)
  - Dependencies: None
  - Deliverables: HTML file, CSS file
- **Create**:
  - Task issue template for T-001
  - Task issue template for T-002
  - Acceptance criteria checklist
- **Output**: Phase 1 ready for execution
- **Approval Required**: ✅ Human approves Phase 1 kickoff and task details

---

### PHASE 2A: FOUNDATION DEVELOPMENT (Execute T-001 & T-002)
**Duration**: ~10 hours  
**Objective**: Create HTML structure and CSS styling foundation

#### Step 2A.1: Implement T-001 - HTML Structure & Markup
- **Task**: Create semantic HTML5 structure for registration form
- **Requirements**:
  - `index.html` with:
    - Registration button (initially visible)
    - Form (initially hidden)
    - Form fields: firstName, lastName, email, phone, address
    - Submit button
    - Cancel button
    - Success message container (initially hidden)
    - Error message container (initially hidden)
  - Semantic HTML5 elements (header, main, form, section, etc.)
  - ARIA labels and roles for accessibility
  - Meta tags for viewport, charset, description
  - Link to CSS file (style.css)
  - Script tags for JavaScript (script.js)

- **Copilot Chat Prompt**:
  ```
  Generate semantic HTML5 structure for a user registration form with:
  - Registration button that toggles form visibility
  - Form with fields: firstName, lastName, email, phone, address
  - Submit and Cancel buttons
  - Message containers for success/error messages
  - Proper ARIA labels for accessibility
  - Mobile-friendly viewport meta tag
  Reference: outputs/requirements.md (FR-001 to FR-010)
  ```

- **Process**:
  1. Generate HTML structure using Copilot
  2. Review generated code
  3. Validate HTML structure (semantic, accessible)
  4. Create `index.html` file
  5. Verify file is valid (no console errors in browser)

- **Deliverables**:
  - `index.html` - Valid semantic HTML5
  - No console errors
  - Accessible form structure

- **Approval Required**: ✅ Human reviews generated HTML, approves structure, requests changes if needed

#### Step 2A.2: Implement T-002 - CSS Styling & Theme
- **Task**: Create complete CSS styling for all components
- **Requirements**:
  - `style.css` with:
    - Base styles (body, fonts, colors)
    - Registration button styling
    - Form styling (layout, spacing)
    - Input field styling (borders, focus states)
    - Button styling (primary, secondary, hover states)
    - Message container styling (success, error)
    - Success message (green, check icon)
    - Error message (red, exclamation icon)
    - Desktop layout (responsive to common desktop sizes)
    - Accessibility features (focus indicators, contrast)

- **Design Tokens**:
  - Primary Color: #007BFF (blue)
  - Error Color: #DC3545 (red)
  - Success Color: #28A745 (green)
  - Font: System fonts (Arial, Helvetica, sans-serif)
  - Spacing: 8px grid
  - Border Radius: 4px
  - Shadow: Subtle shadows for depth

- **Copilot Chat Prompt**:
  ```
  Generate comprehensive CSS for registration form with:
  - Base styles (body, font, color scheme)
  - Desktop-responsive layout (1024px+ viewport)
  - Form styling (padding, margins, grid layout)
  - Input fields (borders, focus states, validation states)
  - Buttons (primary, secondary, hover, active states)
  - Message containers (success in green, error in red)
  - Accessibility (focus indicators, color contrast)
  Design tokens: Primary #007BFF, Error #DC3545, Success #28A745
  Reference: outputs/requirements.md (NFR-001 to NFR-010) for design requirements
  ```

- **Process**:
  1. Generate CSS using Copilot
  2. Review styling (layout, colors, spacing)
  3. Validate design against requirements
  4. Create `style.css` file
  5. Test in browser (visual appearance, responsive)
  6. Verify accessibility (color contrast, focus indicators)

- **Deliverables**:
  - `style.css` - Complete styling
  - Proper visual design
  - Accessible color contrast
  - Working focus indicators

- **Approval Required**: ✅ Human reviews CSS, approves visual design, requests styling changes if needed

#### Step 2A.3: Phase 1 Verification
- **Action**: Verify Phase 1 completion
- **Checks**:
  - ✅ HTML is valid and semantic
  - ✅ CSS is complete and styled
  - ✅ Page loads without console errors
  - ✅ Visual design matches requirements
  - ✅ Form elements are accessible
  - ✅ Both files committed to git

- **Output**: Phase 1 completion report
- **Approval Required**: ✅ Human signs off on Phase 1 completion

---

### PHASE 2B: CORE COMPONENTS (Execute T-003 to T-009)
**Duration**: ~20 hours  
**Objective**: Implement all application components and integrate them

#### Step 2B.1: Implement T-003 - UI Layer Component
- **Task**: Create button visibility toggle and form display logic
- **Requirements**:
  - Component manages registration button visibility
  - Clicking button shows form and hides button
  - Form cancellation hides form and shows button
  - State: formShown (true/false)

- **Copilot Chat Prompt**:
  ```
  Generate JavaScript UI Layer component for registration form visibility:
  - Initial state: button visible, form hidden
  - registerBtn.click() → hide button, show form
  - cancelBtn.click() → show button, hide form
  - No validation, no data handling, just visibility
  Include: constructor, init(), show(), hide(), reset()
  Reference: outputs/architecture.md (UI Layer component spec)
  ```

- **Process**:
  1. Generate component code
  2. Create `src/ui-layer.js`
  3. Test button/form visibility toggle
  4. Verify in browser with index.html

- **Deliverables**:
  - `src/ui-layer.js` - UI Layer component
  - Button toggle working
  - Form visibility toggle working

- **Approval Required**: ✅ Human tests component, approves visibility logic

#### Step 2B.2: Implement T-004 - Form Manager Component
- **Task**: Capture user input and manage form clearing
- **Requirements**:
  - getFormData() → returns { firstName, lastName, email, phone, address }
  - clearForm() → resets all input fields to empty
  - Component handles input field references
  - No validation, just data capture

- **Copilot Chat Prompt**:
  ```
  Generate Form Manager component for user input capture:
  - getFormData() method returns form object with all 5 fields
  - clearForm() method resets all inputs to empty string
  - getInputValue(fieldName) method for individual field access
  - No validation, just element management
  Reference: outputs/architecture.md (Form Manager spec)
  ```

- **Process**:
  1. Generate component code
  2. Create `src/form-manager.js`
  3. Test form data capture
  4. Test form clearing
  5. Test in browser with T-003

- **Deliverables**:
  - `src/form-manager.js` - Form Manager component
  - Form data capture working
  - Form clearing working

- **Approval Required**: ✅ Human tests form data capture and clearing

#### Step 2B.3: Implement T-005 - Validation Engine
- **Task**: Implement field validation and error message generation
- **Requirements**:
  - Validation rules (from requirements.md):
    - firstName: required, text only
    - lastName: required, text only
    - email: required, valid email format
    - phone: required, 10 digits only
    - address: required, text only (single line)
  - validateField(fieldName, value) → returns { isValid: bool, error: string }
  - generateErrors(formData) → returns array of error messages for empty fields
  - No UI update, just validation logic

- **Copilot Chat Prompt**:
  ```
  Generate Validation Engine with field validators:
  - firstName, lastName, address: required text, no special chars except spaces
  - email: required, valid email regex (standard format)
  - phone: required, exactly 10 digits (numeric only)
  - validateField(name, value) returns {isValid, error}
  - generateErrors(formData) returns array of error strings for each invalid field
  - Error messages specific to field (e.g., "First Name is required" or "Invalid email format")
  Reference: outputs/requirements.md (FR-005, FR-006 for validation rules)
  ```

- **Process**:
  1. Generate validation code
  2. Create `src/validation-engine.js`
  3. Test each validation rule
  4. Test error message generation
  5. Test with invalid data

- **Deliverables**:
  - `src/validation-engine.js` - Validation logic
  - Field validation working
  - Error message generation working
  - Specific error messages for each field

- **Approval Required**: ✅ Human tests validation with various inputs, approves error messages

#### Step 2B.4: Implement T-006 - Message Manager Component
- **Task**: Display messages with auto-clear and manual dismiss
- **Requirements**:
  - displayMessage(text, type) → shows message for 2 seconds, then auto-clears
  - type: 'success' (green) or 'error' (red)
  - Manual dismiss button to clear message immediately
  - Message container visibility management
  - Only one message shown at a time

- **Copilot Chat Prompt**:
  ```
  Generate Message Manager component for success/error messages:
  - displayMessage(text, type) method
  - Auto-clear after 2 seconds (setTimeout)
  - Manual dismiss button that clears message immediately
  - Update message container innerHTML with formatted message
  - success messages: green background, check icon
  - error messages: red background, exclamation icon
  - clearMessage() method
  Reference: outputs/requirements.md (FR-007, FR-008 for message requirements)
  ```

- **Process**:
  1. Generate component code
  2. Create `src/message-manager.js`
  3. Test success message display
  4. Test error message display
  5. Test auto-clear timeout
  6. Test manual dismiss

- **Deliverables**:
  - `src/message-manager.js` - Message Manager component
  - Message display working (success and error)
  - Auto-clear after 2 seconds
  - Manual dismiss working

- **Approval Required**: ✅ Human tests message display and timeout behavior

#### Step 2B.5: Implement T-007 - State Manager Component
- **Task**: Manage sessionStorage persistence
- **Requirements**:
  - saveState(key, data) → saves to sessionStorage
  - getState(key) → retrieves from sessionStorage
  - clearState(key) → removes from sessionStorage
  - Wrapper around sessionStorage API

- **Copilot Chat Prompt**:
  ```
  Generate State Manager component for sessionStorage integration:
  - saveState(key, data) → JSON.stringify and save to sessionStorage
  - getState(key) → retrieve and JSON.parse from sessionStorage
  - clearState(key) → remove from sessionStorage
  - clearAllState() → remove all application state
  - Error handling for JSON operations
  Reference: outputs/architecture.md (State Manager spec)
  ```

- **Process**:
  1. Generate component code
  2. Create `src/state-manager.js`
  3. Test state saving
  4. Test state retrieval
  5. Test state clearing
  6. Test in browser with DevTools

- **Deliverables**:
  - `src/state-manager.js` - State Manager component
  - sessionStorage operations working
  - Data persistence working

- **Approval Required**: ✅ Human tests state persistence in browser

#### Step 2B.6: Implement T-008 - Message Timeout Manager
- **Task**: Manage message timeout lifecycle
- **Requirements**:
  - startTimeout() → begins 2-second countdown
  - clearTimeout() → stops countdown, removes message
  - Timer management for auto-clear feature

- **Copilot Chat Prompt**:
  ```
  Generate Message Timeout Manager for 2-second auto-clear:
  - startTimeout(callback) → starts 2-second timer, calls callback on completion
  - clearTimeout() → stops timer immediately
  - Prevent multiple timeouts (clear previous before starting new)
  - Return timeoutId for manual clearing
  Reference: outputs/architecture.md (Message Timeout Manager spec)
  ```

- **Process**:
  1. Generate component code
  2. Create `src/message-timeout-manager.js`
  3. Test timeout start
  4. Test timeout clear
  5. Test with Message Manager integration

- **Deliverables**:
  - `src/message-timeout-manager.js` - Timeout manager
  - Timeout mechanism working
  - Timeout clearing working

- **Approval Required**: ✅ Human tests timeout behavior

#### Step 2B.7: Implement T-009 - Component Integration
- **Task**: Wire all components together, test complete flow
- **Requirements**:
  - Create `src/app.js` as main application controller
  - Initialize all components
  - Wire events: registerBtn → show form, submit → validate → save → message
  - Complete user flow: Button click → Form display → Input → Submit → Validation → Save → Message
  - Test end-to-end functionality

- **Copilot Chat Prompt**:
  ```
  Generate app.js to integrate all components:
  - Import all 6 components (UI, Form, Validation, Message, State, Timeout managers)
  - Initialize all components in main() or init()
  - Wire registerBtn.click() → UILayer.show()
  - Wire form.submit() → FormManager.getData() → Validation.validate() → StateManager.save() → MessageManager.display()
  - Wire cancelBtn.click() → UILayer.hide()
  - Wire dismissBtn.click() → MessageManager.clear()
  - Add to index.html: <script src="src/app.js"><\/script>
  Reference: outputs/impl-plan.md (Task T-009 integration flow)
  ```

- **Process**:
  1. Generate integration code
  2. Create `src/app.js`
  3. Update `index.html` to import all scripts
  4. Test complete user flow in browser
  5. Test button visibility
  6. Test form display/hide
  7. Test form submission
  8. Test validation feedback
  9. Test message display
  10. Test state persistence

- **Deliverables**:
  - `src/app.js` - Main application controller
  - All components wired together
  - Complete end-to-end flow working
  - All files committed

- **Approval Required**: ✅ Human tests complete application flow, approves integration

#### Step 2B.8: Phase 2 Verification
- **Action**: Verify Phase 2 completion
- **Checks**:
  - ✅ All 7 components implemented
  - ✅ Components wired together
  - ✅ User can complete registration flow
  - ✅ Messages display and auto-clear
  - ✅ sessionStorage persistence working
  - ✅ No console errors
  - ✅ Accessibility attributes present
  - ✅ Code quality checklist passed

- **Output**: Phase 2 completion report
- **Approval Required**: ✅ Human signs off on Phase 2 completion

---

### PHASE 3: TESTING (Execute T-010 to T-014)
**Duration**: ~20 hours  
**Objective**: Comprehensive test coverage (unit, integration, E2E)

#### Step 3.1: Implement T-010-T-013 - Unit Tests
- **Task**: Create unit tests for all components
- **Requirements**:
  - Jest test suite with >80% coverage
  - T-010: Validation Engine tests (4 hours)
  - T-011: Message Manager tests (3 hours)
  - T-012: Form Manager tests (3 hours)
  - T-013: State Manager tests (2 hours)

- **Copilot Chat Prompt**:
  ```
  Generate Jest unit tests for each component:
  - tests/validation.test.js: Test all field validators, error message generation
  - tests/message-manager.test.js: Test message display, auto-clear, manual dismiss
  - tests/form-manager.test.js: Test getFormData(), clearForm()
  - tests/state-manager.test.js: Test save/get/clear operations
  - Mock DOM elements and timers as needed
  - Aim for >90% coverage per component
  Reference: outputs/impl-plan.md (Testing Strategy section)
  ```

- **Process**:
  1. Generate test files
  2. Create test suite files
  3. Run tests: `npm test`
  4. Achieve >80% coverage
  5. Fix failing tests
  6. Document test results

- **Deliverables**:
  - `tests/` directory with all test files
  - >80% code coverage
  - All unit tests passing
  - Coverage report

- **Approval Required**: ✅ Human reviews test coverage, approves unit test results

#### Step 3.2: Implement T-014 - Integration Tests
- **Task**: Test component interactions
- **Requirements**:
  - Jest integration tests
  - Test component interactions (6+ test cases)
  - Test complete user flows
  - Test state persistence across components

- **Copilot Chat Prompt**:
  ```
  Generate Jest integration tests for component interactions:
  - tests/integration.test.js
  - Test: Form display → data entry → submit → validation → message display
  - Test: Multiple messages, ensure only latest shows
  - Test: Data persists to sessionStorage after submit
  - Test: Form clears after submit
  - Test: Button shows/hides correctly
  - Test: All 7 components work together
  Reference: outputs/impl-plan.md (Integration Testing section)
  ```

- **Process**:
  1. Generate integration test code
  2. Create `tests/integration.test.js`
  3. Run tests: `npm test`
  4. Fix failing tests
  5. Document integration test results

- **Deliverables**:
  - `tests/integration.test.js` - Integration tests
  - All integration tests passing
  - Component interactions verified

- **Approval Required**: ✅ Human reviews integration tests, approves results

#### Step 3.3: Phase 3 Verification
- **Action**: Verify Phase 3 completion
- **Checks**:
  - ✅ Unit tests: >80% coverage, all passing
  - ✅ Integration tests: all passing
  - ✅ All 7 BDD scenarios passing
  - ✅ Code quality metrics acceptable
  - ✅ No critical bugs identified

- **Output**: Phase 3 completion report
- **Approval Required**: ✅ Human signs off on Phase 3 completion

---

### PHASE 4: OPTIMIZATION & POLISH (Execute T-015 to T-023)
**Duration**: ~14 hours  
**Objective**: E2E testing, performance, optimization, and documentation

#### Step 4.1: Implement T-015 - E2E Tests
- **Task**: Test complete user workflows with Playwright
- **Requirements**:
  - Playwright test suite
  - 7 BDD scenarios from requirements.md
  - Test on Chrome, Firefox, Safari, Edge

- **Copilot Chat Prompt**:
  ```
  Generate Playwright E2E tests for all 7 user scenarios:
  - tests/e2e.spec.js
  - Scenario 1: User opens form and sees empty fields
  - Scenario 2: User enters valid data and saves successfully
  - Scenario 3: User tries to save with incomplete data - error displays
  - Scenario 4: User cancels registration - confirmation message
  - Scenario 5: User manually dismisses message
  - Scenario 6: Message auto-clears after timeout
  - Scenario 7: User starts new registration after completion
  Reference: outputs/requirements.md (Acceptance Criteria section)
  ```

- **Process**:
  1. Generate E2E test code
  2. Create `tests/e2e.spec.js`
  3. Run tests: `npx playwright test`
  4. Test on all 4 browsers
  5. Fix failures
  6. Document E2E results

- **Deliverables**:
  - `tests/e2e.spec.js` - E2E tests
  - All 7 scenarios passing on all browsers
  - E2E test report

- **Approval Required**: ✅ Human reviews E2E tests, approves results

#### Step 4.2: Implement T-016 - Performance Testing
- **Task**: Measure and document performance metrics
- **Requirements**:
  - Page load time: <2 seconds
  - Interaction response: <100ms
  - Memory usage: reasonable
  - Performance report with metrics

- **Copilot Chat Prompt**:
  ```
  Generate performance testing script and analysis:
  - Use Chrome DevTools Performance API
  - Measure: page load time, form interaction response, message display latency
  - Create performance-tests.js for automated metrics collection
  - Generate performance report documenting load time, interaction latency
  - Ensure: <2 second load, <100ms interaction response
  Reference: outputs/impl-plan.md (Performance Testing section)
  ```

- **Process**:
  1. Generate performance test code
  2. Measure page load time
  3. Measure interaction response
  4. Document findings
  5. Identify optimization opportunities

- **Deliverables**:
  - Performance metrics documented
  - <2 second load time verified
  - <100ms interaction response verified
  - Performance report in outputs/

- **Approval Required**: ✅ Human reviews performance metrics, approves results

#### Step 4.3: Implement T-017 - Browser Compatibility Testing
- **Task**: Verify functionality on all target browsers
- **Requirements**:
  - Test on Chrome, Firefox, Safari, Edge (latest)
  - Document any compatibility issues
  - Fix issues if found

- **Process**:
  1. Test on Chrome (DevTools)
  2. Test on Firefox (DevTools)
  3. Test on Safari (if on Mac)
  4. Test on Edge
  5. Document compatibility matrix
  6. Fix any issues found

- **Deliverables**:
  - Compatibility test results
  - All 4 browsers working correctly
  - Compatibility matrix documented

- **Approval Required**: ✅ Human reviews compatibility results, approves testing

#### Step 4.4: Implement T-018 - Code Minification & Optimization
- **Task**: Minify JS and CSS, optimize bundle size
- **Requirements**:
  - Minify JavaScript files
  - Minify CSS file
  - Generate optimized versions
  - Document bundle sizes

- **Copilot Chat Prompt**:
  ```
  Generate build script for minification:
  - Create build/ directory with minified files
  - Minify src/*.js → build/app.min.js (or individual files)
  - Minify style.css → build/style.min.js
  - Update index.html references to minified files for production
  - Document file size reduction (before/after)
  ```

- **Process**:
  1. Generate minification script
  2. Create `build/` directory
  3. Minify JavaScript files
  4. Minify CSS file
  5. Document size reduction
  6. Test minified version works

- **Deliverables**:
  - Minified JavaScript files
  - Minified CSS file
  - Build directory structure
  - Size reduction documentation

- **Approval Required**: ✅ Human reviews minified files, approves optimization

#### Step 4.5: Implement T-019 - Performance Optimization
- **Task**: Optimize code for better performance
- **Requirements**:
  - Optimize DOM queries
  - Reduce reflows/repaints
  - Optimize event handlers
  - Performance improvements documented

- **Copilot Chat Prompt**:
  ```
  Generate performance optimization recommendations and code:
  - Cache DOM element references (reduce querySelector calls)
  - Batch DOM updates (reduce reflows)
  - Optimize event listeners (delegate where appropriate)
  - Remove unused code
  - Add performance comments
  Reference: outputs/impl-plan.md (Performance Optimization section)
  ```

- **Process**:
  1. Analyze performance bottlenecks
  2. Generate optimization code
  3. Apply optimizations
  4. Test performance improvements
  5. Document changes

- **Deliverables**:
  - Optimized code
  - Performance improvements documented
  - Tests still passing

- **Approval Required**: ✅ Human reviews optimizations, approves improvements

#### Step 4.6: Implement T-020 - Accessibility Review & Fixes
- **Task**: Ensure WCAG AA accessibility compliance
- **Requirements**:
  - Keyboard navigation working
  - ARIA labels present and correct
  - Color contrast sufficient
  - Focus indicators visible

- **Process**:
  1. Audit accessibility with automated tool
  2. Test keyboard navigation
  3. Review ARIA labels
  4. Check color contrast
  5. Fix issues found
  6. Document accessibility compliance

- **Deliverables**:
  - Accessibility audit report
  - Keyboard navigation working
  - ARIA labels verified
  - Color contrast verified
  - WCAG AA compliance documented

- **Approval Required**: ✅ Human reviews accessibility, approves compliance

#### Step 4.7: Implement T-021-T-023 - Documentation
- **Task**: Document code, update README, document architecture
- **Requirements**:
  - T-021: JSDoc comments on all functions
  - T-022: README with setup, development, usage guides
  - T-023: Architecture documentation reflecting actual implementation

- **Copilot Chat Prompt**:
  ```
  Generate JSDoc documentation and README:
  - Add JSDoc comments to all functions in src/
  - Generate README.md with:
    - Project overview
    - Setup instructions (clone, npm install)
    - Development guide (running locally, directory structure)
    - Usage guide (how to use the application)
    - Testing instructions (npm test, npm run e2e)
    - Contributing guidelines
    - License information
  Reference: outputs/requirements.md and outputs/architecture.md
  ```

- **Process**:
  1. Add JSDoc to all source files
  2. Generate README.md
  3. Update architecture documentation
  4. Review documentation completeness
  5. Verify code comments clarity

- **Deliverables**:
  - JSDoc comments in all source files
  - README.md with complete documentation
  - Architecture documentation updated
  - Clear, helpful comments throughout

- **Approval Required**: ✅ Human reviews documentation, approves completeness

#### Step 4.8: Phase 4 Verification
- **Action**: Verify Phase 4 completion
- **Checks**:
  - ✅ E2E tests: all 7 scenarios passing
  - ✅ Performance: <2s load, <100ms interaction
  - ✅ Browser compatibility: all 4 browsers working
  - ✅ Minified files generated
  - ✅ Performance optimized
  - ✅ Accessibility: WCAG AA compliant
  - ✅ Code fully documented
  - ✅ README complete

- **Output**: Phase 4 completion report
- **Approval Required**: ✅ Human signs off on Phase 4 completion

---

### PHASE 5: DEPLOYMENT (Execute T-024 to T-026)
**Duration**: ~2 hours  
**Objective**: Build and deploy to production

#### Step 5.1: Implement T-024 - Build Configuration
- **Task**: Create build scripts and production build
- **Requirements**:
  - `package.json` build script
  - Generate optimized production build
  - Test build process
  - Verify build output

- **Copilot Chat Prompt**:
  ```
  Generate package.json build scripts:
  - "build": Create minified, optimized production build
  - "build:dev": Development build with source maps
  - "start": Local development server
  - "test": Run all tests
  - "test:e2e": Run E2E tests only
  Create build/ directory with production-ready assets
  ```

- **Process**:
  1. Create/update `package.json` with build scripts
  2. Create `build/` directory
  3. Run build: `npm run build`
  4. Verify build output
  5. Test build in browser

- **Deliverables**:
  - Build scripts in package.json
  - Production build in build/ directory
  - Build process documented

- **Approval Required**: ✅ Human tests build process, approves build output

#### Step 5.2: Implement T-025 - Staging Deployment
- **Task**: Deploy to staging environment and verify
- **Requirements**:
  - Deploy to staging URL (GitHub Pages or similar)
  - Smoke testing on staging
  - Verify all features working in staging

- **Process**:
  1. Deploy build/ to staging environment
  2. Verify URL is accessible
  3. Run smoke tests
  4. Test all features
  5. Document staging deployment

- **Deliverables**:
  - Staging deployment successful
  - Staging URL accessible
  - All features verified in staging
  - Staging verification report

- **Approval Required**: ✅ Human tests staging, approves for production

#### Step 5.3: Implement T-026 - Production Deployment
- **Task**: Deploy to production and verify success
- **Requirements**:
  - Deploy to production URL
  - Final verification
  - Monitor for errors
  - Success confirmation

- **Process**:
  1. Deploy build/ to production environment
  2. Verify production URL is accessible
  3. Test all features in production
  4. Monitor for errors
  5. Document production deployment

- **Deliverables**:
  - Production deployment successful
  - Production URL accessible and functional
  - All features verified in production
  - Production verification report

- **Approval Required**: ✅ Human verifies production, obtains stakeholder sign-off

#### Step 5.4: Project Completion
- **Action**: Final project verification and handoff
- **Checks**:
  - ✅ All 26 tasks completed
  - ✅ All tests passing
  - ✅ Performance targets met
  - ✅ Browser compatibility verified
  - ✅ Code fully documented
  - ✅ Production deployment successful
  - ✅ Requirements met
  - ✅ Stakeholder sign-off obtained

- **Deliverables**:
  - Final project completion report
  - All outputs documented
  - Lessons learned documented
  - Handoff documentation

- **Output**: EPMCDMETST-40771 Implementation Complete
- **Approval Required**: ✅ Human obtains final stakeholder approval

---

## Human Approval Process

At **each major phase checkpoint**, the agent pauses and requests human approval before proceeding:

1. **Phase 1 Kickoff**: Confirm plan is clear, no clarifications needed
2. **T-001 Approval**: Review HTML, approve structure or request changes
3. **T-002 Approval**: Review CSS, approve design or request changes
4. **Phase 2 Kickoff**: Confirm ready for component development
5. **T-003-008 Approval**: Test each component individually, approve or iterate
6. **T-009 Approval**: Test complete integration, approve or request fixes
7. **Phase 3 Kickoff**: Confirm ready for testing
8. **T-010-014 Approval**: Review test coverage, approve or request additional tests
9. **Phase 4 Kickoff**: Confirm ready for optimization
10. **T-015-023 Approval**: Review E2E, performance, optimization, documentation
11. **Phase 5 Kickoff**: Confirm ready for deployment
12. **T-024-026 Approval**: Review builds and deployments, final sign-off

## Output Artifacts

### Documentation Generated:
- `outputs/task-status.md` - Real-time task execution status
- `outputs/phase-1-report.md` - Phase 1 completion report
- `outputs/phase-2-report.md` - Phase 2 completion report
- `outputs/phase-3-report.md` - Phase 3 completion report (test results)
- `outputs/phase-4-report.md` - Phase 4 completion report (performance, E2E)
- `outputs/phase-5-report.md` - Phase 5 completion report (deployment)
- `outputs/final-completion-report.md` - Project completion summary
- `README.md` - Project documentation (at root or docs/)

### Code Generated:
- `index.html` - HTML structure
- `style.css` - CSS styling
- `src/` - All 7 component files (ui-layer.js, form-manager.js, validation-engine.js, message-manager.js, state-manager.js, message-timeout-manager.js, app.js)
- `tests/` - All test files (Jest and Playwright)
- `build/` - Minified production build

### Git Commits:
- Each task or phase creates a commit documenting changes
- Commits follow conventional commit format: `type(scope): message`
- Example: `feat(components): Implement T-001 HTML structure`
- Example: `test(unit): Add T-010 validation engine tests`
- Example: `docs(phase-1): Complete Phase 1 foundation tasks`

## Success Metrics

**Implementation Complete When:**
- ✅ All 26 tasks completed
- ✅ >80% code coverage (unit tests)
- ✅ All tests passing (unit, integration, E2E)
- ✅ Performance targets met (<2s load, <100ms interaction)
- ✅ Browser compatibility verified (4 browsers)
- ✅ Code fully documented
- ✅ Production deployment successful
- ✅ Stakeholder sign-off obtained
- ✅ Project within timeline or acceptable variance

---

**Document Version**: 1.0  
**Agent Version**: Implementation-Agent v1.0  
**Status**: Ready for Execution
