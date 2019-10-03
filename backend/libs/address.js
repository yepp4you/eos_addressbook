'use strict';

const Promise = require('bluebird'),
    _ = require('lodash'),
    config = require('config'),
    files = require('files'),
    AddressBook = require('libs/eos/addressbook');

const ownerAccount = config.eosNode.ownerAccount;
const accounts = Object.assign({}, files.accounts);

function create(params) {
    const account = _.find(accounts, {name : ownerAccount});
    return AddressBook.upsert(Object.assign({}, params, {owner : account.name}), account.pvt, account.name);
}

function get(name) {
    return AddressBook.getAddress(ownerAccount, name);
}

function gets() {
    return AddressBook.getAddresses(ownerAccount);
}

function update(params) {
    const account = _.find(accounts, {name : ownerAccount});
    return AddressBook.upsert(Object.assign({}, params, {owner : account.name}), account.pvt, account.name);
}

function erase(name) {
    const account = _.find(accounts, {name : ownerAccount});
    return AddressBook.erase({owner : account.name, user : name}, account.pvt, account.name);
}

module.exports = exports = { create, get, gets, update, erase };
