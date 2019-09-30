'use strict';

const config = require('config'),
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

async function getAddress(userName) {
    const result = await eosApi.getTableRows(contractAccount, contractAccount, 'people', 'user', userName, 1, 'name');
    return result;
}

module.exports = exports = {upsert, erase, getAddress};

