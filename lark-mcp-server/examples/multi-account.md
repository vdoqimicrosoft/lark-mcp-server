# Multi-Account Setup Guide

This guide explains how to configure multiple Lark/Feishu accounts (bots) with isolated credentials and configurations. This is useful when you need to:

- Separate work and personal accounts
- Manage bots for different teams or organizations
- Handle different regions (Feishu China and Lark International)
- Implement rate limit isolation

## Overview

Each profile contains:
- Platform selection (Feishu/Lark)
- API credentials (App ID, App Secret)
- Custom configuration options
- Isolated token cache

## Profile Storage

Profiles are stored as JSON files in the `profiles/` directory:

```
lark-mcp-server/
└── profiles/
    ├── default.json
    ├── work-bot.json
    ├── personal-bot.json
    └── intl-bot.json
```

## Creating Profiles

### Method 1: Using the CLI

```bash
# Create a new profile interactively
lark profile create

# List all profiles
lark profile list

# Set active profile
lark profile use work-bot
```

### Method 2: Manual JSON Creation

Create a JSON file in `profiles/` with the following structure:

```json
{
  "name": "profile-name",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "cli_xxxxxxxxxxxx",
  "appSecret": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptKey": "optional-encrypt-key",
  "verificationToken": "optional-verification-token",
  "webhookUrl": "optional-webhook-url",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Profile Configuration Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique profile identifier |
| `platform` | Yes | `feishu` or `lark` |
| `apiHost` | Yes | API endpoint URL |
| `appId` | Yes | Application ID from developer console |
| `appSecret` | Yes | Application secret |
| `encryptKey` | No | For encrypted webhook events |
| `verificationToken` | No | For webhook verification |
| `webhookUrl` | No | Custom webhook URL |
| `createdAt` | No | ISO-8601 timestamp |

## Use Cases

### Case 1: Multiple Organizations

You manage bots for different companies or teams:

```bash
# Create company profiles
profiles/
├── company-a.json    # Company A's Feishu bot
├── company-b.json    # Company B's Feishu bot
└── partner-org.json  # Partner's Lark bot
```

Switch between them:
```bash
export FEISHU_PROFILE=company-a
claude "Send a message to the Project Team group..."

# Later, switch to company-b
export FEISHU_PROFILE=company-b
claude "Check the latest tasks in Sprint Backlog..."
```

### Case 2: Multi-Region Setup

One bot for China (Feishu), one for international (Lark):

```json
// profiles/feishu-china.json
{
  "name": "feishu-china",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "cli_china_app_id",
  "appSecret": "china_app_secret"
}
```

```json
// profiles/lark-intl.json
{
  "name": "lark-intl",
  "platform": "lark",
  "apiHost": "https://open.larksuite.com",
  "appId": "cli_intl_app_id",
  "appSecret": "intl_app_secret"
}
```

### Case 3: Work/Personal Separation

Separate your work and personal bots:

```bash
# Work profile (default)
export FEISHU_PROFILE=work
claude "Create a meeting for tomorrow at 3pm..."

# Personal profile
export FEISHU_PROFILE=personal
claude "Send my family a message about dinner plans..."
```

## Profile Selection Priority

The MCP server determines the active profile in this order:

1. `FEISHU_PROFILE` environment variable
2. `default` profile (if exists)
3. First available profile in `profiles/` directory

## Environment Configuration

### Setting Default Profile

Add to your `~/.bashrc`:

```bash
# Set default Lark MCP profile
export FEISHU_PROFILE="work"

# Optional: Override per session
alias lark-personal='FEISHU_PROFILE=personal claude'
alias lark-work='FEISHU_PROFILE=work claude'
```

### Per-Command Profile

```bash
# Use specific profile for one command
FEISHU_PROFILE=intl-bot claude "Check international messages..."
```

## Claude Code Configuration

To run multiple MCP servers simultaneously, modify `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "lark-work": {
      "command": "node",
      "args": ["/path/to/lark-mcp-server/index.js"],
      "env": {
        "FEISHU_PROFILE": "work"
      }
    },
    "lark-personal": {
      "command": "node",
      "args": ["/path/to/lark-mcp-server/index.js"],
      "env": {
        "FEISHU_PROFILE": "personal"
      }
    },
    "lark-intl": {
      "command": "node",
      "args": ["/path/to/lark-mcp-server/index.js"],
      "env": {
        "FEISHU_PROFILE": "intl-bot"
      }
    }
  }
}
```

Then in Claude Code:
```
Use the lark-work MCP to send a message to my team...
Now use lark-personal to check my calendar...
```

## Isolation Guarantees

Each profile maintains separate:

### Token Cache
- Access tokens are cached per profile
- Token refresh happens independently
- No cross-profile token leakage

### Rate Limits
- Each profile has its own rate limit quota
- High-usage profile won't affect others
- Safe to run concurrent requests

### Conversation Context
- Chat IDs are resolved per profile
- User lookups are profile-specific
- No confusion between organizations

## Security Best Practices

### 1. Restrict File Permissions

```bash
# Profiles contain sensitive credentials
chmod 700 profiles/
chmod 600 profiles/*.json
```

### 2. Use Environment Variables for Secrets

Instead of storing secrets in JSON files:

```json
{
  "name": "secure-profile",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "${FEISHU_APP_ID}",
  "appSecret": "${FEISHU_APP_SECRET}"
}
```

Then set environment variables:
```bash
export FEISHU_APP_ID="cli_xxxx"
export FEISHU_APP_SECRET="xxxx"
```

### 3. Rotate Credentials Regularly

```bash
# Update credentials
lark profile update work-bot --app-id "cli_new_id" --app-secret "new_secret"
```

### 4. Audit Profile Access

```bash
# Check who can read profile files
ls -la profiles/
```

## Troubleshooting

### Profile Not Found

**Error**: `Profile 'xxx' not found`

**Solution**: 
- Verify file exists: `ls profiles/xxx.json`
- Check JSON is valid: `cat profiles/xxx.json | jq .`

### Authentication Failed for Specific Profile

**Error**: `Authentication failed for profile 'xxx'`

**Solution**:
1. Verify credentials in developer console
2. Check platform matches (Feishu vs Lark)
3. Ensure permissions are enabled

### Wrong Profile Active

**Error**: Messages sent to wrong organization

**Solution**:
```bash
# Check current profile
echo $FEISHU_PROFILE

# Verify available profiles
ls -la profiles/
```

## Advanced: Profile Templates

Create reusable templates for common setups:

```bash
# Create template
cat > profiles/templates/team-bot.json << 'EOF'
{
  "name": "{{TEAM_NAME}}",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "{{APP_ID}}",
  "appSecret": "{{APP_SECRET}}"
}
EOF

# Instantiate for a new team
sed -e 's/{{TEAM_NAME}}/marketing-team/' \
    -e 's/{{APP_ID}}/cli_marketing_id/' \
    -e 's/{{APP_SECRET}}/marketing_secret/' \
    profiles/templates/team-bot.json > profiles/marketing.json
```

## Summary

| Task | Command |
|------|---------|
| Create profile | `lark profile create` or create JSON file |
| List profiles | `ls profiles/` or `lark profile list` |
| Switch profile | `export FEISHU_PROFILE=name` |
| Current profile | `echo $FEISHU_PROFILE` |
| Multi-server config | Add multiple entries to `settings.json` |

For more information, see the main [README.md](../README.md).
