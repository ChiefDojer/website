// Keyboard navigation utility
export class KeyboardNavigation {
    static handleArrowKeys(event, elements, currentIndex) {
        const keys = {
            ArrowRight: 1,
            ArrowLeft: -1,
            ArrowDown: elements instanceof HTMLElement ? elements.children.length : elements.length,
            ArrowUp: elements instanceof HTMLElement ? -elements.children.length : -elements.length
        };

        if (!(event.key in keys)) return currentIndex;

        event.preventDefault();
        const length = elements instanceof HTMLElement ? elements.children.length : elements.length;
        const newIndex = (currentIndex + keys[event.key] + length) % length;
        
        return newIndex;
    }

    static focusElement(elements, index) {
        const element = elements instanceof HTMLElement 
            ? elements.children[index] 
            : elements[index];
            
        if (element instanceof HTMLElement) {
            element.focus();
        }
    }
}