# Example: Creating a New Board

This example shows how to programmatically create a complete Kanban board.

## Scenario

Create a new board called "Authentication System" with default columns.

## Step-by-Step

### Step 1: Create Directory Structure

```bash
# Create board directory
mkdir -p ".kanbans/Authentication System/.kanbn/tasks"
```

**Result:**
```
.kanbans/
└── Authentication System/
    └── .kanbn/
        └── tasks/
```

### Step 2: Create index.md

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

## In Progress

## Done
```

### Step 3: Verify Structure

```bash
# List directory structure
ls -R ".kanbans/Authentication System"
```

**Expected Output:**
```
.kanbans/Authentication System/:
.kanbn

.kanbans/Authentication System/.kanbn:
index.md
tasks

.kanbans/Authentication System/.kanbn/tasks:
(empty)
```

## Complete Code Example

### PowerShell

```powershell
# Define board name
$boardName = "Authentication System"
$boardPath = ".kanbans/$boardName/.kanbn"

# Create directories
New-Item -ItemType Directory -Path "$boardPath/tasks" -Force

# Create index.md content
$indexContent = @"
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# $boardName

## Backlog

## In Progress

## Done
"@

# Write index.md
Set-Content -Path "$boardPath/index.md" -Value $indexContent

Write-Host "Board '$boardName' created successfully!"
```

### Bash

```bash
#!/bin/bash

# Define board name
BOARD_NAME="Authentication System"
BOARD_PATH=".kanbans/$BOARD_NAME/.kanbn"

# Create directories
mkdir -p "$BOARD_PATH/tasks"

# Create index.md
cat > "$BOARD_PATH/index.md" << 'EOF'
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# Authentication System

## Backlog

## In Progress

## Done
EOF

echo "Board '$BOARD_NAME' created successfully!"
```

### Python

```python
import os
from pathlib import Path

def create_board(board_name):
    # Define paths
    board_path = Path(f".kanbans/{board_name}/.kanbn")
    tasks_path = board_path / "tasks"
    index_path = board_path / "index.md"
    
    # Create directories
    tasks_path.mkdir(parents=True, exist_ok=True)
    
    # Create index.md content
    index_content = f"""---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# {board_name}

## Backlog

## In Progress

## Done
"""
    
    # Write index.md
    index_path.write_text(index_content, encoding='utf-8')
    
    print(f"Board '{board_name}' created successfully!")

# Usage
create_board("Authentication System")
```

## Custom Columns Example

Create a board with custom workflow columns:

```markdown
---
settings:
  completedColumns:
    - Done
    - Deployed
  startedColumns:
    - In Progress
    - Testing
    - Review
---

# Authentication System

## Backlog

## In Progress

## Testing

## Review

## Done

## Deployed
```

## Multiple Boards Example

Create multiple boards for different projects:

```bash
# Create multiple boards
boards=("Authentication System" "Payment Integration" "User Dashboard")

for board in "${boards[@]}"; do
    mkdir -p ".kanbans/$board/.kanbn/tasks"
    
    cat > ".kanbans/$board/.kanbn/index.md" << EOF
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
---

# $board

## Backlog

## In Progress

## Done
EOF
    
    echo "Created board: $board"
done
```

## Verification

After creating the board, verify it's correct:

1. **Check directory exists:**
   ```bash
   test -d ".kanbans/Authentication System/.kanbn/tasks" && echo "✓ Directory structure correct"
   ```

2. **Check index.md exists:**
   ```bash
   test -f ".kanbans/Authentication System/.kanbn/index.md" && echo "✓ index.md created"
   ```

3. **Validate YAML frontmatter:**
   ```bash
   head -n 10 ".kanbans/Authentication System/.kanbn/index.md"
   ```

4. **Open in VS Code extension:**
   - Run command: `Kanban: Open Board`
   - Select "Authentication System"
   - Should show empty board with three columns

## Common Variations

### Minimal Board (Backlog + Done)

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns: []
---

# Simple Project

## Backlog

## Done
```

### Agile Sprint Board

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - Sprint Backlog
    - In Progress
    - Review
---

# Sprint 3

## Product Backlog

## Sprint Backlog

## In Progress

## Review

## Done
```

### Kanban with WIP Limits (Documentation Only)

```markdown
---
settings:
  completedColumns:
    - Done
  startedColumns:
    - In Progress
    - Testing
---

# Development Board

## Backlog

## In Progress
<!-- WIP Limit: 3 tasks -->

## Testing
<!-- WIP Limit: 2 tasks -->

## Done
```

Note: WIP limits are documentation only - not enforced by the system.
