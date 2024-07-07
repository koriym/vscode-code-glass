# CodeGlass

## Under development - No satisfactory response yet

CodeGlass is a VS Code extension that uses AI to generate comments for your code. It's powered by Ollama and CodeLlama models.

## Prerequisites

- Node.js (v14 or later)
- npm
- Visual Studio Code
- [Ollama](https://ollama.ai/)

## Getting Started

### 1. Clone and Setup

1. Clone the repository:
   ```
   git clone {this repository}
   cd code-glass
   ```

2. Install dependencies:
   ```
   npm install
   ```

### 2. Running the Extension

1. Open the project in VS Code:
   ```
   code .
   ```

2. Press F5 to start debugging. This will open a new VS Code window with the extension loaded.

3. In the new window, open a code file and run the "CodeGlass: Show Code Preview" command from the command palette (Ctrl+Shift+P or Cmd+Shift+P).

### 3. Adjusting the AI Model

The extension uses an Ollama model. To adjust or change the model:

1. Edit the `Modelfile` in the project root:
   ```
   FROM codellama:7b-instruct

   PARAMETER temperature 0.2
   PARAMETER top_p 0.95

   SYSTEM """
   You are an expert code analyst. Your task is to provide brief, insightful comments about given code snippets. Focus on the main purpose, key features, and potential improvements. Be concise and technical.
   """

   PROMPT """
   Analyze the following code and provide a brief, insightful comment:

   {{.prompt}}

   Your analysis:
   """
   ```

2. Create a new model with Ollama:
   ```
   ollama create codeglass -f Modelfile
   ```

3. Test the model:
   ```
   ollama run codeglass "Analyze this code: print('Hello, World!')"
   ```

4. If needed, adjust the `Modelfile` and repeat steps 2-3 until satisfied.

### 4. Editing the Code

1. Main extension logic is in `src/extension.ts`
2. AI interaction is handled in `src/ollamaConnection.ts`
3. After making changes, recompile the project:
   ```
   npm run compile
   ```
4. Restart the debug session in VS Code (F5) to test your changes.

## Troubleshooting

- If you encounter "Unable to generate comment" errors, check that Ollama is running and the model is correctly loaded.
- For other issues, check the Debug Console in VS Code for detailed error messages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
