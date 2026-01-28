# Kanban Manager Skill

A comprehensive Antigravity skill for programmatic management of markdown-based Kanban boards.

## Overview

This skill enables AI coding assistants to create and manage Kanban boards by directly manipulating markdown files and directory structures, without requiring the VS Code extension UI.

## Directory Structure

```
kanban-manager/
├── SKILL.md                          # Main skill definition
├── README.md                         # This file
├── references/                       # Complete format specifications
│   ├── board-index-template.md      # Board index.md format
│   ├── task-file-template.md        # Task file format
│   ├── metadata-schema.md           # Metadata fields reference
│   └── file-naming-conventions.md   # Naming rules
└── examples/                         # Working code examples
    ├── create-board.md              # Create new board
    ├── add-task.md                  # Add task to board
    ├── move-task.md                 # Move task between columns
    └── update-progress.md           # Update task progress
```

## Quick Start

### Creating a Board

```bash
mkdir -p ".kanbans/My Project/.kanbn/tasks"
```

Create `.kanbans/My Project/.kanbn/index.md`:
```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# My Project

## Backlog

## In Progress

## Done
```

### Adding a Task

Create `.kanbans/My Project/.kanbn/tasks/my-task.md`:
```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# My Task

Task description goes here.
```

Add to `index.md`:
```markdown
## Backlog

- [My Task](tasks/my-task.md)
```

## Key Concepts

### Board Structure
- Boards live in `.kanbans/<Board Name>/.kanbn/`
- Each board has an `index.md` (configuration + task list)
- Tasks are individual markdown files in `tasks/` directory

### Task IDs
- Derived from filename: `my-task.md` → task ID is `my-task`
- Use kebab-case (lowercase with hyphens)
- No special characters

### Metadata
- All tasks have YAML frontmatter
- Required fields: `created`, `updated`
- Optional: `assigned`, `progress`, `tags`, `started`

## Common Operations

### Move Task Between Columns
1. Edit `index.md`
2. Cut task link from source column
3. Paste into target column
4. Update task metadata (optional but recommended)

### Update Progress
1. Open task file
2. Update `updated` timestamp
3. Update `progress` value (0 to 1.0)
4. Mark sub-tasks complete if applicable

### Add Relations
```markdown
## Relations

- [Depends on other-task](other-task.md)
- [Blocks another-task](another-task.md)
```

## Reference Files

- **board-index-template.md** - Complete board format specification
- **task-file-template.md** - Complete task format specification
- **metadata-schema.md** - All metadata fields and validation rules
- **file-naming-conventions.md** - Naming rules for boards, tasks, columns

## Examples

All examples include PowerShell, Python, and Bash implementations:

- **create-board.md** - Create new board with default or custom columns
- **add-task.md** - Add tasks with metadata, sub-tasks, relations
- **move-task.md** - Move tasks between columns with metadata updates
- **update-progress.md** - Update progress, complete sub-tasks, add comments

## Integration with VS Code Extension

Files created/updated using this skill are fully compatible with the VS Code Kanban extension:

- Visual board interface
- Drag-and-drop task movement
- Task description preview (100 chars)
- Modal editing for task details
- Relation dropdown with task selection

## Best Practices

1. **Always update timestamps** - Set `updated` field when modifying tasks
2. **Use ISO 8601 format** - `YYYY-MM-DDTHH:MM:SS.SSSZ`
3. **Validate YAML** - Ensure frontmatter is properly formatted
4. **Keep descriptions concise** - First 100 chars show on board
5. **Use relations** - Track dependencies between tasks
6. **Update progress** - Keep progress field current
7. **Add comments** - Document important decisions and blockers

## Workflow Example

```python
# 1. Create board
create_board("Authentication System")

# 2. Add tasks
add_task("Authentication System", "Implement JWT", "Backlog")
add_task("Authentication System", "User Registration", "Backlog")

# 3. Start work
move_task("Authentication System", "implement-jwt", "Backlog", "In Progress")
update_task_progress("Authentication System", "implement-jwt", 0.1)

# 4. Track progress
update_task_progress("Authentication System", "implement-jwt", 0.5)
complete_subtask("Authentication System", "implement-jwt", "Install library")

# 5. Complete
update_task_progress("Authentication System", "implement-jwt", 1.0)
move_task("Authentication System", "implement-jwt", "In Progress", "Done")
```

## Troubleshooting

**Task not showing in extension:**
- Check filename is kebab-case
- Verify link in `index.md` matches filename
- Ensure YAML frontmatter is valid

**Board not loading:**
- Board directory name must match H1 in `index.md`
- Verify YAML frontmatter is present and valid
- Check column headers are H2 (`##`)

**Description not appearing:**
- Description is plain text after title
- Stops at first `##` header
- First 100 chars shown on board

## License

This skill is part of the Antigravity ecosystem and follows the same license as the parent project.

## Version

1.0.0 - Initial release with full CRUD operations for boards and tasks
