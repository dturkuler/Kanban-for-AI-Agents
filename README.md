# Kanban for AI Agents

**Programmatic Kanban board management for AI coding assistants.**

This project provides a standardized, markdown-based Kanban system designed specifically for AI agents to autonomously manage projects, track tasks, and document specifications. It includes a VS Code extension for human visualization and interaction.

## Project Overview

The core idea is to use the filesystem as the database for project management. Kanban boards are just folders, and tasks are markdown files with YAML frontmatter. This allows AI agents (like me!) to read, create, and update project status using standard file operations, while humans can use the VS Code extension for a rich UI experience.

### Example Structure

A Kanban board is structured as follows:

```
.kanbans/
└── My Project/           # Board Name
    └── .kanbn/
        ├── index.md      # Board definition (columns)
        └── tasks/        # Individual task files
            ├── setup-project.md
            └── implement-auth.md
```

**index.md Example:**

```markdown
## Backlog
- [Implement Auth](tasks/implement-auth.md)

## In Progress
- [Setup Project](tasks/setup-project.md)

## Done
```

## VS Code Extension

The **Kanban for AI Agents** extension provides a visual interface for these markdown boards.

- **Name**: Kanban for AI Agents (`kanban-ai-agents`)
- **Publisher**: doganturkuler
- **Version**: 0.0.1
- **Features**:
  - Visual Kanban board view of your markdown files.
  - Drag-and-drop tasks between columns.
  - Create, edit, and delete boards and tasks.
  - Fully compatible with the AI agent's markdown format.

### Installation

You can install the extension from the `.vsix` package included in this repository:

1.  Go to the `kanban-for-ai` directory.
2.  Install `kanban-ai-agents-0.0.1.vsix` into VS Code.

## Antigravity Skill: Kanban Manager

This repository defines a standardized skill for AI agents to interact with this system.

- **Skill Location**: [.agent/skills/kanban-manager/SKILL.md](.agent/skills/kanban-manager/SKILL.md)
- **Goal**: Enable AI assistants to manage project lifecycle (planning, tracking, reporting) autonomously.

### core Rules

All AI coding assistants working in this workspace **MUST** follow the **Kanban Project Management Rule**. This ensures consistency and proper state tracking.

**Rule Location**: [.agent/rules/kanban-manager.md](.agent/rules/kanban-manager.md)

#### Summary of Rules

1.  **Mandatory Usage**:
    *   **Project Planning**: Create boards for new features.
    *   **Task Tracking**: All work must be tracked as tasks.
    *   **Progress**: Update `progress` (0.0 - 1.0) and `updated` timestamps regularly.

2.  **Workflow**:
    *   **Initialize**: Create board -> Break down work -> Add to Backlog.
    *   **Execute**: Move to 'In Progress' -> Update Progress -> Mark sub-tasks complete.
    *   **Complete**: Move to 'Done' -> Set progress to 1.0 -> Add final comment.

3.  **Metadata Requirements**:
    Every task file MUST have valid YAML frontmatter:
    ```yaml
    ---
    created: 2026-01-28T04:30:00.000Z
    updated: 2026-01-28T05:00:00.000Z
    assigned: Antigravity
    progress: 0.5
    tags: [backend, implementation]
    ---
    ```

4.  **Task Types**:
    *   **Specification**: For requirements (no code).
    *   **Implementation**: For coding tasks.
    *   **Bug Fix**: For tracking repairs.
