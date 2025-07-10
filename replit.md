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
- July 04, 2025. Redesigned Mahjong game UI with enhanced control panel layout, placing action buttons and prompts adjacent to player tiles for improved user experience
- July 05, 2025. Fixed critical JavaScript syntax errors and restored Mahjong game interface functionality with proper horizontal layout
- July 05, 2025. Enhanced AI player turn logic with improved error handling and special action detection for seamless 4-player gameplay
- July 05, 2025. Resolved function scope issues by making executeSpecialAction and passAction globally accessible
- July 05, 2025. Implemented local intelligent AI system for Mahjong players that doesn't require OpenAI API, with smart tile selection based on strategic priorities
- July 05, 2025. Completely rebuilt Farm Story game as narrative RPG with 4 NPCs (Mayor Tom, Shopkeeper Mary, Blacksmith Jack, Doctor Lily), branching dialogue system, multi-scene gameplay (farm/town/forest/mine), quest system, relationship tracking, and comprehensive inventory management
- July 05, 2025. Fixed critical JavaScript initialization issues preventing game loading, added comprehensive Canvas effects integration to Farm Story gameplay with particle systems, tool animations, and harvest effects
- July 05, 2025. Implemented complete dual architecture system: Flask backend for stable single-player mode and Node.js Express with Socket.IO for high-performance multiplayer gaming
- July 05, 2025. Simplified gaming system to focus on two core games: Tetris and Mahjong, removing Farm Story for better stability. Created new simple_games.js with original syntax and enhanced GBA-style animations
- July 05, 2025. **STABLE VERSION (2fa47be0c8ae0b59f8440346cf402d370ba1f632)**: Implemented complete personalized AI assistant avatar system with typewriter effect. Created original-style interface maintaining clean design while integrating advanced personalization features. System includes custom AI names, personalities, visual avatars, and conversation styles. All games and utility functions working properly. Application stable and ready for deployment
- July 05, 2025. Enhanced Mahjong game with authentic traditional tile visual patterns matching real mahjong tiles: 3D beveled appearance, proper color schemes (red 萬字, green 條子 bamboo patterns, blue 筒子 circle patterns), traditional font styling for wind and dragon tiles, and realistic shadows and gradients
- July 05, 2025. Fixed AI document template generation system by creating comprehensive template library with 8 spreadsheet types (financial, project, employee, sales, inventory, schedule, budget, attendance) and 6 document types (meeting, proposal, contract, report, policy, manual). Added simplified document generator that creates CSV/HTML for spreadsheets and TXT/HTML for documents, providing immediate download functionality without external dependencies
- July 05, 2025. Added Google Sheets specialized templates with 6 advanced templates (財務儀表板, 專案追蹤器, 庫存管理系統, 員工排班表, 銷售分析, 預算規劃) featuring Google Sheets formulas (SUM, AVERAGE, IF, COUNT functions), automatic calculations, and enhanced CSV export with import instructions for seamless Google Sheets integration
- July 05, 2025. Updated AI system with latest Taiwan Special Leave Law: comprehensive special leave calculation rules integrated into AI responses, including 6-month to 10+ year service periods with accurate day allocations (3-30 days) and proper formula guidance for HR spreadsheet calculations
- July 05, 2025. Added two new games to the platform: Memory Card Flip game (翻牌記憶) with 4x4 grid layout, timer and move tracking, and Pinball game (彈珠檯) with Canvas-based physics engine, collision detection, and keyboard controls. Both games feature complete CSS styling and responsive design integration
- July 05, 2025. Completely redesigned Pinball game with enhanced user interface: added power meter for launch control, combo system with multiplier scoring, side panel with real-time statistics, dual paddle controls, bonus collectibles, and improved physics engine with realistic ball movement and collision detection
- July 05, 2025. Enhanced Pinball game paddle controls: modified left and right arrow keys to move paddles horizontally across the game board for better ball control, updated game instructions to reflect paddle movement functionality
- July 05, 2025. Enhanced CANVA-style design generator with post-generation editing capabilities: added content modification, font size selection (small/medium/large/xlarge), font style options (normal/bold/italic/bold-italic), font family selection (Arial/Helvetica/Times/Georgia/Verdana), text color customization, live text preview, and regeneration with updated parameters while preserving original design settings
- July 05, 2025. Removed CANVA-style design generator functionality completely: deleted backend route '/generate_design', removed openDesignGenerator function and showDesignEditor from frontend JavaScript, removed design generator button from tools panel HTML template while preserving all other functionality intact
- July 05, 2025. Fixed document template generation system: added comprehensive HR templates (hr_attendance, hr_salary, hr_leave, hr_performance, hr_recruitment, hr_training), enhanced budget, customer and grades templates, improved template lookup logic with detailed error messages, fixed file handling and download functionality for Excel/Word/Google Sheets templates
- July 05, 2025. Addressed frontend JavaScript event handling issues in document template generation, improved error handling and debugging for template system reliability
- July 05, 2025. Implemented AI智能文件生成器 with automatic Excel/Word/PPT generation: created comprehensive UI with description input, style selection, language options. Added DALL-E 3 image generation for Word and PPT documents. Built complete backend API with error handling and file download capabilities. Feature includes progress tracking and result display with thumbnail previews for generated images
- July 05, 2025. Added comprehensive mobile responsive design: implemented hamburger menu for mobile navigation, optimized touch interface with 44px minimum button sizes, added viewport meta tags, created mobile-first CSS media queries with responsive sidebar, enhanced mobile user experience with touch-friendly controls and proper font sizing to prevent iOS zoom
- July 05, 2025. Enhanced Mahjong game interface with clear player positioning: added detailed player labels (電腦1/東家/你的上家, 電腦2/北家/你的對家, 電腦3/西家/你的下家), moved action buttons (吃碰槓胡過) to right-bottom corner for better visibility and accessibility, replaced left panel action section with helpful game tips explaining interaction rules
- July 05, 2025. Added 5 new local AI games: Five-in-a-Row (五子棋) with 15x15 board and smart AI opponent, Chinese Chess (象棋) with traditional pieces and basic AI, Poker 21 (撲克21點) with dealer mechanics, Sudoku (數獨) with multiple difficulty levels and hint system, Tower Defense (塔防) with Canvas-based gameplay and real-time strategy mechanics. All games feature local AI that doesn't require external APIs
- July 05, 2025. Added 12 comprehensive utility tools: JSON formatter with validation and minify, Base64 encoder/decoder for text and images, Markdown previewer with live rendering, CSV/Excel converter placeholder, Regex tester with pattern matching, URL encoder/decoder, Hash generator (SHA-1/SHA-256), Lorem Ipsum generator with customizable options, BMI calculator with health categories, Currency converter with demo rates, IP address lookup with public IP detection. All tools feature modal interfaces with copy functionality and responsive design
- July 05, 2025. Integrated web search functionality into AI assistant: added web_search.py module with DuckDuckGo search engine integration, enhanced openai_client.py to automatically detect weather, legal, news, and real-time information queries, implemented intelligent search result formatting with weather info, legal disclaimers, and news summaries. AI can now answer current weather, latest legal information, and news questions like Gemini while maintaining all existing development and productivity features
- July 05, 2025. Enhanced weather functionality with real API integration: modified web_search.py to use OpenWeatherMap API for accurate real-time weather data including temperature, humidity, wind speed, and weather descriptions. Added fallback to web search when API is unavailable. Updated weather response formatting to display detailed weather information with proper units and localization
- July 05, 2025. Added code copy functionality to AI responses: implemented copy buttons for both code blocks and inline code snippets in AI assistant responses. Added comprehensive CSS styling with hover effects and success feedback. Features include automatic clipboard API with fallback support, visual feedback with button state changes, and responsive design for mobile devices
- July 05, 2025. Enhanced appearance theme options with 12 additional theme variants: added dark color themes (blue, purple, green, red), light color themes (blue, purple, green), special themes (cyberpunk, retro, minimal, contrast), comprehensive CSS custom properties for each theme, JavaScript theme switching with system theme detection support, and automatic theme switching notifications with theme display names
- July 10, 2025. Fixed AI chat weather query integration by adding web search functionality to main chat endpoint with proper search type detection and result formatting
- July 10, 2025. Enhanced Python code generation in AI chat with comprehensive prompts requiring complete program structure, error handling, detailed comments, import statements, executable code, usage examples, and package installation instructions for more practical and complete code responses
- July 10, 2025. Optimized AI response speed by reducing token limits (1200 max), lowering temperature (0.5), and streamlining programming language prompts to focus on core functionality rather than extensive documentation, significantly reducing response time for code generation requests

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