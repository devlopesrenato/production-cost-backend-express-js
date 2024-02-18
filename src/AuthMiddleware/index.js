const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../common/errors/types/UnauthorizedError');
const InternalServerError = require('../common/errors/types/InternalServerError');
const UsersRepository = require('../users/users.repository');
require('dotenv').config()

class AuthMiddleware {
    constructor() {
        this.secret = process.env.SECRET_KEY;
        this.usersRepository = new UsersRepository();
    }

    async verifyJWT(req, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new UnauthorizedError("Token not sent")
            };

            jwt.verify(token, `${this.secret}`, function (err, decoded) {
                if (err) {
                    throw new UnauthorizedError("Invalid JWT token")
                }
                req.userId = decoded.id;
            });
            
            const user = await this.usersRepository.getById(req.userId);
            if (!user) {
                throw new UnauthorizedError("Invalid JWT token")
            }
        } catch (error) {
            next(error)
        } finally {
            next()
        }
    }

    decodeJWT(token) {
        jwt.verify(token, `${this.secret}`, function (err, decoded) {
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