const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const UnitsOfMeasurementService = require('./units-of-measurement.service');
const { paramsValidator } = require('../utils/Utils');

class UnitsOfMeasurementController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new UnitsOfMeasurementService()
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
                next(error)
            }
        });
     
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UnitsOfMeasurementController;