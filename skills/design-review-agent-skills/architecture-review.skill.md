# Architecture Review Skill

**Agent**: design-review-agent  
**Version**: 1.0.0  
**Purpose**: Conduct comprehensive design review of system architecture

## Capabilities

### 1. Analyze Architecture Document
- **Function**: `analyzeArchitecture(architecturePath)`
- **Input**: Path to `architecture.md`
- **Extracts**:
  - All architectural decisions
  - Technology choices and rationale
  - Component definitions
  - Data flow strategies
  - Security approaches
  - Performance assumptions
  - Deployment strategy
- **Output**: Architecture baseline document

### 2. Identify Risks
- **Function**: `identifyRisks(architecture)`
- **Risk Categories**:
  - Technical risks (complexity, performance, scalability)
  - Security risks (authentication, data protection, injection attacks)
  - Operational risks (deployment, monitoring, recovery)
  - Team risks (skill gaps, maintainability)
- **Output**: Risk register with severity levels

### 3. Validate Requirements Alignment
- **Function**: `validateRequirementsAlignment(architecture, requirements)`
- **Checks**:
  - Every FR is addressable
  - Every NFR constraint satisfied
  - Technology choices support requirements
  - Performance targets are achievable
- **Output**: Alignment report with gaps

### 4. Check Architecture Consistency
- **Function**: `checkConsistency(architecture)`
- **Validates**:
  - No contradictory components
  - Data flows are consistent
  - Technology stack choices align
  - No isolated components
- **Output**: Consistency report

### 5. Generate Review Report
- **Function**: `generateReviewReport(analysisResults)`
- **Creates**: `architecture-review.md` with:
  - Executive summary
  - Identified risks and mitigations
  - Requirement alignment assessment
  - Design consistency findings
  - Recommendations for improvement
  - Approval/Conditional approval/Rejection status
- **Output**: Review report document

## Review Checklist
- ✅ All requirements addressed
- ✅ No critical security gaps
- ✅ Technology stack is appropriate
- ✅ Performance targets achievable
- ✅ Scalability strategy defined
- ✅ Deployment approach feasible
- ✅ Risks are mitigated
- ✅ Team can execute design

## Success Indicators
✅ Architecture thoroughly analyzed  
✅ Risks identified and prioritized  
✅ Requirements alignment validated  
✅ Review report generated  
✅ Approval decision made  
