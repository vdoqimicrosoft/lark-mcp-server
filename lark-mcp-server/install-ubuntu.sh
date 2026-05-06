#!/bin/bash
#
# Lark/Feishu MCP Server Installation Script for Ubuntu
# ======================================================
# This script installs and configures the Lark MCP server for Claude Code.
# Supports both Feishu (China) and Lark (International) brands.
#
# Usage:
#   ./install-ubuntu.sh                    # Interactive mode
#   ./install-ubuntu.sh --non-interactive  # CI/CD mode
#
# Requirements: Ubuntu 20.04+ or compatible Linux distribution
#

set -e

# ==============================================================================
# Configuration
# ==============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NVM_VERSION="v0.39.7"
NODE_VERSION="lts/*"
LARK_CLI_PACKAGE="@larksuite/cli"
MCP_SERVER_NAME="lark-mcp-server"
CLAUDE_CONFIG_DIR="$HOME/.claude"
CLAUDE_SETTINGS_FILE="$CLAUDE_CONFIG_DIR/settings.json"

# Brand configuration (will be set based on user choice)
FEISHU_API_HOST="https://open.feishu.cn"
LARK_API_HOST="https://open.larksuite.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# Utility Functions
# ==============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

get_user_input() {
    local prompt="$1"
    local default="$2"
    local response

    if [[ "$NON_INTERACTIVE" == "true" ]]; then
        echo "$default"
        return
    fi

    read -p "$prompt [$default]: " response
    echo "${response:-$default}"
}

confirm_action() {
    local prompt="$1"
    local default="${2:-n}"

    if [[ "$NON_INTERACTIVE" == "true" ]]; then
        [[ "$default" == "y" ]]
        return
    fi

    local response
    read -p "$prompt [y/N]: " response
    [[ "${response:-$default}" =~ ^[Yy]$ ]]
}

# ==============================================================================
# Node.js Installation
# ==============================================================================

install_nvm() {
    log_info "Installing nvm (Node Version Manager)..."

    if [[ -d "$HOME/.nvm" ]]; then
        log_warning "nvm already installed. Skipping..."
        return 0
    fi

    # Download and install nvm
    curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash

    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    log_success "nvm installed successfully"
}

install_node() {
    log_info "Checking Node.js installation..."

    if check_command node; then
        local node_version=$(node -v)
        log_success "Node.js $node_version is already installed"

        if check_command npm; then
            log_success "npm $(npm -v) is already installed"
        fi
        return 0
    fi

    log_info "Node.js not found. Installing via nvm..."

    # Install nvm if not present
    if ! check_command nvm; then
        install_nvm
    fi

    # Source nvm for this session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install Node.js LTS
    nvm install "$NODE_VERSION"
    nvm use "$NODE_VERSION"

    log_success "Node.js $(node -v) installed successfully"
    log_success "npm $(npm -v) installed successfully"
}

# ==============================================================================
# Lark CLI Installation
# ==============================================================================

install_lark_cli() {
    log_info "Installing Lark CLI globally..."

    if check_command lark; then
        local current_version=$(lark --version 2>/dev/null || echo "unknown")
        log_warning "Lark CLI is already installed (version: $current_version)"

        if confirm_action "Reinstall Lark CLI?" "n"; then
            npm uninstall -g "$LARK_CLI_PACKAGE" 2>/dev/null || true
        else
            return 0
        fi
    fi

    npm install -g "$LARK_CLI_PACKAGE"

    log_success "Lark CLI installed: $(lark --version)"
}

# ==============================================================================
# MCP Server Dependencies
# ==============================================================================

