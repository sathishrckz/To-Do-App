# Human-in-the-Loop (HITL) Decision Gate Skill

**Agent**: All Agents (Shared)  
**Version**: 1.0.0  
**Purpose**: Standardized human approval/edit/cancel gate between agent steps and agent-to-agent transitions

## Overview

Every agent in the pipeline MUST pause at designated decision gates and present the user with exactly three options before proceeding. This ensures human oversight, allows mid-pipeline corrections, and supports graceful cancellation.

## Decision Gate Contract

At every gate, present the following to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚦 DECISION GATE: [Gate Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Summary of completed work:
[Brief summary of what was just produced]

📄 Artifact(s) ready:
[List of files/outputs generated]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Choose an action:

  ✅ approve  → Accept output and proceed to next step/agent
  ✏️  edit     → Provide change instructions (agent will revise and re-present)
  ❌ cancel   → Stop pipeline gracefully (progress is saved)

Your decision: 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Capabilities

### 1. Present Decision Gate
- **Function**: `presentDecisionGate(gateName, summary, artifacts)`
- **Input**: Gate name, work summary, list of artifacts produced
- **Process**:
  - Display formatted gate prompt (as above)
  - Wait for user response
  - Parse response into action type
- **Output**: User decision (`approve`, `edit`, or `cancel`)

### 2. Handle Approve
- **Function**: `handleApprove(gateName)`
- **Process**:
  - Log approval in `outputs/pipeline-status.md`
  - Record timestamp and gate name
  - Proceed to next step or hand off to next agent
- **Output**: Continuation signal

### 3. Handle Edit
- **Function**: `handleEdit(gateName, editInstructions)`
- **Input**: User's edit instructions (free text)
- **Process**:
  - Parse edit instructions
  - Apply requested changes to the current artifact(s)
  - Show diff/summary of changes made
  - Re-present the same decision gate with updated output
  - Loop until user approves or cancels
- **Output**: Revised artifact(s) + re-presented gate
- **Max Iterations**: 5 edit cycles per gate (then ask user to approve or cancel)

### 4. Handle Cancel
- **Function**: `handleCancel(gateName, reason)`
- **Input**: Optional cancellation reason from user
- **Process**:
  1. **Persist Progress**: Do NOT delete any generated artifacts
  2. **Update Pipeline Status**: Write to `outputs/pipeline-status.md`:
     ```markdown
     ## Pipeline Status: CANCELLED
     
     | Field | Value |
     |-------|-------|
     | **Status** | ❌ CANCELLED |
     | **Cancelled At** | [Agent Name] → [Gate Name] |
     | **Timestamp** | [ISO 8601 timestamp] |
     | **Reason** | [User-provided reason or "No reason provided"] |
     | **Last Completed Step** | [Previous successful step] |
     | **Artifacts Saved** | [List of files persisted] |
     | **Resume Action** | [Exact command/step to resume from] |
     ```
  3. **Exit Gracefully**: Stop execution, do not invoke next agent
  4. **Inform User**: Confirm cancellation with saved state summary
- **Output**: Cancellation confirmation message

### 5. Track Pipeline Progress
- **Function**: `updatePipelineStatus(agentName, gateName, decision, timestamp)`
- **Process**:
  - Append entry to `outputs/pipeline-status.md`
  - Maintain full audit trail of all decisions
- **Output**: Updated status file

## Gate Placement Rules

### Inter-Agent Gates (MANDATORY)
Every agent MUST have a final decision gate before:
- Committing artifacts to git
- Handing off to the next agent in the pipeline

### Intra-Agent Gates (RECOMMENDED)
Agents with multiple phases SHOULD have gates after:
- Major artifact generation (e.g., document drafts)
- Significant decision points
- Before irreversible actions (commits, API calls)

## Pipeline Status File Format

File: `outputs/pipeline-status.md`

```markdown
# Pipeline Execution Log

## Current Status: [IN_PROGRESS | COMPLETED | CANCELLED | PAUSED]

## Decision History

| # | Timestamp | Agent | Gate | Decision | Notes |
|---|-----------|-------|------|----------|-------|
| 1 | 2026-05-21T10:00:00Z | requirement-agent | Final Output Review | ✅ approve | — |
| 2 | 2026-05-21T11:30:00Z | architecture-agent | Architecture Draft | ✏️ edit | "Add caching layer" |
| 3 | 2026-05-21T11:45:00Z | architecture-agent | Architecture Draft | ✅ approve | After edit |
| 4 | 2026-05-21T12:00:00Z | design-review-agent | Review Complete | ❌ cancel | "Need to revisit requirements" |

## Saved Artifacts
- outputs/requirements.md ✅
- outputs/architecture.md ✅
- outputs/architecture-review.md (partial)

## Resume Instructions
To resume pipeline: Run `design-review-agent` from Step 1
```

## Error Handling

- **Invalid Response**: If user response doesn't match `approve`, `edit`, or `cancel`, re-prompt with clarification
- **Edit Without Instructions**: Ask user "What changes would you like?" before proceeding
- **Timeout**: If no response after extended period, mark as `PAUSED` in pipeline status
- **System Error During Edit**: Save current state, inform user, allow retry

## Integration with Agents

Each agent references this skill in its YAML frontmatter:

```yaml
skills:
  - ../skills/shared-skills/human-in-the-loop.skill.md
```

## Success Indicators

✅ Every agent transition requires explicit human approval  
✅ Users can edit artifacts before they are finalized  
✅ Cancellation preserves all progress  
✅ Full audit trail maintained in pipeline-status.md  
✅ Pipeline is resumable after cancel  
✅ No irreversible action happens without approval  

