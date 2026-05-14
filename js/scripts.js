import { ThemeManager } from './modules/theme.js';
import { ToolsListManager } from './modules/toolsList.js';
import { FeaturedToolsManager } from './modules/featuredTools.js';
import { MatrixRain } from './modules/matrix.js';
import { PageTransitions } from './modules/pageTransitions.js';
import { ErrorHandler } from './utils/errorHandler.js';

class App {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Load static components first
            await this.loadComponents();

            // Initialize global features
            this.themeManager = new ThemeManager();
            this.matrixRain = new MatrixRain();
            this.pageTransitions = new PageTransitions();

            // Initialize page-specific features
            this.initPageSpecificModules();

            // Listen for page transitions
            window.addEventListener('pageChanged', () => {
                this.initPageSpecificModules();
                this.updateActiveNavigation();
            });

        } catch (error) {
            ErrorHandler.handle(error, 'App.init');
        }
    }

    async loadComponents() {
        try {
            await Promise.all([
                this.loadComponent('header-container', 'components/header.html'),
                this.loadComponent('footer-container', 'components/footer.html')
            ]);
            this.updateActiveNavigation();
            this.initMobileMenu();
        } catch (error) {
            console.error('Failed to load components:', error);
        }
    }

    async loadComponent(containerId, url) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${url}:`, error);
        }
    }

    initPageSpecificModules() {
        // Re-instantiate managers that depend on DOM elements
        // These managers handle their own safety checks if elements are missing
        if (document.getElementById('featured-tools')) {
            new FeaturedToolsManager();
        }

        if (document.getElementById('tools-list')) {
            new ToolsListManager();
        }
    }

    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.top-menu a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                const isExpanded = nav.classList.contains('active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when clicking a link
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});