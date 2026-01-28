# Example: Updating Task Progress

This example shows how to programmatically update task progress and metadata.

## Scenario

Update progress on "Implement JWT Tokens" task as work progresses.

## Step-by-Step Updates

### Initial State (Not Started)

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T04:00:00.000Z
assigned: ""
progress: 0
tags: []
---
```

### After Starting Work (10% Complete)

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

### Mid-Implementation (50% Complete)

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T06:00:00.000Z
assigned: Antigravity
progress: 0.5
tags:
  - backend
  - authentication
started: 2026-01-28T04:30:00.000Z
---
```

### Near Completion (90% Complete)

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T08:00:00.000Z
assigned: Antigravity
progress: 0.9
tags:
  - backend
  - authentication
  - needs-review
started: 2026-01-28T04:30:00.000Z
---
```

### Completed (100%)

```yaml
---
created: 2026-01-28T04:00:00.000Z
updated: 2026-01-28T09:00:00.000Z
assigned: Antigravity
progress: 1.0
tags:
  - backend
  - authentication
  - completed
started: 2026-01-28T04:30:00.000Z
---
```

## Complete Code Example

### PowerShell

```powershell
function Update-TaskProgress {
    param(
        [string]$BoardName,
        [string]$TaskId,
        [double]$Progress,
        [string[]]$Tags = @(),
        [string]$Assignee = ""
    )
    
    $taskFile = ".kanbans/$BoardName/.kanbn/tasks/$TaskId.md"
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    
    # Read task file
    $content = Get-Content -Path $taskFile -Raw
    
    # Update metadata
    $content = $content -replace "updated: .*", "updated: $timestamp"
    $content = $content -replace "progress: \d+\.?\d*", "progress: $Progress"
    
    if ($Assignee) {
        $content = $content -replace 'assigned: .*', "assigned: $Assignee"
    }
    
    if ($Tags.Count -gt 0) {
        $tagYaml = "tags:`n" + ($Tags | ForEach-Object { "  - $_" }) -join "`n"
        $content = $content -replace "tags: \[\]", $tagYaml
    }
    
    # Write updated content
    Set-Content -Path $taskFile -Value $content
    
    Write-Host "Task progress updated to $($Progress * 100)%"
}

# Usage
Update-TaskProgress -BoardName "Authentication System" `
                    -TaskId "implement-jwt-tokens" `
                    -Progress 0.5 `
                    -Tags @("backend", "authentication") `
                    -Assignee "Antigravity"
```

### Python

```python
from datetime import datetime, timezone
from pathlib import Path
import re

def update_task_progress(board_name, task_id, progress, tags=None, assignee=None):
    """Update task progress and metadata"""
    task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    
    # Read task content
    content = task_file.read_text(encoding='utf-8')
    
    # Current timestamp
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    
    # Update timestamp
    content = re.sub(r'updated: .*', f'updated: {timestamp}', content)
    
    # Update progress
    content = re.sub(r'progress: \d+\.?\d*', f'progress: {progress}', content)
    
    # Update assignee if provided
    if assignee:
        content = re.sub(r'assigned: .*', f'assigned: {assignee}', content)
    
    # Update tags if provided
    if tags:
        tag_yaml = "tags:\n" + "\n".join(f"  - {tag}" for tag in tags)
        content = re.sub(r'tags: \[\]', tag_yaml, content)
    
    # Write updated content
    task_file.write_text(content, encoding='utf-8')
    
    print(f"Task progress updated to {progress * 100}%")

# Usage
update_task_progress(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    progress=0.5,
    tags=["backend", "authentication", "in-progress"],
    assignee="Antigravity"
)
```

### Bash

```bash
#!/bin/bash

update_task_progress() {
    local board_name=$1
    local task_id=$2
    local progress=$3
    
    local task_file=".kanbans/$board_name/.kanbn/tasks/$task_id.md"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # Update timestamp
    sed -i "s/updated: .*/updated: $timestamp/" "$task_file"
    
    # Update progress
    sed -i "s/progress: .*/progress: $progress/" "$task_file"
    
    echo "Task progress updated to $(echo "$progress * 100" | bc)%"
}

# Usage
update_task_progress "Authentication System" "implement-jwt-tokens" 0.5
```

## Updating with Sub-task Completion

```python
def complete_subtask(board_name, task_id, subtask_text):
    """Mark a sub-task as complete and update progress"""
    task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    content = task_file.read_text(encoding='utf-8')
    
    # Mark sub-task as complete
    pattern = f"- \\[ \\] {re.escape(subtask_text)}"
    replacement = f"- [x] {subtask_text}"
    content = re.sub(pattern, replacement, content)
    
    # Calculate progress based on completed sub-tasks
    total_subtasks = len(re.findall(r'- \[[ x]\]', content))
    completed_subtasks = len(re.findall(r'- \[x\]', content))
    progress = completed_subtasks / total_subtasks if total_subtasks > 0 else 0
    
    # Update progress and timestamp
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    content = re.sub(r'updated: .*', f'updated: {timestamp}', content)
    content = re.sub(r'progress: \d+\.?\d*', f'progress: {progress:.2f}', content)
    
    # Write updated content
    task_file.write_text(content, encoding='utf-8')
    
    print(f"Sub-task completed. Progress: {progress * 100:.0f}%")

