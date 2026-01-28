import * as vscode from 'vscode';
import { KanbanPanel } from './KanbanPanel';
import { KanbanParser } from './KanbanParser';

export function activate(context: vscode.ExtensionContext) {
    console.log('Kanban extension is active');

    let openBoardCommand = vscode.commands.registerCommand('kanban.openBoard', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const boards = KanbanParser.listBoards(rootPath);

        if (boards.length === 0) {
            vscode.window.showErrorMessage('No boards found in .kanbans directory');
            return;
        }

        // If only one board, open it directly
        if (boards.length === 1) {
            KanbanPanel.createOrShow(context.extensionUri, rootPath, boards[0]);
            return;
        }

        // Show quick pick to select board
        const selectedBoard = await vscode.window.showQuickPick(boards, {
            placeHolder: 'Select a board to open'
        });

        if (selectedBoard) {
            KanbanPanel.createOrShow(context.extensionUri, rootPath, selectedBoard);
        }
    });

    context.subscriptions.push(openBoardCommand);

    // Create Board Command
    let createBoardCommand = vscode.commands.registerCommand('kanban.createBoard', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;

        // Prompt for board name
        const boardName = await vscode.window.showInputBox({
            prompt: 'Enter board name',
            placeHolder: 'My Project Board',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Board name cannot be empty';
                }
                if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
                    return 'Board name can only contain letters, numbers, spaces, hyphens, and underscores';
                }
                return null;
            }
        });

        if (!boardName) {
            return; // User cancelled
        }

        try {
            KanbanParser.createBoard(rootPath, boardName);
            const openNow = await vscode.window.showInformationMessage(
                `Board "${boardName}" created successfully!`,
                'Open Board'
            );

            if (openNow === 'Open Board') {
                KanbanPanel.createOrShow(context.extensionUri, rootPath, boardName);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create board: ${error}`);
        }
    });

    // Delete Board Command
    let deleteBoardCommand = vscode.commands.registerCommand('kanban.deleteBoard', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const boards = KanbanParser.listBoards(rootPath);

        if (boards.length === 0) {
            vscode.window.showInformationMessage('No boards found to delete');
            return;
        }

        // Show quick pick to select board
        const selectedBoard = await vscode.window.showQuickPick(boards, {
            placeHolder: 'Select a board to delete'
        });

        if (!selectedBoard) {
            return; // User cancelled
        }

        // Confirmation dialog
        const confirmation = await vscode.window.showWarningMessage(
            `Delete board "${selectedBoard}"? This cannot be undone.`,
            { modal: true },
            'Delete'
        );

        if (confirmation !== 'Delete') {
            return; // User cancelled
        }

        try {
            // Close panel if this board is currently open
            if (KanbanPanel.currentPanel) {
                KanbanPanel.currentPanel.dispose();
            }

            KanbanParser.deleteBoard(rootPath, selectedBoard);
            vscode.window.showInformationMessage(`Board "${selectedBoard}" deleted successfully`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to delete board: ${error}`);
        }
    });

    // Watch for file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/.kanbn/index.md');
    watcher.onDidChange(() => {
        if (KanbanPanel.currentPanel) {
            vscode.commands.executeCommand('kanban.refreshBoard');
        }
    });

    let refreshCommand = vscode.commands.registerCommand('kanban.refreshBoard', () => {
        if (KanbanPanel.currentPanel) {
            KanbanPanel.currentPanel.refresh();
        }
    });

    context.subscriptions.push(createBoardCommand);
    context.subscriptions.push(deleteBoardCommand);
    context.subscriptions.push(watcher);
    context.subscriptions.push(refreshCommand);
}

export function deactivate() { }
