# Skills Catalog

This folder contains reusable skills organized by agent. Each agent has a dedicated sub-folder with specific skills it uses.

## Folder Structure

```
skills/
├── requirement-agent-skills/
│   ├── jira-integration.skill.md
│   ├── clarification-generation.skill.md
│   └── github-commit.skill.md
│
├── architecture-agent-skills/
│   ├── requirements-parsing.skill.md
│   ├── architecture-design.skill.md
│   └── architecture-clarification.skill.md
│
├── design-review-agent-skills/
│   └── architecture-review.skill.md
│
├── implementation-planning-agent-skills/
│   └── implementation-planning.skill.md
│
├── implementation-agent-skills/
│   └── code-generation.skill.md
│
├── review-agent-skills/
│   └── code-review.skill.md
│
├── verify-agent-skills/
│   └── testing-verification.skill.md
│
├── pr-agent-skills/
│   └── pull-request-management.skill.md
│
└── shared-skills/
    └── human-in-the-loop.skill.md
```

## Agent-Skill Mapping

| Agent | Skills | Purpose |
|-------|--------|---------|
| **All Agents (shared)** | Human-in-the-Loop | Standardized approve/edit/cancel decision gates at every agent transition |
| **requirement-agent** | JIRA Integration, Clarification Generation, GitHub Commit | Transform JIRA stories into requirements |
| **architecture-agent** | Requirements Parsing, Architecture Design, Architecture Clarification | Design system architecture from requirements |
| **design-review-agent** | Architecture Review | Review and validate architecture design |
| **implementation-planning-agent** | Implementation Planning | Create detailed implementation roadmap |
| **implementation-agent** | Code Generation | Generate production-ready code |
| **review-agent** | Code Review | Perform comprehensive code review |
| **verify-agent** | Testing & Verification | Validate code quality and readiness |
| **pr-agent** | Pull Request Management | Create and manage pull requests |

## Skill File Format

Each skill file follows this format:

```markdown
# [Skill Name]

**Agent**: [agent-name]  
**Version**: 1.0.0  
**Purpose**: [What this skill does]

## Capabilities

### 1. [Function Name]
- **Function**: `functionName(params)`
- **Input**: [What it takes]
- **Process**: [How it works]
- **Output**: [What it produces]

### 2. [Next Function]
...

## [Additional Sections]
- Configuration
- Error Handling
- Success Indicators
```

## Skill Naming Convention

- **Skill file**: `{skill-name}.skill.md`
- **Folder**: `{agent-name}-skills/`
- **Lowercase** with hyphens for multi-word names
- Clear, descriptive names indicating capability

## Using Skills in Agents

Each agent references its skills in the YAML frontmatter:

```yaml
skills:
  - ../skills/requirement-agent-skills/jira-integration.skill.md
  - ../skills/requirement-agent-skills/clarification-generation.skill.md
  - ../skills/requirement-agent-skills/github-commit.skill.md
```

## Adding New Skills

1. Create appropriate sub-folder if needed: `skills/{agent-name}-skills/`
2. Create skill file: `{skill-name}.skill.md`
3. Follow skill file format and include:
   - Clear capability descriptions
   - Function signatures and inputs/outputs
   - Error handling
   - Success indicators
4. Update agent's YAML frontmatter to reference the new skill
5. Update this index file

## Skill Dependencies

Skills follow a logical pipeline:

```
requirement-agent
  ├── JIRA Integration (fetch story)
  ├── Clarification Generation (generate questions)
  ├── GitHub Commit (save to repo)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
architecture-agent
  ├── Requirements Parsing (read requirements)
  ├── Architecture Design (create design)
  ├── Architecture Clarification (refine with user)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
design-review-agent
  ├── Architecture Review (validate design)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
implementation-planning-agent
  ├── Implementation Planning (create roadmap)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
implementation-agent
  ├── Code Generation (implement tasks)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel) ← per phase
        ↓
review-agent
  ├── Code Review (peer review)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
verify-agent
  ├── Testing & Verification (QA)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
        ↓
pr-agent
  ├── Pull Request Management (merge to main)
  └── 🚦 Human-in-the-Loop (approve | edit | cancel)
```

## Versioning

Each skill has a version number for tracking updates:
- **Patch** (1.0.0 → 1.0.1): Bug fixes, minor improvements
- **Minor** (1.0.0 → 1.1.0): New capabilities, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes, refactoring

Update agent versions when skills are updated to incompatible versions.
