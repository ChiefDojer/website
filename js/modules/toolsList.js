import { ErrorHandler } from '../utils/errorHandler.js';
import { SELECTORS, CLASSES, STORAGE_KEYS } from '../utils/constants.js';
import { tools, categories } from '../data/tools.js';
import { StorageService } from '../utils/storage.js';
import { KeyboardNavigation } from '../utils/keyboard.js';

export class ToolsListManager {
    constructor() {
        this.toolsList = document.querySelector(SELECTORS.TOOLS_LIST);
        this.filterContainer = document.querySelector(SELECTORS.TOOLS_FILTER);
        this.currentCategory = StorageService.get(STORAGE_KEYS.LAST_CATEGORY, 'all');
        this.currentFilterIndex = 0;
        this.currentToolIndex = 0;
        this.init();
    }

    init() {
        try {
            this.renderTools(this.currentCategory);
            this.setupEventListeners();
            this.updateActiveFilter();
        } catch (error) {
            ErrorHandler.handle(error, 'ToolsListManager.init');
        }
    }

    setupEventListeners() {
        if (!this.toolsList || !this.filterContainer) return;

        // Tool click tracking
        this.toolsList.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) return;
            this.trackToolClick(link.href, link.dataset.toolName);
        });

        // Filter click handling
        this.filterContainer.addEventListener('click', (event) => {
            const filterBtn = event.target.closest('.filter-btn');
            if (!filterBtn) return;
            
            const category = filterBtn.dataset.category;
            this.filterByCategory(category);
        });

        // Sidebar menu filtering
        const sideMenu = document.querySelector('.side-menu');
        if (sideMenu) {
            sideMenu.addEventListener('click', (event) => {
                const link = event.target.closest('a');
                if (!link) return;
                event.preventDefault();
                
                const category = link.dataset.category;
                if (category) {
                    this.filterByCategory(category);
                    
                    // Update filter buttons to match
                    const filterBtn = this.filterContainer.querySelector(`[data-category="${category}"]`);
                    if (filterBtn) {
                        this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                            btn.classList.toggle(CLASSES.ACTIVE, btn === filterBtn);
                            btn.setAttribute('aria-pressed', btn === filterBtn ? 'true' : 'false');
                        });
                    }
                }
            });

            let currentMenuIndex = 0;
            
            sideMenu.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    const link = event.target.closest('a');
                    if (!link) return;
                    event.preventDefault();
                    link.click();
                    return;
                }

                const links = sideMenu.querySelectorAll('a');
                currentMenuIndex = KeyboardNavigation.handleArrowKeys(
                    event,
                    Array.from(links),
                    currentMenuIndex
                );
                KeyboardNavigation.focusElement(links, currentMenuIndex);
            });
        }

        // Keyboard navigation for filters
        this.filterContainer.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const filterBtn = event.target.closest('.filter-btn');
                if (!filterBtn) return;
                event.preventDefault();
                filterBtn.click();
                return;
            }

            const buttons = this.filterContainer.querySelectorAll('.filter-btn');
            this.currentFilterIndex = KeyboardNavigation.handleArrowKeys(
                event, 
                Array.from(buttons), 
                this.currentFilterIndex
            );
            KeyboardNavigation.focusElement(buttons, this.currentFilterIndex);
        });

        // Keyboard navigation for tool cards
        this.toolsList.addEventListener('keydown', (event) => {
            const cards = this.toolsList.querySelectorAll('.tool-card');
            this.currentToolIndex = KeyboardNavigation.handleArrowKeys(
                event,
                Array.from(cards),
                this.currentToolIndex
            );
            KeyboardNavigation.focusElement(cards, this.currentToolIndex);
        });
    }

    renderTools(category = 'all') {
        if (!this.toolsList) return;

        const filteredTools = category === 'all' 
            ? tools 
            : tools.filter(tool => tool.category === category);

        this.toolsList.innerHTML = filteredTools.map(tool => this.createToolCard(tool)).join('');
    }

    createToolCard(tool) {
        return `
            <div class="card tool-card" 
                 tabindex="0" 
                 role="article" 
                 aria-labelledby="tool-title-${tool.name.toLowerCase().replace(/\s+/g, '-')}"
            >
                <div class="tool-header">
                    <img src="${tool.icon}" alt="${tool.name} icon" class="tool-icon">
                    <h3 id="tool-title-${tool.name.toLowerCase().replace(/\s+/g, '-')}">${tool.name}</h3>
                </div>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-footer">
                    <a href="${tool.url}" 
                       target="_blank" 
                       class="tool-link" 
                       data-tool-name="${tool.name}"
                       aria-label="Try ${tool.name}"
                    >Try It</a>
                    <span class="tool-category" role="status">${tool.category}</span>
                </div>
            </div>`;
    }

    updateActiveFilter() {
        if (!this.filterContainer) return;

        const buttons = this.filterContainer.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle(CLASSES.ACTIVE, btn.dataset.category === this.currentCategory);
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        StorageService.set(STORAGE_KEYS.LAST_CATEGORY, category);
        this.renderTools(category);
        this.updateActiveFilter();
        this.updateSideMenuActive(category);
    }

    updateSideMenuActive(category) {
        const sideMenu = document.querySelector('.side-menu');
        if (!sideMenu) return;

        sideMenu.querySelectorAll('a').forEach(link => {
            link.classList.toggle('active', link.dataset.category === category);
        });
    }

    trackToolClick(url, toolName) {
        try {
            const viewedTools = StorageService.get(STORAGE_KEYS.VIEWED_TOOLS, []);
            if (!viewedTools.includes(toolName)) {
                viewedTools.push(toolName);
                StorageService.set(STORAGE_KEYS.VIEWED_TOOLS, viewedTools);
            }
            console.log(`Tool clicked: ${toolName} (${url})`);
            // Here you could add analytics tracking
        } catch (error) {
            ErrorHandler.handle(error, 'ToolsListManager.trackToolClick');
        }
    }
}