'use strict';

let useRoutes = function(app) {
    const addressRouter = require('./address');

    app.use('/api/', addressRouter);
};

module.exports = exports = {
    useRoutes : useRoutes
};
