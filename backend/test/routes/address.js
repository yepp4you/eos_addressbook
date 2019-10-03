'use strict';

const Promise = require('bluebird'),
    _ = require('lodash'),
    Address = require('libs/address'),
    data = require('test/data'),
    app = require('app');

const chai = require('chai');
chai.should();

const request = Promise.promisifyAll(require('supertest'));

describe('routes_test', function() {
    const dummy = Object.assign({}, data);
    it('create', async () => {
        await Promise.each(dummy.addresses, async (address) => {
            console.log(`create adddress -- ${address.user}`);
            await request(app)
                .post('/api/1/users/address')
                .send(address)
                .endAsync().then(async (res) => {
                    const addr = await Address.get(address.user);
                    console.log(addr);
                    addr.should.be.deep.equal(address);
                });
        });
    });

    it('get', async () => {
        await Promise.each(dummy.addresses, async (address) => {
            await request(app)
                .get(`/api/1/users/${address.user}/address`)
                .endAsync().then(async (res) => {
                    const addr = res.body.address;
                    addr.should.be.deep.equal(address);
                });
        });
    });

    it('gets', async () => {
        await request(app)
            .get('/api/1/users/addresses')
            .endAsync().then(async (res) => {
                const addresses = res.body.addresses;
                _.forEach(addresses, (address) => {
                    const addr = _.find(dummy.addresses, {user : address.user});
                    address.should.be.deep.equal(addr);
                    addr.should.be.deep.equal(address);
                });
            });
    });

    it('update', async () => {
        return Promise.each(dummy.addresses, async (address) => {
            address.first_name = `${address.first_name} updated`;
            address.last_name = `${address.last_name} updated`;
            address.street = `${address.street} updated`;
            address.city = `${address.street} city`;

            console.log(`update adddress -- ${address.user}`);
            await request(app)
                .put(`/api/1/users/${address.user}/address`)
                .send(address)
                .endAsync().then(async (res) => {
                    console.log(res.body);
                    const addr = await Address.get(address.user);
                    console.log(addr);
                    addr.should.be.deep.equal(address);
                });
        });
    });

    it('erase', async () => {
        return Promise.each(dummy.addresses, async (address) => {
            console.log(`erase adddress -- ${address.user}`);
            await request(app)
                .delete(`/api/1/users/${address.user}/address`)
                .endAsync().then(async (res) => {
                    console.log(res.body);
                    const addr = await Address.get(address.user);
                    addr.should.be.deep.equal({});
                });
        });
    });
});

