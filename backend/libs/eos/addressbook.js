'use strict';

const _ = require('lodash'),
    config = require('config'),
    eosApi = require('external_apis/eos_api');

const contractAccount = config.eosNode.contractAccount;

function upsert(params, keyProvider, actor) {
    const options = {keyProvider};
    const authorization = eosApi.createAuthorization(actor, 'active');
    const action = eosApi.createAction(contractAccount, 'upsert', params, authorization);
    return eosApi.transact({actions : [action]}, options);
}

function erase(params, keyProvider, actor) {
    const options = {keyProvider};
    const authorization = eosApi.createAuthorization(actor, 'active');
    const action = eosApi.createAction(contractAccount, 'erase', params, authorization);
    return eosApi.transact({actions : [action]}, options);
}

async function getAddress(owner, name) {
    const result = await eosApi.getTableRows(contractAccount, owner, 'contacts', 'user', name, 1, 'name');
    if (!_.isEmpty(result.rows)) {
        return result.rows[0];
    }
    return {};
}

async function getAddresses(owner) {
    const result = await eosApi.getTableRows(contractAccount, owner, 'contacts', 'user', null, 300, 'name');
    return result.rows;
}

module.exports = exports = {upsert, erase, getAddress, getAddresses};

