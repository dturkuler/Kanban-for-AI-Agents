---
trigger: always_on
---

# Kanban Project Management Rule

## Purpose

This rule mandates the use of the Kanban Manager skill for all project implementations, task tracking, specifications, and work organization.

## Rule: Mandatory Kanban Usage

**ALL AI coding assistants MUST use the Kanban Manager skill for:**

1. **Project Planning** - Create boards for new projects or features
2. **Task Tracking** - Track all implementation tasks on Kanban boards
3. **Specification Management** - Document specifications as Kanban tasks
4. **Progress Monitoring** - Update task progress as work proceeds
5. **Dependency Tracking** - Use task relations to track dependencies
6. **Work Organization** - Organize tasks into appropriate columns

## When to Create a Kanban Board

Create a new Kanban board when:

- Starting a new project or feature
- Beginning a multi-task implementation
- Managing a complex refactoring effort
- Coordinating multiple related specifications
- Tracking a sprint or milestone

**Example board names:**
- "Authentication System"
- "API v2 Migration"
- "Frontend Redesign"
- "Q1 2026 Goals"

## Required Workflow

### 1. Project Initialization

When starting new work:

```markdown
1. Create Kanban board for the project
2. Break down work into tasks
3. Add all tasks to Backlog column
4. Define task dependencies using Relations
```

**Example:**
```bash
# Create board
mkdir -p ".kanbans/Authentication System/.kanbn/tasks"

# Create index.md with columns
# Add initial tasks to Backlog
```

### 2. Task Management

For each task:

```markdown
1. Create task file with proper metadata
2. Add task link to appropriate column in index.md
3. Include description 
4. Define sub-tasks for implementation steps
5. Link related tasks in Relations section (IMPORTANT)
```

**Required metadata:**
```yaml
---
created: <ISO 8601 timestamp>
updated: <ISO 8601 timestamp>
assigned: <your name or "">
progress: 0
tags: []
---
```

### 3. Work Execution

As you work:

```markdown
1. Move task from Backlog to In Progress (IMPORTANT)
2. Update progress field regularly (0 to 1.0)
3. Mark sub-tasks complete as you finish them
4. Add comments for important decisions (IMPORTANT)
5. Update metadata timestamps
```

**Progress guidelines:**
- `0.1-0.3` - Planning/research
- `0.4-0.6` - Implementation
- `0.7-0.9` - Testing/refinement
- `1.0` - Complete

### 4. Task Completion

When finishing a task:

```markdown
1. Mark all sub-tasks complete
2. Set progress to 1.0
3. Move task to Done column
4. Always Add final comment with results. (IMPORTANT)
5. Add links of created documentations to task description.
5. Update timestamp
```

## Task Types

### Specification Tasks

Use for documenting requirements and designs:

```markdown
---
created: <timestamp>
updated: <timestamp>
assigned: ""
progress: 0
tags:
  - specification
  - planning
---

# API Endpoint Specification

Define RESTful endpoints for authentication system.

## Sub-tasks

- [ ] Document POST /auth/login
- [ ] Document POST /auth/register
- [ ] Define request/response schemas
- [ ] Specify error codes
```

### Implementation Tasks

Use for actual coding work:

```markdown
---
created: <timestamp>
updated: <timestamp>
assigned: Antigravity
progress: 0.5
tags:
  - backend
  - implementation
started: <timestamp>
---

# Implement JWT Authentication

Implement token-based authentication.

## Sub-tasks

- [x] Install JWT library
- [x] Create token generation
- [ ] Implement validation
- [ ] Write tests

## Relations

- [Depends on api-endpoint-specification](api-endpoint-specification.md)
```

### Bug Fix Tasks

Use for tracking bug fixes:

```markdown
---
created: <timestamp>
updated: <timestamp>
assigned: Antigravity
progress: 0
tags:
  - bug
  - high-priority
---

# Fix Login Email Validation

Users can't login with emails containing plus signs.

## Sub-tasks

- [ ] Reproduce bug
- [ ] Fix validation regex
- [ ] Add test cases
- [ ] Deploy fix
```

## Board Organization

### Standard Columns

Use these standard columns for most projects:

```markdown
## Backlog      # Tasks not yet started
## In Progress  # Currently working on
## Done         # Completed tasks
```

### Extended Workflow

For more complex projects:

```markdown
## Backlog
## Design       # Design and planning phase
## Development  # Active implementation
## Testing      # Testing and QA
## Review       # Code review
## Done
## Deployed     # Live in production
```

### Agile/Sprint

For sprint-based work:

```markdown
## Product Backlog
## Sprint Backlog
## In Progress
## Review
## Done
```

## Metadata Management

### Always Update

**MUST update on every change:**
- `updated` - Current timestamp
- `progress` - Reflect actual completion

