# AI Tools Directory

A modern, responsive web application for discovering and exploring AI tools. This project serves as a training ground for Web UI Development, featuring a modular JavaScript architecture, dynamic content loading, and interactive UI elements.

## 🚀 Features

- **Modern UI/UX**: Clean interface with dark/light mode support.
- **Dynamic Content**: Tools and featured items are loaded dynamically.
- **Interactive Elements**: Matrix rain background effect, smooth page transitions.
- **Responsive Design**: Fully optimized for mobile and desktop devices.
- **Modular Architecture**: Built with ES6 modules for better code organization and maintainability.

## 📂 Project Structure

```
website/
├── index.html          # Main entry point
├── css/               # Stylesheets
│   ├── base.css       # Reset and base styles
│   ├── layout.css     # Grid and layout structures
│   ├── components.css # Component-specific styles
│   ├── theme.css      # Theme variables (light/dark)
│   └── style.css      # Main bundle/overrides
├── js/                # JavaScript Code
│   ├── scripts.js     # Main application entry point
│   ├── modules/       # Feature modules
│   │   ├── theme.js           # Theme management
│   │   ├── matrix.js          # Matrix rain effect
│   │   ├── featuredTools.js   # Featured tools logic
│   │   ├── toolsList.js       # Tool list rendering & filtering
│   │   └── pageTransitions.js # SPA-like navigation
│   └── utils/         # Utility functions
│       ├── constants.js       # App constants
│       ├── errorHandler.js    # Centralized error handling
│       ├── storage.js         # LocalStorage wrapper
│       └── keyboard.js        # Accessibility helpers
├── components/        # HTML Components
│   ├── header.html    # Site header
│   └── footer.html    # Site footer
└── data/              # Data Sources
    └── tools.js       # Tools data (mock database)
```

## 🛠️ Technologies

- **HTML5**: Semantic markup.
- **CSS3**: Custom properties, Flexbox, Grid.
- **JavaScript (ES6+)**: Modules, Async/Await, Classes.
- **No Frameworks**: Pure Vanilla JS for maximum performance and learning.

## 🚦 Getting Started

1.  Clone the repository.
2.  Open `index.html` in a modern web browser (or serve via a local server like Live Server for best experience with modules).
