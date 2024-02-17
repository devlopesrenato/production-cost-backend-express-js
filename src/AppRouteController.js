const express = require('express');

class AppController {
    constructor() {
        this.router = express.Router();
        this.headerControl = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // setHeader
        this.headerControl.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).send({
                    'Access-Control-Allow-Methods': 'PUT, POST, PATCH, DELETE, GET'
                });
            }
            next();
        });

        // app routes and error control
        this.router.get('/api', (req, res, next) =>
            res.status(200).send('API Custo de Produção')
        );

        this.router.use((req, res, next) => {
            const erro = new Error('page not found');
            erro.status = 404;
            next(erro);
        });
    }

    getRouter() {
        return this.router;
    }

    setHeaderControls() {
        return this.headerControl;
    }
}

module.exports = AppController;