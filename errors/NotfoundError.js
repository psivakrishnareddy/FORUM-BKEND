export class NotfoundError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);
        this.message = message;
    }
}