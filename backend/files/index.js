'use strict';

const NODE_ENV = process.env.NODE_ENV;
const files = {
    accounts : require(`./${NODE_ENV}/account`),
    upserts : require(`./${NODE_ENV}/upsert`)
};

module.exports = exports = files;
