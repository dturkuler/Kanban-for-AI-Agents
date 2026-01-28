# Metadata Schema Reference

Complete specification of all metadata fields used in Kanban task files.

## Frontmatter Fields

### Required Fields

#### `created`
- **Type:** String (ISO 8601 timestamp)
- **Required:** Yes
- **Format:** `YYYY-MM-DDTHH:MM:SS.SSSZ`
- **Description:** Timestamp when the task was created
- **Example:** `2026-01-28T04:00:00.000Z`
- **Notes:** Set once when task is created, never modified

#### `updated`
- **Type:** String (ISO 8601 timestamp)
- **Required:** Yes
- **Format:** `YYYY-MM-DDTHH:MM:SS.SSSZ`
- **Description:** Timestamp of last modification
- **Example:** `2026-01-28T05:30:00.000Z`
- **Notes:** Update every time task content or metadata changes

### Optional Fields

#### `assigned`
- **Type:** String
- **Required:** No
- **Default:** `""`
- **Format:** Name without quotes, or empty string `""`
- **Description:** Person or agent assigned to the task
- **Examples:**
  - `assigned: Antigravity`
  - `assigned: "John Doe"`
  - `assigned: ""`
- **Notes:** Use empty string if unassigned, not null or omitted

#### `progress`
- **Type:** Number
- **Required:** No
- **Default:** `0`
- **Range:** `0` to `1.0`
- **Description:** Task completion percentage
- **Examples:**
  - `progress: 0` - Not started
  - `progress: 0.25` - 25% complete
  - `progress: 0.5` - 50% complete
  - `progress: 1.0` - 100% complete
- **Notes:** Use `0` for zero, not `0.0`

**Progress Guidelines:**
- `0` - Not started
- `0.1-0.3` - Initial research/planning
- `0.4-0.6` - Implementation in progress
- `0.7-0.9` - Testing/refinement
- `1.0` - Complete

#### `tags`
- **Type:** Array of Strings
- **Required:** No
- **Default:** `[]`
- **Format:** YAML array
- **Description:** Categorization tags for the task
- **Examples:**
  ```yaml
  tags: []
  
  tags:
    - backend
    - api
  
  tags:
    - frontend
    - ui
    - high-priority
  ```
- **Notes:** Use empty array `[]` if no tags, not null

**Common Tags:**
- Priority: `high-priority`, `medium-priority`, `low-priority`
- Type: `bug`, `feature`, `enhancement`, `documentation`
- Area: `frontend`, `backend`, `database`, `api`, `ui`, `testing`
- Status: `blocked`, `needs-review`, `ready-for-qa`

#### `started`
- **Type:** String (ISO 8601 timestamp)
- **Required:** No
- **Format:** `YYYY-MM-DDTHH:MM:SS.SSSZ`
- **Description:** Timestamp when task moved to a "started" column
- **Example:** `started: 2026-01-28T03:00:00.000Z`
- **Notes:** Set automatically when moved to column in `startedColumns`

## Complete Examples

### Minimal (Required Fields Only)

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---
```

### Unassigned Task

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0.3
tags:
  - backend
  - api
---
```

### Assigned Task in Progress

```yaml
---
created: 2026-01-28T01:00:00.000Z
updated: 2026-01-28T04:30:00.000Z
assigned: Antigravity
progress: 0.7
tags:
  - frontend
  - high-priority
started: 2026-01-28T01:15:00.000Z
---
```

### Completed Task

```yaml
---
created: 2026-01-27T10:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 1.0
tags:
  - backend
  - authentication
  - completed
started: 2026-01-27T11:00:00.000Z
---
```

## Field Update Rules

### When Creating a Task

```yaml
---
created: <current-timestamp>
updated: <current-timestamp>  # Same as created
assigned: ""
progress: 0
tags: []
---
```

### When Starting a Task (Moving to "In Progress")

```yaml
---
created: <unchanged>
updated: <current-timestamp>
assigned: <set-if-not-already>
progress: 0.1  # Or appropriate starting value
tags: <unchanged-or-add-tags>
started: <current-timestamp>  # Add this field
---
```

### When Updating Progress

```yaml
---
created: <unchanged>
updated: <current-timestamp>  # Always update
assigned: <unchanged>
progress: <new-value>  # Increment based on work done
tags: <unchanged>
started: <unchanged>
---
```

### When Completing a Task

```yaml
---
created: <unchanged>
updated: <current-timestamp>
assigned: <unchanged>
progress: 1.0  # Set to complete
tags: <add-'completed'-tag-if-desired>
started: <unchanged>
---
```

## Validation Rules

1. **Timestamps must be valid ISO 8601**
   - ✅ `2026-01-28T04:00:00.000Z`
   - ❌ `2026-01-28 04:00:00`
   - ❌ `01/28/2026`

2. **Progress must be 0-1.0**
   - ✅ `progress: 0`
   - ✅ `progress: 0.5`
   - ✅ `progress: 1.0`
   - ❌ `progress: 50`
   - ❌ `progress: 1.5`

3. **Tags must be array**
   - ✅ `tags: []`
   - ✅ `tags: [backend, api]`
   - ✅ `tags:\n  - backend\n  - api`
   - ❌ `tags: backend, api`
   - ❌ `tags: "backend"`

4. **Assigned can be empty string or name**
   - ✅ `assigned: ""`
   - ✅ `assigned: Antigravity`
   - ✅ `assigned: "John Doe"`
   - ❌ `assigned:` (no value)
   - ❌ `assigned: null`

## YAML Formatting Notes

### Strings with Spaces

```yaml
# No quotes needed for single words
assigned: Antigravity

# Quotes needed for names with spaces
assigned: "John Doe"
```

### Arrays

```yaml
# Empty array
tags: []

# Inline array
tags: [backend, api, testing]

# Block array (preferred for multiple items)
tags:
  - backend
  - api
  - testing
```

### Timestamps

```yaml
# Always use ISO 8601 format
created: 2026-01-28T04:00:00.000Z

# Include timezone (Z for UTC)
updated: 2026-01-28T04:00:00.000Z

# Not valid:
created: 2026-01-28  # Missing time
updated: 04:00:00    # Missing date
```

## Custom Metadata Fields

You can add custom fields for project-specific needs:

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 0.5
tags: [backend]
# Custom fields:
priority: high
estimated_hours: 8
sprint: "Sprint 3"
reviewer: "Jane Smith"
---
```

**Note:** Custom fields won't be recognized by the VS Code extension but will be preserved in the file.
