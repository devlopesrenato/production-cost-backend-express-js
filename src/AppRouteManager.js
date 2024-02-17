const express = require('express');
const AppInitializer = require('./AppInitializer');

const routeSimpleMeasure = require('./routes/simpleMeasure');
const routeExactMeasure = require('./routes/exactMeasure');
const routeFeedstock = require('./routes/feedstock');
const routeUsers = require('./routes/users');
const routeProduction = require('./routes/production');
const routeFeedstockUsed = require('./routes/feedstockUsed');
const routeWPOUsed = require('./routes/wpoUsed');
const routeWPOU = require('./routes/wpo');
const routeDash = require('./routes/dashboard');
const routeCategory = require('./routes/category');
const routeReports = require('./routes/reports');
const routeSettings = require('./routes/settings');

class AppRouteManager {
    constructor() {
        this.router = express.Router();
        this.appInitializer = new AppInitializer();
        this.setupRoutes();
    }

    setupRoutes() {
        // must be at the start 
        this.router.use(this.appInitializer.setHeaderControls());

        // TO UPDATE
        this.router.use('/simplemeasure', routeSimpleMeasure);
        this.router.use('/exactmeasure', routeExactMeasure);
        this.router.use('/feedstock', routeFeedstock);
        this.router.use('/users', routeUsers);
        this.router.use('/production', routeProduction);
        this.router.use('/feedstockused', routeFeedstockUsed);
        this.router.use('/wpoused', routeWPOUsed);
        this.router.use('/wpo', routeWPOU);
        this.router.use('/dashboard', routeDash);
        this.router.use('/category', routeCategory);
        this.router.use('/reports', routeReports);
        this.router.use('/settings', routeSettings);
        // TO UPDATE

        // must be at the end 
        this.router.use(this.appInitializer.getRouter());

        // errors 
        this.router.use((error, req, res, next) => {
            res.status(error.status || 500);
            return res.send({
                status: error.status,
                error: error.message,
            });
        })
    }

    getRoutes() {
        return this.router;
    }
}

module.exports = AppRouteManager;