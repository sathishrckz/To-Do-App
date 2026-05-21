# Implementation Planning Skill

**Agent**: implementation-planning-agent  
**Version**: 1.0.0  
**Purpose**: Transform approved architecture into detailed implementation plan

## Capabilities

### 1. Break Down Architecture into Tasks
- **Function**: `breakdownIntoTasks(architecture)`
- **Creates**: Granular implementation tasks
  - Task-001: Database schema design
  - Task-002: User model implementation
  - Task-003: Form component creation
  - Task-004: Validation logic
  - etc.
- **Output**: Task list with descriptions

### 2. Analyze Dependencies
- **Function**: `analyzeDependencies(tasks)`
- **Identifies**:
  - Task prerequisites
  - Blocking relationships
  - Parallelizable tasks
  - Critical path
- **Output**: Dependency graph

### 3. Sequence Tasks
- **Function**: `sequenceTasks(tasks, dependencies)`
- **Produces**: Ordered task sequence
  - Respects dependencies
  - Maximizes parallelization
  - Identifies critical path
  - Provides realistic timeline
- **Output**: Sequenced task list with effort estimates

### 4. Create Implementation Roadmap
- **Function**: `createRoadmap(sequencedTasks)`
- **Generates**: Comprehensive plan document `impl-plan.md`
  ```
  # Implementation Plan
  
  ## Phase 1: Foundation (Week 1)
  - Task-001: Database setup
  - Task-002: Backend structure
  
  ## Phase 2: Core Features (Week 2-3)
  - Task-003: User model
  - Task-004: Authentication
  
  ## Phase 3: Testing (Week 4)
  - Task-XX: Unit testing
  - Task-YY: Integration testing
  ```

### 5. Estimate Effort
- **Function**: `estimateEffort(tasks)`
- **Considers**:
  - Task complexity
  - Team skill level
  - Technology familiarity
  - Resource availability
- **Output**: T-shirt sizing (XS, S, M, L, XL) + hours

## Planning Outputs
- Task breakdown structure
- Dependency graph (Mermaid)
- Sequenced task list
- Effort estimates
- Risk factors
- Resource requirements
- Timeline projection

## Success Indicators
✅ Tasks are well-defined  
✅ Dependencies are clear  
✅ Sequence is logical  
✅ Estimates are realistic  
✅ Plan is executable  
