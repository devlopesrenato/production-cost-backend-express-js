const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv/config');
}

app.use(morgan('dev'));

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

app.use('/simplemeasure', routeSimpleMeasure);
app.use('/exactmeasure', routeExactMeasure);
app.use('/feedstock', routeFeedstock);
app.use('/users', routeUsers);
app.use('/production', routeProduction);
app.use('/feedstockused', routeFeedstockUsed);
app.use('/wpoused', routeWPOUsed);
app.use('/wpo', routeWPOU);
app.use('/dashboard', routeDash);
app.use('/category', routeCategory);
app.use('/reports', routeReports);
app.use('/settings', routeSettings);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message
        }
    });
})

module.exports = app; 
