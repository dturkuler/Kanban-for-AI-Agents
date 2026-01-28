# File Naming Conventions

Rules and guidelines for naming boards, tasks, and files in the Kanban system.

## Board Names

### Directory Name Format

```
.kanbans/<Board Name>/
```

**Rules:**
- Can contain spaces
- Can contain letters, numbers, spaces, hyphens, underscores
- Should be descriptive and meaningful
- Must match the H1 title in `index.md`

**Examples:**
- ✅ `Authentication System`
- ✅ `Project Alpha`
- ✅ `Backend API v2`
- ✅ `Q1-2026-Goals`
- ❌ `auth@system` (special characters)
- ❌ `project/alpha` (forward slash)

### Board Title in index.md

```markdown
# Board Name
```

**Rules:**
- Must match the directory name exactly
- Use H1 header (`#`)
- First line after frontmatter

**Example:**
```
Directory: .kanbans/Authentication System/
index.md:  # Authentication System
           ↑ Must match
```

## Task IDs (Filenames)

### Format

```
<task-id>.md
```

**Rules:**
- Lowercase only
- Use hyphens for spaces (kebab-case)
- Letters, numbers, and hyphens only
- No special characters
- Should be descriptive but concise
- Derived from task title

**Conversion Examples:**

| Task Title | Task ID (Filename) |
|------------|-------------------|
| Implement User Authentication | `implement-user-authentication.md` |
| Fix Login Bug | `fix-login-bug.md` |
| API Endpoint Design | `api-endpoint-design.md` |
| Database Schema v2 | `database-schema-v2.md` |
| Update README | `update-readme.md` |

### Generation Algorithm

```
1. Take task title
2. Convert to lowercase
3. Replace spaces with hyphens
4. Remove special characters (keep letters, numbers, hyphens)
5. Remove leading/trailing hyphens
6. Add .md extension
```

**Examples:**

```
"Implement OAuth 2.0" 
  → "implement oauth 2.0"
  → "implement-oauth-2.0"
  → "implement-oauth-2-0"
  → "implement-oauth-2-0.md"

"Fix: Login button not working!"
  → "fix: login button not working!"
  → "fix-login-button-not-working"
  → "fix-login-button-not-working.md"

"[URGENT] Database Migration"
  → "urgent database migration"
  → "urgent-database-migration"
  → "urgent-database-migration.md"
```

### Validation

**Valid:**
- ✅ `implement-jwt-tokens.md`
- ✅ `fix-bug-123.md`
- ✅ `api-v2-design.md`
- ✅ `update-readme.md`

**Invalid:**
- ❌ `Implement JWT.md` (uppercase)
- ❌ `fix bug.md` (space instead of hyphen)
- ❌ `api_design.md` (underscore instead of hyphen)
- ❌ `urgent!.md` (special character)
- ❌ `task@123.md` (special character)

## Task Links in index.md

### Format

```markdown
- [Task Title](tasks/task-id.md)
```

**Rules:**
- Link text is the task title (can have spaces, capitals)
- Link path is relative from `.kanbn/` directory
- Always starts with `tasks/`
- Filename is the task ID

**Examples:**

```markdown
- [Implement User Authentication](tasks/implement-user-authentication.md)
- [Fix Login Bug](tasks/fix-login-bug.md)
- [API Endpoint Design](tasks/api-endpoint-design.md)
```

### Link Text vs Filename

| Link Text (Display) | Filename (Path) |
|---------------------|-----------------|
| Implement User Authentication | `tasks/implement-user-authentication.md` |
| Fix Login Bug | `tasks/fix-login-bug.md` |
| API Endpoint Design | `tasks/api-endpoint-design.md` |

## Column Names

### Format

```markdown
## Column Name
```

**Rules:**
- Can contain spaces
- Can contain letters, numbers, spaces
- Use title case for readability
- Should be concise
- Common names: Backlog, In Progress, Done

**Examples:**
- ✅ `Backlog`
- ✅ `In Progress`
- ✅ `Done`
- ✅ `Needs Review`
- ✅ `Testing`
- ✅ `Deployed`
- ❌ `in-progress` (use spaces, not hyphens)
- ❌ `DONE` (use title case)

## Relation Links

### Format in Task Files

```markdown
- [Relation Description](task-id.md)
```

**Rules:**
- Link text describes the relationship
- Link path is just the task ID filename (no `tasks/` prefix)
- Must reference an existing task

**Examples:**

```markdown
## Relations

- [Depends on authentication-system](authentication-system.md)
- [Blocks frontend-integration](frontend-integration.md)
- [Related to api-design](api-design.md)
```

## Complete Example

### Directory Structure

```
.kanbans/
└── Authentication System/
    └── .kanbn/
        ├── index.md
        └── tasks/
            ├── implement-jwt-tokens.md
            ├── user-registration-flow.md
            ├── password-reset-feature.md
            └── api-endpoint-design.md
```

### index.md

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# Authentication System

## Backlog

- [API Endpoint Design](tasks/api-endpoint-design.md)

## In Progress

- [Implement JWT Tokens](tasks/implement-jwt-tokens.md)
- [User Registration Flow](tasks/user-registration-flow.md)

## Done

- [Password Reset Feature](tasks/password-reset-feature.md)
```

### Task File: `implement-jwt-tokens.md`

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 0.5
tags:
  - backend
  - authentication
---

# Implement JWT Tokens

Implement JSON Web Token authentication for API endpoints.

## Relations

- [Depends on api-endpoint-design](api-endpoint-design.md)
- [Blocks user-registration-flow](user-registration-flow.md)
```

## Best Practices

### Task ID Naming

1. **Be descriptive** - `implement-user-auth` better than `task-1`
2. **Keep it concise** - `fix-login-bug` better than `fix-the-bug-where-users-cannot-login`
3. **Use prefixes for organization**:
   - `feat-` for features: `feat-oauth-integration`
   - `fix-` for bugs: `fix-login-timeout`
   - `docs-` for documentation: `docs-api-reference`
   - `test-` for testing: `test-integration-suite`

### Board Naming

1. **Use project/feature names** - `Authentication System`, `Payment Integration`
2. **Include version if needed** - `API v2`, `Frontend Redesign 2026`
3. **Use meaningful names** - `Q1 Goals` better than `Board 1`

### Column Naming

1. **Use standard names when possible** - Backlog, In Progress, Done
2. **Match your workflow** - Design, Development, Testing, Deployed
3. **Keep names short** - `Review` better than `Needs Code Review`

## Troubleshooting

**Problem:** Task not showing in VS Code extension

**Check:**
1. Filename is lowercase kebab-case
2. File is in `.kanbn/tasks/` directory
3. Link in `index.md` matches filename
4. Link uses correct format: `- [Title](tasks/filename.md)`

**Problem:** Board not loading

**Check:**
1. Board directory name matches H1 in `index.md`
2. `index.md` has valid YAML frontmatter
3. All column headers are H2 (`##`)
