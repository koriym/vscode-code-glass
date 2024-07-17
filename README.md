# CodeGlass

[Japanese](README.ja.md)

CodeGlass is a Visual Studio Code extension designed to enhance code readability and understanding. It uses AI to generate insightful comments for source code, making it easier for developers to comprehend complex codebases, learn new languages, and onboard to new projects.

## Core Features

2. **AI-Powered Comments**: Generate and display AI-created comments alongside the original code.

## Prerequisites

- Node.js (v14 or later)
- npm
- Visual Studio Code
- [Ollama](https://ollama.ai/)

## Getting Started

### 1. Clone and Setup

1. Clone the repository:

2. Install dependencies:
   ```
   npm install
   ```

### 2. Setting up the AI Model

1. Ensure Ollama is installed and running.

2. Pull the AI model:

   ```
   ollama pull deepseek-coder-v2:16b
   ```

3. Create a `Modelfile` in the project root with the following content:

```
FROM deepseek-coder-v2:16b

PARAMETER temperature 1.0
PARAMETER top_p 0.95

SYSTEM """You are a professional AI assistant that analyses source code and generates insightful comments. Your task is to provide concise and clear explanations to improve readability and understanding of the code. 
"""
```

4. Create the CodeGlass model:
   ```
   ollama create codeglass -f Modelfile
   ```

### 3. Running the Extension

1. Open the project in VS Code:
   ```
   code .
   ```

2. Press F5 to start debugging. This will open a new VS Code window with the extension loaded.

3. In the new window, open a code file and run the "CodeGlass: Show Code Preview" command from the command palette (Ctrl+Shift+P or Cmd+Shift+P).

### 4. Editing the Code

1. Main extension logic is in `src/extension.ts`
2. AI interaction is handled in `src/ollamaConnection.ts`, `src/aiConnection.ts`
3. After making changes, recompile the project:
   ```
   npm run compile
   ```
4. Restart the debug session in VS Code (F5) to test your changes.

### 5. Editing Prompts

To customize CodeGlass's functionality or adapt it for different purposes, you can edit the prompts:

1. Open the `prompts.ts` file.
2. Edit the prompts in this file to change the AI's behavior or the content it generates.

By editing the prompts, you can develop features beyond just comment generation. For example, you could adapt CodeGlass for code optimization suggestions, security checks, documentation generation, and various other applications.

## Configuration

CodeGlass allows you to choose between different AI services for code commenting. You can configure this setting through VS Code's settings interface.

### Changing the AI Service

To change the AI service used by CodeGlass:

1. Open the Command Palette (Ctrl+Shift+P on Windows/Linux or Cmd+Shift+P on macOS).
2. Type "Preferences: Open Settings (UI)" and select it.
3. In the search bar of the Settings tab, type "CodeGlass".
4. Look for the `codeglass.connectionType` setting.
5. Use the dropdown menu to select either "ollama" or "deepseek".

Alternatively, you can directly edit your `settings.json` file:

1. Open the Command Palette.
2. Type "Preferences: Open Settings (JSON)" and select it.
3. Add or modify the following setting:

```json
{
  "codeglass.connectionType": "ollama"  // or "deepseek"
}
```

The change should take effect immediately, but you may need to restart VS Code if you don't see the changes applied.

### Available Options

- `ollama`: Use the Ollama AI service for code commenting.
- `deepseek`: Use the DeepSeek AI service for code commenting.

Choose the option that best suits your needs and preferences.

### Additional Setup for DeepSeek

If you choose to use DeepSeek as your AI service, you'll need to perform some additional setup:

1. Create a [DeepSeek](https://www.deepseek.com/) account if you don't already have one.
2. Obtain an API key from your DeepSeek account dashboard.
3. Set up an environment variable named `CODEGLASS_API_KEY` with your DeepSeek API key as its value.

To set up the environment variable:

- On Windows:
    1. Open the Start menu and search for "Environment Variables".
    2. Click on "Edit the system environment variables".
    3. In the System Properties window, click on "Environment Variables".
    4. Under "User variables", click "New" and enter `CODEGLASS_API_KEY` as the variable name and your API key as the value.

- On macOS and Linux:
    1. Open your shell's configuration file (e.g., `~/.bash_profile`, `~/.zshrc`, etc.).
    2. Add the following line: `export CODEGLASS_API_KEY=your_api_key_here`
    3. Save the file and restart your terminal or run `source ~/.bash_profile` (or the appropriate file you edited).

Make sure to restart VS Code after setting up the environment variable to ensure it recognizes the new API key.

Note: Keep your API key confidential and never share it publicly.

## Current Status and Future Development

- The Code Preview feature is implemented and functional.
- Currently, the codellama:7b-instruct model is used for comment generation.
- As for quality, Ollama's is not so good, but this may be a matter of coordination.
- We think it would be nice if we could edit the prompts.

## Troubleshooting

- If you encounter issues with the AI model, ensure Ollama is running and the codeglass model is correctly loaded.
- Check the Debug Console in VS Code for detailed error messages.
- If you're using DeepSeek and experiencing issues, verify that your API key is correctly set in the environment variables.
