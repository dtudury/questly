var Q = require('q');
var http = require('http');
var https = require('https');

var cookieJars = {};

function isString(obj) {
    return  {}.toString.call(obj) === '[object String]';
}

function defaults(obj, def) {
    for(var prop in def) {
        obj[prop] || (obj[prop] = def[prop]);
    }
    return obj;
}

module.exports = function qRequestNode(options, body, method) {
    var verbose = require('../index').verbose;
    var secureProtocol = require('../index').secureProtocol;

    var deferred = Q.defer();

    options.method = method;

    if (body) {
        if (!isString(body)) body = JSON.stringify(body);
        //sets content-length if it's unset
        options.headers = options.headers || {};
        defaults(options.headers, {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        });
    }


    var baseUrl = "http" + (secureProtocol ? "s" : "") + "://" + options.host + ":" + options.port;
    if(cookieJars[baseUrl]) {
        options.headers = options.headers || {};
        options.headers.Cookie = cookieJars[baseUrl].join("; ");
    }


    if (verbose) {
        console.log(
            '------------------------------------------ request',
            '\noptions:', options,
            '\nbody:', body,
            '\n------------------------------------------ request'
        );
    }
    var request;
    if (secureProtocol) {
        defaults(options, {port: 443, scheme: 'https', rejectUnauthorized: false});
        request = https.request(options, dataConsumer);
    } else {
        defaults(options, {port: 80});
        request = http.request(options, dataConsumer);
    }




    if (body) {
        request.write(body);
    }

    request.end();

    return deferred.promise;

    function dataConsumer(response) {
        console.log(response.headers);
        if(response.headers['set-cookie']) {
            var cookieJar = cookieJars[baseUrl] || (cookieJars[baseUrl] = []);
            //TODO: something better
            cookieJars[baseUrl] = response.headers['set-cookie'];
        }
        var data = "";
        response.setEncoding('utf8');
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