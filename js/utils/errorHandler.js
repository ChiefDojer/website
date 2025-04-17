// Error handling utility
export class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error ${context ? `in ${context}: ` : ':'}`, error);
        
        // You can add more sophisticated error handling here
        // For example, showing user-friendly error messages
        if (error instanceof TypeError) {
            console.warn('Type error occurred. Please check your input types.');
        }
    }

    static async tryAsync(promise, context = '') {
        try {
            return await promise;
        } catch (error) {
            this.handle(error, context);
            throw error;
        }
    }
}