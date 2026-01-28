import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    column: string;
    path: string;
}

export interface KanbanColumn {
    name: string;
    tasks: KanbanTask[];
}

export interface KanbanBoard {
    title: string;
    columns: KanbanColumn[];
    startedColumns: string[];
    completedColumns: string[];
}

export class KanbanParser {
    private boardPath: string;

    constructor(workspaceRoot: string, boardName: string) {
        this.boardPath = path.join(workspaceRoot, '.kanbn_boards', boardName, '.kanbn');
    }

    public async loadBoard(): Promise<KanbanBoard> {
        const indexPath = path.join(this.boardPath, 'index.md');
        if (!fs.existsSync(indexPath)) {
            throw new Error(`Board index not found at ${indexPath}`);
        }

        const content = fs.readFileSync(indexPath, 'utf-8');
        return this.parseIndex(content);
    }

    private parseIndex(content: string): KanbanBoard {
        const lines = content.split('\n');
        const board: KanbanBoard = {
            title: 'Kanban Board',
            columns: [],
            startedColumns: [],
            completedColumns: []
        };

        let currentColumn: KanbanColumn | null = null;
        let parsingFrontmatter = false;
        let frontmatterContent = '';

        for (const line of lines) {
            const trimmed = line.trim();

            // Frontmatter handling
            if (trimmed === '---') {
                if (parsingFrontmatter) {
                    parsingFrontmatter = false;
                    this.parseFrontmatter(frontmatterContent, board);
                } else {
                    parsingFrontmatter = true;
                }
                continue;
            }
            if (parsingFrontmatter) {
                frontmatterContent += line + '\n';
                continue;
            }

            // Title
            if (trimmed.startsWith('# ')) {
                board.title = trimmed.substring(2);
                continue;
            }

            // Columns
            if (trimmed.startsWith('## ')) {
                currentColumn = {
                    name: trimmed.substring(3),
                    tasks: []
                };
                board.columns.push(currentColumn);
                continue;
            }

            // Tasks
            // Format: - [task-id](tasks/filename.md) or - [Task Title](tasks/filename.md)
            if (trimmed.startsWith('- [') && currentColumn) {
                const match = trimmed.match(/- \[(.*?)\]\((.*?)\)/);
                if (match) {
                    const linkText = match[1];
                    const linkPath = match[2];
                    // Usually filename is task id, link text might be id or title. 
                    // user example: - [deployment-plan](tasks/deployment-plan.md)
                    // We'll use basename of linkPath as ID
                    const id = path.basename(linkPath, '.md');
                    const taskPath = path.join(this.boardPath, linkPath);

                    // Read description from task file
                    let description = '';
                    if (fs.existsSync(taskPath)) {
                        try {
                            const taskContent = fs.readFileSync(taskPath, 'utf-8');
                            // Remove frontmatter
                            const bodyMatch = taskContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
                            const body = bodyMatch ? bodyMatch[1] : taskContent;

                            // Extract description (text after title, before first ##)
                            const lines = body.split('\n');
                            let descLines: string[] = [];
                            let foundTitle = false;

                            for (const line of lines) {
                                if (line.startsWith('# ')) {
                                    foundTitle = true;
                                    continue;
                                }
                                if (foundTitle && line.startsWith('## ')) {
                                    break;
                                }
                                if (foundTitle && line.trim()) {
                                    descLines.push(line.trim());
                                }
                            }
                            description = descLines.join(' ').substring(0, 100);
                        } catch (e) {
                            // Ignore errors, just don't show description
                        }
                    }

                    currentColumn.tasks.push({
                        id: id,
                        title: linkText,
                        description: description,
                        column: currentColumn.name,
                        path: taskPath
                    });
                }
            }
        }

        return board;
    }

