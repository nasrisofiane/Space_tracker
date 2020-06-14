/**
 * A simple configuration for headers origins
 * @param {*} origins 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const allowOrigins = (origins, req, res, next) => {
    res.header("Access-Control-Allow-Origin", origins);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
}

exports.allowOrigins = allowOrigins;