# Code Review Skill

**Agent**: review-agent  
**Version**: 1.0.0  
**Purpose**: Perform comprehensive peer code review

## Capabilities

### 1. Analyze Code Quality
- **Function**: `analyzeCodeQuality(sourceCode)`
- **Evaluates**:
  - Code readability and maintainability
  - Adherence to style guidelines
  - Function complexity
  - Code duplication
  - Documentation completeness
- **Output**: Quality metrics report

### 2. Validate Security
- **Function**: `validateSecurity(sourceCode)`
- **Checks**:
  - Input validation and sanitization
  - XSS vulnerability prevention
  - SQL injection prevention
  - Proper authentication flows
  - Secure data handling
- **Output**: Security findings

### 3. Review Test Coverage
- **Function**: `reviewTestCoverage(testFiles, sourceCode)`
- **Evaluates**:
  - Code coverage percentage
  - Critical path coverage
  - Edge case coverage
  - Test quality and assertions
- **Output**: Coverage report

### 4. Validate Requirements Compliance
- **Function**: `validateRequirementsCompliance(code, requirements)`
- **Checks**:
  - FR implementation complete
  - AC satisfied
  - NFR met (performance, security)
- **Output**: Compliance matrix

### 5. Generate Review Report
- **Function**: `generateReviewReport(allFindings)`
- **Creates**: Review report with:
  - Code quality assessment
  - Security findings
  - Test coverage report
  - Requirements compliance
  - Issues grouped by severity (critical, high, medium, low)
  - Recommendations for improvement
  - Approval status (approved, needs changes, rejected)
- **Output**: `code-review.md` document

## Review Checklist
- ✅ Code follows style guide
- ✅ Functions are well-named and documented
- ✅ No security vulnerabilities
- ✅ Tests have >= 80% coverage
- ✅ All requirements addressed
- ✅ No performance regressions
- ✅ Error handling is comprehensive
- ✅ Code is ready for production

## Issue Severity Levels
| Severity | Impact | Action |
|----------|--------|--------|
| Critical | Must fix before merge | Blocks approval |
| High | Should fix | Requires review response |
| Medium | Nice to have | Can approve with note |
| Low | Future improvement | Documentation only |

## Success Indicators
✅ Code quality assessed  
✅ Security validated  
✅ Test coverage verified  
✅ Requirements compliance confirmed  
✅ Review report generated  
✅ Approval decision made  
