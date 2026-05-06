# Lark/Feishu MCP Server

A Model Context Protocol (MCP) server that enables Claude Code to interact with Lark (International) and Feishu (China) platforms. Send messages, manage documents, handle calendar events, and automate workflows through natural language commands.

## What This MCP Server Does

This server bridges Claude Code with the Lark/Feishu collaboration platform, providing:

- **Messaging**: Send and receive messages in chats and groups
- **Documents**: Create, read, and edit Lark documents and wikis
- **Calendar**: Manage calendar events and schedules
- **Tasks**: Create and track tasks and to-do items
- **Contacts**: Access user profiles and organizational structure
- **Approval Flows**: Interact with approval workflows
- **Bitable**: Work with Lark Base (database) records
- **Storage**: Manage files and folders in Lark Drive

## Supported Platforms

| Platform | Region | API Host |
|----------|--------|----------|
| Feishu | China | open.feishu.cn |
| Lark | International | open.larksuite.com |

## Installation

### Prerequisites

- Ubuntu 20.04+ or compatible Linux distribution
- curl (for downloading packages)

### Quick Install

```bash
# Clone or download the repository
cd /path/to/lark-mcp-server

# Make the installation script executable
chmod +x install-ubuntu.sh

# Run the installer
./install-ubuntu.sh
```

### Non-Interactive Installation (CI/CD)

```bash
./install-ubuntu.sh --non-interactive
```

### Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### 1. Install Node.js via nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

#### 2. Install Lark CLI

```bash
npm install -g @larksuite/cli
```

#### 3. Install MCP Server Dependencies

```bash
cd lark-mcp-server
npm install
```

#### 4. Configure Claude Code

