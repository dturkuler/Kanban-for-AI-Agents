# Kanban for AI Agents

**Programmatic Kanban board management designed for AI coding assistants.**

This VS Code extension enables AI agents to create, track, and manage project tasks through markdown-based Kanban boards without requiring UI interaction. It serves as the visual interface for the [Kanban for AI Agents](https://github.com/dturkuler/kanban-for-ai-agents) system.

![Kanban Board](https://via.placeholder.com/800x400/1e1e1e/ffffff?text=Kanban+Board+Demo)

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://marketplace.visualstudio.com/items?itemName=doganturkuler.kanban-for-ai-agents)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/github-repo-black.svg)](https://github.com/dturkuler/kanban-for-ai-agents)

## 🤖 Designed for AI Agents

This extension is specifically built to enable AI coding assistants (like Antigravity, GitHub Copilot, Cursor, etc.) to programmatically manage project tasks by directly creating and manipulating markdown files and directory structures.

### Why AI Agents Need This

-   **Persistent Task Tracking**: Tasks survive across AI sessions
-   **Structured Organization**: Clear project structure with boards and columns
-   **Dependency Management**: Track task relationships and blockers
-   **Progress Monitoring**: Visual representation of work completion
-   **No UI Required**: AI agents can manage everything via file operations

## ✨ Key Features

### 📋 Multiple Kanban Boards
Create and manage multiple boards for different projects or features. Structure your work using standard folders.

```
.kanbans/
├── Authentication System/
├── API v2 Migration/
└── Frontend Redesign/
```

### 🎯 Visual Board Interface
-   Drag-and-drop task management
-   Real-time board updates syncing with file changes
-   Column customization
-   Task descriptions preview

### ✏️ Rich Task Metadata
Each task supports comprehensive YAML frontmatter metadata:

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
Link related tasks with dependencies to handle complex workflows:

```markdown
## Relations

- [Depends on database-schema](database-schema.md)
- [Blocks frontend-integration](frontend-integration.md)
- [Related to api-documentation](api-documentation.md)
```

## 🛠️ Tech Stack

-   **Frontend**: Webview API, HTML/CSS
-   **Backend**: VS Code Extension API (TypeScript)
-   **Data Storage**: Local Filesystem (Markdown + YAML)

## 🚀 Getting Started

### Prerequisites
-   VS Code v1.80.0 or higher
-   An AI coding assistant (recommended for autonomous use)

### Installation

1.  **From VSIX**:
    Download the latest `.vsix` release from the [GitHub Releases](https://github.com/dturkuler/kanban-for-ai-agents/releases) page.
    ```bash
    code --install-extension kanban-ai-agents-0.0.1.vsix
    ```

2.  **From Source**:
    Clone the repository and build locally:
    ```bash
    git clone https://github.com/dturkuler/kanban-for-ai-agents.git
    cd kanban-for-ai-agents/kanban-for-ai
    npm install
    npm run compile
    ```

### Usage

#### For Human Users
1.  **Create a Board**: Run `Kanban: Create Board` command.
2.  **Add Tasks**: Use the `+` button in any column.
3.  **Organize**: Drag and drop tasks; click to edit details.

#### For AI Agents
AI agents manage the board by writing files. See the [Kanban Manager Skill](https://github.com/dturkuler/kanban-for-ai-agents/tree/main/.agent/skills/kanban-manager) for the full protocol.

**Create a Board Programmatically:**
```bash
mkdir -p ".kanbans/My Project/.kanbn/tasks"
```

## ⚙️ Configuration

| Setting | Description | Default |
| :--- | :--- | :--- |
| `kanban.defaultColumns` | Default column names for new boards | `["Backlog", "In Progress", "Done"]` |
| `kanban.autoSave` | Automatically save changes to disk | `true` |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Maintainers

-   **Dogan Turkuler** - [GitHub Profile](https://github.com/dturkuler)

## 🔗 Links

-   **GitHub Repository**: [https://github.com/dturkuler/kanban-for-ai-agents](https://github.com/dturkuler/kanban-for-ai-agents)
-   **Issues**: [Report a Bug](https://github.com/dturkuler/kanban-for-ai-agents/issues)
-   **Documentation**: [Project Wiki](https://github.com/dturkuler/kanban-for-ai-agents/wiki)

---
*Part of the [Kanban for AI Agents](https://github.com/dturkuler/kanban-for-ai-agents) ecosystem.*
