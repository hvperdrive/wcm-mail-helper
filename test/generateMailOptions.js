"use strict";

require("rootpath")();
var mockery = require("mockery");
var expect = require("chai").expect;
var mockery = require("mockery");
var generateMailOptions;
var configMock = require("test/helpers/configMock");

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

describe("Mail - generateMailOptions: ", function() {
    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock("config", configMock);

        generateMailOptions = require("src").generateMailOptions;
    });

    after(function() {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    var to = ["jeroen.valcke@district01.be", "valcke_jeroen@hotmail.com"];

    it("Should fail when no 'to' property is given", function(done) {
        var options = generateMailOptions("example@example.com");

        expect(options).to.be.null;

        done();
    });

    it("Should fail when no 'from' property is given", function(done) {
        var options = generateMailOptions(null, to);

        expect(options).to.be.null;

        done();
    });

    it("Should render emailOptons from 'to' array", function(done) {
        var options = generateMailOptions("example@example.com", to);

        expect(options).to.not.be.null;
        expect(options).to.have.property("to");
        expect(options).to.have.property("from");
        expect(options.to).to.equal("jeroen.valcke@district01.be, valcke_jeroen@hotmail.com");
        expect(options.from).to.equal("example@example.com");

        done();
    });

    it("Should render emailOptons from 'to' string", function(done) {
        var options = generateMailOptions("example@example.com", "jeroen.valcke@district01.be, valcke_jeroen@hotmail.com");

        expect(options).to.not.be.null;
        expect(options).to.have.property("to");
        expect(options).to.have.property("from");
        expect(options.to).to.equal("jeroen.valcke@district01.be, valcke_jeroen@hotmail.com");
        expect(options.from).to.equal("example@example.com");

        done();
    });
});
