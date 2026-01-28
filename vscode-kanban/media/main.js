(function () {
    const vscode = acquireVsCodeApi();

    // Make functions available globally for onclick
    window.addTask = (column) => {
        vscode.postMessage({
            command: 'addTask',
            column: column
        });
    };

    window.openTask = (taskId) => {
        vscode.postMessage({
            command: 'getTask',
            taskId: taskId
        });
    };

    window.deleteTaskQuick = (taskId, taskTitle) => {
        vscode.postMessage({
            command: 'deleteTask',
            taskId: taskId,
            taskTitle: taskTitle
        });
    };

    // Modal State
    let currentTaskId = null;
    let currentData = null;

    // Create Modal DOM with Tabs
    const modalHTML = `
        <div class="modal-overlay" id="taskModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Task</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="details">Details</button>
                    <button class="tab-btn" data-tab="subtasks">Sub-tasks</button>
                    <button class="tab-btn" data-tab="relations">Relations</button>
                    <button class="tab-btn" data-tab="comments">Comments</button>
                </div>

                <div class="modal-body">
                    <!-- Details Tab -->
                    <div class="tab-content active" id="tab-details">
                        <div class="form-group">
                            <label for="taskTitle">Title</label>
                            <input type="text" id="taskTitle" class="form-input" placeholder="Task Title">
                        </div>
                        
                        <div class="form-group">
                            <label for="taskDescription">Description</label>
                            <textarea id="taskDescription" class="form-textarea" placeholder="Task description..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="taskAssigned">Assigned To</label>
                                <input type="text" id="taskAssigned" class="form-input" placeholder="Name">
                            </div>
                            <div class="form-group">
                                <label for="taskProgress">Progress (0-1)</label>
                                <input type="number" id="taskProgress" class="form-input" placeholder="0.5" step="0.01" min="0" max="1">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Tags</label>
                            <div id="tagsList" class="tags-container"></div>
                            <div class="tag-input-group">
                                <input type="text" id="newTag" class="form-input" placeholder="Add tag...">
                                <button type="button" class="btn btn-secondary" onclick="addTag()">Add</button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Timestamps</label>
                            <div class="readonly-fields">
                                <div><strong>Created:</strong> <span id="taskCreated">-</span></div>
                                <div><strong>Updated:</strong> <span id="taskUpdated">-</span></div>
                                <div><strong>Started:</strong> <span id="taskStarted">-</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- Sub-tasks Tab -->
                    <div class="tab-content" id="tab-subtasks">
                        <div id="subtasksList"></div>
                        <button type="button" class="btn btn-secondary" onclick="addSubtask()">+ Add Sub-task</button>
                    </div>

                    <!-- Relations Tab -->
                    <div class="tab-content" id="tab-relations">
                        <datalist id="tasksList"></datalist>
                        <div id="relationsList"></div>
                        <button type="button" class="btn btn-secondary" onclick="addRelation()">+ Add Relation</button>
                    </div>

                    <!-- Comments Tab -->
                    <div class="tab-content" id="tab-comments">
                        <div id="commentsList"></div>
                        <div class="add-comment-section">
                            <h4>Add Comment</h4>
                            <input type="text" id="commentAuthor" class="form-input" placeholder="Your name">
                            <textarea id="commentText" class="form-textarea" placeholder="Comment text..."></textarea>
                            <button type="button" class="btn btn-secondary" onclick="addComment()">Add Comment</button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="deleteTask()">Delete Task</button>
                    <div style="flex: 1;"></div>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="saveTask()">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('taskModal');

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tab}`).classList.add('active');
        });
    });

    window.closeModal = () => {
        modal.classList.remove('active');
        currentTaskId = null;
        currentData = null;
    };

    window.deleteTask = () => {
        if (!currentTaskId) return;

        const taskTitle = document.getElementById('taskTitle').value || 'this task';
        vscode.postMessage({
            command: 'deleteTask',
            taskId: currentTaskId,
            taskTitle: taskTitle
        });
        closeModal();
    };

    window.addTag = () => {
        const input = document.getElementById('newTag');
        const tag = input.value.trim();
        if (tag) {
            const container = document.getElementById('tagsList');
            const tagEl = document.createElement('span');
            tagEl.className = 'tag-chip';
            tagEl.innerHTML = `${tag} <button onclick="this.parentElement.remove()">&times;</button>`;
            container.appendChild(tagEl);
            input.value = '';
        }
    };

    window.addSubtask = () => {
        const container = document.getElementById('subtasksList');
        const item = document.createElement('div');
        item.className = 'subtask-item';
        item.innerHTML = `
            <input type="checkbox" class="subtask-checkbox">
            <input type="text" class="form-input subtask-input" placeholder="Sub-task description">
            <button class="btn-remove" onclick="this.parentElement.remove()">&times;</button>
        `;
        container.appendChild(item);
    };

    window.addRelation = () => {
        const container = document.getElementById('relationsList');
        const item = document.createElement('div');
        item.className = 'relation-item';
        item.innerHTML = `
            <input type="text" class="form-input relation-name" placeholder="Relation name">
            <input type="text" class="form-input relation-target" list="tasksList" placeholder="Select or type task-id">
            <button class="btn-remove" onclick="this.parentElement.remove()">&times;</button>
        `;
        container.appendChild(item);
    };

    window.addComment = () => {
        const author = document.getElementById('commentAuthor').value.trim();
        const text = document.getElementById('commentText').value.trim();
        if (author && text) {
            const container = document.getElementById('commentsList');
            const comment = document.createElement('div');
            comment.className = 'comment-item';
            const date = new Date().toISOString();
            comment.innerHTML = `
                <div class="comment-header">
                    <strong>${author}</strong>
                    <span class="comment-date">${new Date(date).toLocaleString()}</span>
                </div>
                <div class="comment-text">${text}</div>
            `;
            container.appendChild(comment);
            document.getElementById('commentAuthor').value = '';
            document.getElementById('commentText').value = '';
        }
    };

    window.saveTask = () => {
        if (!currentTaskId) return;

        // Gather all data
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        // Metadata
        const metadata = {
            assigned: document.getElementById('taskAssigned').value,
            progress: parseFloat(document.getElementById('taskProgress').value) || 0,
            tags: Array.from(document.querySelectorAll('#tagsList .tag-chip')).map(el => el.textContent.replace('×', '').trim()),
            created: currentData?.metadata?.created,
            updated: new Date().toISOString(),
            started: currentData?.metadata?.started
        };

        // Sub-tasks
        const subTasks = Array.from(document.querySelectorAll('.subtask-item')).map(item => ({
            description: item.querySelector('.subtask-input').value,
            completed: item.querySelector('.subtask-checkbox').checked
        })).filter(st => st.description);

        // Relations
        const relations = Array.from(document.querySelectorAll('.relation-item')).map(item => ({
            name: item.querySelector('.relation-name').value,
            target: item.querySelector('.relation-target').value
        })).filter(rel => rel.name && rel.target);

        // Comments - collect all from DOM
        const comments = Array.from(document.querySelectorAll('.comment-item')).map(item => {
            const author = item.querySelector('.comment-header strong').textContent;
            const dateText = item.querySelector('.comment-date').textContent;
            const text = item.querySelector('.comment-text').textContent;
            // Try to parse the date, or use ISO string if it's already formatted
            let date = dateText;
            try {
                const parsed = new Date(dateText);
                if (!isNaN(parsed.getTime())) {
                    date = parsed.toISOString();
                }
            } catch (e) {
                // Keep original if parsing fails
            }
            return { author, date, text };
        });

        // Send to backend
        vscode.postMessage({
            command: 'updateTask',
            taskId: currentTaskId,
            data: {
                title,
                description,
                metadata,
                subTasks,
                relations,
                comments
            }
        });

        closeModal();
    };

    window.showModal = (taskId, data) => {
        currentTaskId = taskId;
        currentData = data;

        // Populate Details Tab
        document.getElementById('taskTitle').value = data.title || '';
        document.getElementById('taskDescription').value = data.description || '';
        document.getElementById('taskAssigned').value = data.metadata?.assigned || '';
        document.getElementById('taskProgress').value = data.metadata?.progress || 0;

        // Tags
        const tagsContainer = document.getElementById('tagsList');
        tagsContainer.innerHTML = '';
        if (data.metadata?.tags) {
            data.metadata.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag-chip';
                tagEl.innerHTML = `${tag} <button onclick="this.parentElement.remove()">&times;</button>`;
                tagsContainer.appendChild(tagEl);
            });
        }

        // Timestamps
        document.getElementById('taskCreated').textContent = data.metadata?.created ? new Date(data.metadata.created).toLocaleString() : '-';
        document.getElementById('taskUpdated').textContent = data.metadata?.updated ? new Date(data.metadata.updated).toLocaleString() : '-';
        document.getElementById('taskStarted').textContent = data.metadata?.started ? new Date(data.metadata.started).toLocaleString() : '-';

        // Populate tasks datalist for relations
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';
        if (data.availableTasks) {
            data.availableTasks.forEach(task => {
                const option = document.createElement('option');
                option.value = task.id;
                option.textContent = `${task.id} - ${task.title}`;
                tasksList.appendChild(option);
            });
        }

        // Sub-tasks
        const subtasksContainer = document.getElementById('subtasksList');
        subtasksContainer.innerHTML = '';
        if (data.subTasks) {
            data.subTasks.forEach(st => {
                const item = document.createElement('div');
                item.className = 'subtask-item';
                item.innerHTML = `
                    <input type="checkbox" class="subtask-checkbox" ${st.completed ? 'checked' : ''}>
                    <input type="text" class="form-input subtask-input" value="${st.description}">
                    <button class="btn-remove" onclick="this.parentElement.remove()">&times;</button>
                `;
                subtasksContainer.appendChild(item);
            });
        }

        // Relations
        const relationsContainer = document.getElementById('relationsList');
        relationsContainer.innerHTML = '';
        if (data.relations) {
            data.relations.forEach(rel => {
                const item = document.createElement('div');
                item.className = 'relation-item';
                item.innerHTML = `
                    <input type="text" class="form-input relation-name" value="${rel.name}">
                    <input type="text" class="form-input relation-target" list="tasksList" value="${rel.target}">
                    <button class="btn-remove" onclick="this.parentElement.remove()">&times;</button>
                `;
                relationsContainer.appendChild(item);
            });
        }

        // Comments
        const commentsContainer = document.getElementById('commentsList');
        commentsContainer.innerHTML = '';
        if (data.comments) {
            data.comments.forEach(comment => {
                const item = document.createElement('div');
                item.className = 'comment-item';
                item.innerHTML = `
                    <div class="comment-header">
                        <strong>${comment.author}</strong>
                        <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                `;
                commentsContainer.appendChild(item);
            });
        }

        modal.classList.add('active');
    };

    // Drag and Drop State
    let draggedItem = null;
    let draggedId = null;
    let sourceColumn = null;

    // Initialize
    document.querySelectorAll('.task-card').forEach(card => {
        addDragListeners(card);
    });

    document.querySelectorAll('.column').forEach(column => {
        addColumnListeners(column);
    });

    function addDragListeners(card) {
        card.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            draggedItem = card;
            draggedId = card.getAttribute('data-task-id');
            sourceColumn = card.getAttribute('data-column');

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedId);

            setTimeout(() => card.classList.add('dragging'), 0);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggedItem = null;
            document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));
        });
    }

    function addColumnListeners(column) {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column.querySelector('.task-list'), e.clientY);
            const taskList = column.querySelector('.task-list');

            column.classList.add('drag-over');

            if (draggedItem) {
                if (afterElement == null) {
                    taskList.appendChild(draggedItem);
                } else {
                    taskList.insertBefore(draggedItem, afterElement);
                }
            }
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');

            const targetCol = column.getAttribute('data-column-name');

            if (draggedItem && sourceColumn !== targetCol) {
                draggedItem.setAttribute('data-column', targetCol);

                vscode.postMessage({
                    command: 'moveTask',
                    taskId: draggedId,
                    sourceCol: sourceColumn,
                    targetCol: targetCol
                });

                sourceColumn = targetCol;
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Handle messages from extension
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'showTaskModal') {
            window.showModal(message.taskId, message.data);
        }
    });

})();
