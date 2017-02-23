"use strict";

require("rootpath")();
var _ = require("lodash");

module.exports = function generateMailOptions(from, to, subject, html) {
    if (!to || !from) {
        return null;
    }

    if (_.isArray(to)) {
        to = to.join(", ");
    }

    return {
        from: from,
        to: to,
        subject: subject,
        html: html
    };
};
