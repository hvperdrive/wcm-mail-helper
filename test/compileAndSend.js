"use strict";

require("rootpath")();
var Q = require("q");
var assert = require("chai").assert;
var compileAndSend;
var mockery = require("mockery");
var nodemailerMock = require("test/helpers/nodemailerMock");
var configMock = require("test/helpers/configMock");

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

describe("Mail - compile and send: ", function() {

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock("nodemailer", nodemailerMock);
        mockery.registerMock("config", configMock);

        compileAndSend = require("src").compileAndSend;
    });

    after(function() {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    // These tests are skipped because i have not yet found a right way to mock mailing.

    it("Should send an email to one recipient using the default transporter", function() {
        var options = {
            template: "<span>{{test}}</span>",
            data: { test: "hello world" },
            emailOptions:  {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options);
    });

    it("Should fail sending email when no to parameter is specified in the email options", function() {
        var options = {
            template: "<span>{{test}}</span>",
            data: { test: "hello world" },
            emailOptions:  {
                from: "Example <example@example.com>",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options)
            .then(
                function onSuccess() {
                    assert.fail("Succeeded", "Fail", "Should fail when sending email with no 'to' parameter.");
                },
                function onError() {
                    return Q.when();
                }
            );

    });

    it("Should send an email to a recepient using a custom transporter", function() {
        var options = {
            template: "<span>{{test}}</span>",
            data: { test: "hello world" },
            emailOptions: {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            },
            senderConfig: {
                service: "gmail",
                auth: {
                    xoauth2: {
                        user: "jeroen.email.test@gmail.com",
                        clientId: "824836902242-342isrprlbr871ntho1l5dqrvlcfqtmk.apps.googleusercontent.com",
                        clientSecret: "8tRomd9MwP3yvf97-qS8oXKw",
                        refreshToken: "1/-qOVcIEAOL2SXN15SZYuQgNZDafcQY3ymBVFX2OI61o"
                    }
                }
            }
        };

        return compileAndSend(options);
    });

    it("Should fail when no template is given", function() {
        var options = {
            data: { test: "hello world" },
            emailOptions: {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options)
            .then(
                function onSuccess() {
                    assert.fail("Succeeded", "Fail", "Should fail when no template is given");
                },
                function onError() {
                    return Q.when();
                }
            );
    });

    it("Should not fail when no data is given", function() {
        var options = {
            template: "<span>{{test}}</span>",
            emailOptions: {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options);
    });

    it("Should render html content a path correctly when a valid path is given", function() {
        var options = {
            templateUrl: "./test/template.html",
            data: { test: "hello world" },
            emailOptions: {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options);
    });

    it("Should fail when rendering html content for a invalid path", function() {
        var options = {
            templateUrl: "test/server/invalid_template-path.html",
            data: { test: "hello world" },
            emailOptions: {
                from: "Example <example@example.com>",
                to: "jeroen.valcke@district01.be",
                subject: "test",
                html: "<span>test</span>"
            }
        };

        return compileAndSend(options)
            .then(
                function onSuccess() {
                    assert.fail("Succeeded", "Fail", "Should fail when rendering html content for a invalid path");
                },
                function onError() {
                    return Q.when();
                }
            );

    });
});
