# Code Generation Skill

**Agent**: implementation-agent  
**Version**: 1.0.0  
**Purpose**: Transform implementation plan into production-ready code

## Capabilities

### 1. Parse Implementation Plan
- **Function**: `parseImplementationPlan(implPlanPath)`
- **Extracts**:
  - Task breakdown
  - Sequencing and dependencies
  - Acceptance criteria
  - Technology stack details
- **Output**: Parsed plan object

### 2. Generate Code for Task
- **Function**: `generateCodeForTask(task, architecture)`
- **Process**:
  - Generate boilerplate/skeleton code
  - Implement core functionality
  - Follow coding standards
  - Include comments and documentation
- **Output**: Production-ready code files

### 3. Create Unit Tests
- **Function**: `createUnitTests(code, taskRequirements)`
- **Generates**:
  - Test cases for happy path
  - Edge case tests
  - Error handling tests
  - Integration test stubs
- **Output**: Test file with >= 80% coverage

### 4. Handle Human Approval
- **Function**: `requestApproval(generatedCode)`
- **Prompts**:
  - Review generated code
  - Provide feedback or approval
  - Request modifications
- **Process**:
  - Accept or request changes
  - Loop until approved
  - Track approval history

### 5. Commit Code to Git
- **Function**: `commitCode(code, task)`
- **Process**:
  - Create feature branch
  - Stage code files
  - Commit with conventional message
  - Push to remote
- **Output**: Git commit hash

### 6. Track Task Completion
- **Function**: `updateTaskStatus(task, status)`
- **Statuses**: `in-progress` → `code-generated` → `tested` → `approved` → `committed`

## Code Quality Standards
- ✅ Follows coding conventions
- ✅ Functions have JSDoc/docstrings
- ✅ Tests have >= 80% coverage
- ✅ No console logs or debug code
- ✅ Proper error handling
- ✅ Environment variables used

## Success Indicators
✅ Code generated per task  
✅ Unit tests created  
✅ Human approval obtained  
✅ Code committed to git  
✅ No breaking changes  
