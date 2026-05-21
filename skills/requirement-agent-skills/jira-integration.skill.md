# JIRA Integration Skill

**Agent**: requirement-agent  
**Version**: 1.0.0  
**Purpose**: Handle JIRA API integration for fetching user stories and issue details

## Capabilities

### 1. Fetch JIRA Issue
- **Function**: `fetchJiraIssue(issueKey)`
- **Input**: Issue key in format `[A-Z]+-\d+` (e.g., `EPMCDMETST-43701`)
- **Process**:
  - Validate issue key format using regex
  - Call JIRA REST API with Bearer token authentication
  - Parse response JSON
  - Handle HTTP error codes (401, 403, 404, 429)
- **Output**: 
  ```json
  {
    "issueKey": "EPMCDMETST-43701",
    "summary": "Create user registration form",
    "description": "As a user, I want to...",
    "issueType": "Story",
    "priority": "High",
    "acceptanceCriteria": ["AC1", "AC2"],
    "attachments": [],
    "customFields": {}
  }
  ```

### 2. Validate JIRA Connectivity
- **Function**: `validateJiraConnection()`
- **Checks**:
  - JIRA_URL is accessible
  - JIRA_TOKEN is valid
  - User has read permissions
- **Output**: Boolean success/error message

### 3. Parse Issue Content
- **Function**: `parseIssueContent(issue)`
- **Extracts**:
  - Summary and description
  - Acceptance criteria from custom fields
  - Attachments and linked issues
  - Custom fields (if any)
- **Output**: Structured issue object

## Environment Variables Required
```env
JIRA_URL=https://jiraeu.epam.com
JIRA_TOKEN=<BEARER_TOKEN>
JIRA_PROJECT_KEY=EPMCDMETST
```

## Error Handling
| Error Code | Meaning | Action |
|-----------|---------|--------|
| 401 | Unauthorized | Verify JIRA_TOKEN |
| 403 | Forbidden | Check token permissions |
| 404 | Not Found | Validate issue key exists |
| 429 | Rate Limited | Retry with backoff |

## Dependencies
- JIRA REST API v3
- HTTP client library
- Bearer token authentication

## Success Indicators
✅ Issue fetched successfully  
✅ All fields parsed correctly  
✅ Metadata extracted  
✅ Attachments linked  
