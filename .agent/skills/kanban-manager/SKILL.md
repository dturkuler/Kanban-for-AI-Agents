---
name: kanban-manager
description: Use this skill when the user asks to create, update, or manage Kanban boards for project tracking, task management, or specification definitions. This skill enables programmatic creation and manipulation of markdown-based Kanban boards without requiring the VS Code extension UI.
---

# Kanban Manager Skill

## Goal
Enable AI coding assistants to programmatically create and manage Kanban boards by directly creating and updating markdown files and directory structures, allowing for project tracking, task management, and specification definitions without requiring UI interaction.

## When to Use This Skill
- User asks to create a new Kanban board
- User wants to add, update, or move tasks
- User needs to track project progress
- User wants to organize work into columns (Backlog, In Progress, Done, etc.)
- User asks to update task metadata (progress, assignee, tags)
- User needs to manage task dependencies or relations

## Directory Structure

Kanban boards follow this structure:
```
.kanbans/
└── <Board Name>/
    └── .kanbn/
        ├── index.md          # Board configuration and task list
        └── tasks/
            ├── task-id-1.md  # Individual task files
            ├── task-id-2.md
            └── ...
```

## Instructions

### 1. Creating a New Board

**Steps:**
1. Create directory: `.kanbans/<Board Name>/.kanbn/`
2. Create tasks directory: `.kanbans/<Board Name>/.kanbn/tasks/`
3. Create `index.md` with proper frontmatter and columns

**Template:** See `references/board-index-template.md`

**Example:**
```bash
# Create board structure
mkdir -p ".kanbans/My Project/.kanbn/tasks"

# Create index.md with default columns
```

### 2. Adding a New Task

**Steps:**
1. Generate task ID from title (lowercase, kebab-case)
2. Create task file: `.kanbans/<Board>/.kanbn/tasks/<task-id>.md`
3. Add frontmatter with required metadata
4. Add task link to appropriate column in `index.md`

**Template:** See `references/task-file-template.md`

**Example:**
```markdown
# In index.md, add to Backlog column:
## Backlog

- [Implement User Authentication](tasks/implement-user-authentication.md)
```

### 3. Moving Tasks Between Columns

**Steps:**
1. Open `.kanbans/<Board>/.kanbn/index.md`
2. Find task link in source column
3. Cut the line and paste it in target column
4. Update task file metadata if needed (e.g., `started` timestamp, `progress`)

**Example:**
```markdown
# Move from Backlog to In Progress:

## Backlog
# Remove this line:
# - [Task Title](tasks/task-id.md)

## In Progress
# Add it here:
- [Task Title](tasks/task-id.md)
```

### 4. Updating Task Progress

**Steps:**
1. Open task file: `.kanbans/<Board>/.kanbn/tasks/<task-id>.md`
2. Update frontmatter fields:
   - `updated`: Current ISO 8601 timestamp
   - `progress`: 0 to 1.0
   - Mark sub-tasks as complete: `- [x]`

**Example:**
```yaml
---
updated: 2026-01-28T04:20:00.000Z
progress: 0.7
---
```

### 5. Adding Task Relations

**Steps:**
1. Open task file
2. Add or update `## Relations` section
3. Link to related tasks using format: `- [Description](task-id.md)`

**Example:**
```markdown
## Relations

- [Depends on user-authentication](user-authentication.md)
- [Blocks payment-integration](payment-integration.md)
```

### 6. Adding Comments

**Steps:**
1. Open task file
2. Add or update `## Comments` section
3. Follow the structured format with author, date, and text

**Example:**
```markdown
## Comments

- author: Antigravity
  date: 2026-01-28T04:20:00.000Z
  Completed initial implementation, ready for review.
```

## File Format References

All file formats and schemas are documented in the `references/` directory:

- **board-index-template.md** - Complete board index.md format
- **task-file-template.md** - Complete task file format
- **metadata-schema.md** - All metadata fields and their types
- **file-naming-conventions.md** - Rules for naming boards and tasks

## Examples

See the `examples/` directory for complete working examples:

- **create-board.md** - Full example of creating a new board
- **add-task.md** - Example of adding a task to a board
- **move-task.md** - Example of moving a task between columns
- **update-progress.md** - Example of updating task progress

## Critical Rules

1. **Always use ISO 8601 timestamps** for dates: `YYYY-MM-DDTHH:MM:SS.SSSZ`
2. **Task IDs are kebab-case** derived from filenames (no spaces, lowercase)
3. **Board name folder must match** the H1 title in index.md
4. **No checkboxes in index.md** - only markdown links
5. **Update `updated` field** whenever modifying a task
6. **Preserve YAML formatting** - use proper indentation and quotes

## Workflow Pattern

```
1. User Request → Identify intent (create/update/move)
2. Determine board and task
3. Read current state (if updating)
4. Apply changes to files
5. Confirm completion to user
```

## Constraints

- Never delete task files without user confirmation
- Always validate YAML frontmatter before writing
- Preserve existing task content when updating metadata
- Keep task descriptions concise (first 100 chars show on UI)
- Use proper markdown formatting for all sections

## Integration with VS Code Extension

While this skill enables programmatic management, the VS Code Kanban extension provides:
- Visual board interface
- Drag-and-drop task movement
- Modal editing for task details
- Task description preview (100 chars)
- Relation dropdown with task selection

Files created/updated by this skill are fully compatible with the extension.
