const { expect } = require("chai");
const sinon = require("sinon");
const rewire = require("rewire");

let poolDb = rewire("../src");

describe("Testing PG-WRAPPER", () => {
  afterEach(() => {
    poolDb = rewire("../src");
  });
  it("Should call constructor Pool with correct configs", done => {
    const configsTest = { x: "0" };
    poolDb.__set__(
      "Pool",
      class {
        constructor(configs) {
          expect(configs).to.deep.equal(configsTest);
          done();
        }
      }
    );

    poolDb(configsTest);
  });
  describe("Testing query()", () => {
    it("Should call query client ", () => {
      const spyQueryClient = sinon.spy();
      const db = poolDb({});
      const textTest = "SELECT *";
      const valuesTest = ["VALUE"];

      const client = {
        query: spyQueryClient
      };
      db.query(textTest, valuesTest, client);
      expect(spyQueryClient.calledWithExactly(textTest, valuesTest)).to.equal(
        true
      );
    });
    it("Should call query pool ", done => {
      const textTest = "SELECT *";
      const valuesTest = ["VALUE"];
      poolDb.__set__(
        "Pool",
        class {
          constructor() {}
          query(text, value) {
            expect(text).to.equal(textTest);
            expect(value).to.deep.equal(valuesTest);
            done();
          }
        }
      );

      const db = poolDb({});

      db.query(textTest, valuesTest);
    });
  });
  describe("Testing startTransaction()", () => {
    it("Should call query correct", done => {
      let queryValue;

      const clientTest = {
        query: value => {
          queryValue = value;
        }
      };

      poolDb.__set__(
        "Pool",
        class {
          constructor() {}
          connect() {
            return Promise.resolve(clientTest);
          }
        }
      );

      const db = poolDb({});

      db.startTransaction().then(client => {
        expect(client).to.deep.equal(clientTest);
        expect(queryValue).to.equal("BEGIN");
        done();
      });
    });
  });

  describe("Testing endTransaction()", () => {
    it("Should call query correct in error case", () => {
      poolDb.__set__(
        "Pool",
        class {
          constructor() {}
        }
      );

      const db = poolDb({});
      const spyQuery = sinon.stub();
      const spyRelease = sinon.stub();

      const client = {
        query: spyQuery,
        release: spyRelease
      };

      spyQuery.resolves({});
      spyRelease.resolves({});
      db.endTransaction({}, client).then(res => {
        expect(spyQuery.calledWithExactly("ROLLBACK")).to.equal(true);
        expect(spyRelease.calledOnce).to.equal(true);

        expect(res).to.deep.equal({});
      });
    });

    it("Should call query correct in success case", () => {
      poolDb.__set__(
        "Pool",
        class {
          constructor() {}
        }
      );

      const db = poolDb({});
      const spyQuery = sinon.stub();
      const spyRelease = sinon.stub();

      const client = {
        query: spyQuery,
        release: spyRelease
      };

      spyQuery.resolves({});
      spyRelease.resolves({});
      db.endTransaction(undefined, client).then(res => {
        expect(spyQuery.calledWithExactly("COMMIT")).to.equal(true);
        expect(spyRelease.calledOnce).to.equal(true);

        expect(res).to.deep.equal({});
      });
    });
  });
});
