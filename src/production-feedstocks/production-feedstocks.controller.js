const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const { paramsValidator } = require('../utils/Utils');
const ProductionFeedstocksService = require('./production-feedstocks.service');

class ProductionFeedstocksController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new ProductionFeedstocksService()
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


        this.router.get('/:uuid', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "uuid", type: "string", rules: ["isUUID"] }
                ], req.params);

                const result = await this.service.getOne(req.params.uuid)
                res.status(200).send(result);
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/', async (req, res, next) => {
            try {
                paramsValidator([
                    { name: "feedstockId", type: "string", rules: ["isNotEmpty", "isUUID"] },
                    { name: "productionId", type: "string", rules: ["isNotEmpty", "isUUID"] },
                    { name: "quantity", type: "number", rules: ["isNotEmpty"] },
                ], req.body);

                const result = await this.service.create(req.body);
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
                    { name: "quantity", type: "number", rules: ["isNotEmpty"] },
                ], req.body);

                const result = await this.service.update(req.params.uuid, req.body)
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

module.exports = ProductionFeedstocksController;