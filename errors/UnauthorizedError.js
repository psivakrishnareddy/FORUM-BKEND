export class UnauthorizedError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);
        this.message = message;
    }
}