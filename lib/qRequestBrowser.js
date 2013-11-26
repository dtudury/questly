var Q = require('q');

module.exports = function _browserRequest(options, body, method) {
    var verbose = require('../index').verbose;
    var secureProtocol = require('../index').secureProtocol;

    var deferred = Q.defer();

    function reqListener () {
        console.log(this.responseText);
        deferred.resolve(this.responseText);
    }

    var request = new XMLHttpRequest();
    request.onload = function () {
        console.log(this.responseText);
        deferred.resolve(this.responseText);
    };
    request.onerror = function () {
        console.log(this.responseText);
        deferred.reject(this.responseText);
    };
    var url = "http" + (secureProtocol ? "s" : "") + "://" +  options.host + ":" + options.port + options.path;
    request.open(method, url, true);
    request.overrideMimeType('application/json');
    request.withCredentials = true;
    if(options.headers) {
        for(var header in options.headers) {
            if(header.toLowerCase() === "cookie") {
            } else {
                request.setRequestHeader(header, options.headers[header]);
            }
        }
    }
    request.send(body);

    return deferred.promise;
};
