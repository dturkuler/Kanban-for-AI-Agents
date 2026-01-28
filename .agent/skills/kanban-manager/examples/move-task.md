# Example: Moving a Task

This example shows how to programmatically move a task between columns.

## Scenario

Move task "Implement JWT Tokens" from "Backlog" to "In Progress" column.

## Step-by-Step

### Step 1: Update index.md

Move the task link from source column to target column.

**Before:**
```markdown
## Backlog

- [Implement JWT Tokens](tasks/implement-jwt-tokens.md)
- [User Registration Flow](tasks/user-registration-flow.md)

## In Progress

## Done
```

**After:**
```markdown
## Backlog

- [User Registration Flow](tasks/user-registration-flow.md)

## In Progress

- [Implement JWT Tokens](tasks/implement-jwt-tokens.md)

## Done
```

### Step 2: Update Task Metadata (Optional but Recommended)

Update the task file to reflect the status change.

**File:** `.kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md`

**Before:**
```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---
```

**After:**
```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:30:00.000Z
assigned: Antigravity
progress: 0.1
tags:
  - backend
  - authentication
started: 2026-01-28T04:30:00.000Z
---
```

## Complete Code Example

### PowerShell

```powershell
# Configuration
$boardName = "Authentication System"
$taskTitle = "Implement JWT Tokens"
$taskId = "implement-jwt-tokens"
$sourceColumn = "Backlog"
$targetColumn = "In Progress"

# Paths
$boardPath = ".kanbans/$boardName/.kanbn"
$indexFile = "$boardPath/index.md"
$taskFile = "$boardPath/tasks/$taskId.md"

# Read index.md
$indexContent = Get-Content -Path $indexFile -Raw

# Task link to move
$taskLink = "- [$taskTitle](tasks/$taskId.md)"

# Remove from source column
$indexContent = $indexContent -replace "(?m)^- \[$taskTitle\]\(tasks/$taskId\.md\)\r?\n", ""

# Add to target column
$indexContent = $indexContent -replace "## $targetColumn\s*\n", "## $targetColumn`n`n$taskLink`n"

# Write updated index.md
Set-Content -Path $indexFile -Value $indexContent

# Update task metadata
$taskContent = Get-Content -Path $taskFile -Raw
$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

# Update frontmatter
$taskContent = $taskContent -replace "updated: .*", "updated: $timestamp"
$taskContent = $taskContent -replace "progress: 0\s*\n", "progress: 0.1`nstarted: $timestamp`n"

Set-Content -Path $taskFile -Value $taskContent

Write-Host "Task '$taskTitle' moved from $sourceColumn to $targetColumn!"
```

### Python

```python
from datetime import datetime, timezone
from pathlib import Path
import re

def move_task(board_name, task_id, task_title, source_column, target_column):
    # Paths
    board_path = Path(f".kanbans/{board_name}/.kanbn")
    index_file = board_path / "index.md"
    task_file = board_path / "tasks" / f"{task_id}.md"
    
    # Read index.md
    index_content = index_file.read_text(encoding='utf-8')
    
    # Task link
    task_link = f"- [{task_title}](tasks/{task_id}.md)"
    
    # Remove from source column (remove entire line)
    pattern = f"- \\[{re.escape(task_title)}\\]\\(tasks/{task_id}\\.md\\)\\n"
    index_content = re.sub(pattern, "", index_content)
    
    # Add to target column
    pattern = f"## {target_column}\\s*\\n"
    replacement = f"## {target_column}\\n\\n{task_link}\\n"
    index_content = re.sub(pattern, replacement, index_content)
    
    # Write index.md
    index_file.write_text(index_content, encoding='utf-8')
    
    # Update task metadata
    task_content = task_file.read_text(encoding='utf-8')
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    
    # Update timestamp
    task_content = re.sub(r'updated: .*', f'updated: {timestamp}', task_content)
    
    # Add started timestamp if moving to "started" column
    if target_column in ["In Progress", "Development", "Testing"]:
        if 'started:' not in task_content:
            task_content = re.sub(
                r'(progress: \d+\.?\d*)\n',
                f'\\1\\nstarted: {timestamp}\\n',
                task_content
            )
        # Update progress if still 0
        task_content = re.sub(r'progress: 0\n', 'progress: 0.1\\n', task_content)
    
    # Set progress to 1.0 if moving to "completed" column
    if target_column in ["Done", "Completed", "Deployed"]:
        task_content = re.sub(r'progress: \d+\.?\d*', 'progress: 1.0', task_content)
    
    # Write task file
    task_file.write_text(task_content, encoding='utf-8')
    
    print(f"Task '{task_title}' moved from {source_column} to {target_column}!")

# Usage
move_task(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    task_title="Implement JWT Tokens",
    source_column="Backlog",
    target_column="In Progress"
)
```

### Bash

```bash
#!/bin/bash

# Configuration
BOARD_NAME="Authentication System"
TASK_TITLE="Implement JWT Tokens"
TASK_ID="implement-jwt-tokens"
SOURCE_COLUMN="Backlog"
TARGET_COLUMN="In Progress"

