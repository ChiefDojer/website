export class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error in ${context}:`, error);

        // Show user-friendly error message
        const errorMessage = this.getUserFriendlyMessage(error);
        this.showErrorNotification(errorMessage);
    }

    static getUserFriendlyMessage(error) {
        // Map technical errors to user-friendly messages
        const errorMap = {
            'TypeError': 'Something went wrong with the data type.',
            'ReferenceError': 'Something is missing that we need.',
            'NetworkError': 'There was a problem connecting to the server.',
            'SyntaxError': 'There is a problem with the code syntax.'
        };

        const errorType = error.name || error.constructor.name;
        return errorMap[errorType] || 'An unexpected error occurred. Please try again.';
    }

    static showErrorNotification(message) {
        // Create error notification element
        const notification = document.createElement('div');
        notification.className = 'alert alert-error';
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
} 
