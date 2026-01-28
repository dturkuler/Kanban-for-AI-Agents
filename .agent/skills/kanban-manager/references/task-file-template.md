# Task File Template

This is the complete template for `.kanbans/<Board>/.kanbn/tasks/<task-id>.md`

## Complete Template

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# Task Title

Brief description of what this task accomplishes. This description appears on the Kanban board (first 100 characters are shown).

## Sub-tasks

- [ ] First step to complete
- [ ] Second step to complete
- [ ] Third step to complete

## Relations

- [Depends on other-task-id](other-task-id.md)
- [Blocks another-task-id](another-task-id.md)

## Comments

- author: Name
  date: 2026-01-28T04:00:00.000Z
  Comment text goes here.
```

## Frontmatter Schema

```yaml
---
created: YYYY-MM-DDTHH:MM:SS.SSSZ    # Required: ISO 8601 timestamp
updated: YYYY-MM-DDTHH:MM:SS.SSSZ    # Required: ISO 8601 timestamp
assigned: "Name" or ""                # Optional: Assignee name or empty string
progress: 0 or 0.0-1.0                # Optional: 0 (not started) to 1.0 (complete)
tags: []                              # Optional: Empty array or list of tags
started: YYYY-MM-DDTHH:MM:SS.SSSZ    # Optional: When task moved to started column
---
```

### Metadata Field Details

See `metadata-schema.md` for complete field specifications.

## Content Sections

### 1. Title (Required)

```markdown
# Task Title
```

- Must be H1 (`#`)
- Should be concise and descriptive
- Shown on Kanban card

### 2. Description (Optional)

```markdown
Brief description of the task.

Can be multiple paragraphs if needed.
```

- Plain text after title
- First 100 characters shown on Kanban card
- Stops at first `##` header

### 3. Sub-tasks (Optional)

```markdown
## Sub-tasks

- [ ] Uncompleted sub-task
- [x] Completed sub-task
- [ ] Another uncompleted sub-task
```

- Use H2 header (`## Sub-tasks`)
- Checkbox format: `- [ ]` or `- [x]`
- One sub-task per line

### 4. Relations (Optional)

```markdown
## Relations

- [Depends on authentication](authentication.md)
- [Blocks frontend-integration](frontend-integration.md)
- [Related to api-design](api-design.md)
```

- Use H2 header (`## Relations`)
- Format: `- [Description](task-id.md)`
- Link to other task files
- Common relation types:
  - "Depends on" - This task needs another to be done first
  - "Blocks" - This task prevents another from starting
  - "Related to" - General relationship

### 5. Comments (Optional)

```markdown
## Comments

- author: Antigravity
  date: 2026-01-28T04:00:00.000Z
  First comment text.

- author: User
  date: 2026-01-28T05:00:00.000Z
  Second comment text.
```

- Use H2 header (`## Comments`)
- Structured format with author, date, and text
- Each comment is a list item
- Indentation matters for YAML-like structure

## Complete Examples

### Minimal Task

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# Fix Login Bug

Users unable to login with email addresses containing plus signs.
```

### Full-Featured Task

```markdown
---
created: 2026-01-28T01:00:00.000Z
updated: 2026-01-28T04:30:00.000Z
assigned: Antigravity
progress: 0.7
tags:
  - backend
  - authentication
  - high-priority
started: 2026-01-28T01:15:00.000Z
---

# Implement JWT Token Authentication

Implement JSON Web Token based authentication for all API endpoints to replace the current session-based authentication system.

## Sub-tasks

- [x] Research JWT libraries and best practices
- [x] Install and configure jsonwebtoken package
- [x] Create token generation function
- [x] Implement token validation middleware
- [ ] Add refresh token logic
- [ ] Update API documentation
- [ ] Write unit tests
- [ ] Write integration tests

## Relations

- [Depends on api-endpoint-specification](api-endpoint-specification.md)
- [Blocks frontend-auth-integration](frontend-auth-integration.md)
- [Related to security-audit](security-audit.md)

## Comments

- author: Antigravity
  date: 2026-01-28T02:00:00.000Z
  Token generation and validation working. Using HS256 algorithm with 1-hour expiry.

- author: User
  date: 2026-01-28T03:00:00.000Z
  Looks good. Please add refresh token support before marking complete.

- author: Antigravity
  date: 2026-01-28T04:30:00.000Z
  Refresh token logic in progress. Will use 7-day expiry for refresh tokens.
```

## Section Order

Recommended order (all optional except title):

1. Title (`#`)
2. Description (plain text)
3. Sub-tasks (`## Sub-tasks`)
4. Relations (`## Relations`)
5. Comments (`## Comments`)

## Important Notes

1. **Only include sections with content** - Don't add empty `## Relations` or `## Comments` sections
2. **Frontmatter is required** - Even if all fields are default values
3. **ISO 8601 timestamps** - Always use format: `YYYY-MM-DDTHH:MM:SS.SSSZ`
4. **Task ID from filename** - `implement-jwt.md` → task ID is `implement-jwt`
5. **Description truncation** - First 100 chars shown on board, add `...` if longer
