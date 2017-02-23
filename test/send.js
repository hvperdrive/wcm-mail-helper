"use strict";

require("rootpath")();
var Q = require("q");
var mockery = require("mockery");
var assert = require("chai").assert;
var nodemailerMock = require("test/helpers/nodemailerMock");
var configMock = require("test/helpers/configMock");
var send;

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

describe("Mail - send: ", function() {
    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock("nodemailer", nodemailerMock);
        mockery.registerMock("config", configMock);

        send = require("src").send;
    });

    after(function() {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it("Should send an email to one recipient using the default transporter", function() {
        var emailOptions = {
            from: "Example <example@example.com>",
            to: "jeroen.valcke@district01.be",
            subject: "test",
            html: "<span>test</span>"
        };

        return send(emailOptions);
    });

    it("Should fail sending email when no 'to' parameter is specified in the email options", function() {
        var emailOptions = {
            from: "Example <example@example.com>",
            subject: "test",
            html: "<span>test</span>"
        };

        return send(emailOptions)
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
        var emailOptions = {
            from: "Example <example@example.com>",
            to: "jeroen.valcke@district01.be",
            subject: "test",
            html: "<span>test</span>"
        };
        var senderConfig = {
            service: "gmail",
            auth: {
                xoauth2: {
                    user: "jeroen.email.test@gmail.com",
                    clientId: "824836902242-342isrprlbr871ntho1l5dqrvlcfqtmk.apps.googleusercontent.com",
                    clientSecret: "8tRomd9MwP3yvf97-qS8oXKw",
                    refreshToken: "1/-qOVcIEAOL2SXN15SZYuQgNZDafcQY3ymBVFX2OI61o"
                }
            }
        };

        return send(emailOptions, senderConfig);
    });
});
