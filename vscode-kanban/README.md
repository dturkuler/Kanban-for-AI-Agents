# Kanban for AI Agents

**Programmatic Kanban board management designed for AI coding assistants.** This VS Code extension enables AI agents to create, track, and manage project tasks through markdown-based Kanban boards without requiring UI interaction.

![Kanban Board](https://via.placeholder.com/800x400/1e1e1e/ffffff?text=Kanban+Board+Demo)

## 🤖 Designed for AI Agents

This extension is specifically built to enable AI coding assistants (like Antigravity, GitHub Copilot, Cursor, etc.) to programmatically manage project tasks by directly creating and manipulating markdown files and directory structures.

### Why AI Agents Need This

- **Persistent Task Tracking**: Tasks survive across AI sessions
- **Structured Organization**: Clear project structure with boards and columns
- **Dependency Management**: Track task relationships and blockers
- **Progress Monitoring**: Visual representation of work completion
- **No UI Required**: AI agents can manage everything via file operations

## ✨ Features

### 📋 Multiple Kanban Boards

Create and manage multiple boards for different projects or features.

```
.kanbn_boards/
├── Authentication System/
├── API v2 Migration/
└── Frontend Redesign/
```

### 🎯 Visual Board Interface

- Drag-and-drop task management
- Real-time board updates
- Column customization
- Task descriptions (first 100 chars shown)

### ✏️ Rich Task Metadata

Each task supports comprehensive metadata:

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 0.5
tags:
  - backend
  - authentication
started: 2026-01-28T04:00:00.000Z
---
```

### 🔗 Task Relations

Link related tasks with dependencies:

```markdown
## Relations

- [Depends on database-schema](database-schema.md)
- [Blocks frontend-integration](frontend-integration.md)
- [Related to api-documentation](api-documentation.md)
```

### 📊 Progress Tracking

- Progress field (0 to 1.0)
- Sub-task completion tracking
- Automatic progress calculation
- Visual progress indicators

### 💬 Task Comments

Document decisions and blockers:

```markdown
## Comments

- author: Antigravity
  date: 2026-01-28T04:30:00.000Z
  Completed initial implementation. Token generation working.
```

## 🚀 Usage

### For Human Users

1. **Create a Board:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Run: `Kanban: Create Board`
   - Enter board name

2. **Add Tasks:**
   - Click `+` button on any column
   - Enter task title
   - Click task card to edit details

3. **Organize Tasks:**
   - Drag tasks between columns
   - Update metadata and progress
   - Add sub-tasks and relations

### For AI Agents

AI agents can programmatically manage boards by creating/updating markdown files:

**Create a Board:**
```bash
mkdir -p ".kanbn_boards/My Project/.kanbn/tasks"
```

**Create index.md:**
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

**Add a Task:**
```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# Implement Authentication

Add JWT-based authentication to API endpoints.

## Sub-tasks

- [ ] Research JWT libraries
- [ ] Implement token generation
- [ ] Add validation middleware
- [ ] Write tests
```

**Link Task in index.md:**
```markdown
## Backlog

- [Implement Authentication](tasks/implement-authentication.md)
```

See the [Kanban Manager Skill](https://github.com/doganturkuler/kanban-ai-agents/tree/main/.agent/skills/kanban-manager) for complete AI agent integration guide.

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Kanban for AI Agents"
4. Click Install

### From VSIX File

1. Download the `.vsix` file
2. In VS Code: Extensions → `...` → Install from VSIX
3. Select the downloaded file

## ⚙️ Extension Settings

This extension contributes the following settings:

* `kanban.defaultColumns`: Default column names for new boards (default: `["Backlog", "In Progress", "Done"]`)
* `kanban.autoSave`: Automatically save changes (default: `true`)

## 📋 Commands

* `Kanban: Create Board` - Create a new Kanban board
* `Kanban: Open Board` - Open an existing board
* `Kanban: Delete Board` - Delete a board

## 🔧 Requirements

- VS Code 1.80.0 or higher

## 🐛 Known Issues

- Large boards (>100 tasks) may experience performance issues
- Task descriptions are limited to 100 characters on board view (full text available in task editor)

## 📝 Release Notes

### 0.0.1 (Initial Release)

**Added:**
- Create, open, and delete Kanban boards
- Visual board interface with drag-and-drop
- Task CRUD operations
- Task metadata editing (progress, tags, assignee)
- Task relations and dependencies
- Task comments
- Sub-task tracking
- Programmatic board management for AI agents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for AI agents to have persistent task tracking
- Built for the Antigravity AI coding assistant ecosystem
- Compatible with all AI coding assistants that can manipulate files

## 📧 Contact

**Dogan Turkuler**
- Email: dogan@turkuler.com
- GitHub: [@doganturkuler](https://github.com/doganturkuler)

## 🔗 Links

- [GitHub Repository](https://github.com/doganturkuler/kanban-ai-agents)
- [Issue Tracker](https://github.com/doganturkuler/kanban-ai-agents/issues)
- [Kanban Manager Skill Documentation](https://github.com/doganturkuler/kanban-ai-agents/tree/main/.agent/skills/kanban-manager)

---

**Made with ❤️ for AI Agents**
