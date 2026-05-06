# Quick Start Guide

Get your Lark/Feishu MCP server running in 5 minutes. This guide walks you through the essential setup steps.

## Prerequisites

Before starting, make sure you have:

- Ubuntu 20.04+ or compatible Linux
- A Lark or Feishu account with admin access
- A terminal with internet access

## Step 1: Run the Installer (1 minute)

```bash
cd /path/to/lark-mcp-server
chmod +x install-ubuntu.sh
./install-ubuntu.sh
```

The installer will:
- Install Node.js (if needed)
- Install Lark CLI
- Install MCP dependencies
- Configure Claude Code

## Step 2: Create Your Bot (2 minutes)

### For Feishu (China)

1. Go to https://open.feishu.cn/app
2. Click "Create Custom App"
3. Fill in the app name (e.g., "Claude Assistant")
4. Copy the **App ID** and **App Secret**

### For Lark (International)

1. Go to https://open.larksuite.com/app
2. Click "Create Custom App"
3. Fill in the app name
4. Copy the **App ID** and **App Secret**

## Step 3: Configure Permissions (1 minute)

In your app's developer console:

1. Go to "Permissions & Scopes"
2. Enable these essential permissions:
   - `im:message` - Send and receive messages
   - `doc:document` - Access documents
   - `calendar:calendar` - Manage calendar
   - `task:task` - Access tasks

3. Configure event subscriptions:
   - Add your webhook URL or use the Lark CLI for local development

## Step 4: Create Your First Profile (1 minute)

### Option A: Interactive Setup

```bash
# The installer already prompted you for profile setup
# If you skipped it, run:
lark login
```

### Option B: Manual Setup

Create `profiles/default.json`:

```json
{
  "name": "default",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "cli_your_app_id_here",
  "appSecret": "your_app_secret_here",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Step 5: Test with Claude Code

```bash
# Start Claude Code
claude

# Ask Claude to interact with Lark
> Send a test message to myself saying "MCP server is working!"
```

If successful, Claude will use the `lark_send_message` tool to send your message.

## Verifying Installation

Run these commands to verify everything is set up:

```bash
# Check Node.js
node -v

# Check Lark CLI
lark --version

# Check MCP server starts
node index.js --test

# Check Claude Code configuration
cat ~/.claude/settings.json
```

## Common First-Time Issues

### "node: command not found"

Restart your terminal or run:
```bash
source ~/.bashrc
```

### "Authentication failed"

1. Verify your App ID and Secret are correct
2. Check you're using the right platform (Feishu vs Lark)
3. Ensure permissions are enabled in the developer console

### "MCP server not found"

1. Check the path in `~/.claude/settings.json` is absolute
2. Verify the path exists: `ls /path/to/lark-mcp-server/index.js`

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- See [examples/multi-account.md](examples/multi-account.md) to set up multiple bots
- Explore available tools in the Tools Reference section

## Getting Help

- Check the [Troubleshooting](README.md#troubleshooting) section
- Open an issue on GitHub
- Review Lark/Feishu API documentation

---

That's it! You're ready to use Lark/Feishu with Claude Code.
