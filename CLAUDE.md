# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Chrome extension (Manifest V3) that prefills Google Gemini's input field via URL parameters. Allows integration with productivity tools like Alfred, Raycast, or browser bookmarks.

## Development Commands

**Load extension for testing:**
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

**No build step required** - this is vanilla JavaScript without bundling.

## Architecture

### Core Files
- `manifest.json` - Extension configuration (Manifest V3), defines content script injection on `gemini.google.com/*`
- `content.js` - Main logic, injected into Gemini pages at `document_idle`
- `popup.html` - Browser action popup showing usage instructions

### Content Script Flow (`content.js`)
1. Parses URL params: `?q=` (prompt text), `?m=` (model selection: 1=Fast, 3=Pro, default=Thinking)
2. Attempts model selection via dropdown interaction (up to 10 retries at 100ms intervals)
3. Fills the contenteditable textbox and auto-clicks send button (up to 20 retries at 50ms intervals)

The retry mechanism handles Gemini's SPA loading delays - elements may not exist immediately.

### Internationalization
- Default locale: `zh_TW` (Traditional Chinese)
- Locales in `_locales/{locale}/messages.json`
- Manifest uses `__MSG_appName__` and `__MSG_appDesc__` placeholders

## URL Parameters

| Param | Purpose | Values |
|-------|---------|--------|
| `q` | Prompt text | URL-encoded string |
| `m` | Model selection | `1`/`fast`=Fast, `3`/`pro`=Pro, omit=Thinking |

Example: `https://gemini.google.com/app?q=Hello&m=1`
