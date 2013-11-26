var Q = require('q');
var _ = require('lodash');
var http = require('http');
var https = require('https');

module.exports = function qRequestNode(options, body, method) {
    var verbose = require('../index').verbose;
    var secureProtocol = require('../index').secureProtocol;

    var deferred = Q.defer();

    options = _.extend(options, {method: method});

    if (body) {
        if (!_.isString(body)) body = JSON.stringify(body);
        //sets content-length if it's unset
        options.headers = options.headers || {};
        options.headers = _.defaults(options.headers, {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        });
    }

    var request;
    if (secureProtocol) {
        options = _.defaults(options, {port: 443, scheme: 'https', rejectUnauthorized: false});
        request = https.request(options, dataConsumer);
    } else {
        options = _.defaults(options, {port: 80});
        request = http.request(options, dataConsumer);
    }

    if (verbose) {
        console.log(
            '------------------------------------------ request',
            '\noptions:', options,
            '\nbody:', body,
            '\n------------------------------------------ request'
        );
    }

    if (body) {
        request.write(body);
    }

    request.end();

    return deferred.promise;

    function dataConsumer(response) {
        var data = "";
//        response.setEncoding('utf8');
        response.on('data', function (buffer) {
            data += buffer;
        });
        response.on('end', function () {
            if (verbose) {
                console.log(
                    '========================================== response',
                    '\ndata: ', data,
                    '\n========================================== response'
                );
            }
            deferred.resolve(data);
        });
        response.on('error', function (error) {
            deferred.reject(error);
        });
    }

};