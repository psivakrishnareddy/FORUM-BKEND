export class ForbiddenError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);
        this.message = message;
    }
}