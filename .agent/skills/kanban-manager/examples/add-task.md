# Example: Adding a Task

This example shows how to programmatically add a new task to a Kanban board.

## Scenario

Add a new task "Implement JWT Tokens" to the "Authentication System" board in the "Backlog" column.

## Step-by-Step

### Step 1: Generate Task ID

Convert task title to kebab-case filename:

```
"Implement JWT Tokens"
  → "implement jwt tokens"
  → "implement-jwt-tokens"
  → "implement-jwt-tokens.md"
```

### Step 2: Create Task File

**File:** `.kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md`

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# Implement JWT Tokens

Implement JSON Web Token based authentication for all API endpoints.

## Sub-tasks

- [ ] Research JWT libraries
- [ ] Install jsonwebtoken package
- [ ] Create token generation function
- [ ] Implement token validation middleware
- [ ] Write unit tests
```

### Step 3: Add Link to index.md

**File:** `.kanbans/Authentication System/.kanbn/index.md`

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# Authentication System

## Backlog

- [Implement JWT Tokens](tasks/implement-jwt-tokens.md)

## In Progress

## Done
```

## Complete Code Example

### PowerShell

```powershell
# Configuration
$boardName = "Authentication System"
$taskTitle = "Implement JWT Tokens"
$taskId = "implement-jwt-tokens"
$column = "Backlog"
$description = "Implement JSON Web Token based authentication for all API endpoints."

# Paths
$boardPath = ".kanbans/$boardName/.kanbn"
$taskFile = "$boardPath/tasks/$taskId.md"
$indexFile = "$boardPath/index.md"

# Get current timestamp
$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

# Create task file content
$taskContent = @"
---
created: $timestamp
updated: $timestamp
assigned: ""
progress: 0
tags: []
---

# $taskTitle

$description

## Sub-tasks

- [ ] Research JWT libraries
- [ ] Install jsonwebtoken package
- [ ] Create token generation function
- [ ] Implement token validation middleware
- [ ] Write unit tests
"@

# Write task file
Set-Content -Path $taskFile -Value $taskContent

# Add task to index.md
$indexContent = Get-Content -Path $indexFile -Raw
$taskLink = "- [$taskTitle](tasks/$taskId.md)"
$indexContent = $indexContent -replace "## $column\s*\n", "## $column`n`n$taskLink`n"
Set-Content -Path $indexFile -Value $indexContent

Write-Host "Task '$taskTitle' added to $column column!"
```

### Python

```python
from datetime import datetime, timezone
from pathlib import Path
import re

def add_task(board_name, task_title, column, description="", sub_tasks=None):
    # Generate task ID
    task_id = task_title.lower().replace(" ", "-")
    task_id = re.sub(r'[^a-z0-9-]', '', task_id)
    
    # Paths
    board_path = Path(f".kanbans/{board_name}/.kanbn")
    task_file = board_path / "tasks" / f"{task_id}.md"
    index_file = board_path / "index.md"
    
    # Current timestamp
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    
    # Create task content
    task_content = f"""---
created: {timestamp}
updated: {timestamp}
assigned: ""
progress: 0
tags: []
---

# {task_title}

{description}
"""
    
    # Add sub-tasks if provided
    if sub_tasks:
        task_content += "\n## Sub-tasks\n\n"
        for sub_task in sub_tasks:
            task_content += f"- [ ] {sub_task}\n"
    
    # Write task file
    task_file.write_text(task_content, encoding='utf-8')
    
    # Add to index.md
    index_content = index_file.read_text(encoding='utf-8')
    task_link = f"- [{task_title}](tasks/{task_id}.md)"
    
    # Find column and add task
    pattern = f"## {column}\\s*\\n"
    replacement = f"## {column}\\n\\n{task_link}\\n"
    index_content = re.sub(pattern, replacement, index_content)
    
    index_file.write_text(index_content, encoding='utf-8')
    
    print(f"Task '{task_title}' added to {column} column!")
    return task_id

# Usage
add_task(
    board_name="Authentication System",
    task_title="Implement JWT Tokens",
    column="Backlog",
    description="Implement JSON Web Token based authentication for all API endpoints.",
    sub_tasks=[
        "Research JWT libraries",
        "Install jsonwebtoken package",
        "Create token generation function",
        "Implement token validation middleware",
        "Write unit tests"
    ]
)
```

### Bash

```bash
#!/bin/bash

