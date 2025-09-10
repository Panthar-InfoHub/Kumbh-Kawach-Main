/**
 * A wrapper class for Error objects that adds HTTP status code support
 * and preserves the original error.
 */
export default class WrappedError extends Error {
    /** HTTP status code associated with this error */
    public readonly code: number;
    /** The original error that was wrapped */
    public readonly originalError: Error;

    /**
     * Create a new WrappedError
     * @param message - The error message to display
     * @param originalError - The original error being wrapped
     * @param code - HTTP status code for this error
     */
    constructor(message: string, originalError: Error, code: number) {
        super(message);
        this.originalError = originalError;
        this.code = code;
    }

    /**
     * Create a WrappedError from an existing Error
     * @param error - The error to wrap
     * @returns A new WrappedError with a 500 status code
     */
    static from(error: Error) {
        const message = error.message || "An unknown error occurred"
        return new WrappedError(message, error, 500);
    }
}



