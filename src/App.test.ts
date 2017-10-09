import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from './App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

    it('should be json', () => {
        return chai.request(app).get('/')
            .then(res => {
                expect(res.type).to.eql('application/json');
            });
    });

    it('should have a message prop', () => {
        return chai.request(app).get('/')
            .then(res => {
                expect(res.body.message).to.eql('Hello World!');
            });
    });

});

describe('Token', () => {

    it('should be text', () => {
        return chai.request(app).get('/api/v0/Token/ZRX').then(res => {
            expect(res.type).to.eql('text/plain');
        });
    });

    it('should have a symbol description', () => {
        return chai.request(app).get('/api/v0/Token/ZRX').then(res => {
            expect(res.text).to.eql('Token 0x Protocol Token (ZRX) with address 0x34d402f14d58e001d8efbe6585051bf9706aa064');
        });
    });

});