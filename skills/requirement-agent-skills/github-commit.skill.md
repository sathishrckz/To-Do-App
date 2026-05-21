# GitHub Commit Skill

**Agent**: requirement-agent  
**Version**: 1.0.0  
**Purpose**: Generate and commit requirements documents to GitHub

## Capabilities

### 1. Generate Requirements Document
- **Function**: `generateRequirementsDocument(synthesizedRequirements)`
- **Input**: Synthesized requirements from clarifications
- **Process**:
  - Create markdown document structure
  - Populate all requirement sections
  - Format acceptance criteria as checkboxes
  - Add metadata (timestamp, issue link)
- **Output**: `requirements.md` content

### 2. Document Structure
```markdown
# Requirements: [ISSUE_KEY] - [SUMMARY]

## Story Summary
[Original story description]

## Functional Requirements
- FR-001: [Requirement]
- FR-002: [Requirement]

## Non-Functional Requirements
- Performance: [Targets]
- Security: [Measures]
- Scalability: [Strategy]

## User Personas & Workflows
- [Persona details]

## Acceptance Criteria
- [ ] AC-001
- [ ] AC-002

## Data & Integrations
- [External systems]

## Edge Cases & Error Handling
- [Boundary conditions]

## Assumptions & Constraints
- [Project constraints]

## Dependencies
- [Blocking issues]
```

### 3. Validate Git Repository
- **Function**: `validateGitRepository()`
- **Checks**:
  - .git directory exists
  - Remote origin is configured
  - GITHUB_TOKEN has push permissions
  - No uncommitted changes in working directory
- **Output**: Boolean with error details

### 4. Commit to GitHub
- **Function**: `commitToGithub(requirementsContent)`
- **Process**:
  - Stage requirements.md
  - Create commit with conventional message format
  - Push to configured branch
  - Return commit hash
- **Commit Message Format**:
  ```
  docs(requirements): Add requirements for [ISSUE_KEY]: [SUMMARY]
  
  - Extracted from JIRA user story
  - Clarified with user interactions
  - Acceptance criteria documented
  - Edge cases identified
  ```

### 5. Conflict Resolution
- **Function**: `handleMergeConflicts()`
- **When**: Branch is behind upstream
- **Process**:
  - Attempt rebase
  - Flag conflicts for user
  - Provide merge suggestions
  - Allow manual resolution

## Environment Variables Required
```env
GITHUB_REPO=<REPO_URL>
GITHUB_BRANCH=main
GITHUB_TOKEN=<PERSONAL_ACCESS_TOKEN>
GITHUB_USER_NAME=<YOUR_NAME>
GITHUB_USER_EMAIL=<YOUR_EMAIL>
```

## Success Indicators
✅ requirements.md created successfully  
✅ Document contains all required sections  
✅ Committed to GitHub  
✅ Commit hash returned  
✅ No merge conflicts  
