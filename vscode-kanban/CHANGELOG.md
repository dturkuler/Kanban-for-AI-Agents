# Change Log

All notable changes to the "Kanban for AI Agents" extension.

## [Unreleased]

- Task filtering by tags and assignee
- Export board to JSON format
- Import from Trello/Jira
- Bulk task operations
- Task templates
- Board templates for common workflows
- Integration with GitHub Issues
- Task time tracking
- Sprint planning features

## [0.0.1] - 2026-01-28

### Added

- **Board Management**
  - Create new Kanban boards with custom names
  - Open existing boards from quick pick menu
  - Delete boards with confirmation dialog
  - Multiple board support

- **Visual Board Interface**
  - Drag-and-drop task management
  - Customizable columns
  - Task card display with title, description, and ID
  - Real-time board updates

- **Task Management**
  - Create tasks with rich metadata
  - Edit task details in modal interface
  - Delete tasks with confirmation
  - Task descriptions (first 100 chars shown on board)

- **Task Metadata**
  - Progress tracking (0 to 1.0)
  - Tags for categorization
  - Assignee field
  - Created and updated timestamps
  - Started timestamp for in-progress tasks

- **Task Relations**
  - Dependency tracking (depends on, blocks, related to)
  - Task dropdown for easy relation selection
  - Bidirectional relationship support

- **Task Comments**
  - Add comments with author and timestamp
  - Document decisions and blockers
  - Comment history

- **Sub-tasks**
  - Markdown checkbox sub-tasks
  - Track completion status
  - Organize complex work

- **Programmatic Management**
  - AI agents can create boards via file operations
  - Markdown-based task files
  - YAML frontmatter for metadata
  - File naming conventions (kebab-case)
  - ISO 8601 timestamp format

- **Commands**
  - `Kanban: Create Board` - Create new board
  - `Kanban: Open Board` - Open existing board
  - `Kanban: Delete Board` - Delete board

### Technical Details

- Built with TypeScript
- Uses VS Code Webview API
- Markdown and YAML parsing with js-yaml
- File system watching for external changes
- Drag-and-drop with native HTML5 API

### Known Issues

- Large boards (>100 tasks) may have performance issues
- Task descriptions limited to 100 characters on board view
- No undo/redo functionality yet

---

## Version History

- **0.0.1** (2026-01-28) - Initial release