# Configuration
BOARD_NAME="Authentication System"
TASK_TITLE="Implement JWT Tokens"
TASK_ID="implement-jwt-tokens"
COLUMN="Backlog"
DESCRIPTION="Implement JSON Web Token based authentication for all API endpoints."

# Paths
BOARD_PATH=".kanbans/$BOARD_NAME/.kanbn"
TASK_FILE="$BOARD_PATH/tasks/$TASK_ID.md"
INDEX_FILE="$BOARD_PATH/index.md"

# Current timestamp (ISO 8601)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Create task file
cat > "$TASK_FILE" << EOF
---
created: $TIMESTAMP
updated: $TIMESTAMP
assigned: ""
progress: 0
tags: []
---

# $TASK_TITLE

$DESCRIPTION

## Sub-tasks

- [ ] Research JWT libraries
- [ ] Install jsonwebtoken package
- [ ] Create token generation function
- [ ] Implement token validation middleware
- [ ] Write unit tests
EOF

# Add task to index.md
TASK_LINK="- [$TASK_TITLE](tasks/$TASK_ID.md)"
sed -i "/## $COLUMN/a\\$TASK_LINK" "$INDEX_FILE"

echo "Task '$TASK_TITLE' added to $COLUMN column!"
```

## Adding Multiple Tasks

```python
tasks = [
    {
        "title": "Implement JWT Tokens",
        "description": "Implement JSON Web Token authentication.",
        "column": "Backlog",
        "tags": ["backend", "authentication"]
    },
    {
        "title": "User Registration Flow",
        "description": "Create user registration endpoint and validation.",
        "column": "Backlog",
        "tags": ["backend", "api"]
    },
    {
        "title": "Password Reset Feature",
        "description": "Implement password reset via email.",
        "column": "In Progress",
        "tags": ["backend", "email"]
    }
]

for task in tasks:
    add_task(
        board_name="Authentication System",
        task_title=task["title"],
        column=task["column"],
        description=task["description"]
    )
```

## Adding Task with Full Metadata

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 0
tags:
  - backend
  - authentication
  - high-priority
---

# Implement JWT Tokens

Implement JSON Web Token based authentication for all API endpoints to replace session-based auth.

## Sub-tasks

- [ ] Research JWT libraries (jsonwebtoken vs jose)
- [ ] Install and configure chosen library
- [ ] Create token generation function with 1-hour expiry
- [ ] Implement token validation middleware
- [ ] Add refresh token support (7-day expiry)
- [ ] Update API documentation
- [ ] Write unit tests for token generation
- [ ] Write unit tests for token validation
- [ ] Write integration tests

## Relations

- [Depends on api-endpoint-specification](api-endpoint-specification.md)
- [Blocks frontend-auth-integration](frontend-auth-integration.md)
```

## Verification

After adding the task:

1. **Check task file exists:**
   ```bash
   test -f ".kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md" && echo "✓ Task file created"
   ```

2. **Check task appears in index.md:**
   ```bash
   grep "Implement JWT Tokens" ".kanbans/Authentication System/.kanbn/index.md" && echo "✓ Task linked in index"
   ```

3. **View in VS Code extension:**
   - Open board
   - Task should appear in Backlog column
   - Click task to see details

## Common Patterns

### Quick Task (Minimal)

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---

# Fix Login Bug

Users unable to login with email addresses containing plus signs.
```

### Bug Report Task

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags:
  - bug
  - high-priority
---

# Fix Login Bug

**Issue:** Users unable to login with email addresses containing plus signs (+).

**Steps to Reproduce:**
1. Navigate to login page
2. Enter email: user+test@example.com
3. Enter valid password
4. Click login

**Expected:** User logs in successfully
**Actual:** Error: "Invalid email format"

## Sub-tasks

- [ ] Reproduce bug locally
- [ ] Identify validation regex issue
- [ ] Fix email validation
- [ ] Add test cases for special characters
- [ ] Deploy fix
```

### Feature Task with Relations

```markdown
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: Antigravity
progress: 0
tags:
  - feature
  - backend
---

# OAuth Integration

Add OAuth 2.0 authentication support for Google and GitHub.

## Sub-tasks

- [ ] Research OAuth 2.0 flow
- [ ] Register apps with Google/GitHub
- [ ] Implement OAuth callback endpoints
- [ ] Store OAuth tokens securely
- [ ] Add OAuth buttons to login page
- [ ] Test OAuth flow

## Relations

- [Depends on implement-jwt-tokens](implement-jwt-tokens.md)
- [Related to user-registration-flow](user-registration-flow.md)
```
