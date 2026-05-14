# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

This is a static site with no build step. Open `index.html` directly in a browser, or use a local dev server (e.g., VS Code Live Server extension) for proper ES6 module support — modules won't load via `file://` protocol.

There are no package.json, test runner, or linting configs. Testing is manual in the browser.

## Architecture

**Entry point**: `js/scripts.js` — imports all modules and boots the `App` class on `DOMContentLoaded`.

**Module pattern**: All JS uses ES6 `import`/`export`. The exception is `games.html`, which uses non-module `<script>` tags (to support direct `file://` loading) and exposes game init functions on `window`.

**Component loading**: Header and footer are fetched at runtime via `fetch()` and injected into `#header-container` / `#footer-container`. This means those DOM elements don't exist synchronously — `ThemeManager` retries with a 100ms polling loop (up to 5 times) to find `#theme-toggle` after the header loads.

**SPA-like navigation**: `PageTransitions` intercepts internal link clicks, fetches the target HTML, diffs `.main-content` and `.sidebar-content`, and swaps only those regions. It fires a `pageChanged` CustomEvent after each navigation, which `App` listens to in order to re-initialize page-specific managers.

**Theme**: Stored in `localStorage` via `StorageService`. The toggle checkbox state is inverted — `checked = dark`, `unchecked = light`. Defaults to dark if no saved preference.

**Data**: `js/data/tools.js` is the mock database. It exports `tools` (array) and `categories`. Tools are filtered client-side.

**State persistence**: `StorageService` (localStorage wrapper) saves last selected category (`last-category`) and viewed tools (`viewed-tools`).

## CSS Structure

`css/style.css` is the single import bundle — it `@import`s everything else. Load only `style.css` in HTML. Theme variables (colors, gradients, shadows, glassmorphism tokens) are defined in `css/theme.css` as CSS custom properties on `[data-theme="light"]` and `[data-theme="dark"]` selectors.

## Key Conventions

- DOM selectors and class names are centralized in `js/utils/constants.js` (`SELECTORS`, `CLASSES`, `STORAGE_KEYS`).
- All errors go through `ErrorHandler.handle(error, 'ClassName.methodName')`.
- `games.html` is a self-contained page — it does not use `scripts.js` or the component-loading system. It has an inline debug log panel (visible at bottom of page) that mirrors console output.
