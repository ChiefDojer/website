import { ErrorHandler } from '../utils/errorHandler.js';
import { tools } from '../data/tools.js';
import { KeyboardNavigation } from '../utils/keyboard.js';

export class FeaturedToolsManager {
    constructor(containerId = 'featured-tools') {
        this.container = document.getElementById(containerId);
        this.featuredTools = this.getFeaturedTools();
        this.currentIndex = 0;
        this.init();
    }

    init() {
        try {
            this.renderFeaturedTools();
            this.setupEventListeners();
        } catch (error) {
            ErrorHandler.handle(error, 'FeaturedToolsManager.init');
        }
    }

    setupEventListeners() {
        if (!this.container) return;

        // Handle keyboard navigation
        this.container.addEventListener('keydown', (event) => {
            const cards = this.container.querySelectorAll('.tool-card');
            this.currentIndex = KeyboardNavigation.handleArrowKeys(
                event,
                Array.from(cards),
                this.currentIndex
            );
            KeyboardNavigation.focusElement(cards, this.currentIndex);
        });

        // Track tool clicks
        this.container.addEventListener('click', (event) => {
            const link = event.target.closest('.tool-link');
            if (!link) return;
            
            const toolName = link.dataset.toolName;
            console.log(`Tool clicked: ${toolName}`);
        });
    }

    getFeaturedTools() {
        // Get all tools and sort by importance/popularity
        return tools.slice(0, 6); // Show up to 6 featured tools
    }

    renderFeaturedTools() {
        if (!this.container) return;

        this.container.innerHTML = this.featuredTools
            .map((tool, index) => this.createToolCard(tool, index))
            .join('');
    }

    createToolCard(tool, index) {
        const toolId = `tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`;
        return `
            <article class="tool-card featured" 
                     tabindex="0" 
                     role="article"
                     aria-labelledby="${toolId}-title"
                     aria-describedby="${toolId}-desc"
            >
                <div class="tool-header">
                    <img src="${tool.icon}" 
                         alt="" 
                         class="tool-icon" 
                         aria-hidden="true"
                         loading="${index < 3 ? 'eager' : 'lazy'}"
                    >
                    <h3 id="${toolId}-title">${tool.name}</h3>
                </div>
                <p id="${toolId}-desc" class="tool-description">
                    ${tool.description}
                </p>
                <div class="tool-footer">
                    <a href="${tool.url}" 
                       class="tool-link" 
                       data-tool-name="${tool.name}"
                       target="_blank" 
                       rel="noopener"
                       aria-label="Try ${tool.name} (opens in new tab)"
                    >
                        Try It
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                    </a>
                    <span class="tool-category" role="status">
                        ${tool.category}
                    </span>
                </div>
            </article>`;
    }
}