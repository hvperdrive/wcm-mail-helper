"use strict";

require("rootpath")();
var expect = require("chai").expect;
var assert = require("chai").assert;
var mockery = require("mockery");
var generateHtmlFromTemplateSync;
var configMock = require("test/helpers/configMock");

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

describe("Mail - generateHtmlFromTemplateSync: ", function() {

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock("config", configMock);

        generateHtmlFromTemplateSync = require("src").generateHtmlFromTemplateSync;
    });

    after(function() {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it("Should fail when no template is given", function() {
        var template = generateHtmlFromTemplateSync({
            data: { test: "hello world" }
        });

        expect(template).to.equal(false);
    });

    it("Should not fail when no data is given", function() {
        var template = generateHtmlFromTemplateSync({
            template: "<span>{{test}}</span>"
        });

        expect(template).to.equal("<span></span>");
    });

    it("Should render html content from content correctly", function() {
        var template = generateHtmlFromTemplateSync({
            template: "<span>{{test}}</span>",
            data: { test: "hello world" }
        });

        expect(template).to.equal("<span>hello world</span>");
    });

    it("Should render html content a path correctly when a valid path is given", function() {
        var template = generateHtmlFromTemplateSync({
            templateUrl: "./test/template.html",
            data: { test: "hello world" }
        });

        expect(template).to.equal("<span>From file: hello world</span>\n");
    });

    it("Should fail when rendering html content for a invalid path", function() {
        var throwTest = function() {
            generateHtmlFromTemplateSync({
                templateUrl: "test/server/invalid_template-path.html",
                data: { test: "hello world" }
            });
        };

        assert.throws(throwTest, Error, "template not found: test/server/invalid_template-path.html");
    });
});
