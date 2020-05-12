import http from "http";
import request from "supertest";
import Server from "./../src/server";
import chai from "chai";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();

let server:null|http.Server = null;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

beforeEach( async () => {
  const uri    = await mongoServer.getConnectionString()
  let instance = new Server({mongo_uri: uri, port: getRandomInt(4000, 10000), jwt_secret: "2345678945678"});
  server       = http.createServer(instance.listen().callback());
});

afterEach(() => {
  server.close();
});


/* THESE ARE BEING DUMB */
describe("POST /user", () => {
  it("should return some defined error message with valid parameters", (done) => {
    const expect = chai.expect;
    return request(server)
      .post("/user/")
      .send({ id: getRandomInt(100000000000000000, 999999999999999999) })
      .expect(200)
      .end(function (err, res) {
        expect(err).not.to.be.undefined;
        done();
      });
  });
});

describe("GET /user/:id", () => {
  it("should return some defined error message with valid parameters", (done) => {
    const expect = chai.expect;
    return request(server).get("/user/123123123")
      .expect(200)
      .end(function(err, res) {
        expect(err).not.to.be.undefined;
        done();
      });
  });
});

