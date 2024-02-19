const express = require('express');
const AppInitializer = require('./AppInitializer');
const UsersController = require('./users/users.controller');
const UnitsOfMeasurementController = require('./units-of-measurement/units-of-measurement.controller');
const ProductionsController = require('./productions/productions.controller')
const CategoriesController = require('./categories/categories.controller');
const ProductionFeedstocksController = require('./production-feedstocks/production-feedstocks.controller');
const FeedstocksController = require('./feedstocks/feedstocks.controller');
const ProductionOtherCostsController = require('./production-other-costs/production-feedstocks.controller');
const OtherCostsController = require('./other-costs/other-costs.controller');

const routeSimpleMeasure = require('./routes/simpleMeasure');
const routeDash = require('./routes/dashboard');
const routeReports = require('./routes/reports');
const routeSettings = require('./routes/settings');

class AppRouteManager {
    constructor() {
        this.appInitializer = new AppInitializer();
        this.usersController = new UsersController();
        this.unitsOfMeasurementController = new UnitsOfMeasurementController();
        this.productionsController = new ProductionsController();
        this.categoriesController = new CategoriesController();
        this.productionFeedstocksController = new ProductionFeedstocksController();
        this.feedstocksController = new FeedstocksController();
        this.productionOtherCostsController = new ProductionOtherCostsController();
        this.otherCostsController = new OtherCostsController();
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // must be at the start 
        this.router.use(this.appInitializer.setHeaderControls());

        this.router.use('/users', this.usersController.getRouter());
        this.router.use('/unitsOfMeasurement', this.unitsOfMeasurementController.getRouter());
        this.router.use('/production', this.productionsController.getRouter());
        this.router.use('/category', this.categoriesController.getRouter());
        this.router.use('/production-feedstock', this.productionFeedstocksController.getRouter());
        this.router.use('/feedstock', this.feedstocksController.getRouter());
        this.router.use('/production-otherCost', this.productionOtherCostsController.getRouter());
        this.router.use('/otherCost', this.otherCostsController.getRouter());

        // TO UPDATE
        this.router.use('/simplemeasure', routeSimpleMeasure);
        this.router.use('/dashboard', routeDash);
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