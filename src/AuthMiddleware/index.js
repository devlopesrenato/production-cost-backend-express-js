const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../common/errors/types/UnauthorizedError');
const InternalServerError = require('../common/errors/types/InternalServerError');
const UsersRepository = require('../users/users.repository');
const BadRequestError = require('../common/errors/types/BadRequestError');
require('dotenv').config()

class AuthMiddleware {
    constructor() {
        this.secret = process.env.SECRET_KEY;
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
        } catch (error) {
            console.log(error)
            next(error)
        } finally {
            next()
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
        return jwt.verify(token, `${this.secret}`, function (err, decoded) {
            if (err) {
                throw new UnauthorizedError("Invalid JWT token")
            }
            return decoded;
        });
    }

    createJTW(userData) {
        try {
            return jwt.sign(userData, `${this.secret}`, {
                expiresIn: 604800 // 7 dias
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to create token")
        }
    }

}

module.exports = AuthMiddleware;