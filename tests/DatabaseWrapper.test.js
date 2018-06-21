const { expect } = require('chai');
const sinon = require('sinon');
const { Pool } = require('pg');

 
const DatabaseWrapper = require('../src/DatabaseWrapper');

describe('teste', () => {
    it('lili', () => {
        let stub1 = sinon.stub(Pool.prototype, 'constructor');

        const teste = {
            x: 'y'
        }
    new DatabaseWrapper(teste);

    sinon.assert.calledOnce(stub1);

    });
});