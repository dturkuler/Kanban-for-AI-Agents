# Kanban for AI Agents

**Empowering AI agents to autonomously manage projects using a standardized, filesystem-based Kanban system.**

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Overview

**Kanban for AI Agents** bridges the gap between human project management and AI autonomy. It treats the filesystem as a database (`.kanbans/`), allowing AI coding assistants to programmatically create, update, and track tasks using standard markdown files. This enables true agency: agents can plan their work, track their progress, and document specifications without needing to interact with a GUI, while humans can visualize and manage the same boards using the companion VS Code extension.



<div align="center">
  <video src="assets/Kanvas for AI agents.mp4" width="100%" controls></video>
</div>



## ✨ Key Features

-   **Filesystem-based Database**: zero-dependency, portable, and version-controllable.
-   **AI-First Design**: Optimized for agents to read/write using standard file operations.
-   **Hybrid Workflow**: Seamless interoperability between AI (CLI/File ops) and Humans (VS Code UI).
-   **Standardized Metadata**: Strict schema for task tracking (status, progress, dependencies).
-   **Integrated Skill**: Ready-to-use definition for AI agents to adopt this workflow immediately.

## 🛠️ Tech Stack

-   **Core**: Markdown, YAML Frontmatter
-   **Extension**: TypeScript, VS Code API
-   **AI Integration**: Custom Agent Skill Definition

## 🚀 Getting Started

### Prerequisites

-   **VS Code**: v1.80.0 or higher
-   **AI Assistant**: effectively any agentic AI (e.g., Antigravity, Cline) capable of reading/writing files.

### Installation

1.  **Install the Extension**:
    Since this is currently in development, you can install the VSIX package directly:
    ```bash
    code --install-extension kanban-for-ai/kanban-ai-agents-0.0.1.vsix
    ```

2.  **Equip Your AI Agent**:
    Ensure your AI assistant has access to the Kanban Manager skill rules located at:
    `[.agent/skills/kanban-manager/SKILL.md](.agent/skills/kanban-manager/SKILL.md)`

### Usage

1.  **Initialize a Board**:
    Create a new folder in `.kanbans/` or use the VS Code command `Kanban: Create Board`.

2.  **Create Tasks**:
    Add markdown files to the `.kanbn/tasks/` directory of your board.

3.  **Track Progress**:
    *   **Humans**: Drag and drop tasks in the Kanban board UI.
    *   **AI**: Move lines between headers in `index.md` and update `progress` metadata in task files.

4.  **Visualize**:
    Open the board by running `Kanban: Open Board` from the Command Palette.

## 🤖 AI Agent Guidelines

To use this system effectively, AI agents must adhere to the **Kanban Project Management Rule**.

> [!IMPORTANT]
> **Mandatory Rule for Agents**:
> Review the core rules at [.agent/rules/kanban-manager.md](.agent/rules/kanban-manager.md) before starting any task.

### Quick Rules Summary
1.  **Structure**: All work -> Tasks.
2.  **Metadata**: Keep `updated` and `progress` fields current.
3.  **Filenames**: Use `kebab-case` for task IDs.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Maintainers

-   **Dogan Turkuler** - [GitHub Profile](https://github.com/dturkuler)

---
*Built with ❤️ for the future of Agentic Coding.*
