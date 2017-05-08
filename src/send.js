"use strict";

require("rootpath");
var Q = require("q");
var _ = require("lodash");
var nodemailer = require("nodemailer");
var xoauth2 = require("xoauth2");

var config = require("config")();

var _getSenderConfig = function _getSenderConfig(senderConfig) {
    if (!senderConfig || _.isEmpty(senderConfig)) {
        return null;
    }

    var config = {
        service: senderConfig.service,
        auth: null
    };

    // Setup xoauth2 generator if xoauth2 config is specified
    if (
        senderConfig.hasOwnProperty("auth") &&
        senderConfig.auth.hasOwnProperty("xoauth2") &&
        !_.isEmpty(senderConfig.auth.xoauth2)
    ) {
        config.auth = {
            xoauth2: {
                user: senderConfig.auth.xoauth2.user,
                clientId: senderConfig.auth.xoauth2.clientId,
                clientSecret: senderConfig.auth.xoauth2.clientSecret,
                refreshToken: senderConfig.auth.xoauth2.refreshToken
            }
        };

        config.auth.xoauth2 = xoauth2.createXOAuth2Generator(config.auth.xoauth2);
    }

    return config;
};

var _getTransporter = function _getTransporter(senderConfig) {
    var sConfig;

    if (!senderConfig && (config && config.email && config.email.smtp)) {
        sConfig = _getSenderConfig(_.cloneDeep(config.email.smtp));
    } else if (senderConfig) {
        sConfig = _getSenderConfig(_.cloneDeep(senderConfig));
    }

    if (sConfig) {
        return nodemailer.createTransport(sConfig);
    }

    console.error("No email config available"); // eslint-disable-line no-console
};

module.exports = function send(mailOptions, senderConfig) {
    if (!mailOptions.to) {
        return Q.reject("No 'to' parameter in the mail options found!");
    }

    if (!mailOptions.from) {
        var email = _.get(senderConfig, "auth.xoauth2.user", false) ||
            _.get(config, "email.address", false) ||
            _.get(config, "email.auth.xoauth2.user", "");

        mailOptions.from = {
            name: "WCM",
            address: email
        };
    }

    var transporter = _getTransporter(senderConfig);

    if (!transporter) {
        return Q.reject("Sender config not valid!");
    }

    var d = Q.defer();

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            return d.reject({
                error: err,
                info: info
            });
        }

        d.resolve({
            info: info
        });
    });

    return d.promise;
};