Create or edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "lark-mcp-server": {
      "command": "node",
      "args": ["/path/to/lark-mcp-server/index.js"],
      "env": {}
    }
  }
}
```

</details>

## Multi-Account Setup

This MCP server supports multiple Lark/Feishu accounts through profiles. Each profile represents a separate bot with its own credentials.

### Creating Profiles

#### Interactive Mode

```bash
# Create a new profile interactively
lark profile create
```

#### Manual Profile Creation

Create a JSON file in the `profiles/` directory:

```json
{
  "name": "my-work-bot",
  "platform": "feishu",
  "apiHost": "https://open.feishu.cn",
  "appId": "cli_xxxxxxxxxxxx",
  "appSecret": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Switching Profiles

```bash
# Set active profile
export FEISHU_PROFILE="my-work-bot"

# Or specify when running
FEISHU_PROFILE="my-work-bot" claude
```

### Profile Isolation

Each profile maintains separate:
- Authentication tokens
- Cache data
- Conversation history
- Rate limit counters

See [examples/multi-account.md](examples/multi-account.md) for detailed multi-account setup.

## Available Tools

### Messaging Tools

| Tool | Description |
|------|-------------|
| `lark_send_message` | Send a message to a chat or user |
| `lark_send_card` | Send an interactive card message |
| `lark_get_messages` | Retrieve messages from a chat |
| `lark_reply_message` | Reply to a specific message |
| `lark_update_message` | Update an existing message |
| `lark_delete_message` | Delete a message |

### Document Tools

| Tool | Description |
|------|-------------|
| `lark_create_doc` | Create a new Lark document |
| `lark_get_doc` | Read document content |
| `lark_update_doc` | Update document content |
| `lark_create_wiki` | Create a wiki space |
| `lark_move_doc` | Move document to folder/wiki |

### Calendar Tools

| Tool | Description |
|------|-------------|
| `lark_create_event` | Create a calendar event |
| `lark_get_events` | List calendar events |
| `lark_update_event` | Update an event |
| `lark_delete_event` | Delete an event |
| `lark_create_meeting` | Create a video meeting |

### Task Tools

| Tool | Description |
|------|-------------|
| `lark_create_task` | Create a new task |
| `lark_get_tasks` | List tasks |
| `lark_update_task` | Update task status |
| `lark_assign_task` | Assign task to user |

### Bitable (Database) Tools

| Tool | Description |
|------|-------------|
| `lark_create_bitable` | Create a new Bitable |
| `lark_get_records` | Query records from Bitable |
| `lark_create_record` | Add a new record |
| `lark_update_record` | Update a record |
| `lark_delete_record` | Delete a record |

### Storage Tools

| Tool | Description |
|------|-------------|
| `lark_upload_file` | Upload a file to Lark Drive |
| `lark_download_file` | Download a file |
| `lark_list_folder` | List folder contents |
| `lark_create_folder` | Create a new folder |

### Contact Tools

| Tool | Description |
|------|-------------|
| `lark_get_user` | Get user profile info |
| `lark_search_users` | Search for users |
| `lark_get_department` | Get department info |
| `lark_list_departments` | List organizational structure |

## Usage Examples

### Sending a Message

Ask Claude:
```
Send a message to the "Project Updates" group saying "Build completed successfully!"
```

Claude will use the `lark_send_message` tool to deliver your message.

### Creating a Document

```
Create a meeting notes document titled "Sprint Planning - May 2024"
```

### Scheduling a Meeting

```
Schedule a 1-hour meeting with the team for tomorrow at 2pm
```

### Querying a Database

```
Show me all open tasks from the "Sprint Backlog" Bitable
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FEISHU_PROFILE` | Active profile name | `default` |
| `LARK_MCP_LOG_LEVEL` | Logging verbosity | `info` |
| `LARK_MCP_CACHE_TTL` | Cache TTL in seconds | `3600` |

### Profile Configuration

Each profile JSON file supports:

```json
{
  "name": "profile-name",
  "platform": "feishu" | "lark",
  "apiHost": "https://open.feishu.cn",
  "appId": "cli_xxxxxxxxxxxx",
  "appSecret": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptKey": "optional-encrypt-key",
  "verificationToken": "optional-verification-token",
  "createdAt": "ISO-8601-date"
}
```

## Troubleshooting

### Node.js Issues

**Problem**: `node: command not found`

**Solution**:
```bash
source ~/.bashrc
# Or restart your terminal
```

### Authentication Errors

**Problem**: `Authentication failed` or `Invalid app credentials`

**Solutions**:
1. Verify your App ID and App Secret in the developer console
2. Check that you're using the correct platform (Feishu vs Lark)
3. Ensure the app has the required permissions enabled

```bash
# Re-authenticate
lark login
```

### MCP Server Not Found

**Problem**: Claude Code cannot find the MCP server

**Solutions**:
1. Check the path in `~/.claude/settings.json` is absolute
2. Verify the MCP server starts: `node /path/to/lark-mcp-server/index.js`
3. Check Claude Code logs: `claude --mcp-debug`

### Rate Limiting

**Problem**: `Rate limit exceeded` errors

**Solutions**:
1. Reduce request frequency
2. Use multiple profiles for high-volume scenarios
3. Implement request caching

### Permission Denied

**Problem**: `EACCES` or permission errors

**Solutions**:
```bash
# Fix npm permissions
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Development

### Project Structure

```
lark-mcp-server/
├── index.js              # Main entry point
├── install-ubuntu.sh     # Installation script
├── package.json          # Node.js dependencies
├── profiles/             # User profiles directory
├── tools/                # MCP tool implementations
│   ├── messaging.js
│   ├── documents.js
│   ├── calendar.js
│   └── ...
├── lib/                  # Shared utilities
│   ├── auth.js
│   ├── api.js
│   └── cache.js
└── examples/             # Usage examples
```

### Adding New Tools

1. Create a new file in `tools/`
2. Export the tool definition and handler
3. Register in `index.js`

### Running Tests

```bash
npm test
```

### Debug Mode

```bash
LARK_MCP_LOG_LEVEL=debug claude --mcp-debug
```

## API Reference

For detailed API documentation, see the [Lark Open Platform](https://open.larksuite.com/document) or [Feishu Open Platform](https://open.feishu.cn/document).

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- **Issues**: Open an issue on GitHub
- **Documentation**: See the `docs/` directory
- **Community**: Join our discussion forum
