'use strict';

const Promise = require('bluebird'),
    _ = require('lodash'),
    Address = require('libs/address'),
    data = require('test/data');

const chai = require('chai');
chai.should();

describe('libs_test', async () => {
    const dummy = Object.assign({}, data);
    it('create', async () => {
        await Promise.each(dummy.addresses, async (address) => {
            console.log(`create adddress -- ${address.user}`);
            await Address.create(address);
            const addr = await Address.get(address.user);
            addr.should.be.deep.equal(address);
        })
        .catch((err) => {
            console.log(err);
        });
    });

    it('get', async () => {
        return Promise.each(dummy.addresses, async (address) => {
            const addr = await Address.get(address.user);
            addr.should.be.deep.equal(address);
        })
        .catch((err) => {
            console.log(err);
        });
    });

    it('gets', async () => {
        const addresses = await Address.gets();
        _.forEach(addresses, (address) => {
            const addr = _.find(dummy.addresses, {user : address.user});
            address.should.be.deep.equal(addr);
        });
    });

    it('update', async () => {
        return Promise.each(dummy.addresses, async (address) => {
            address.first_name = `${address.first_name} updated`;
            address.last_name = `${address.last_name} updated`;
            address.street = `${address.street} updated`;
            address.city = `${address.street} city`;

            console.log(`update adddress -- ${address.user}`);
            await Address.update(address);
            const addr = await Address.get(address.user);
            addr.should.be.deep.equal(address);
        })
        .catch((err) => {
            console.log(err);
        });
    });

    it('erase', async () => {
        await Promise.each(dummy.addresses, async (address) => {
            console.log(`erase adddress -- ${address.user}`);
            await Address.erase(address.user);

            const addr = await Address.get(address.user);
            addr.should.be.deep.equal({});
        })
        .catch((err) => {
            console.log(err);
        });
    });
});
