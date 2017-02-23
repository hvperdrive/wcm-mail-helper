"use strict";

module.exports = function() {
    return {
        email: {
            address: "jeroen.email.test@gmail.com",
            smtp: {
                service: "gmail",
                auth: {
                    xoauth2: {
                        user: "jeroen.email.test@gmail.com",
                        clientId: "824836902242-342isrprlbr871ntho1l5dqrvlcfqtmk.apps.googleusercontent.com",
                        clientSecret: "8tRomd9MwP3yvf97-qS8oXKw",
                        refreshToken: "1/ifCXAbfTFDgXT9f4fzTxRkZZe2X6B49RXsKuhIg9W1Y"
                    }
                }
            }
        }
    };
};
