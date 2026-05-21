# Testing & Verification Skill

**Agent**: verify-agent  
**Version**: 1.0.0  
**Purpose**: Generate and execute comprehensive verification suite

## Capabilities

### 1. Generate Unit Tests
- **Function**: `generateUnitTests(sourceCode)`
- **Creates**:
  - Test cases for each function/method
  - Happy path tests
  - Edge case tests
  - Error condition tests
- **Output**: Unit test files (.test.js, .spec.ts, etc.)

### 2. Generate Integration Tests
- **Function**: `generateIntegrationTests(architecture)`
- **Creates**:
  - Component interaction tests
  - API endpoint tests
  - Database interaction tests
  - External service mocking
- **Output**: Integration test files

### 3. Execute Test Suite
- **Function**: `executeTestSuite(testDirectory)`
- **Process**:
  - Install dependencies
  - Run test command
  - Collect coverage metrics
  - Parse test results
- **Output**: Test execution report

### 4. Validate Code Coverage
- **Function**: `validateCodeCoverage(coverageReport)`
- **Checks**:
  - Overall coverage >= 70%
  - Critical paths have >= 90% coverage
  - No uncovered error paths
- **Output**: Coverage validation report

### 5. Validate Documentation
- **Function**: `validateDocumentation(projectRoot)`
- **Checks**:
  - README.md completeness
  - API documentation present
  - Code comments adequate (>= 50%)
  - CHANGELOG up-to-date
  - Type definitions (if applicable)
- **Output**: Documentation report

### 6. Verify Build
- **Function**: `verifyBuild(projectRoot)`
- **Process**:
  - Run build command
  - Check for compilation errors
  - Verify artifacts generated
- **Output**: Build verification report

### 7. Generate Verification Report
- **Function**: `generateVerificationReport(allResults)`
- **Creates**: `verification-report.md` with:
  - Test execution summary
  - Coverage metrics
  - Documentation checklist
  - Build verification status
  - Production readiness assessment
  - Blockers or warnings
- **Output**: Comprehensive verification report

## Verification Checklist
- ✅ Unit tests pass (100%)
- ✅ Integration tests pass (100%)
- ✅ Code coverage >= 70%
- ✅ Critical paths >= 90% coverage
- ✅ Build succeeds
- ✅ No compilation errors
- ✅ Documentation complete
- ✅ Type definitions correct (if applicable)

## Success Indicators
✅ Tests created and passing  
✅ Coverage >= 70%  
✅ Build successful  
✅ Documentation validated  
✅ Production ready  
