const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const CustomMeasurementsService = require('./custom-measurements.service');
const { paramsValidator } = require('../utils/Utils');

class CustomMeasurementsController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new CustomMeasurementsService()
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
                    { name: "name", type: "string", rules: ["isNotEmpty"] },
                    { name: "unitsOfMeasurementId", type: "string", rules: ["isNotEmpty", "isUUID"] },
                    { name: "quantity", type: "number", rules: ["isNotEmpty"] },
                ], req.body);

                const result = await this.service.create({ ...req.body, userId: req.userId });
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
                    { name: "unitsOfMeasurementId", type: "string", rules: ["isNotEmpty", "isUUID", "isOptional"] },
                    { name: "quantity", type: "number", rules: ["isNotEmpty", "isOptional"] },
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

module.exports = CustomMeasurementsController;