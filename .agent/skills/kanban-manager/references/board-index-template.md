# Board Index Template

This is the complete template for `.kanbans/<Board Name>/.kanbn/index.md`

## File Structure

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# Board Name

## Backlog

## In Progress

## Done
```

## Frontmatter Schema

```yaml
---
settings:                    # Required: Board settings object
  completedColumns:          # Required: Array of column names considered "complete"
    - Done                   # List column names that represent completed work
    - Archived
  startedColumns:            # Required: Array of column names considered "in progress"
    - In Progress            # List column names that represent active work
    - Development
    - Testing
---
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `settings` | Object | Yes | Container for board configuration |
| `settings.completedColumns` | Array[String] | Yes | Column names where tasks are considered complete |
| `settings.startedColumns` | Array[String] | Yes | Column names where tasks are considered in progress |

## Column Format

Columns are defined as H2 headers (`##`) followed by task links:

```markdown
## Column Name

- [Task Title](tasks/task-id.md)
- [Another Task](tasks/another-task-id.md)
```

### Rules

1. **Column headers** must be H2 (`##`)
2. **Task links** must use format: `- [Title](tasks/filename.md)`
3. **No checkboxes** in index.md (checkboxes only in task files)
4. **Relative paths** from `.kanbn/` directory
5. **One task per line**

## Complete Example

```markdown
---
settings:
  completedColumns:
    - Done
    - Archived
  startedColumns:
    - In Progress
    - Review
---

# Authentication System

## Backlog

- [API Endpoint Design](tasks/api-endpoint-design.md)
- [Security Audit](tasks/security-audit.md)

## In Progress

- [Implement JWT Tokens](tasks/implement-jwt-tokens.md)
- [User Registration Flow](tasks/user-registration-flow.md)

## Review

- [Password Reset Feature](tasks/password-reset-feature.md)

## Done

- [Database Schema](tasks/database-schema.md)
- [User Model](tasks/user-model.md)

## Archived

- [Initial Research](tasks/initial-research.md)
```

## Custom Columns

You can create any column names you need:

```markdown
## Design
## Development  
## Testing
## Staging
## Production
## Blocked
## Needs Review
```

Just make sure to include them in `startedColumns` or `completedColumns` as appropriate.

## Board Title

The H1 title (`# Board Name`) should match the board directory name:

```
.kanbans/Authentication System/.kanbn/index.md
                ↓
# Authentication System
```

## Adding Tasks to Index

When adding a new task:

1. Create the task file first
2. Add the link to the appropriate column
3. Use the task title as link text
4. Use the filename (without .md) as the path

```markdown
## Backlog

- [Implement OAuth](tasks/implement-oauth.md)
  ↑ Link text        ↑ Relative path from .kanbn/
```
