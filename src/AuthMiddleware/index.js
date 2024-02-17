const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../common/errors/types/UnauthorizedError');
const InternalServerError = require('../common/errors/types/InternalServerError');
require('dotenv').config()

class AuthMiddleware {
    constructor() {
        this.secret = process.env.SECRET_KEY;
    }

    verifyJWT(req, next) {
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
                next()
            });
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to verify token")
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