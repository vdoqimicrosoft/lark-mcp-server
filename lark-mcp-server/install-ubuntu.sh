#!/bin/bash
set -e

echo "=== Installing lark-mcp-server (multi-bot) ==="

# 1. Install lark-cli globally
echo "[1/4] Installing lark-cli..."
npm install -g @larksuite/cli

# 2. Install lark-mcp-server dependencies
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
echo "[2/4] Installing MCP server dependencies..."
npm install

# 3. Configure multiple bots
echo "[3/4] Setting up profiles..."
echo ""
echo "You need to configure each bot as a separate profile."
echo "For each bot, you need: name, app_id, app_secret"
echo ""

# Interactive setup
while true; do
  read -p "Enter profile name (or 'done' to finish): " PROF_NAME
  [ "$PROF_NAME" = "done" ] && break

  read -p "Enter App ID: " APP_ID
  read -p "Enter App Secret: " APP_SECRET
  read -p "Brand (feishu/lark) [feishu]: " BRAND
  BRAND=${BRAND:-feishu}

  lark-cli config init --name "$PROF_NAME" --app-id "$APP_ID" --app-secret "$APP_SECRET" --brand "$BRAND"
  echo "Profile '$PROF_NAME' created."
  echo ""
done

# 4. Show profile list
echo "[4/4] Configured profiles:"
lark-cli profile list

echo ""
echo "=== Setup complete ==="
echo ""
echo "Add this to your Claude Code MCP settings (~/.claude/settings.json):"
echo ""
cat << 'JSONEOF'
{
  "mcpServers": {
    "lark": {
      "command": "node",
      "args": ["/absolute/path/to/lark-mcp-server/index.js"]
    }
  }
}
JSONEOF
echo ""
echo "Usage: Each tool has a 'profile' parameter. Specify which bot to use."
echo "Example: lark_im_send with profile='bot-a' uses bot-a identity."
echo "If profile is omitted, the default (active) profile is used."
