const request = require('request');
const SimpleDate = require('./utils/SimpleDate');

//Horizons JPL response keywords needed.
const horizonsKeywords = {
    START_STRING: '$$SOE',
    SEARCH_STRING: 'GlxLon',
    END_STRING: '$$EOE'
}

const getPlanetDatas = (req, res, planetId, userLocation, date) => {

    if (!userDatasChecker(planetId, userLocation)) {
        respondToUser(req, res, "##QUERY ERROR##", 403);
    }
    else {
        request(apiUrlGenerator(planetId, userLocation, date), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                respondToUser(req, res, resultsFilter(body));
            }
        });
    }

}

const apiUrlGenerator = (planetId, userLocation, date) =>{
    let startingDate = new SimpleDate(date).readableIso();
    let endingDate = new SimpleDate(date).appendToDate({ minutes: 1 });

    let requestUrl = "https://ssd.jpl.nasa.gov/horizons_batch.cgi?batch=1";
    let requestParameters = `
        &COMMAND=${planetId}
        &MAKE_EPHEM='YES'
        &TABLE_TYPE='OBSERVER'
        &CENTER='c@399'
        &COORD_TYPE='GEODETIC'
        &SITE_COORD='${userLocation.longitude},${userLocation.latitude},0'
        &START_TIME='${startingDate}'
        &STOP_TIME='${endingDate}'
        &STEP_SIZE='10m'
        &QUANTITIES='31,1,4'
        &CSV_FORMAT='YES'
    `;

    let finalApiUrl = `${requestUrl}${requestParameters}`;
    return finalApiUrl;
}


/**
 * Check user's entries and return true or false if the user can start the HORIZON query.
 */
const userDatasChecker = (planetId, userLocation) => {
    if (!planetId) {
        return false;
    }
    else {
        if (!userLocation.longitude || !userLocation.latitude) {
            return false;
        }

        if (!userLocation.altitude) {
            userLocation.altitude = 0;
        }

        return true;
    }
}

/**
 * Get response by cutting only needed strings to reduce data trafic.
 */
const resultsFilter = (response) => {
    //First and last line needed
    let firstLineWanted = response.lastIndexOf(horizonsKeywords.START_STRING) + horizonsKeywords.START_STRING.length;
    let lastLineWanted = response.lastIndexOf(horizonsKeywords.END_STRING);

    //Cut the text response with first and last line wanted
    response = response.substring(firstLineWanted, lastLineWanted);

    return resultsFinalFormat(response);
}

//Convert strings text to final format response.
const resultsFinalFormat = (response) => {

    let finalResultObject = {
        date: null,
        glxLon: null,
        glxLat: null,
        rightAscension: null,
        declination: null,
        azimuth: null,
        elevation: null
    };

    let stringToArr = response.split(',')
        .map(data => data.replace(/(?:\\[rn]|[\r\n]|[*]|[ ]+)+/g, ""))
        .filter(data => data.length > 4);

    Object.keys(finalResultObject).map((prop, index) => {
        finalResultObject[prop] = stringToArr[index];
    });

    return finalResultObject;
}

/**
 * respond to the user with the req and res passed in parameters
 */
const respondToUser = (req, res, queryMessage, statusCode = 200) => {
    res.status(statusCode).json({
        message: queryMessage,
        method: req.method
    });
}

exports.getPlanetDatas = getPlanetDatas;
