# AI Assistant Chat Application

## Overview

This is a Flask-based web application that provides a conversational AI interface using OpenAI's GPT-4o model. The application features a responsive chat interface with session-based conversation history, syntax highlighting for code, and a clean dark theme UI.

## System Architecture

### Frontend Architecture
- **HTML/CSS/JavaScript**: Client-side interface built with Bootstrap for responsive design
- **Dark Theme**: Uses Replit's dark theme Bootstrap variant for consistent styling
- **Real-time Chat**: JavaScript-based chat interface with message history
- **Syntax Highlighting**: Prism.js integration for code formatting
- **Session Management**: Client-side session handling with server-side storage

### Backend Architecture
- **Flask Framework**: Lightweight Python web framework serving as the API layer
- **Session-based Storage**: Flask sessions store conversation history without persistent database
- **OpenAI Integration**: Dedicated client class for API communication
- **Error Handling**: Comprehensive logging and error management
- **Environment Configuration**: API keys managed through environment variables

## Key Components

### Core Application Files
- `app.py`: Main Flask application with routing and session management
- `main.py`: Application entry point with development server configuration
- `openai_client.py`: OpenAI API integration and response handling
- `templates/index.html`: Frontend chat interface template
- `static/css/style.css`: Custom styling for chat interface
- `static/js/app.js`: Client-side JavaScript for chat functionality

### OpenAI Client
- **Model**: Uses GPT-4o (latest model as of May 2024)
- **Configuration**: Environment-based API key management
- **System Prompt**: Predefined assistant behavior for programming assistance
- **Error Handling**: Graceful degradation when API key is missing

### Session Management
- **In-Memory Storage**: Conversation history stored in Flask sessions
- **Message History**: Maintains complete conversation context
- **Session Security**: Configurable secret key for session encryption

## Data Flow

1. **User Input**: User types message in chat interface
2. **Client Processing**: JavaScript validates and sends message via POST request
3. **Session Retrieval**: Flask retrieves existing conversation history from session
4. **AI Processing**: OpenAI client processes message with full context
5. **Response Handling**: AI response added to session history
6. **Client Update**: Response sent back to frontend for display

## External Dependencies

### Python Packages
- `flask`: Web framework for HTTP handling
- `openai`: Official OpenAI Python client
- Standard library: `os`, `logging` for configuration and debugging

### Frontend Libraries
- **Bootstrap**: Responsive UI framework with dark theme
- **Prism.js**: Syntax highlighting for code blocks
- **Font Awesome**: Icon library for UI elements

### API Services
- **OpenAI API**: GPT-4o model for AI responses
- **Environment Variables**: `OPENAI_API_KEY` for authentication

## Deployment Strategy

### Development Environment
- **Local Development**: Flask development server on port 5000
- **Debug Mode**: Enabled for development with detailed error logging
- **Hot Reload**: Automatic server restart on code changes

### Production Considerations
- **Environment Variables**: Secure API key management
- **Session Storage**: In-memory sessions (consider Redis for production)
- **Error Handling**: Comprehensive logging for debugging
- **Security**: Configurable session secret key

## Changelog

- July 04, 2025. Initial setup
- July 04, 2025. Fixed typewriter effect text duplication issue by optimizing JavaScript logic
- July 04, 2025. Modified AI system prompt to provide more concise, focused responses
- July 04, 2025. Updated AI system prompt to prioritize practical examples and function syntax for technical questions
- July 04, 2025. Refined AI system prompt to provide direct, practical answers for all types of questions
- July 04, 2025. Temporarily disabled typewriter effect to prevent text duplication issues
- July 04, 2025. Added comprehensive feature upgrade with all requested functionalities
- July 04, 2025. Implemented voice input/output support using browser APIs and OpenAI Whisper/TTS
- July 04, 2025. Added automatic image generation using DALL-E 3 triggered by keywords like "畫", "繪", "生成圖片"
- July 04, 2025. Enhanced UI with sidebar navigation, multi-panel interface, and responsive design
- July 04, 2025. Integrated PostgreSQL database for persistent storage and collaboration features
- July 04, 2025. Added comprehensive document generation capabilities with AI-powered Excel, Word, and Google Sheets creation
- July 04, 2025. Expanded gaming suite with Tetris, Mahjong, and Farm Story games including AI interaction limits
- July 04, 2025. Added cheat code system to Farm Story game, allowing mid-game AI assistant cheat activation
- July 04, 2025. Enhanced QR code generator with download functionality and customizable settings
- July 04, 2025. Added HR administrative spreadsheet templates including attendance tracking, payroll, performance reviews, and recruitment management
- July 04, 2025. Implemented PowerPoint presentation generation using python-pptx with AI-powered content creation and structured slides
- July 04, 2025. Developed Canva-style design generator using DALL-E 3 for creating professional graphics with customizable templates, styles, and color schemes

## Enhanced Features Added

### Core AI Capabilities
- **Image Generation**: DALL-E 3 integration with keyword detection ("畫", "繪", etc.)
- **Image Analysis**: GPT-4o vision for uploaded image analysis
- **Voice Input**: Browser Speech Recognition API support
- **Voice Output**: OpenAI TTS with multiple voice options
- **Multi-language Support**: Voice recognition in multiple languages

### User Interface Enhancements
- **Sidebar Navigation**: Tabbed interface for different functions
- **File Upload Panel**: Drag-drop support for multiple file types
- **Tools Panel**: Built-in utilities (calculator, QR code, password generator)
- **Settings Panel**: Comprehensive personalization options
- **Collaboration Panel**: Multi-user room creation and management

### Data Management
- **PostgreSQL Integration**: Persistent conversation and file storage
- **Session Management**: User preferences and chat history
- **File Processing**: Support for documents, images, and media files
- **Real-time Collaboration**: Socket.IO for live multi-user features

### Technical Architecture
- **Enhanced Backend**: Flask with SQLAlchemy, file upload handling
- **Modern Frontend**: Bootstrap 5 with custom CSS, Socket.IO client
- **API Integration**: OpenAI GPT-4o, DALL-E 3, Whisper, TTS
- **Responsive Design**: Mobile-friendly interface with touch support

## User Preferences

Preferred communication style: Simple, everyday language.
AI response style: Direct, practical answers for all questions. Give key information first, followed by brief explanation with examples. Keep responses short and actionable.
Feature preference: Comprehensive functionality with voice and image generation capabilities.