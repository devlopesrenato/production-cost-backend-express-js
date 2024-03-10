const express = require('express');
const ProductionsService = require('./productions.service');
const AuthMiddleware = require('../AuthMiddleware');
const { paramsValidator } = require('../utils/Utils');

class ProductionsController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new ProductionsService()
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

        this.router.post('/', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "name", type: "string" },
                    { name: "categoryId", type: "string", rules: ["isUUID"] },
                    { name: "price", type: ["string", "number"] },
                    { name: "quantity", type: "number" },
                ], req.body);

                const result = await this.service.create({ ...req.body, userId: req.userId });
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/duplicate/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] }
                ], req.params);

                paramsValidator([
                    { name: "name", type: "string", rules: ["isNotEmpty", "isOptional"] },
                ], req.body);

                const result = await this.service.duplicate(req.params.uuid, { userId: req.userId, name: req.body.name });
                res.status(201).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.put('/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] }
                ], req.params);

                paramsValidator([
                    { name: "name", type: "string", rules: ["isNotEmpty", "isOptional"] },
                    { name: "categoryId", type: "string", rules: ["isUUID", "isOptional"] },
                    { name: "price", type: ["string", "number"], rules: ["isNotEmpty", "isOptional"] },
                    { name: "quantity", type: "number", rules: ["isOptional"] },
                ], req.body);

                const result = await this.service.update(req.params.uuid, { ...req.body, userId: req.userId })
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.delete('/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] }
                ], req.params);

                const result = await this.service.delete(req.params.uuid);
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

module.exports = ProductionsController;