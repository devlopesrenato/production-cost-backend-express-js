const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppRouteManager = require('./AppRouteManager');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv/config');
}

class Server {
    constructor(app, routeManager) {
        this.app = app;
        this.routeManager = routeManager;
        this.server = http.createServer(this.app);
    }

    start() {
        this.configureMiddleware();
        this.configureRoutes();
        this.startServer();
    }

    configureMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));        
    }

    configureRoutes() {
        this.app.use(this.routeManager.getRoutes());
    }

    startServer() {
        const port = process.env.APP_PORT || 3333;
        this.server.listen(port, () => {
            console.log("App running on the port: ", port);
        });
    }
}

const app = express();
const routeManager = new AppRouteManager();

const server = new Server(app, routeManager);
server.start();
