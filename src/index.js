"use strict";

require("rootpath")();

module.exports = {
    compileAndSend: require("./compileAndSend"),
    generateHtmlFromTemplate: require("./generateHtmlFromTemplate").async,
    generateHtmlFromTemplateSync: require("./generateHtmlFromTemplate").sync,
    generateMailOptions: require("./generateMailOptions"),
    send: require("./send")
};