install_mcp_dependencies() {
    log_info "Installing MCP server dependencies..."

    cd "$SCRIPT_DIR"

    if [[ -f "package.json" ]]; then
        npm install
        log_success "MCP server dependencies installed"
    else
        log_warning "No package.json found. Creating basic MCP server structure..."

        # Create basic package.json if it doesn't exist
        cat > package.json << 'EOF'
{
  "name": "lark-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Lark/Feishu integration with Claude Code",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "keywords": ["mcp", "lark", "feishu", "claude", "ai"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
EOF

        npm install
        log_success "MCP server initialized with default configuration"
    fi
}

# ==============================================================================
# Claude Code Configuration
# ==============================================================================

configure_claude_code() {
    log_info "Configuring Claude Code for MCP server..."

    # Create Claude config directory if it doesn't exist
    mkdir -p "$CLAUDE_CONFIG_DIR"

    # Determine the MCP server path
    local mcp_server_path="$SCRIPT_DIR/index.js"

    # If index.js doesn't exist, check for other entry points
    if [[ ! -f "$mcp_server_path" ]]; then
        if [[ -f "$SCRIPT_DIR/server.js" ]]; then
            mcp_server_path="$SCRIPT_DIR/server.js"
        elif [[ -f "$SCRIPT_DIR/dist/index.js" ]]; then
            mcp_server_path="$SCRIPT_DIR/dist/index.js"
        fi
    fi

    # Create or update settings.json
    if [[ -f "$CLAUDE_SETTINGS_FILE" ]]; then
        log_info "Updating existing Claude Code settings..."

        # Backup existing settings
        cp "$CLAUDE_SETTINGS_FILE" "$CLAUDE_SETTINGS_FILE.backup.$(date +%Y%m%d%H%M%S)"

        # Use node to merge JSON (more reliable than sed for JSON)
        node -e "
            const fs = require('fs');
            const settings = JSON.parse(fs.readFileSync('$CLAUDE_SETTINGS_FILE', 'utf8'));

            if (!settings.mcpServers) settings.mcpServers = {};

            settings.mcpServers['$MCP_SERVER_NAME'] = {
                command: 'node',
                args: ['$mcp_server_path'],
                env: process.env.FEISHU_PROFILE ? { FEISHU_PROFILE: process.env.FEISHU_PROFILE } : {}
            };

            fs.writeFileSync('$CLAUDE_SETTINGS_FILE', JSON.stringify(settings, null, 2));
        "

        log_success "Claude Code settings updated"
    else
        log_info "Creating new Claude Code settings..."

        cat > "$CLAUDE_SETTINGS_FILE" << EOF
{
  "mcpServers": {
    "$MCP_SERVER_NAME": {
      "command": "node",
      "args": ["$mcp_server_path"],
      "env": {}
    }
  }
}
EOF

        log_success "Claude Code settings created"
    fi

    log_info "MCP server '$MCP_SERVER_NAME' registered with Claude Code"
}

# ==============================================================================
# Profile Setup
# ==============================================================================

setup_first_profile() {
    log_info "Setting up your first profile..."
    echo ""
    echo "=========================================="
    echo "  Profile Configuration"
    echo "=========================================="
    echo ""
    echo "Choose your platform:"
    echo "  1) Feishu (China - open.feishu.cn)"
    echo "  2) Lark (International - open.larksuite.com)"
    echo ""

    local platform_choice
    if [[ "$NON_INTERACTIVE" == "true" ]]; then
        platform_choice="1"
        log_info "Non-interactive mode: Defaulting to Feishu (China)"
    else
        read -p "Select platform [1/2]: " platform_choice
    fi

    local profile_name
    local api_host

    case "${platform_choice:-1}" in
        2)
            profile_name="lark-intl"
            api_host="$LARK_API_HOST"
            log_info "Selected: Lark (International)"
            ;;
        *)
            profile_name="feishu-china"
            api_host="$FEISHU_API_HOST"
            log_info "Selected: Feishu (China)"
            ;;
    esac

    # Create profiles directory
    local profiles_dir="$SCRIPT_DIR/profiles"
    mkdir -p "$profiles_dir"

    if [[ "$NON_INTERACTIVE" == "true" ]]; then
        log_warning "Non-interactive mode: Skipping credential setup."
        log_info "Please run 'lark login' manually to authenticate."

        # Create placeholder profile config
        cat > "$profiles_dir/$profile_name.json" << EOF
{
  "name": "$profile_name",
  "platform": "$([ "$platform_choice" = "2" ] && echo "lark" || echo "feishu")",
  "apiHost": "$api_host",
  "appId": "",
  "appSecret": "",
  "createdAt": "$(date -Iseconds)"
}
EOF

        log_info "Profile template created at: $profiles_dir/$profile_name.json"
        log_info "Edit this file with your App ID and App Secret, or run: lark login"
        return 0
    fi

    # Interactive credential setup
    echo ""
    echo "To create a bot, you need:"
    echo "  1. Go to ${api_host}/app"
    echo "  2. Create a custom app"
    echo "  3. Get your App ID and App Secret"
    echo ""

    local app_id=$(get_user_input "Enter your App ID" "")
    local app_secret=$(get_user_input "Enter your App Secret" "")

    if [[ -n "$app_id" && -n "$app_secret" ]]; then
        cat > "$profiles_dir/$profile_name.json" << EOF
{
  "name": "$profile_name",
  "platform": "$([ "$platform_choice" = "2" ] && echo "lark" || echo "feishu")",
  "apiHost": "$api_host",
  "appId": "$app_id",
  "appSecret": "$app_secret",
  "createdAt": "$(date -Iseconds)"
}
EOF

        log_success "Profile '$profile_name' created successfully"

        # Set as default profile
        export FEISHU_PROFILE="$profile_name"
        echo "export FEISHU_PROFILE=\"$profile_name\"" >> ~/.bashrc

        log_info "Set '$profile_name' as default profile"
    else
        log_warning "No credentials provided. Profile created without credentials."
        log_info "Run 'lark login' later to authenticate"
    fi
}

