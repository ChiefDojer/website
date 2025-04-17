import { ErrorHandler } from '../utils/errorHandler.js';
import { StorageService } from '../utils/storage.js';
import { THEME, SELECTORS } from '../utils/constants.js';

export class ThemeManager {
    constructor() {
        this.maxRetries = 5; // Increased retries
        this.retryDelay = 100; // ms
        this.init();
    }

    async init() {
        try {
            await this.initializeWithRetry(this.maxRetries);
        } catch (error) {
            ErrorHandler.handle(error, 'ThemeManager.init');
            this.setTheme(THEME.DARK); // Ensure dark theme is set on error
        }
    }

    async initializeWithRetry(retriesLeft) {
        try {
            this.themeToggle = document.querySelector(SELECTORS.THEME_TOGGLE);
            
            if (!this.themeToggle && retriesLeft > 0) {
                console.log(`Theme toggle not found, retrying... (${retriesLeft} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.initializeWithRetry(retriesLeft - 1);
            }
            
            if (!this.themeToggle) {
                throw new Error('Theme toggle element not found after retries');
            }

            console.log('Theme toggle found, initializing...');
            this.setupEventListeners();
            this.restoreTheme();
        } catch (error) {
            if (retriesLeft === 0) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            return this.initializeWithRetry(retriesLeft - 1);
        }
    }

    setupEventListeners() {
        if (!this.themeToggle) return;
        this.themeToggle.addEventListener('change', () => this.handleThemeChange());
    }

    handleThemeChange() {
        try {
            // Fix: toggle checked = light theme, unchecked = dark theme
            const theme = this.themeToggle.checked ? THEME.DARK : THEME.LIGHT;
            this.setTheme(theme);
        } catch (error) {
            ErrorHandler.handle(error, 'ThemeManager.handleThemeChange');
        }
    }

    setTheme(theme) {
        StorageService.set(THEME.STORAGE_KEY, theme);
        document.documentElement.setAttribute(THEME.DATA_ATTRIBUTE, theme);
    }

    restoreTheme() {
        const savedTheme = StorageService.get(THEME.STORAGE_KEY);
        // If no theme is saved, default to dark
        if (!savedTheme) {
            this.themeToggle.checked = true; // Fix: checked for dark theme
            this.setTheme(THEME.DARK);
            return;
        }
        
        if (savedTheme === THEME.LIGHT) {
            this.themeToggle.checked = false; // Fix: unchecked for light theme
            this.setTheme(THEME.LIGHT);
        } else {
            this.themeToggle.checked = true; // Fix: checked for dark theme
            this.setTheme(THEME.DARK);
        }
    }
}