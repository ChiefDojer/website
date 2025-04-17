// Main application entry point
import { ThemeManager } from './js/modules/theme.js';
import { ToolsListManager } from './js/modules/toolsList.js';
import { FeaturedToolsManager } from './js/modules/featuredTools.js';
import { MatrixRain } from './js/modules/matrix.js';
import { ErrorHandler } from './js/utils/errorHandler.js';

class ComponentLoader {
    static loadComponents() {
        const headerHtml = `
            <header>
                <div class="header-content">
                    <div class="logo">
                        <a href="#">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="white" stroke-width="2"/>
                                <path d="M12 20C12 16.6863 14.6863 14 18 14H22C25.3137 14 28 16.6863 28 20C28 23.3137 25.3137 26 22 26H18C14.6863 26 12 23.3137 12 20Z" fill="white"/>
                                <circle cx="20" cy="20" r="4" fill="#007acc"/>
                            </svg>
                            <span>AI Tools</span>
                        </a>
                    </div>
                    <h1>AI Tools Collection</h1>
                    <div class="header-controls">
                        <label class="switch matrix-toggle" title="Toggle matrix effect">
                            <input type="checkbox" id="matrix-toggle" checked>
                            <div class="slider round">
                                <i class="fas fa-terminal"></i>
                            </div>
                        </label>
                        <label class="switch" title="Toggle dark/light theme">
                            <input type="checkbox" id="theme-toggle">
                            <div class="slider round">
                                <div class="sun-moon">
                                    <svg id="moon-dot-1" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-2" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-3" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-1" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-2" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-3" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                </div>
                                <div class="stars">
                                    <svg id="star-1" class="star" viewBox="0 0 20 20">
                                        <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z"></path>
                                    </svg>
                                    <svg id="star-2" class="star" viewBox="0 0 20 20">
                                        <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z"></path>
                                    </svg>
                                    <svg id="star-3" class="star" viewBox="0 0 20 20">
                                        <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z"></path>
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                <nav role="navigation" aria-label="Main navigation">
                    <ul class="top-menu">
                        <li><a href="index.html" aria-current="page">Home</a></li>
                        <li><a href="news.html">AI News</a></li>
                        <li><a href="games.html">AI Games</a></li>
                        <li><a href="examples.html">Web UI Examples</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                </nav>
            </header>`;

        const footerHtml = `
            <footer>
                <div class="footer-content">
                    <p>&copy; 2025 AI Tools Collection. All rights reserved.</p>
                    <div class="social-icons">
                        <a href="#" class="social-icon facebook" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-icon twitter" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-icon instagram" title="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="social-icon youtube" title="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <a href="#" class="social-icon tiktok" title="TikTok">
                            <i class="fab fa-tiktok"></i>
                        </a>
                        <a href="#" class="social-icon telegram" title="Telegram">
                            <i class="fab fa-telegram-plane"></i>
                        </a>
                        <a href="#" class="social-icon whatsapp" title="WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </footer>`;

        // Replace includes with actual content
        document.querySelectorAll('include').forEach(include => {
            const src = include.getAttribute('src');
            if (src.includes('header.html')) {
                const div = document.createElement('div');
                div.innerHTML = headerHtml.trim();
                include.replaceWith(div.firstElementChild);
            } else if (src.includes('footer.html')) {
                const div = document.createElement('div');
                div.innerHTML = footerHtml.trim();
                include.replaceWith(div.firstElementChild);
            }
        });
    }
}

class App {
    constructor() {
        this.init();
    }

    init() {
        try {
            console.log('Loading components...');
            ComponentLoader.loadComponents();
            
            console.log('Components loaded, initializing managers...');
            this.themeManager = new ThemeManager();
            this.toolsListManager = new ToolsListManager();
            this.featuredToolsManager = new FeaturedToolsManager();
            this.matrixRain = new MatrixRain();
        } catch (error) {
            ErrorHandler.handle(error, 'App.init');
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});