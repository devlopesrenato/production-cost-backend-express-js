const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../common/errors/types/UnauthorizedError');
const InternalServerError = require('../common/errors/types/InternalServerError');
const UsersRepository = require('../users/users.repository');
const BadRequestError = require('../common/errors/types/BadRequestError');
require('dotenv').config()

class AuthMiddleware {
    constructor() {
        this.secret = process.env.SECRET_KEY;
        this.tokenExpiresIn = process.env.TOKEN_EXPIRES_IN || '3h';
        this.usersRepository = new UsersRepository();
    }

    async verifyJWT(request, next) {
        try {
            const token = this.jwtExtractor(request);
            const decodedToken = await this.jwtDecoder(token);
            const user = await this.usersRepository.getById(decodedToken.id);
            if (!user) {
                throw new UnauthorizedError("User not found");
            }
            request.userId = decodedToken.id;
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    jwtExtractor(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new BadRequestError('Token not sent.');
        }
        const [, token] = authHeader.split(' ');
        return token;
    }

    async jwtDecoder(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new UnauthorizedError("Invalid JWT token");
        }
    }

    createJTW(userData) {
        try {
            return jwt.sign(userData, `${this.secret}`, {
                expiresIn: this.tokenExpiresIn
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to create token")
        }
    }

}

module.exports = AuthMiddleware;