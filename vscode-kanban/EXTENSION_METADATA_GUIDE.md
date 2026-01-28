# Extension Metadata Configuration Guide

Complete guide for updating all extension metadata fields in `package.json`.

## Quick Reference Table

| Field | Location | Purpose | Example |
|-------|----------|---------|---------|
| Extension Name | `name` | Package identifier | `vscode-kanban` |
| Display Name | `displayName` | Marketplace title | `Kanban Board` |
| Author | `publisher` | Publisher ID | `johndoe` |
| Short Description | `description` | Brief summary | `Visual Kanban board for tasks` |
| Detailed Description | `README.md` | Full description | See README section |
| Features | `README.md` | Feature list | See README section |
| Changelog | `CHANGELOG.md` | Version history | See CHANGELOG section |
| Categories | `categories` | Marketplace category | `["Other"]` |
| Settings | `contributes.configuration` | User settings | See Settings section |

---

## 1. Extension Name (`name`)

**Location:** `package.json` → `name`

**Rules:**
- Lowercase only
- No spaces (use hyphens)
- Alphanumeric and hyphens only
- Must be unique in marketplace

**Current:**
```json
{
  "name": "vscode-kanban"
}
```

**How to update:**
```json
{
  "name": "my-awesome-extension"
}
```

**Examples:**
- `vscode-kanban`
- `markdown-preview-enhanced`
- `prettier-vscode`
- `eslint`

---

## 2. Display Name (`displayName`)

**Location:** `package.json` → `displayName`

**Rules:**
- Human-readable name
- Shown in marketplace and Extensions view
- Can contain spaces and capitals
- Keep under 50 characters

**Current:**
```json
{
  "displayName": "VS Code Kanban"
}
```

**How to update:**
```json
{
  "displayName": "Kanban Board Manager"
}
```

**Examples:**
- `Kanban Board`
- `Markdown Preview Enhanced`
- `Prettier - Code formatter`
- `ESLint`

---

## 3. Author/Publisher (`publisher`)

**Location:** `package.json` → `publisher`

**Rules:**
- Must match your publisher ID
- Created via marketplace or `vsce create-publisher`
- Lowercase, numbers, hyphens only
- Cannot be changed after publishing (creates new extension)

**Current:**
```json
{
  "publisher": "antigravity"
}
```

**How to update:**
```json
{
  "publisher": "your-publisher-id"
}
```

**To create/verify publisher:**
```bash
# Create new publisher
npx @vscode/vsce create-publisher

# Login to existing publisher
npx @vscode/vsce login your-publisher-id

# Verify publisher
npx @vscode/vsce show your-publisher-id
```

**Additional author info (optional):**
```json
{
  "publisher": "johndoe",
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://johndoe.com"
  },
  "contributors": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

## 4. Short Description (`description`)

**Location:** `package.json` → `description`

**Rules:**
- Brief one-line summary
- Shown in marketplace search results
- Maximum 200 characters
- No markdown formatting

**Current:**
```json
{
  "description": "Kanban board for markdown tasks"
}
```

**How to update:**
```json
{
  "description": "Visual Kanban board for managing markdown-based tasks with drag-and-drop support"
}
```

**Tips:**
- Be specific and descriptive
- Include key features
- Use keywords for searchability
- Avoid marketing fluff

**Examples:**
- `"Visual Kanban board for project management"`
- `"Markdown preview with GitHub Flavored Markdown support"`
- `"Code formatter using prettier"`

---

## 5. Detailed Description (README.md)

**Location:** `README.md` file in project root

**Structure:**
```markdown
# Extension Name

Brief introduction paragraph.

![Demo GIF](images/demo.gif)

## Features

- Feature 1 with screenshot
- Feature 2 with screenshot
- Feature 3 with screenshot

## Usage

Step-by-step guide with examples.

## Requirements

Any dependencies or prerequisites.

## Extension Settings

List of configuration options.

## Known Issues

Current limitations or bugs.

## Release Notes

Link to CHANGELOG.md or brief summary.

## Contributing

How to contribute (optional).

## License

License information.
```

**Example README.md:**
```markdown
# Kanban Board

Visual Kanban board for managing markdown-based tasks directly in VS Code.

![Kanban Board Demo](images/demo.gif)

## Features

### 📋 Multiple Boards
Create and manage multiple Kanban boards for different projects.

![Multiple Boards](images/boards.png)

### 🎯 Drag-and-Drop
Easily move tasks between columns with drag-and-drop support.

![Drag and Drop](images/drag-drop.gif)

### ✏️ Rich Task Editing
Edit task metadata including progress, tags, assignees, and sub-tasks.

![Task Editor](images/task-editor.png)

