'use strict';

let Promise = require('bluebird'),
    _ = require('lodash'),
    util = require('util'),
    parseArgs = require('minimist'),
    path = require('path'),
    config = require('config'),
    eosApi = require('external_apis/eos_api'),
    files = require('./files'),
    AddressbookAction = require('./addressbook_action');

const accounts = files.accounts;
const contractAccount = config.eosNode.contractAccount;

Promise.resolve(start())
    .then(() => {
        console.log('build complete~~');
    })
    .catch((err) => {
        console.log(util.inspect(err, {depth : 5}));
    })
    .delay(500);

async function start() {
    const argv = parseArgs(process.argv.splice(2));
    const cmd = argv.c;

    if (cmd === 'deploy') {
        return deploy();
    } else if (cmd === 'upserts') {
        return upsertAddressBooks();
    } else if (cmd === 'erases') {
        return eraseAddressBooks();
    } else if (cmd === 'address') {
        const name = argv.n;
        return getAddress(name);
    } else {
        throw Error(`${cmd} command is not exist`);
    }
}

async function deploy() {
    console.log('deploy addressbook contract');

    const account = _.find(accounts, {name : contractAccount});
    const contractPath = path.join(__dirname, 'contract', 'addressbook');
    const authorization = eosApi.createAuthorization(contractAccount, 'active');
    const options = {keyProvider : account.pvt};

    return eosApi.deployContract(contractAccount, contractPath, authorization, options)
    .catch((err) => {
        console.log(err);
        if (err.error && err.error.code === 3160008) { // set_exact_code: Contract is already running this version
            console.log(err.error.what);
            return;
        }
        throw err;
    });
}

function upsertAddressBooks() {
    console.log('update or insert addressbooks');
    return Promise.each(files.upserts, (address) => {
        let account = _.find(accounts, {name : address.user});
        console.log(`update or insert addressbooks --${account.name}`);
        return Promise.resolve(AddressbookAction.upsert(address, account.pvt, account.name))
            .delay(200)
            .then((trx) => {
                console.log(util.inspect(trx, {depth: 4}));
                return trx;
            })
            .catch((err) => {
                err.type = 'upserts';
                throw err;
            });
    });
}

function eraseAddressBooks() {
    console.log('erase addressbooks');
    return Promise.each(files.erases, (erase) => {
        let account = _.find(accounts, {name : erase.user});
        console.log(`update or insert addressbooks --${account.name}`);
        return Promise.resolve(AddressbookAction.erase({user : account.name}, account.pvt, account.name))
            .delay(200)
            .then((trx) => {
                return trx;
            })
            .catch((err) => {
                err.type = 'erases';
                throw err;
            });
    });
}


function getAddress(userName) {
    console.log('get address');
    return Promise.resolve(AddressbookAction.getAddress(userName))
        .then((address) => {
            console.log(address);
        });
}