# Paths
BOARD_PATH=".kanbans/$BOARD_NAME/.kanbn"
INDEX_FILE="$BOARD_PATH/index.md"
TASK_FILE="$BOARD_PATH/tasks/$TASK_ID.md"

# Task link
TASK_LINK="- [$TASK_TITLE](tasks/$TASK_ID.md)"

# Create temp file
TEMP_FILE=$(mktemp)

# Remove task from source column and add to target
awk -v source="## $SOURCE_COLUMN" -v target="## $TARGET_COLUMN" -v link="$TASK_LINK" '
    /^## / { column = $0 }
    column == source && /^- \[/ && /'$TASK_ID'/ { next }
    column == target && /^## / { print; print ""; print link; next }
    { print }
' "$INDEX_FILE" > "$TEMP_FILE"

mv "$TEMP_FILE" "$INDEX_FILE"

# Update task metadata
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
sed -i "s/updated: .*/updated: $TIMESTAMP/" "$TASK_FILE"
sed -i "s/progress: 0$/progress: 0.1\nstarted: $TIMESTAMP/" "$TASK_FILE"

echo "Task '$TASK_TITLE' moved from $SOURCE_COLUMN to $TARGET_COLUMN!"
```

## Moving to "Done" Column

When moving to a completed column, set progress to 1.0:

```python
def complete_task(board_name, task_id, task_title, source_column):
    move_task(board_name, task_id, task_title, source_column, "Done")
    
    # Additional: Set progress to 1.0
    task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    task_content = task_file.read_text(encoding='utf-8')
    task_content = re.sub(r'progress: \d+\.?\d*', 'progress: 1.0', task_content)
    task_file.write_text(task_content, encoding='utf-8')
    
    print(f"Task '{task_title}' completed!")

# Usage
complete_task(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    task_title="Implement JWT Tokens",
    source_column="In Progress"
)
```

## Moving Multiple Tasks

```python
tasks_to_move = [
    ("implement-jwt-tokens", "Implement JWT Tokens", "Backlog", "In Progress"),
    ("user-registration-flow", "User Registration Flow", "Backlog", "In Progress"),
    ("password-reset-feature", "Password Reset Feature", "In Progress", "Done")
]

for task_id, task_title, source, target in tasks_to_move:
    move_task("Authentication System", task_id, task_title, source, target)
```

## Complete Workflow Example

```python
def start_task(board_name, task_id, task_title, assignee):
    """Move task from Backlog to In Progress and assign"""
    # Move task
    move_task(board_name, task_id, task_title, "Backlog", "In Progress")
    
    # Update assignment
    task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    task_content = task_file.read_text(encoding='utf-8')
    task_content = re.sub(r'assigned: ""', f'assigned: {assignee}', task_content)
    task_file.write_text(task_content, encoding='utf-8')
    
    print(f"Task '{task_title}' started by {assignee}!")

# Usage
start_task(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    task_title="Implement JWT Tokens",
    assignee="Antigravity"
)
```

## Verification

After moving the task:

1. **Check index.md:**
   ```bash
   # Task should be in target column
   sed -n '/## In Progress/,/^##/p' ".kanbans/Authentication System/.kanbn/index.md"
   ```

2. **Check task metadata:**
   ```bash
   # Should show updated timestamp and started field
   head -n 15 ".kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md"
   ```

3. **View in VS Code extension:**
   - Open board
   - Task should appear in target column
   - Task metadata should reflect changes

## Common Movement Patterns

### Backlog → In Progress
```yaml
progress: 0 → 0.1
started: (add current timestamp)
assigned: "" → (assign to someone)
```

### In Progress → Review
```yaml
progress: 0.5 → 0.8
updated: (current timestamp)
```

### Review → Done
```yaml
progress: 0.8 → 1.0
updated: (current timestamp)
tags: (add 'completed')
```

### In Progress → Blocked
```yaml
updated: (current timestamp)
tags: (add 'blocked')
# Add comment explaining blocker
```

## Error Handling

```python
def move_task_safe(board_name, task_id, task_title, source_column, target_column):
    try:
        # Check board exists
        board_path = Path(f".kanbans/{board_name}/.kanbn")
        if not board_path.exists():
            raise FileNotFoundError(f"Board '{board_name}' not found")
        
        # Check task exists
        task_file = board_path / "tasks" / f"{task_id}.md"
        if not task_file.exists():
            raise FileNotFoundError(f"Task '{task_id}' not found")
        
        # Check columns exist in index.md
        index_file = board_path / "index.md"
        index_content = index_file.read_text(encoding='utf-8')
        
        if f"## {source_column}" not in index_content:
            raise ValueError(f"Column '{source_column}' not found")
        if f"## {target_column}" not in index_content:
            raise ValueError(f"Column '{target_column}' not found")
        
        # Perform move
        move_task(board_name, task_id, task_title, source_column, target_column)
        
    except Exception as e:
        print(f"Error moving task: {e}")
        return False
    
    return True
```
