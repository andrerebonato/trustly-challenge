'use strict';
const axios = require("axios");
const chai = require("chai");
const expect = chai.expect;
const url = "https://rebonato-trustly-challenge-api.herokuapp.com/repository/files/info/andrerebonato/boiler-rest-api-nodets";

describe("Test challenger Trustly API", () => {
    it("Must show all lines of files grouped by file extension", async () => {
        const response = await axios.get(url);
        const { data } = response;

        expect(response.status).to.equal(200);

        expect(data).to.have.property('model');
        expect(data.model.json.lines).to.equal(3871)
        expect(data.model.js.lines).to.equal(31);
        expect(data.model.text.lines).to.equal(2984);
        expect(data.model.ts.lines).to.equal(247);
    });
    it("Must show all total files grouped by file extension", async () => {
        const response = await axios.get(url);
        const { data } = response;

        expect(response.status).to.equal(200);

        expect(data).to.have.property('model');
        expect(data.model.json.files).to.equal(3)
        expect(data.model.js.files).to.equal(2);
        expect(data.model.text.files).to.equal(2);
        expect(data.model.ts.files).to.equal(14);
        
    });
});