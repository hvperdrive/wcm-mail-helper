"use strict";

require("rootpath")();
var Q = require("q");
var nunjucks = require("nunjucks");

var _getNunjucksTemplate = function _getNunjucksTemplate(options) {
    var d = Q.defer();

    if (options.template) {
        return Q.when(nunjucks.renderString(options.template, options.data));
    }

    nunjucks.render(options.templateUrl, options.data, function(err, template) {
        if (err) {
            return d.reject(err);
        }

        return d.resolve(template);
    });

    return d.promise;
};

var _getNunjucksTemplateSync = function _getNunjucksTemplateSync(options) {
    if (options.template) {
        return nunjucks.renderString(options.template, options.data);
    }

    return nunjucks.render(options.templateUrl, options.data);
};

var _handler = function(options, isSync) {
    if (!options.template && !options.templateUrl) {
        return isSync ? false : Q.reject("Template should be filled in!");
    }

    return isSync ? _getNunjucksTemplateSync(options) : _getNunjucksTemplate(options);
};

module.exports.sync = function(options) {
    return _handler(options, true);
};

module.exports.async = function(options) {
    return _handler(options, false);
};
