'use strict';

let Promise = require('bluebird'),
    _ = require('lodash'),
    util = require('util'),
    parseArgs = require('minimist'),
    path = require('path'),
    config = require('config'),
    contract = require('contract'),
    eosApi = require('external_apis/eos_api'),
    files = require('files'),
    Addressbook = require('libs/eos/addressbook');

const accounts = files.accounts;
const contractAccount = config.eosNode.contractAccount;
const ownerAccount = config.eosNode.ownerAccount;

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

    if (cmd === 'buyram') {
        const bytes = argv.b;
        return buyramBytes(bytes);
    } else if (cmd === 'stake') {
        const cpu = argv.cpu || 0;
        const net = argv.net || 0;
        return delegatebw(cpu, net);
    } else if (cmd === 'deploy') {
        return deploy();
    } else if (cmd === 'upserts') {
        return upsertAddressBooks();
    } else if (cmd === 'erase') {
        const name = argv.n;
        return eraseAddressBook(name);
    } else if (cmd === 'address') {
        const name = argv.n;
        return getAddress(name);
    } else {
        throw Error(`${cmd} command is not exist`);
    }
}

async function buyramBytes(bytes) {
    console.log('buyram Bytes');

    const account = _.find(accounts, {name : contractAccount});
    const authorization = eosApi.createAuthorization(contractAccount, 'active');
    const ram = {payer : contractAccount, receiver : contractAccount, bytes : parseInt(bytes)};
    const options = {keyProvider : account.pvt};
    return Promise.resolve(eosApi.buyrambytes(ram, authorization, options));
}

async function delegatebw(cpu, net) {
    console.log('delegate(stake)');

    const account = _.find(accounts, {name : contractAccount});
    const authorization = eosApi.createAuthorization(contractAccount, 'active');
    const delegate = {from : account.name, receiver : ownerAccount, stake_net_quantity : `${cpu}.0000 EOS`, stake_cpu_quantity : `${net}.0000 EOS`, transfer : false};
    const options = {keyProvider : account.pvt};

    return Promise.resolve(eosApi.delegatebw(delegate, authorization, options));
}

async function deploy() {
    console.log('deploy addressbook contract');

    const account = _.find(accounts, {name : contractAccount});
    const contractPath = path.join(contract.path, 'addressbook');
    const authorization = eosApi.createAuthorization(contractAccount, 'active');
    const options = {keyProvider : account.pvt};

    return eosApi.deployContract(contractAccount, contractPath, authorization, options)
    .catch((err) => {
        console.log(util.inspect(err, {depth : 5}));
        if (err.error && err.error.code === 3160008) { // set_exact_code: Contract is already running this version
            console.log(err.error.what);
            return;
        }
        throw err;
    });
}

function upsertAddressBooks() {
    console.log('update or insert addressbooks');
    const owner = _.find(accounts, {name : contractAccount});
    return Promise.each(files.upserts, (address) => {
        let account = _.find(accounts, {name : address.user});
        console.log(`update or insert addressbooks -- ${account.name}`);
        address.owner = owner.name;
        return Promise.resolve(Addressbook.upsert(address, owner.pvt, owner.name))
            .delay(200)
            .then((trx) => {
                console.log(util.inspect(trx, {depth: 5}));
                return trx;
            })
            .catch((err) => {
                err.type = 'upserts';
                throw err;
            });
    });
}

function eraseAddressBook(name) {
    console.log('erase addressbook');
    const owner = _.find(accounts, {name : contractAccount});
    console.log(`erase -- ${name}`);
    return Promise.resolve(Addressbook.erase({owner : owner.name, user : name}, owner.pvt, owner.name))
        .delay(200)
        .then((trx) => {
            return trx;
        })
        .catch((err) => {
            err.type = 'erases';
            throw err;
        });
}

function getAddress(name) {
    console.log('get address');
    if (_.isNil(name)) {
        return Addressbook.getAddresses(ownerAccount)
            .then((addresses) => {
                console.log(addresses);
            });
    }
    return Addressbook.getAddress(ownerAccount, name)
        .then((address) => {
            console.log(address);
        });
}
