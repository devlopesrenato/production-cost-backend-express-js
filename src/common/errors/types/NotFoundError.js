class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
    }
}

module.exports = NotFoundError;