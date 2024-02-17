class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 500;
    }
}

module.exports = InternalServerError;