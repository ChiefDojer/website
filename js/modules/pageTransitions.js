// Page Transitions Handler
export class PageTransitions {
    constructor() {
        this.init();
        this.isNavigating = false;
        this.pageCache = new Map();
    }

    init() {
        // Add loading class to main content and menu on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.removeLoadingStates();
            // Cache the initial page
            this.pageCache.set(window.location.href, document.documentElement.cloneNode(true));
        });

        // Handle navigation clicks
        this.handleNavigationClicks();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigateToPage(window.location.href, false);
        });
    }

    handleNavigationClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || 
                link.target === '_blank' || 
                link.getAttribute('download') || 
                link.getAttribute('href').startsWith('#') ||
                link.getAttribute('href').startsWith('http') ||
                link.getAttribute('href').startsWith('//')) {
                return;
            }

            e.preventDefault();
            if (!this.isNavigating) {
                this.navigateToPage(link.href, true);
            }
        });
    }

    addLoadingStates() {
        const mainContent = document.querySelector('.main-content');
        const menuSection = document.querySelector('.menu-section');
        if (mainContent) mainContent.classList.add('loading');
        if (menuSection) menuSection.classList.add('loading');
    }

    removeLoadingStates() {
        const mainContent = document.querySelector('.main-content');
        const menuSection = document.querySelector('.menu-section');
        requestAnimationFrame(() => {
            if (mainContent) mainContent.classList.remove('loading');
            if (menuSection) menuSection.classList.remove('loading');
        });
    }

    async getPageContent(url) {
        // Check cache first
        if (this.pageCache.has(url)) {
            return this.pageCache.get(url);
        }

        // If not in cache, fetch and parse
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // Cache the result
        this.pageCache.set(url, newDoc);
        
        // Cache cleanup - keep only last 5 pages
        if (this.pageCache.size > 5) {
            const firstKey = this.pageCache.keys().next().value;
            this.pageCache.delete(firstKey);
        }

        return newDoc;
    }

    async navigateToPage(url, updateHistory = true) {
        if (this.isNavigating) return;
        
        try {
            this.isNavigating = true;
            this.addLoadingStates();

            const newDoc = await this.getPageContent(url);

            // Perform the update with minimal DOM operations
            requestAnimationFrame(() => {
                this.updatePageContent(newDoc, url, updateHistory);
            });

        } catch (error) {
            console.error('Navigation error:', error);
            this.isNavigating = false;
            window.location.href = url;
        }
    }

    updatePageContent(newDoc, url, updateHistory) {
        try {
            // Update main content and sidebar with their scripts
            this.updateElementWithScripts('.main-content', newDoc);
            this.updateElementWithScripts('.sidebar-content', newDoc);
            
            // Update title if different
            if (document.title !== newDoc.title) {
                document.title = newDoc.title;
            }

            // Update URL if needed
            if (updateHistory) {
                window.history.pushState({}, '', url);
            }

            // Remove loading states
            this.removeLoadingStates();

            // Scroll to top only if navigating to a different page
            if (window.location.href !== url) {
                window.scrollTo(0, 0);
            }

            // Dispatch custom event for page change
            window.dispatchEvent(new CustomEvent('pageChanged', { 
                detail: { 
                    url,
                    cached: this.pageCache.has(url),
                    isGamePage: url.includes('games.html'),
                    isHomePage: url.endsWith('index.html') || url.endsWith('/')
                }
            }));

        } finally {
            this.isNavigating = false;
        }
    }

    updateElementWithScripts(selector, newDoc) {
        const newElement = newDoc.querySelector(selector);
        const currentElement = document.querySelector(selector);
        
        if (!newElement || !currentElement) return;

        // Only update if content has changed
        if (!this.isElementEqual(currentElement, newElement)) {
            // First, store references to old scripts
            const oldScripts = Array.from(currentElement.getElementsByTagName('script'));
            
            // Update the content
            currentElement.innerHTML = newElement.innerHTML;
            
            // Handle scripts
            const newScripts = Array.from(currentElement.getElementsByTagName('script'));
            newScripts.forEach((script, index) => {
                const oldScript = oldScripts[index];
                // Only replace if script content or src has changed
                if (!oldScript || 
                    script.src !== oldScript.src || 
                    script.textContent !== oldScript.textContent) {
                    
                    const replacement = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                        replacement.setAttribute(attr.name, attr.value);
                    });
                    replacement.textContent = script.textContent;
                    script.parentNode.replaceChild(replacement, script);
                }
            });
        }
    }

    isElementEqual(el1, el2) {
        // Compare without scripts for content equality
        const el1Clone = el1.cloneNode(true);
        const el2Clone = el2.cloneNode(true);
        
        Array.from(el1Clone.getElementsByTagName('script')).forEach(script => script.remove());
        Array.from(el2Clone.getElementsByTagName('script')).forEach(script => script.remove());
        
        return el1Clone.innerHTML === el2Clone.innerHTML;
    }
} 