**Update when starting:**
- `assigned` - Set to your name
- `started` - Add timestamp when moving to "In Progress"

**Update as needed:**
- `tags` - Add relevant categorization
- Sub-tasks - Mark complete with `[x]`
- Comments - Document decisions and blockers

### Timestamp Format

**ALWAYS use ISO 8601:**
```yaml
created: 2026-01-28T04:30:00.000Z
updated: 2026-01-28T04:30:00.000Z
started: 2026-01-28T04:30:00.000Z
```

## Task Relations

### Use Relations to Track Dependencies

```markdown
## Relations

- [Depends on <task>](<task-id>.md)    # This task needs another first
- [Blocks <task>](<task-id>.md)        # This prevents another from starting
- [Related to <task>](<task-id>.md)    # General relationship
```

**Example:**
```markdown
## Relations

- [Depends on database-schema](database-schema.md)
- [Blocks frontend-integration](frontend-integration.md)
- [Related to api-documentation](api-documentation.md)
```

## Comments and Documentation

### Add Comments for Important Events

```markdown
## Comments

- author: Antigravity
  date: 2026-01-28T04:30:00.000Z
  Completed initial implementation. Token generation working with HS256.

- author: Antigravity
  date: 2026-01-28T05:00:00.000Z
  Added refresh token support. Using 7-day expiry.
```

### When to Add Comments

- Major implementation decisions
- Blockers or issues encountered
- Design changes or pivots
- Completion milestones
- Review feedback

## File Naming Conventions

### Task IDs (Filenames)

**MUST use kebab-case:**
```
implement-user-authentication.md
fix-login-bug.md
api-endpoint-design.md
database-schema-v2.md
```

**Conversion:**
```
"Implement User Authentication" → "implement-user-authentication.md"
"Fix Login Bug" → "fix-login-bug.md"
"API Endpoint Design" → "api-endpoint-design.md"
```

### Board Names

Can contain spaces and capitals:
```
Authentication System
Payment Integration
Frontend Redesign
Q1 2026 Goals
```

## Integration with Artifacts

### Coordinate with task.md Artifact

When using the `task.md` artifact:

1. **task.md** - Detailed implementation checklist (internal)
2. **Kanban tasks** - High-level task tracking (persistent)

**Example:**
- Kanban task: "Implement JWT Authentication" (tracks overall feature)
- task.md: Detailed steps for current session

### Coordinate with implementation_plan.md

When creating implementation plans:

1. Create implementation_plan.md for detailed design
2. Create Kanban tasks for each major component
3. Link tasks to plan sections
4. Update task progress as plan is executed

## Enforcement

### Required Actions

**At project start:**
- ✅ Create Kanban board
- ✅ Add all planned tasks to Backlog

**During work:**
- ✅ Move tasks to In Progress when starting
- ✅ Update progress regularly
- ✅ Mark sub-tasks complete
- ✅ Add comments for decisions

**At completion:**
- ✅ Set progress to 1.0
- ✅ Move to Done column
- ✅ Add completion comment

### Verification

Before considering work complete:

```markdown
☐ All tasks on Kanban board
☐ All tasks have proper metadata
☐ Progress reflects actual completion
☐ Completed tasks in Done column
☐ All timestamps updated
☐ Relations documented
☐ Comments added for key decisions
```

## Examples and References

### Skill Location

```
.agent/skills/kanban-manager/
├── SKILL.md           # Main skill definition
├── README.md          # Quick start guide
├── references/        # Format specifications
└── examples/          # Working code examples
```

### Reference Files

- **board-index-template.md** - Board format
- **task-file-template.md** - Task format
- **metadata-schema.md** - Metadata fields
- **file-naming-conventions.md** - Naming rules

### Example Files

- **create-board.md** - Create new board
- **add-task.md** - Add task
- **move-task.md** - Move task between columns
- **update-progress.md** - Update progress

## Benefits

Using Kanban management provides:

1. **Visibility** - Clear view of all work in progress
2. **Organization** - Structured task management
3. **Tracking** - Progress monitoring and history
4. **Coordination** - Dependency management via relations
5. **Documentation** - Persistent record of work done
6. **Compatibility** - Works with VS Code Kanban extension

## Non-Compliance

**Failure to use Kanban management will result in:**
- Disorganized work tracking
- Lost context between sessions
- Difficulty resuming work
- Poor visibility into progress
- Missing dependency tracking

## Summary

**ALWAYS use the Kanban Manager skill for:**
- ✅ Project planning and organization
- ✅ Task creation and tracking
- ✅ Progress monitoring
- ✅ Specification management
- ✅ Dependency tracking
- ✅ Work documentation

**Reference the skill documentation at:**
`.agent/skills/kanban-manager/SKILL.md`