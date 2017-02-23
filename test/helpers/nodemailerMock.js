"use strict";

module.exports =  {
    createTransport: function(transportOptions) {
        if (!transportOptions.service) {
            throw "NO_SERVICE";
        }

        return {
            sendMail: function(mailOptions, cb) {
                if (!mailOptions.to) {
                    throw "NO RECEPIENT(S)";
                }

                cb();
            }
        };
    }
};
