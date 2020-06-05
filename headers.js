/**
 * A simple configuration for headers origins
 * @param {*} origins 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const allowOrigins = (origins, req, res, next) =>{
    res.header("Access-Control-Allow-Origin", origins);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
}

exports.allowOrigins = allowOrigins;