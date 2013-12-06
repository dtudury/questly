function request(options, body, method) {
    return require('./lib/qRequestNode')(options, body, method); //shimmed for browser in package.json
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
exports.withCredentials = false;
exports.request = request;
exports.get = get;
exports.post = post;
exports.delete = del;
exports.put = put;
