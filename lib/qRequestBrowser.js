var when = require('when');

var _badHeaders = ["accept-charset", "accept-encoding", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
var _badHeaderPrefix = /^(proxy-|sec-)/;
module.exports = function _browserRequest(options, body, method) {
    var verbose = require('../index').verbose;
    var withCredentials = require('../index').withCredentials;
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
                '========================================== response',
                '\ndata: ', this.responseText,
                '\n========================================== response'
            );
        }
        deferred.resolve(this.responseText);
    };
    request.onerror = function () {
        deferred.reject(this.responseText);
    };
    var url = "http" + (secureProtocol ? "s" : "") + "://" + options.host + ":" + options.port + options.path;
    request.open(method, url, true);
    for (var headerName in options.headers) {
        var _headername = headerName.toLowerCase();
        if (!~_badHeaders.indexOf(_headername) && !_headername.match(_badHeaderPrefix)) {
            request.setRequestHeader(headerName, options.headers[headerName]);
        }
    }
    if (withCredentials)
        request.withCredentials = true;
    request.send(body);

    return deferred.promise;
};

