# CodeGlass - WIP

CodeGlass is a Visual Studio Code extension designed to enhance code readability and understanding. It uses AI to generate insightful comments for source code, making it easier for developers to comprehend complex codebases, learn new languages, and onboard to new projects.

## Core Features

1. **Code Preview**: Display the current active editor's content in a side panel.
2. **AI-Powered Comments**: Generate and display AI-created comments alongside the original code (to be implemented).
3. **Hypertext Capabilities**: Add @link annotations to comments, referencing language documentation or library information (to be implemented).

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

2. Pull the codellama:7b-instruct model:

   ```
   ollama pull deepseek-coder-v2:16b
   ```

3. Create a `Modelfile` in the project root with the following content:

```
FROM deepseek-coder-v2:16b

PARAMETER temperature 0.2
PARAMETER top_p 0.95

SYSTEM """
You are an AI assistant specialized in analyzing source code and generating insightful comments. Your task is to enhance code readability and understanding by providing brief, clear explanations. Focus on:
1. Summarizing the main purpose of the code.
2. Identifying key algorithms or design patterns used.
3. Highlighting potential issues or areas for improvement.
4. Explaining complex or non-obvious parts of the code.
Be precise, technical, and keep your comments concise.
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
2. AI interaction is handled in `src/ollamaConnection.ts`
3. After making changes, recompile the project:
   ```
   npm run compile
   ```
4. Restart the debug session in VS Code (F5) to test your changes.

## Current Status and Future Development

- The Code Preview feature is implemented and functional.
- AI-Powered Comments and Hypertext Capabilities are planned for future implementation.
- We are currently using the codellama:7b-instruct model for generating comments.

## Troubleshooting

- If you encounter issues with the AI model, ensure Ollama is running and the codeglass model is correctly loaded.
- Check the Debug Console in VS Code for detailed error messages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
