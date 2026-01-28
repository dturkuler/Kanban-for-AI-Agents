# VS Code Kanban Extension - Usage and Publishing Guide

## Table of Contents
1. [Using the Extension in Your Projects](#using-the-extension-in-your-projects)
2. [Testing the Extension](#testing-the-extension)
3. [Publishing to VS Code Marketplace](#publishing-to-vs-code-marketplace)
4. [Distribution Alternatives](#distribution-alternatives)

---

## Using the Extension in Your Projects

### Option 1: Development Mode (Testing)

1. **Open the Extension Project:**
   ```bash
   cd c:\projects\kanban-for-ai-agents\kanban-for-ai
   code .
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

4. **Run Extension Development Host:**
   - Press `F5` in VS Code
   - Or: Run → Start Debugging
   - A new VS Code window opens with the extension loaded

5. **Use the Extension:**
   - In the Extension Development Host window, open any project
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Run commands:
     - `Kanban: Create Board`
     - `Kanban: Open Board`
     - `Kanban: Delete Board`

### Option 2: Install Locally (VSIX Package)

1. **Install vsce (VS Code Extension Manager):**

   **Windows (PowerShell):**
   ```powershell
   npm install -g @vscode/vsce
   ```

   **Ubuntu Linux:**
   ```bash
   sudo npm install -g @vscode/vsce
   ```

2. **Package the Extension:**

   **Windows:**
   ```powershell
   cd c:\projects\kanban-for-ai-agents\kanban-for-ai
   
   # Ensure dependencies are installed
   npm install
   
   # Compile TypeScript
   npm run compile
   
   # Package - Method 1: Using npx (recommended, no PATH issues)
   npx @vscode/vsce package
   
   # Package - Method 2: Using vsce directly (if PATH is configured)
   vsce package
   ```

   **Ubuntu Linux:**
   ```bash
   cd ~/projects/kanban-for-ai-agents/kanban-for-ai
   
   # Ensure dependencies are installed
   npm install
   
   # Compile TypeScript
   npm run compile
   
   # Package - Method 1: Using npx (recommended)
   npx @vscode/vsce package
   
   # Package - Method 2: Using vsce directly
   vsce package
   ```

   > **Note:** If `vsce` command is not found, use `npx @vscode/vsce package` instead. This runs the tool without needing it in your PATH.

   **During packaging, you'll be prompted:**
   - "Missing repository field" → Press `y` to continue
   - "LICENSE not found" → Press `y` to continue (or add LICENSE file)

   This creates `kanban-for-ai-agents-0.0.1.vsix`

3. **Install the VSIX:**

   **Windows & Linux:**
   - In VS Code: Extensions view (`Ctrl+Shift+X`)
   - Click `...` (Views and More Actions) in top-right
   - Select "Install from VSIX..."
   - Navigate to the `.vsix` file
   - Click "Install"
   - Reload VS Code when prompted

4. **Use in Any Project:**
   - Open any workspace
   - Extension is now available
   - Press `Ctrl+Shift+P` and use Kanban commands

### Option 3: Install from Source (Symlink)

**Windows (PowerShell - Run as Administrator):**
```powershell
# Navigate to VS Code extensions folder
cd "$env:USERPROFILE\.vscode\extensions"

# Create symbolic link
New-Item -ItemType SymbolicLink -Name "kanban-for-ai-agents" -Target "c:\projects\kanban-for-ai-agents\kanban-for-ai"

# Verify link created
Get-ChildItem | Where-Object {$_.Name -eq "kanban-for-ai-agents"}
```

**Ubuntu Linux:**
```bash
# Navigate to VS Code extensions folder
cd ~/.vscode/extensions

# Create symbolic link
ln -s ~/projects/kanban-for-ai-agents/kanban-for-ai kanban-for-ai-agents

# Verify link created
ls -la | grep kanban-for-ai-agents
```

**After creating symlink:**
1. Reload VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Extension should now be available
3. Any changes to source code will be reflected after recompiling and reloading

---

## Testing the Extension

### 1. Create a Test Project

**Windows:**
```powershell
mkdir test-kanban-project
cd test-kanban-project
code .
```

**Ubuntu Linux:**
```bash
mkdir test-kanban-project
cd test-kanban-project
code .
```

### 2. Create Your First Board

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `Kanban: Create Board`
3. Enter board name: "My First Board"
4. Click "Open Board"

### 3. Add Tasks

1. Click `+` button on any column
2. Enter task title
3. Click on task card to edit details

### 4. Test Features

- ✅ Drag tasks between columns
- ✅ Edit task metadata (progress, tags, assignee)
- ✅ Add sub-tasks
- ✅ Add relations to other tasks
- ✅ Add comments
- ✅ Delete tasks
- ✅ Create/delete boards

---

## Publishing to VS Code Marketplace

### Prerequisites

1. **Microsoft Account:**
   - Create at https://account.microsoft.com

2. **Azure DevOps Organization:**
   - Go to https://dev.azure.com
   - Sign in with Microsoft account
   - Create new organization

3. **Personal Access Token (PAT):**
   - In Azure DevOps: User Settings → Personal Access Tokens
   - Click "New Token"
   - Name: "VS Code Marketplace"
   - Organization: All accessible organizations
   - Scopes: **Marketplace → Manage**
   - Expiration: Custom (1 year recommended)
   - Click "Create"
   - **SAVE THE TOKEN** - you won't see it again!

### Step-by-Step Publishing

#### 1. Prepare package.json

Update `kanban-for-ai/package.json`:

```json
{
  "name": "kanban-for-ai-agents",
  "displayName": "Kanban for AI Agents",
  "description": "Programmatic Kanban board management for AI coding assistants - create, track, and manage tasks via markdown files",
  "version": "0.0.1",
  "publisher": "doganturkuler",
  "repository": {
    "type": "git",
    "url": "https://github.com/doganturkuler/kanban-for-ai-agents"
  },
  "icon": "icon.png",
  "categories": ["Other", "Visualization"],
  "keywords": [
    "kanban",
    "ai",
    "agents",
    "task management",
    "markdown",
    "project management",
    "automation"
  ],
  "engines": {
    "vscode": "^1.80.0"
  }
}
```

**Required fields:**
- `publisher` - Your publisher name (create in step 2)
- `repository` - GitHub repo URL (optional but recommended)
- `icon` - 128x128 PNG icon (optional)

#### 2. Add LICENSE File

A LICENSE file is recommended (and required for some marketplaces).

**Choose a license:**
- **MIT License** - Most permissive, allows commercial use
- **Apache 2.0** - Similar to MIT, includes patent grant
- **GPL-3.0** - Copyleft, requires derivatives to be open source

**Create LICENSE file (MIT example):**

**Windows:**
```powershell
cd c:\projects\kanban-for-ai-agents\kanban-for-ai

# Create LICENSE file
@"
MIT License

Copyright (c) 2026 Dogan Turkuler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@ | Out-File -FilePath LICENSE -Encoding UTF8
```

**Update package.json with license:**
```json
{
  "license": "MIT"
}
```

#### 3. Update package.json for Publishing

**Required fields for publishing:**

```json
{
  "name": "kanban-for-ai-agents",
  "displayName": "Kanban for AI Agents",
  "description": "Programmatic Kanban board management for AI coding assistants - create, track, and manage tasks via markdown files",
  "version": "0.0.1",
  "publisher": "doganturkuler",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/doganturkuler/kanban-for-ai-agents"
  },
  "bugs": {
    "url": "https://github.com/doganturkuler/kanban-for-ai-agents/issues"
  },
  "homepage": "https://github.com/doganturkuler/kanban-for-ai-agents#readme",
  "icon": "icon.png",
  "categories": ["Other", "Visualization"],
  "keywords": [
    "kanban",
    "ai",
    "agents",
    "task management",
    "markdown",
    "project management",
    "automation"
  ],
  "engines": {
    "vscode": "^1.80.0"
  }
}
```

**Field explanations:**
- `name` - Package name (lowercase, no spaces)
- `displayName` - Human-readable name shown in marketplace
- `description` - Short description (under 200 chars)
- `version` - Semantic version (MAJOR.MINOR.PATCH)
- `publisher` - Your publisher ID (create in next step)
- `license` - License type (MIT, Apache-2.0, GPL-3.0, etc.)
- `repository` - GitHub/GitLab repo URL
- `bugs` - Issue tracker URL
- `homepage` - Project homepage
- `icon` - Path to 128x128 PNG icon
- `categories` - Extension category (Other, Programming Languages, etc.)
- `keywords` - Search keywords (max 5)
- `engines.vscode` - Minimum VS Code version

**Optional but recommended:**
```json
{
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  },
  "badges": [
    {
      "url": "https://img.shields.io/github/stars/doganturkuler/kanban-for-ai-agents",
      "href": "https://github.com/doganturkuler/kanban-for-ai-agents",
      "description": "GitHub Stars"
    }
  ],
  "sponsor": {
    "url": "https://github.com/sponsors/doganturkuler"
  }
}
```

#### 4. Create Publisher Account

**Method 1: Via Web Interface (Recommended)**

1. **Go to Marketplace Management:**
   - Visit: https://marketplace.visualstudio.com/manage
   - Sign in with Microsoft account

2. **Create Publisher:**
   - Click "Create Publisher"
   - Fill in details:
     - **Publisher ID**: `doganturkuler`
     - **Display Name**: Dogan Turkuler
     - **Description**: Brief description of you/your organization
     - **Personal Access Token**: Paste the PAT from Prerequisites step

3. **Verify Publisher:**
   - Publisher should now appear in your list
   - Note the Publisher ID - you'll need it for package.json

**Method 2: Via Command Line**

**Windows:**
```powershell
# Create publisher interactively
npx @vscode/vsce create-publisher

# You'll be prompted for:
# - Publisher ID (unique identifier)
# - Display Name
# - Description
# - Personal Access Token
```

**Login to existing publisher:**

**Windows:**
```powershell
npx @vscode/vsce login doganturkuler
# Enter your PAT when prompted
```

**Verify publisher:**
```bash
# Show publisher details
npx @vscode/vsce show doganturkuler
```

**Publisher ID best practices:**
- Use lowercase letters, numbers, and hyphens only
- Make it memorable and professional
- Use your GitHub username for consistency
- Examples: `johndoe`, `acme-corp`, `dev-tools`

#### 5. Add Icon (Optional)

Create `icon.png` (128x128 pixels) in project root.

**Icon requirements:**
- Size: 128x128 pixels
- Format: PNG
- Clear and recognizable
- Works on both light and dark backgrounds

**Quick icon creation options:**
- Design tools: Figma, Canva, Adobe Illustrator
- Icon generators: https://favicon.io, https://realfavicongenerator.net
- AI tools: DALL-E, Midjourney, Stable Diffusion

#### 6. Add README and CHANGELOG

**README.md:**
```markdown
# Kanban for AI Agents

Programmatic Kanban board management designed for AI coding assistants.

## Features

- Create and manage multiple Kanban boards
- Drag-and-drop task management
- Full task editing with metadata
- Task relations and dependencies
- Progress tracking

## Usage

1. Create board: `Kanban: Create Board`
2. Open board: `Kanban: Open Board`
3. Add tasks using `+` button
4. Drag tasks between columns

## Commands

- `Kanban: Create Board` - Create new board
- `Kanban: Open Board` - Open existing board
- `Kanban: Delete Board` - Delete board
```

**CHANGELOG.md:**
```markdown
# Change Log

## [0.0.1] - 2026-01-28

### Added
- Initial release
- Create, open, and delete boards
- Visual Kanban board interface
- Task CRUD operations
- Drag-and-drop support
- Task metadata editing
```

#### 7. Package Extension

```bash
cd c:\projects\kanban-for-ai-agents\kanban-for-ai

# Ensure all dependencies are installed
npm install

# Compile TypeScript
npm run compile

# Package extension
vsce package
```

This creates `kanban-for-ai-agents-0.0.1.vsix`

#### 8. Publish to Marketplace

```bash
# Login with your publisher name
vsce login doganturkuler
# Enter your PAT

# Publish
vsce publish
```

Or publish manually:
1. Go to https://marketplace.visualstudio.com/manage
2. Click "New Extension" → "Visual Studio Code"
3. Upload the `.vsix` file

#### 9. Verify Publication

- Visit: `https://marketplace.visualstudio.com/items?itemName=doganturkuler.kanban-for-ai-agents`
- Search in VS Code Extensions view
- Install from marketplace

---

## Publishing Updates

### Version Updates

1. **Update version in package.json:**
   ```json
   "version": "0.0.2"
   ```

2. **Update CHANGELOG.md:**
   ```markdown
   ## [0.0.2] - 2026-01-29
   
   ### Added
   - New feature X
   
   ### Fixed
   - Bug Y
   ```

3. **Publish update:**
   ```bash
   vsce publish
   ```

Or use version bump commands:
```bash
vsce publish patch  # 0.0.1 → 0.0.2
vsce publish minor  # 0.0.1 → 0.1.0
vsce publish major  # 0.0.1 → 1.0.0
```

---

## Distribution Alternatives

### 1. GitHub Releases

**Advantages:**
- No publisher account needed
- Version control integration
- Easy for team distribution

**Steps:**
1. Create GitHub repository
2. Package extension: `vsce package`
3. Create GitHub release
4. Attach `.vsix` file to release
5. Users install from VSIX

### 2. Private Distribution

**For internal teams:**

1. **Package extension:**
   ```bash
   vsce package
   ```

2. **Share VSIX file:**
   - Email
   - Shared drive
   - Internal package repository

3. **Users install:**
   - Extensions view → Install from VSIX

### 3. Open VSX Registry

**Alternative to VS Code Marketplace:**

- Used by VSCodium, Gitpod, etc.
- Free and open source
- Publish at: https://open-vsx.org

```bash
# Install ovsx CLI
npm install -g ovsx

# Publish
ovsx publish kanban-for-ai-0.0.1.vsix -p <access-token>
```

---

## Best Practices

### Before Publishing

- ✅ Test extension thoroughly
- ✅ Add comprehensive README
- ✅ Include screenshots/GIFs
- ✅ Add icon (128x128 PNG)
- ✅ Update CHANGELOG
- ✅ Set appropriate version
- ✅ Add license file
- ✅ Test on different OS (Windows, Mac, Linux)

### README Should Include

- Clear description
- Feature list
- Usage instructions
- Screenshots/GIFs
- Commands list
- Configuration options
- Known issues
- Contributing guidelines

### Icon Guidelines

- Size: 128x128 pixels
- Format: PNG
- Clear and recognizable
- Works on light and dark backgrounds

---

## Troubleshooting

### "vsce: command not found" or "vsce is not recognized"

This occurs when npm's global bin directory is not in your system PATH.

**Solution 1: Use npx (Recommended)**
```bash
# Instead of: vsce package
npx @vscode/vsce package

# Instead of: vsce publish
npx @vscode/vsce publish

# Instead of: vsce login
npx @vscode/vsce login <publisher>
```

**Solution 2: Add npm to PATH**

**Windows:**
1. Find npm global bin directory:
   ```powershell
   npm config get prefix
   # Output example: C:\Users\YourName\AppData\Roaming\npm
   ```

2. Add to PATH:
   - Open "Environment Variables" (Search in Start menu)
   - Under "User variables", select "Path"
   - Click "Edit"
   - Click "New"
   - Add the path from step 1
   - Click "OK" on all dialogs
   - **Restart PowerShell/Terminal**

3. Verify:
   ```powershell
   vsce --version
   ```

**Ubuntu Linux:**
1. Find npm global bin directory:
   ```bash
   npm config get prefix
   # Output example: /usr/local
   ```

2. Add to PATH in `~/.bashrc` or `~/.zshrc`:
   ```bash
   echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. Verify:
   ```bash
   vsce --version
   ```

### "Publisher not found"

**Solution:**
```bash
# Create publisher first
vsce create-publisher <publisher-name>
```

Or create at: https://marketplace.visualstudio.com/manage

### "Missing repository field"

**Solution:** Add to package.json:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/yourusername/kanban-for-ai"
}
```

### "Icon not found"

**Solution:**
- Add `icon.png` to project root
- Or remove `"icon"` field from package.json

### Extension not loading

**Check:**
1. Compile errors: `npm run compile`
2. Dependencies installed: `npm install`
3. Activation events in package.json
4. Extension host logs: Help → Toggle Developer Tools

---

## Quick Reference

### Development Workflow

```bash
# 1. Make changes
# Edit TypeScript files

# 2. Compile
npm run compile

# 3. Test
# Press F5 to launch Extension Development Host

# 4. Package
vsce package

# 5. Publish
vsce publish
```

### Important Commands

**Using vsce directly (requires PATH configuration):**
```bash
# Install vsce
npm install -g @vscode/vsce

# Login
vsce login <publisher>

# Package
vsce package

# Publish
vsce publish

# Publish with version bump
vsce publish patch|minor|major

# Show extension info
vsce show <publisher>.<extension>
```

**Using npx (recommended, no PATH issues):**
```bash
# No installation needed!

# Login
npx @vscode/vsce login <publisher>

# Package
npx @vscode/vsce package

# Publish
npx @vscode/vsce publish

# Publish with version bump
npx @vscode/vsce publish patch|minor|major

# Show extension info
npx @vscode/vsce show <publisher>.<extension>
```

### Useful Links

- **VS Code Extension API:** https://code.visualstudio.com/api
- **Publishing Extensions:** https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Marketplace:** https://marketplace.visualstudio.com
- **Manage Publishers:** https://marketplace.visualstudio.com/manage
- **Extension Guidelines:** https://code.visualstudio.com/api/references/extension-guidelines

---

## Example: Complete Publishing Flow

**Windows (PowerShell):**
```powershell
# 1. Prepare extension
cd c:\projects\test1\kanban-for-ai
npm install
npm run compile

# 2. Update package.json
# Set version, publisher, description, etc.

# 3. Create publisher (first time only)
npx @vscode/vsce create-publisher my-publisher-name

# 4. Login
npx @vscode/vsce login my-publisher-name
# Enter PAT when prompted

# 5. Package
npx @vscode/vsce package
# Creates: kanban-for-ai-0.0.1.vsix

# 6. Test locally
# Install VSIX in VS Code and test

# 7. Publish
npx @vscode/vsce publish

# 8. Verify
# Check marketplace.visualstudio.com
```

**Ubuntu Linux:**
```bash
# 1. Prepare extension
cd ~/projects/kanban-for-ai
npm install
npm run compile

# 2. Update package.json
# Set version, publisher, description, etc.

# 3. Create publisher (first time only)
npx @vscode/vsce create-publisher my-publisher-name

# 4. Login
npx @vscode/vsce login my-publisher-name
# Enter PAT when prompted

# 5. Package
npx @vscode/vsce package
# Creates: kanban-for-ai-0.0.1.vsix

# 6. Test locally
# Install VSIX in VS Code and test

# 7. Publish
npx @vscode/vsce publish

# 8. Verify
# Check marketplace.visualstudio.com
```

---

## Next Steps

1. **Test thoroughly** in Extension Development Host
2. **Create publisher** at marketplace.visualstudio.com
3. **Get Personal Access Token** from Azure DevOps
4. **Update package.json** with publisher and metadata
5. **Add README and icon**
6. **Package and test** the VSIX locally
7. **Publish** to marketplace
8. **Share** with users!
