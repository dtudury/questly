var when = require('when');

module.exports = function _browserRequest(options, body, method) {
    var verbose = require('../index').verbose;
    var secureProtocol = require('../index').secureProtocol;

    var deferred = when.defer();

    if (verbose) {
        console.log(
            '------------------------------------------ request',
            '\noptions:', options,
            '\nbody:', body,
            '\n------------------------------------------ request'
        );
    }

    var request = new XMLHttpRequest();
    request.onload = function () {
        if (verbose) {
            console.log(
                '------------------------------------------ request',
                '\data:', this.responseText,
                '\n------------------------------------------ request'
            );
        }
        deferred.resolve(this.responseText);
    };
    request.onerror = function () {
        deferred.reject(this.responseText);
    };
    var url = "http" + (secureProtocol ? "s" : "") + "://" + options.host + ":" + options.port + options.path;
    request.open(method, url, true);
    request.send(body);

    return deferred.promise;
};
