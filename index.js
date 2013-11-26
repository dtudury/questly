
var qRequestBrowser = require('./lib/qRequestBrowser');
var qRequestNode = require('./lib/qRequestNode');


function request(options, body, method) {
    if (typeof document === "undefined") {
        return qRequestNode(options, body, method);
    } else {
        return qRequestNode(options, body, method);
    }
}

function get(options) {
    return request(options, null, 'GET');
}

function post(options, body) {
    return request(options, body, 'POST');
}

function del(options) {
    return request(options, null, 'DELETE');
}

function put(options, body) {
    return request(options, body, 'PUT');
}

exports.verbose = true;
exports.secureProtocol = true;
exports.request = request;
exports.get = get;
exports.post = post;
exports.delete = del;
exports.put = put;
