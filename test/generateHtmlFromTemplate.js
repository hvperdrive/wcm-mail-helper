"use strict";

require("rootpath")();
var expect = require("chai").expect;
var assert = require("chai").assert;
var mockery = require("mockery");
var generateHtmlFromTemplate;
var configMock = require("test/helpers/configMock");

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

describe("Mail - generateHtmlFromTemplate: ", function() {

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock("config", configMock);

        generateHtmlFromTemplate = require("src").generateHtmlFromTemplate;
    });

    after(function() {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it("Should fail when no template is given", function() {
        return generateHtmlFromTemplate({
            data: { test: "hello world" }
        })
            .then(
                function() {
                    assert.fail("Succeeded", "Should not succeed", "No template given. Should fail!");
                },
                function onError(error) {
                    expect(error).to.exist;
                }
            );
    });

    it("Should not fail when no data is given", function() {
        return generateHtmlFromTemplate({
            template: "<span>{{test}}</span>"
        })
            .then(
                function(result) {
                    expect(result).to.equal("<span></span>");
                },
                function onError(error) {
                    assert.fail("Failed", "Should not fail", "No data given but it failed!");
                }
            );
    });

    it("Should render html content from content correctly", function() {
        return generateHtmlFromTemplate({
            template: "<span>{{test}}</span>",
            data: { test: "hello world" }
        })
            .then(
                function(result) {
                    expect(result).to.equal("<span>hello world</span>");
                },
                function onError(error) {
                    assert.fail("Failed", "Should not fail", "Rendering faulty");
                }
            );
    });

    it("Should render html content a path correctly when a valid path is given", function() {
        return generateHtmlFromTemplate({
            templateUrl: "./test/template.html",
            data: { test: "hello world" }
        })
            .then(
                function(result) {
                    expect(result).to.equal("<span>From file: hello world</span>\n");
                },
                function onError(error) {
                    assert.fail("Failed", "Should not fail", "Failed on url content parsing!");
                }
            );
    });

    it("Should fail when rendering html content for a invalid path", function() {
        generateHtmlFromTemplate({
            templateUrl: "test/invalid_template-path.html",
            data: { test: "hello world" }
        })
            .then(
                function() {
                    assert.fail("Succeeded", "Should not succeed", "Invalid path not catched!");
                },
                function onError(error) {
                    expect(error).to.exist;
                }
            );
    });
});