### 🔗 Task Relations
Link related tasks with dependencies and blockers.

## Usage

1. Create a new board:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Run command: `Kanban: Create Board`
   - Enter board name

2. Add tasks:
   - Click the `+` button on any column
   - Enter task title
   - Click on task card to edit details

3. Organize tasks:
   - Drag tasks between columns
   - Update progress and metadata
   - Add sub-tasks and relations

## Requirements

- VS Code 1.80.0 or higher

## Extension Settings

This extension contributes the following settings:

* `kanban.defaultColumns`: Default column names for new boards
* `kanban.autoSave`: Automatically save changes (default: true)

## Known Issues

- Large boards (>100 tasks) may experience performance issues
- Task descriptions limited to 100 characters on board view

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### 0.0.1

Initial release with basic Kanban functionality.

## License

MIT License - see [LICENSE](LICENSE) file for details.
```

**Tips:**
- Add screenshots and GIFs
- Use clear headings
- Include usage examples
- Keep it concise but comprehensive
- Update with each release

---

## 6. Features

**Location:** `README.md` → Features section

**Format:**
```markdown
## Features

### Feature Name
Description of the feature with screenshot/GIF.

![Feature Screenshot](images/feature.png)

### Another Feature
Description with example.

```code example```
```

**Example:**
```markdown
## Features

### 📋 Board Management
- Create unlimited Kanban boards
- Switch between boards easily
- Delete boards when no longer needed

![Board Management](images/boards.gif)

### 🎯 Task Organization
- Drag-and-drop tasks between columns
- Customize column names
- Track task progress (0-100%)

### ✏️ Rich Metadata
- Assign tasks to team members
- Add tags for categorization
- Track creation and update timestamps
- Add sub-tasks for complex work

### 🔗 Dependencies
- Link related tasks
- Mark dependencies and blockers
- Visualize task relationships
```

**Also add to package.json (optional):**
```json
{
  "keywords": [
    "kanban",
    "task",
    "project management",
    "markdown",
    "board"
  ]
}
```

---

## 7. Changelog (CHANGELOG.md)

**Location:** `CHANGELOG.md` file in project root

**Format:** Use [Keep a Changelog](https://keepachangelog.com/) format

**Structure:**
```markdown
# Change Log

All notable changes to the "extension-name" extension will be documented in this file.

## [Unreleased]
- Upcoming features

## [1.0.0] - 2026-01-28

### Added
- New feature X
- New feature Y

### Changed
- Modified behavior of Z

### Fixed
- Bug fix for issue #123

### Removed
- Deprecated feature A

## [0.0.1] - 2026-01-15

### Added
- Initial release
- Basic functionality
```

**Example CHANGELOG.md:**
```markdown
# Change Log

All notable changes to the "vscode-kanban" extension.

## [Unreleased]
- Task filtering by tags
- Export board to JSON
- Import from Trello

## [0.2.0] - 2026-02-15

### Added
- Task search functionality
- Keyboard shortcuts for common actions
- Dark mode support for board view

### Changed
- Improved drag-and-drop performance
- Updated task card design

### Fixed
- Fixed issue with task descriptions not saving
- Resolved board loading error on Windows

## [0.1.0] - 2026-02-01

### Added
- Task relations (depends on, blocks)
- Task comments
- Progress tracking

### Fixed
- Fixed task deletion confirmation dialog

## [0.0.1] - 2026-01-28

