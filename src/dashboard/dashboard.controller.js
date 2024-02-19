const express = require('express');
const AuthMiddleware = require('../AuthMiddleware');
const DashboardService = require('./dashboard.service');

class DashboardController {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        this.service = new DashboardService()
        this.auth = new AuthMiddleware()
    }

    setupRoutes() {

        this.router.use((req, res, next) => {
            try {
                this.auth.verifyJWT(req, next)
            } catch (error) {
                next(error)
            }
        });

        this.router.get('/', async (req, res, next) => {
            try {
                const result = await this.service.getDashboard();
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

module.exports = DashboardController;