# ==============================================================================
# Environment Setup
# ==============================================================================

setup_environment() {
    log_info "Setting up environment variables..."

    # Add nvm to shell config if not already present
    local shell_config="$HOME/.bashrc"

    if ! grep -q 'NVM_DIR' "$shell_config" 2>/dev/null; then
        cat >> "$shell_config" << 'EOF'

# NVM configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
EOF
        log_info "Added nvm configuration to $shell_config"
    fi

    # Add lark-mcp-server to PATH
    if ! grep -q 'lark-mcp-server' "$shell_config" 2>/dev/null; then
        cat >> "$shell_config" << EOF

# Lark MCP Server
export LARK_MCP_SERVER_DIR="$SCRIPT_DIR"
EOF
        log_info "Added Lark MCP Server configuration to $shell_config"
    fi
}

# ==============================================================================
# Main Installation Flow
# ==============================================================================

print_banner() {
    echo ""
    echo "=========================================="
    echo "  Lark/Feishu MCP Server Installer"
    echo "  For Ubuntu Linux"
    echo "=========================================="
    echo ""
}

print_summary() {
    echo ""
    echo "=========================================="
    echo "  Installation Complete!"
    echo "=========================================="
    echo ""
    echo "Installed components:"
    echo "  - Node.js: $(node -v 2>/dev/null || echo 'Not found')"
    echo "  - npm: $(npm -v 2>/dev/null || echo 'Not found')"
    echo "  - Lark CLI: $(lark --version 2>/dev/null || echo 'Not found')"
    echo ""
    echo "Configuration:"
    echo "  - MCP Server: $SCRIPT_DIR"
    echo "  - Claude Settings: $CLAUDE_SETTINGS_FILE"
    echo "  - Profiles: $SCRIPT_DIR/profiles/"
    echo ""
    echo "Next steps:"
    echo "  1. Restart your terminal or run: source ~/.bashrc"
    echo "  2. Verify installation: lark --version"
    echo "  3. Test MCP server: claude --mcp-debug"
    echo ""
    echo "For more information, see:"
    echo "  - README.md for detailed documentation"
    echo "  - QUICKSTART.md for a 5-minute setup guide"
    echo ""
}

main() {
    # Parse arguments
    NON_INTERACTIVE="false"
    while [[ $# -gt 0 ]]; do
        case $1 in
            --non-interactive|-n)
                NON_INTERACTIVE="true"
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --non-interactive, -n  Run without prompts (for CI/CD)"
                echo "  --help, -h            Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    print_banner

    # Check for required system packages
    log_info "Checking system requirements..."

    if ! check_command curl; then
        log_error "curl is required but not installed."
        log_info "Install with: sudo apt update && sudo apt install -y curl"
        exit 1
    fi

    # Installation steps
    install_node
    install_lark_cli
    install_mcp_dependencies
    configure_claude_code
    setup_environment
    setup_first_profile

    print_summary
}

# Run main function
main "$@"