### Added
- Initial release
- Create, open, and delete boards
- Visual Kanban board interface
- Task CRUD operations
- Drag-and-drop support
- Task metadata editing (progress, tags, assignee)
```

**Update version in package.json:**
```json
{
  "version": "0.2.0"
}
```

**Version numbering:**
- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- `MAJOR`: Breaking changes
- `MINOR`: New features (backwards compatible)
- `PATCH`: Bug fixes

---

## 8. Categories

**Location:** `package.json` → `categories`

**Available categories:**
- `Programming Languages`
- `Snippets`
- `Linters`
- `Themes`
- `Debuggers`
- `Formatters`
- `Keymaps`
- `SCM Providers`
- `Other`
- `Extension Packs`
- `Language Packs`
- `Data Science`
- `Machine Learning`
- `Visualization`
- `Notebooks`
- `Education`
- `Testing`

**Current:**
```json
{
  "categories": ["Other"]
}
```

**How to update:**
```json
{
  "categories": [
    "Other",
    "Visualization"
  ]
}
```

**Examples:**
- Kanban extension: `["Other"]` or `["Other", "Visualization"]`
- Linter: `["Linters", "Programming Languages"]`
- Theme: `["Themes"]`
- Formatter: `["Formatters"]`

---

## 9. Settings (Configuration)

**Location:** `package.json` → `contributes.configuration`

**Structure:**
```json
{
  "contributes": {
    "configuration": {
      "title": "Extension Name",
      "properties": {
        "extensionName.settingName": {
          "type": "string",
          "default": "value",
          "description": "Description of setting",
          "enum": ["option1", "option2"],
          "enumDescriptions": ["Description 1", "Description 2"]
        }
      }
    }
  }
}
```

**Example for Kanban extension:**
```json
{
  "contributes": {
    "configuration": {
      "title": "Kanban Board",
      "properties": {
        "kanban.defaultColumns": {
          "type": "array",
          "default": ["Backlog", "In Progress", "Done"],
          "description": "Default column names for new boards",
          "items": {
            "type": "string"
          }
        },
        "kanban.autoSave": {
          "type": "boolean",
          "default": true,
          "description": "Automatically save changes to tasks"
        },
        "kanban.taskDescriptionLength": {
          "type": "number",
          "default": 100,
          "description": "Maximum characters to show in task description on board",
          "minimum": 50,
          "maximum": 500
        },
        "kanban.theme": {
          "type": "string",
          "default": "auto",
          "enum": ["auto", "light", "dark"],
          "enumDescriptions": [
            "Follow VS Code theme",
            "Always use light theme",
            "Always use dark theme"
          ],
          "description": "Board theme"
        },
        "kanban.confirmDelete": {
          "type": "boolean",
          "default": true,
          "description": "Show confirmation dialog before deleting tasks"
        }
      }
    }
  }
}
```

**Setting types:**
- `string` - Text input
- `number` - Numeric input
- `boolean` - Checkbox
- `array` - List of values
- `object` - Complex configuration

**Reading settings in code:**
```typescript
import * as vscode from 'vscode';

// Get configuration
const config = vscode.workspace.getConfiguration('kanban');

// Read setting
const autoSave = config.get<boolean>('autoSave', true);
const defaultColumns = config.get<string[]>('defaultColumns', ['Backlog', 'Done']);

// Update setting
await config.update('autoSave', false, vscode.ConfigurationTarget.Global);
```

---

## Complete package.json Example

```json
{
  "name": "vscode-kanban",
  "displayName": "Kanban Board",
  "description": "Visual Kanban board for managing markdown-based tasks with drag-and-drop support",
  "version": "0.2.0",
  "publisher": "johndoe",
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://johndoe.com"
  },
  "license": "MIT",
  "icon": "icon.png",
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  },
  "categories": [
    "Other",
    "Visualization"
  ],
  "keywords": [
    "kanban",
    "task",
    "project management",
    "markdown",
    "board"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/johndoe/vscode-kanban"
  },
  "bugs": {
    "url": "https://github.com/johndoe/vscode-kanban/issues"
  },
  "homepage": "https://github.com/johndoe/vscode-kanban#readme",
  "engines": {
    "vscode": "^1.80.0"
  },
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "kanban.openBoard",
        "title": "Kanban: Open Board",
        "icon": "$(notebook)"
      },
      {
        "command": "kanban.createBoard",
        "title": "Kanban: Create Board",
        "icon": "$(add)"
      },
      {
        "command": "kanban.deleteBoard",
        "title": "Kanban: Delete Board",
        "icon": "$(trash)"
      }
    ],
    "configuration": {
      "title": "Kanban Board",
      "properties": {
        "kanban.defaultColumns": {
          "type": "array",
          "default": ["Backlog", "In Progress", "Done"],
          "description": "Default column names for new boards"
        },
        "kanban.autoSave": {
          "type": "boolean",
          "default": true,
          "description": "Automatically save changes"
        },
        "kanban.theme": {
          "type": "string",
          "default": "auto",
          "enum": ["auto", "light", "dark"],
          "description": "Board theme"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "lint": "eslint src --ext ts"
  },
  "devDependencies": {
    "@types/vscode": "^1.80.0",
    "typescript": "^5.1.3"
  },
  "dependencies": {
    "js-yaml": "^4.1.1"
  }
}
```

---

## Quick Update Checklist

Before publishing or updating:

- [ ] Update `version` in package.json
- [ ] Update `displayName` if needed
- [ ] Update `description` (short)
- [ ] Update README.md with new features
- [ ] Add entry to CHANGELOG.md
- [ ] Update screenshots/GIFs if UI changed
- [ ] Add/update settings if new config options
- [ ] Update `categories` if functionality changed
- [ ] Update `keywords` for better search
- [ ] Test extension locally
- [ ] Commit changes to git
- [ ] Package: `npx @vscode/vsce package`
- [ ] Publish: `npx @vscode/vsce publish`
