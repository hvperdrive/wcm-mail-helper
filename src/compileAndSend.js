"use strict";

require("rootpath")();

var generateHtmlFromTemplate = require("./generateHtmlFromTemplate").async;
var send = require("./send");

module.exports = function(options) {
    var htmlOptions = {
        template: options.template,
        templateUrl: options.templateUrl,
        data: options.data
    };

    var emailOptions = options.emailOptions;
    var senderConfig = options.senderConfig;

    return generateHtmlFromTemplate(htmlOptions)
        .then(
            function onSuccess(renderedHtml) {
                emailOptions.html = renderedHtml;

                return send(emailOptions, senderConfig);
            },
            function onError(responseError) {
                throw responseError;
            }
        );
};
