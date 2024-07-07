# CodeGlass Specification

## Project Overview

CodeGlass is a Visual Studio Code extension designed to enhance code readability and understanding. It uses AI to generate insightful comments for source code, making it easier for developers to comprehend complex codebases, learn new languages, and onboard to new projects.

## Core Features

1. **Code Preview**: Display the current active editor's content in a side panel.
2. **AI-Powered Comments**: Generate and display AI-created comments alongside the original code (to be implemented).
3. **Hypertext Capabilities**: Add `@link` annotations to comments, referencing language documentation or library information (to be implemented).

## Technical Specifications

### Extension Details
- **Name**: CodeGlass
- **Display Name**: CodeGlass
- **Description**: View your code with clarity - AI-powered code comments and insights
- **Version**: 0.0.1
- **VS Code Compatibility**: ^1.60.0

### Commands
- `codeglass.showPreview`: Opens a side panel with the current code content

### Activation Events
- On command: `codeglass.showPreview`

### Dependencies
- VS Code Extension API
- TypeScript
- (Future) AI Model for comment generation (e.g., Ollama code-specific model)

## User Interface

### Code Preview Panel
- Opens in a separate column next to the active editor
- Displays the current file's content
- (Future) Will display AI-generated comments alongside the code

## Development Roadmap

1. **Phase 1 (Current)**: Implement basic code preview functionality
    - Create extension structure
    - Implement code reading and display in side panel

2. **Phase 2**: Integrate AI comment generation
    - Connect with Ollama or similar AI model
    - Implement comment generation logic
    - Display generated comments in the preview panel

3. **Phase 3**: Enhance comment functionality
    - Add hyperlink capabilities to comments
    - Implement user interaction for comment editing and approval

4. **Phase 4**: Refine and optimize
    - Improve AI model accuracy
    - Enhance user interface and experience
    - Optimize performance

## Future Considerations

- Support for multiple programming languages
- User customization of AI comment generation
- Integration with version control systems for historical code analysis
- Collaborative features for team code reviews

## Contribution Guidelines

(To be added: Information about how others can contribute to the project)

## License

(To be added: Choose and specify an appropriate open-source license)
