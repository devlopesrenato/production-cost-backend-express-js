const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const ParametersService = require('./parameters.service');
const { paramsValidator } = require('../utils/Utils');


class ParametersController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new ParametersService()
        this.auth = new AuthMiddleware()
    }

    setupRoutes() {

        this.router.use((req, res, next) => {
            try {
                this.auth.verifyJWT(req, next);
            } catch (error) {
                next(error)
            }
        });

        this.router.get('/', async (req, res, next) => {
            try {
                const result = await this.service.getAll()
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.get('/:id', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "id", type: "string", rules: ["isNumber"] }
                ], req.params);

                const result = await this.service.getById(req.params.id);
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.put('/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] },
                ], req.params);

                paramsValidator([
                    { name: "value", type: ["string", "number", "boolean"], rules: ["isNotEmpty"] },
                ], req.body);

                const result = await this.service.update(req.params.uuid, req.body);
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

module.exports = ParametersController;