    private parseFrontmatter(content: string, board: KanbanBoard) {
        // Simple manual parsing needed as we don't have yaml lib yet
        // pattern:
        // startedColumns:
        //   - 'In Progress'
        const lines = content.split('\n');
        let currentKey: 'startedColumns' | 'completedColumns' | null = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('startedColumns:')) {
                currentKey = 'startedColumns';
            } else if (trimmed.startsWith('completedColumns:')) {
                currentKey = 'completedColumns';
            } else if (trimmed.startsWith('-') && currentKey) {
                let val = trimmed.substring(1).trim();
                // Remove quotes if present
                if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                    val = val.substring(1, val.length - 1);
                }
                board[currentKey].push(val);
            }
        }
    }

    public async moveTask(taskId: string, sourceCol: string, targetCol: string) {
        // This is a naive implementation: it reads the file, edits it string-wise, and saves.
        // A better approach would be to reconstruct the file from the Board model.
        // For compliance with user's specific format, reconstructing "safely" is better.

        const board = await this.loadBoard();
        const sourceColumn = board.columns.find(c => c.name === sourceCol);
        const targetColumn = board.columns.find(c => c.name === targetCol);

        if (!sourceColumn || !targetColumn) {
            throw new Error('Column not found');
        }

        const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found in source column');
        }

        const task = sourceColumn.tasks[taskIndex];
        sourceColumn.tasks.splice(taskIndex, 1);
        targetColumn.tasks.push(task);
        task.column = targetCol;

        await this.saveBoard(board);
    }

    public async createTask(title: string, columnName: string) {
        const board = await this.loadBoard();
        const column = board.columns.find(c => c.name === columnName);
        if (!column) {
            throw new Error('Column not found');
        }

        // Generate ID / Filename
        // e.g. "My New Task" -> "my-new-task"
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const filename = id + '.md';
        const tasksDir = path.join(this.boardPath, 'tasks');

        if (!fs.existsSync(tasksDir)) {
            fs.mkdirSync(tasksDir);
        }

        const filePath = path.join(tasksDir, filename);

        // Don't overwrite existing
        if (fs.existsSync(filePath)) {
            throw new Error(`Task with ID ${id} already exists`);
        }

        // Create empty task file
        const fileContent = `# ${title}\n\n`;
        fs.writeFileSync(filePath, fileContent, 'utf-8');

        // Add to board
        column.tasks.push({
            id: id,
            title: title,
            column: columnName,
            path: filePath
        });

        await this.saveBoard(board);
    }

    private async saveBoard(board: KanbanBoard) {
        let content = '---\n';
        if (board.startedColumns.length > 0) {
            content += 'startedColumns:\n';
            board.startedColumns.forEach(c => content += `  - '${c}'\n`);
        }
        if (board.completedColumns.length > 0) {
            content += 'completedColumns:\n';
            board.completedColumns.forEach(c => content += `  - '${c}'\n`);
        }
        content += '---\n\n';

        content += `# ${board.title}\n\n`;

        for (const col of board.columns) {
            content += `## ${col.name}\n\n`;
            for (const task of col.tasks) {
                // reconstruct link path relative to .kanbn
                // task.path is absolute, need relative
                const relativePath = path.relative(this.boardPath, task.path).replace(/\\/g, '/');
                content += `- [${task.title}](${relativePath})\n`;
            }
            content += '\n'; // Add spacing
        }

        const indexPath = path.join(this.boardPath, 'index.md');
        fs.writeFileSync(indexPath, content, 'utf-8');
    }

    // Helper to find the first board
    public static findFirstBoard(workspaceRoot: string): string | null {
        const boardsDir = path.join(workspaceRoot, '.kanbn_boards');
        if (fs.existsSync(boardsDir)) {
            const items = fs.readdirSync(boardsDir, { withFileTypes: true });
            const boardDir = items.find(dirent => dirent.isDirectory());
            return boardDir ? boardDir.name : null;
        }
        return null;
    }

    // List all boards
    public static listBoards(workspaceRoot: string): string[] {
        const boardsDir = path.join(workspaceRoot, '.kanbn_boards');
        if (!fs.existsSync(boardsDir)) {
            return [];
        }
        const items = fs.readdirSync(boardsDir, { withFileTypes: true });
        return items.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }

    // Create a new board
    public static createBoard(workspaceRoot: string, boardName: string): void {
        const boardsDir = path.join(workspaceRoot, '.kanbn_boards');
        const boardDir = path.join(boardsDir, boardName);
        const kanbnDir = path.join(boardDir, '.kanbn');
        const tasksDir = path.join(kanbnDir, 'tasks');

        // Create directory structure
        if (!fs.existsSync(boardsDir)) {
            fs.mkdirSync(boardsDir, { recursive: true });
        }
        if (fs.existsSync(boardDir)) {
            throw new Error(`Board "${boardName}" already exists`);
        }

        fs.mkdirSync(boardDir);
        fs.mkdirSync(kanbnDir);
        fs.mkdirSync(tasksDir);

        // Create default index.md
        const defaultContent = `---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# ${boardName}

## Backlog

## In Progress

## Done
`;

        const indexPath = path.join(kanbnDir, 'index.md');
        fs.writeFileSync(indexPath, defaultContent, 'utf-8');
    }

    // Delete a board
    public static deleteBoard(workspaceRoot: string, boardName: string): void {
        const boardDir = path.join(workspaceRoot, '.kanbn_boards', boardName);

        if (!fs.existsSync(boardDir)) {
            throw new Error(`Board "${boardName}" does not exist`);
        }

        // Recursively delete directory
        fs.rmSync(boardDir, { recursive: true, force: true });
    }

    public async getTask(taskId: string) {
        const board = await this.loadBoard();
        let taskPath: string | undefined;

        for (const col of board.columns) {
            const task = col.tasks.find(t => t.id === taskId);
            if (task) {
                taskPath = task.path;
                break;
            }
        }

        if (!taskPath || !fs.existsSync(taskPath)) {
            throw new Error('Task file not found');
        }

        const fileContent = fs.readFileSync(taskPath, 'utf-8');

        // Parse frontmatter
        const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let metadata: any = {};
        let body = fileContent;

        if (match) {
            try {
                metadata = yaml.load(match[1]) || {};
                body = match[2];
            } catch (e) {
                console.error('Error parsing frontmatter', e);
            }
        }

        // Parse markdown body
        const lines = body.split('\n');
        let title = '';
        let description = '';
        const subTasks: Array<{ description: string, completed: boolean }> = [];
        const relations: Array<{ name: string, target: string }> = [];
        const comments: Array<{ author: string, date: string, text: string }> = [];

        let currentSection = 'header';
        let descriptionLines: string[] = [];
        let currentComment: any = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Extract title from H1
            if (line.startsWith('# ') && !title) {
                title = line.substring(2).trim();
                currentSection = 'description';
                continue;
            }

            // Detect sections
            if (line.startsWith('## ')) {
                const sectionName = line.substring(3).trim().toLowerCase();
                if (sectionName === 'sub-tasks') {
                    currentSection = 'subtasks';
                } else if (sectionName === 'relations') {
                    currentSection = 'relations';
                } else if (sectionName === 'comments') {
                    currentSection = 'comments';
                } else {
                    currentSection = 'other';
                }
                continue;
            }

            // Parse based on current section
            if (currentSection === 'description' && line.trim()) {
                descriptionLines.push(line);
            } else if (currentSection === 'subtasks' && line.trim().startsWith('- [')) {
                const completed = line.includes('[x]') || line.includes('[X]');
                const desc = line.replace(/^- \[[xX ]\]\s*/, '').trim();
                if (desc) {
                    subTasks.push({ description: desc, completed });
                }
            } else if (currentSection === 'relations' && line.trim().startsWith('- [')) {
                // Format: - [Relation Name task-id](task-id.md)
                const relationMatch = line.match(/- \[(.*?)\]\((.*?)\)/);
                if (relationMatch) {
                    const name = relationMatch[1].trim();
                    const target = relationMatch[2].replace('.md', '').trim();
                    relations.push({ name, target });
                }
            } else if (currentSection === 'comments') {
                if (line.trim().startsWith('- author:')) {
                    // Save previous comment if exists
                    if (currentComment && currentComment.author) {
                        comments.push(currentComment);
                    }
                    currentComment = { author: line.replace('- author:', '').trim(), date: '', text: '' };
                } else if (line.trim().startsWith('date:') && currentComment) {
                    currentComment.date = line.replace('date:', '').trim();
                } else if (currentComment && currentComment.author && currentComment.date && line.trim()) {
                    currentComment.text = line.trim();
                }
            }
        }

        // Save last comment
        if (currentComment && currentComment.author) {
            comments.push(currentComment);
        }

        description = descriptionLines.join('\n').trim();

        return {
            metadata,
            title,
            description,
            subTasks,
            relations,
            comments
        };
    }

    public async updateTask(
        taskId: string,
        data: {
            title: string,
            description: string,
            metadata: any,
            subTasks: Array<{ description: string, completed: boolean }>,
            relations: Array<{ name: string, target: string }>,
            comments: Array<{ author: string, date: string, text: string }>
        }
    ) {
        const board = await this.loadBoard();
        let foundTask: KanbanTask | undefined;

        for (const col of board.columns) {
            foundTask = col.tasks.find(t => t.id === taskId);
            if (foundTask) {
                break;
            }
        }

        if (!foundTask || !fs.existsSync(foundTask.path)) {
            throw new Error('Task not found');
        }

        // Update metadata timestamps
        data.metadata.updated = new Date().toISOString();
        if (!data.metadata.created) {
            data.metadata.created = new Date().toISOString();
        }

        // Build markdown body
        let body = '';

        // Title
        body += `# ${data.title}\n\n`;

        // Description
        if (data.description) {
            body += `${data.description}\n\n`;
        }

        // Sub-tasks section
        if (data.subTasks && data.subTasks.length > 0) {
            body += `## Sub-tasks\n\n`;
            for (const task of data.subTasks) {
                const checkbox = task.completed ? '[x]' : '[ ]';
                body += `- ${checkbox} ${task.description}\n`;
            }
            body += '\n';
        }

        // Relations section
        if (data.relations && data.relations.length > 0) {
            body += `## Relations\n\n`;
            for (const rel of data.relations) {
                body += `- [${rel.name}](${rel.target}.md)\n`;
            }
            body += '\n';
        }

        // Comments section
        if (data.comments && data.comments.length > 0) {
            body += `## Comments\n\n`;
            for (const comment of data.comments) {
                body += `- author: ${comment.author}\n`;
                body += `  date: ${comment.date}\n`;
                body += `  ${comment.text}\n\n`;
            }
        }

        // Build complete file content
        let fileOutput = '';
        try {
            const yamlStr = yaml.dump(data.metadata);
            fileOutput = `---\n${yamlStr}---\n${body}`;
        } catch (e) {
            console.error('Error stringifying frontmatter', e);
            fileOutput = body;
        }

        // Update file content
        fs.writeFileSync(foundTask.path, fileOutput, 'utf-8');

        // Update title in index if changed
        if (data.title && data.title !== foundTask.title) {
            foundTask.title = data.title;
            await this.saveBoard(board);
        }
    }

    public async deleteTask(taskId: string) {
        const board = await this.loadBoard();
        let foundTask: KanbanTask | undefined;
        let foundColumn: KanbanColumn | undefined;

        // Find the task and its column
        for (const col of board.columns) {
            const task = col.tasks.find(t => t.id === taskId);
            if (task) {
                foundTask = task;
                foundColumn = col;
                break;
            }
        }

        if (!foundTask || !foundColumn) {
            throw new Error('Task not found');
        }

        // Delete the task file
        if (fs.existsSync(foundTask.path)) {
            fs.unlinkSync(foundTask.path);
        }

        // Remove from column
        foundColumn.tasks = foundColumn.tasks.filter(t => t.id !== taskId);

        // Save updated board
        await this.saveBoard(board);
    }
}
