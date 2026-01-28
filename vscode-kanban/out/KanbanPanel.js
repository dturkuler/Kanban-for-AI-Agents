"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanPanel = void 0;
const vscode = __importStar(require("vscode"));
const KanbanParser_1 = require("./KanbanParser");
class KanbanPanel {
    constructor(panel, extensionUri, parser) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._parser = parser;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        // this._panel.onDidChangeViewState(
        // 	e => {
        // 		if (this._panel.visible) {
        // 			this._update();
        // 		}
        // 	},
        // 	null,
        // 	this._disposables
        // );
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'moveTask':
                    await this.handleMoveTask(message.taskId, message.sourceCol, message.targetCol);
                    return;
                case 'openTask':
                    await this.handleOpenTask(message.taskId);
                    return;
                case 'addTask':
                    await this.handleAddTask(message.column);
                    return;
                case 'refresh':
                    await this._update();
                    return;
                case 'getTask':
                    await this.handleGetTask(message.taskId);
                    return;
                case 'updateTask':
                    await this.handleUpdateTask(message.taskId, message.data);
                    return;
                case 'deleteTask':
                    await this.handleDeleteTask(message.taskId, message.taskTitle);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri, workspaceRoot, boardName) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (KanbanPanel.currentPanel) {
            KanbanPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel('kanbanBoard', 'Kanban: ' + boardName, column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our media directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        });
        const parser = new KanbanParser_1.KanbanParser(workspaceRoot, boardName);
        KanbanPanel.currentPanel = new KanbanPanel(panel, extensionUri, parser);
    }
    async handleMoveTask(taskId, sourceCol, targetCol) {
        try {
            await this._parser.moveTask(taskId, sourceCol, targetCol);
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to move task: ' + error);
            this._update(); // Revert UI
        }
    }
    async handleOpenTask(taskId) {
        const board = await this._parser.loadBoard();
        let taskPath;
        for (const col of board.columns) {
            const task = col.tasks.find(t => t.id === taskId);
            if (task) {
                taskPath = task.path;
                break;
            }
        }
        if (taskPath) {
            const doc = await vscode.workspace.openTextDocument(taskPath);
            await vscode.window.showTextDocument(doc);
        }
        else {
            vscode.window.showErrorMessage('Task file not found');
        }
    }
    async handleAddTask(columnName) {
        const title = await vscode.window.showInputBox({
            prompt: `Add task to ${columnName}`,
            placeHolder: 'Task Title'
        });
        if (title) {
            try {
                await this._parser.createTask(title, columnName);
                this._update();
            }
            catch (error) {
                vscode.window.showErrorMessage('Failed to create task: ' + error);
            }
        }
    }
    async handleGetTask(taskId) {
        try {
            const data = await this._parser.getTask(taskId);
            const board = await this._parser.loadBoard();
            // Collect all tasks for the dropdown
            const availableTasks = [];
            for (const col of board.columns) {
                for (const task of col.tasks) {
                    if (task.id !== taskId) {
                        availableTasks.push({ id: task.id, title: task.title });
                    }
                }
            }
            this._panel.webview.postMessage({
                command: 'showTaskModal',
                taskId: taskId,
                data: {
                    ...data,
                    availableTasks: availableTasks
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to load task: ' + error);
        }
    }
    async handleUpdateTask(taskId, data) {
        try {
            await this._parser.updateTask(taskId, data);
            this._update(); // Refresh to show new title if changed
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to update task: ' + error);
        }
    }
    async handleDeleteTask(taskId, taskTitle) {
        try {
            const title = taskTitle || taskId;
            const result = await vscode.window.showWarningMessage(`Delete "${title}"? This cannot be undone.`, { modal: true }, 'Delete');
            if (result === 'Delete') {
                await this._parser.deleteTask(taskId);
                this._update(); // Refresh to remove deleted task
            }
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to delete task: ' + error);
        }
    }
    async refresh() {
        await this._update();
    }
    async _update() {
        const webview = this._panel.webview;
        try {
            const board = await this._parser.loadBoard();
            this._panel.webview.html = this._getHtmlForWebview(webview, board);
        }
        catch (error) {
            this._panel.webview.html = `<html><body><h1>Error loading board</h1><p>${error}</p></body></html>`;
        }
    }
    dispose() {
        KanbanPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _getHtmlForWebview(webview, board) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        // Local path to css styles
        const stylesPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css');
        const stylesUri = webview.asWebviewUri(stylesPathOnDisk);
        // Generate columns HTML
        const columnsHtml = board.columns.map(col => `
            <div class="column" data-column-name="${col.name}">
                <div class="column-header">
                    <h2>${col.name} <span class="count">${col.tasks.length}</span></h2>
                    <button class="add-task-btn" onclick="window.addTask('${col.name}')">+</button>
                </div>
                <div class="task-list" id="${col.name}">
                    ${col.tasks.map(task => `
                        <div class="task-card" draggable="true" data-task-id="${task.id}" data-column="${col.name}" onclick="window.openTask('${task.id}')">
                            <button class="task-delete-btn" onclick="event.stopPropagation(); window.deleteTaskQuick('${task.id}', '${task.title.replace(/'/g, "\\'")}')">×</button>
                            <div class="task-title">${task.title}</div>
                            ${task.description ? `<div class="task-description">${task.description}${task.description.length >= 100 ? '...' : ''}</div>` : ''}
                            <div class="task-id">#${task.id}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesUri}" rel="stylesheet">
            <title>${board.title}</title>
        </head>
        <body>
            <div class="board">
                ${columnsHtml}
            </div>
            <script src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}
exports.KanbanPanel = KanbanPanel;
//# sourceMappingURL=KanbanPanel.js.map