# Usage
complete_subtask(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    subtask_text="Install jsonwebtoken package"
)
```

## Adding Comments with Progress Update

```python
def add_progress_comment(board_name, task_id, progress, author, comment_text):
    """Update progress and add a comment"""
    task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    content = task_file.read_text(encoding='utf-8')
    
    # Update progress
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    content = re.sub(r'updated: .*', f'updated: {timestamp}', content)
    content = re.sub(r'progress: \d+\.?\d*', f'progress: {progress}', content)
    
    # Add comment
    comment = f"\n- author: {author}\n  date: {timestamp}\n  {comment_text}\n"
    
    if "## Comments" in content:
        # Append to existing comments
        content = re.sub(r'(## Comments\n)', f'\\1{comment}', content)
    else:
        # Add Comments section
        content += f"\n## Comments{comment}"
    
    # Write updated content
    task_file.write_text(content, encoding='utf-8')
    
    print(f"Progress updated to {progress * 100}% with comment added")

# Usage
add_progress_comment(
    board_name="Authentication System",
    task_id="implement-jwt-tokens",
    progress=0.7,
    author="Antigravity",
    comment_text="Token generation and validation complete. Working on refresh token logic."
)
```

## Progress Tracking Workflow

```python
class TaskProgressTracker:
    def __init__(self, board_name, task_id):
        self.board_name = board_name
        self.task_id = task_id
        self.task_file = Path(f".kanbans/{board_name}/.kanbn/tasks/{task_id}.md")
    
    def start(self, assignee):
        """Start working on task"""
        update_task_progress(self.board_name, self.task_id, 0.1, assignee=assignee)
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        
        # Add started timestamp
        content = self.task_file.read_text(encoding='utf-8')
        if 'started:' not in content:
            content = re.sub(
                r'(progress: \d+\.?\d*)\n',
                f'\\1\nstarted: {timestamp}\n',
                content
            )
            self.task_file.write_text(content, encoding='utf-8')
        
        print(f"Task started by {assignee}")
    
    def update(self, progress, comment=None):
        """Update progress with optional comment"""
        if comment:
            add_progress_comment(self.board_name, self.task_id, progress, "Antigravity", comment)
        else:
            update_task_progress(self.board_name, self.task_id, progress)
    
    def complete(self):
        """Mark task as complete"""
        update_task_progress(self.board_name, self.task_id, 1.0, tags=["completed"])
        print("Task completed!")

# Usage
tracker = TaskProgressTracker("Authentication System", "implement-jwt-tokens")
tracker.start("Antigravity")
tracker.update(0.3, "Completed research and library selection")
tracker.update(0.6, "Token generation implemented")
tracker.update(0.9, "All tests passing, ready for review")
tracker.complete()
```

## Verification

After updating progress:

1. **Check metadata:**
   ```bash
   head -n 15 ".kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md"
   ```

2. **Verify progress value:**
   ```bash
   grep "progress:" ".kanbans/Authentication System/.kanbn/tasks/implement-jwt-tokens.md"
   ```

3. **View in VS Code extension:**
   - Open task
   - Check progress field
   - Verify updated timestamp

## Progress Guidelines

| Progress | Stage | Description |
|----------|-------|-------------|
| 0 | Not Started | Task created but no work begun |
| 0.1-0.3 | Planning | Research, design, planning phase |
| 0.4-0.6 | Implementation | Active development work |
| 0.7-0.9 | Testing | Implementation complete, testing/refinement |
| 1.0 | Complete | All work finished and verified |

## Common Patterns

### Incremental Updates

```python
# Start
update_task_progress(board, task, 0.1, assignee="Antigravity")

# After each major milestone
update_task_progress(board, task, 0.25)  # Research complete
update_task_progress(board, task, 0.5)   # Implementation half done
update_task_progress(board, task, 0.75)  # Implementation complete
update_task_progress(board, task, 0.9)   # Tests passing
update_task_progress(board, task, 1.0)   # Complete
```

### Based on Sub-tasks

```python
# Automatically calculate from sub-task completion
total = 5
completed = 3
progress = completed / total  # 0.6
update_task_progress(board, task, progress)
```

### With Status Tags

```python
# Update tags based on progress
if progress < 0.3:
    tags = ["planning"]
elif progress < 0.7:
    tags = ["in-progress"]
elif progress < 1.0:
    tags = ["testing", "needs-review"]
else:
    tags = ["completed"]

update_task_progress(board, task, progress, tags=tags)
```
