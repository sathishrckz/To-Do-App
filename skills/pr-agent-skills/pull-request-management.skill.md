# Pull Request Management Skill

**Agent**: pr-agent  
**Version**: 1.0.0  
**Purpose**: Create and manage pull requests for merge to main branch

## Capabilities

### 1. Generate PR Title and Description
- **Function**: `generatePRContent(commitMessages, changes, reviewReport)`
- **Generates**:
  - Title: Short, descriptive (20-80 chars)
  - Summary: Overview of changes
  - Motivation: Why these changes
  - Type: feat, fix, docs, refactor, etc.
- **Output**: PR title and description

### 2. Create PR Body Sections
- **Function**: `createPRBody(allReports)`
- **Sections**:
  ```markdown
  # [ISSUE_KEY]: Brief Title
  
  ## Summary
  [What and why]
  
  ## Changes Made
  - [Change 1]
  - [Change 2]
  
  ## Test Evidence
  - Unit tests: ✅ Pass (X/Y)
  - Integration tests: ✅ Pass (X/Y)
  - Coverage: XX%
  
  ## Known Limitations
  - [Any limitations or TODOs]
  
  ## Related Documentation
  - Requirements: [Link]
  - Architecture: [Link]
  
  ## Reviewer Checklist
  - [ ] Code follows style guide
  - [ ] Tests are adequate
  - [ ] Requirements addressed
  - [ ] Security validated
  - [ ] Performance acceptable
  ```

### 3. Validate PR Prerequisites
- **Function**: `validatePRPrerequisites()`
- **Checks**:
  - All previous steps completed
  - Code review approved
  - Tests passing
  - No conflicts with target branch
  - Branch is up-to-date
- **Output**: Prerequisites validation report

### 4. Create Pull Request
- **Function**: `createPullRequest(prData)`
- **Process**:
  - API call to GitHub
  - Link to issue/task
  - Request reviewers
  - Add labels (bug, feature, documentation, etc.)
  - Set milestone (if applicable)
- **Output**: PR URL and number

### 5. Monitor PR Status
- **Function**: `monitorPRStatus(prNumber)`
- **Tracks**:
  - Review comments
  - Required status checks
  - Merge conflicts
  - Required approvals
- **Output**: PR status updates

### 6. Handle PR Merge
- **Function**: `mergePullRequest(prNumber)`
- **Options**:
  - Squash commits
  - Create merge commit
  - Rebase and merge
- **Process**:
  - Delete feature branch
  - Update release notes
  - Create release tag (if applicable)
- **Output**: Merge confirmation

## PR Requirements
- ✅ Title follows convention
- ✅ Description is complete
- ✅ Test evidence provided
- ✅ Related docs linked
- ✅ Code review approved
- ✅ All checks passing
- ✅ No merge conflicts

## Success Indicators
✅ PR created successfully  
✅ All checks passing  
✅ PR approved by reviewers  
✅ PR merged to main  
✅ Release tag created  
