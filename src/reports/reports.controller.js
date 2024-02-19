const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const ReportsService = require('./reports.service');

class ReportsController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new ReportsService()
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

        this.router.get('/costPerProduction', async (req, res, next) => {
            try {
                const result = await this.service.getCostPerProduction()
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

module.exports = ReportsController;