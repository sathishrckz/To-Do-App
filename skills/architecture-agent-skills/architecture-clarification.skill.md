# Architecture Clarification Skill

**Agent**: architecture-agent  
**Version**: 1.0.0  
**Purpose**: Engage stakeholders in interactive dialogue to finalize architectural decisions

## Capabilities

### 1. Generate Clarifying Questions
- **Function**: `generateArchitectureQuestions(proposedArchitecture)`
- **Generates** 7 targeted questions:
  1. Frontend Framework choice (Vanilla JS vs Framework)
  2. Backend Architecture (REST vs GraphQL)
  3. Database Technology (SQL vs NoSQL)
  4. State Management (Vanilla vs Library)
  5. Authentication & Authorization (JWT vs OAuth vs Session)
  6. Deployment & DevOps (AWS vs Azure vs On-Prem)
  7. Performance & Scalability (Load targets, performance budgets)
- **Output**: Question array with context

### 2. Present Questions to Stakeholder
- **Function**: `presentQuestionsToUser(questions)`
- **Format**:
  ```
  🏗️ **Architecture Analysis Complete**
  
  [Architectural proposal summary]
  
  I have clarifying questions:
  1. [Question 1 with context]
  2. [Question 2 with context]
  ...
  ```

### 3. Capture User Responses
- **Function**: `captureUserResponses(questions, userInput)`
- **Process**:
  - Parse user responses
  - Validate architectural feasibility
  - Flag conflicting decisions
  - Track decision rationale
- **Output**: User decisions map

### 4. Refine Architecture
- **Function**: `refineArchitecture(initialArchitecture, userDecisions)`
- **Process**:
  - Update component specifications
  - Adjust technology selections
  - Revise deployment strategy
  - Update diagrams and documentation
- **Output**: Refined architecture document

## Question Format Template
```
**Question [N]: [Topic]**

Current proposal: [Current approach]

Options:
- Option A: [Description] [Pros/Cons]
- Option B: [Description] [Pros/Cons]

Your preference? Any constraints?
```

## Iteration Control
- Maximum 2 clarification rounds
- Allow up to 3 follow-up questions per round
- Summarize decisions before finalizing

## Decision Tracking
```json
{
  "decision": "Use React for frontend",
  "rationale": "Need complex state management",
  "alternatives": ["Vue.js", "Vanilla JS"],
  "timestamp": "2026-05-20T10:30:00Z",
  "approved": true
}
```

## Success Indicators
✅ 7 questions generated  
✅ User responses captured  
✅ Architecture refined based on feedback  
✅ Decisions documented  
✅ Stakeholder alignment confirmed  
