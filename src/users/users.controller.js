const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const UsersService = require('./users.service');
const { paramsValidator } = require('../utils/Utils');

class UsersController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new UsersService()
        this.auth = new AuthMiddleware()
    }

    setupRoutes() {

        this.router.post('/login', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "user", type: "string", rules: ["isNotEmpty"] },
                    { name: "password", type: "string", rules: ["isNotEmpty"] },
                ], req.body);

                const result = await this.service.login(req.body)
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.use((req, res, next) => {
            try {
                this.auth.verifyJWT(req, next);
            } catch (error) {
                next(error)
            }
        });

        this.router.post('/validtoken', async (req, res, next) => {
            try {
                const result = await this.service.validtoken(req.userId)
                res.status(200).send(result);
            } catch (error) {
                next(error)
            }
        });

        this.router.put('/update/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] }
                ], req.params);

                paramsValidator([
                    { name: "name", type: ["string", "undefined"] },
                    { name: "newpass", type: ["string", "undefined"] },
                    { name: "pass", type: "string" },
                ], req.body);

                const result = await this.service.update(req.userId, req.body)
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

    }

    getRouter() {
        return this.router;
    }
}

module.exports = UsersController;