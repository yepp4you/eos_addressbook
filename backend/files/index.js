'use strict';

const NODE_ENV = process.env.NODE_ENV;
const files = {
    accounts : require(`./${NODE_ENV}/account`),
    upserts : require(`./${NODE_ENV}/upsert`),
    erases : require(`./${NODE_ENV}/erase`),
};

module.exports = exports = files;
