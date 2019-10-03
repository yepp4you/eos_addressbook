'use strict';

const express = require('express'),
    Address = require('libs/address'),
    SErr = require('libs/error');

const router = express.Router();

let create = function(req, res, next) {
    Address.create(req.body)
        .then(function(trx) {
            res.json({trx});
        })
        .catch(function(err) {
            SErr.sendRes(res, err);
        });
};

let get = function(req, res, next) {
    Address.get(req.params.name)
        .then(function(address) {
            res.json({address});
        })
        .catch(function(err) {
            SErr.sendRes(res, err);
        });
};

let gets = function(req, res, next) {
    Address.gets()
        .then(function(addresses) {
            res.json({addresses});
        })
        .catch(function(err) {
            SErr.sendRes(res, err);
        });
};

let update = function(req, res, next) {
    Address.update(req.body)
        .then(function(trx) {
            res.json({trx});
        })
        .catch(function(err) {
            SErr.sendRes(res, err);
        });
};

let erase = function(req, res, next) {
    Address.erase(req.params.name)
        .then(function(trx) {
            res.json({trx});
        })
        .catch(function(err) {
            SErr.sendRes(res, err);
        });
};

router.post('/1/users/address', create);
router.get('/1/users/:name/address', get);
router.get('/1/users/addresses', gets);
router.put('/1/users/:name/address', update);
router.delete('/1/users/:name/address', erase);

module.exports = exports = router;
