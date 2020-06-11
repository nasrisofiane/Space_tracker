const net = require('net');
const SimpleDate = require('./utils/SimpleDate');
const TelnetQueries = new Set();
const enterCommand = '\r\n';

//Telnet informations from server informations to needed keywords in data responses text
const telnet = {
    PORT: 6775,
    HOST: 'horizons.jpl.nasa.gov',
    KEYWORDS: {
        READY: 'Horizons>',
        START_STRING: '$$SOE',
        SEARCH_STRING: 'GlxLon',
        END_STRING: '$$EOE'
    }
}

class TelnetQuery {
    constructor(req, res, planetId, userLocation) {

        this.req = req;
        this.res = res;
        TelnetQueries.add(this);

        if (!this.userDatasChecker(planetId, userLocation)) {
            this.respondToUser('## QUERY ERROR ##', 403);
        }
        else {
            this.response = '';
            this.socket = new net.Socket();
            this.initializeEvents();
            this.connectToTelnet();
            this.stepsCounter = 0;
            this.startingDate = new SimpleDate().readableIso();
            this.endingDate = new SimpleDate().appendToDate({ minutes: 1 });
            this.commands = [
                planetId,
                'E',
                'o',
                `c@399`,
                'g',
                `${userLocation.longitude}, ${userLocation.latitude}, ${userLocation.altitude}`,
                this.startingDate,
                this.endingDate,
                '10m',
                'n',
                '33, 1 , 4',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'Y'
            ];
        }
    }

    /**
     * Initialize all events related to the telnet server
     */
    initializeEvents = () => {
        this.socket.on('error', (err) => console.log(err));

        this.socket.on('data', (data) => {
            this.addDataToResponse(data);
        });

        this.socket.on('close', () => {
            console.log('### CLOSED TELNET CONNECTION ###');
            
            this.respondToUser(this.resultsFilter(), 200);
        })

    }

    /**
     * Check user's entries and return true or false if the user can start the telnet query.
     */
    userDatasChecker = (planetId, userLocation) => {
        if (!planetId) {
            return false;
        }
        else {
            if (!userLocation.longitude && !userLocation.latitude) {
                return false;
            }

            if (!userLocation.altitude) {
                userLocation.altitude = 0;
            }
            return true;
        }
    }

    /**
     * Add data for the user response
     */
    addDataToResponse = (data) => {
        let stringResponse = data.toString('utf8');
        this.response += stringResponse;
        console.log(stringResponse); //Important logger

        //If telnet response contain a keyword, the commands can starts
        if (stringResponse.includes(telnet.KEYWORDS.READY)) {
            this.socket.write(this.commands[this.stepsCounter] + enterCommand);
            this.stepsCounter += 1;
        }
        else if (this.stepsCounter > 0 && this.stepsCounter < this.commands.length) {
            this.socket.write(this.commands[this.stepsCounter] + enterCommand);
            this.stepsCounter += 1;
        }

        //If the keyword of the data needed is found in a telnet response, then we can stop fetching data by closing the user's telnet socket.
        if (stringResponse.includes(telnet.KEYWORDS.SEARCH_STRING)) {
            this.socket.destroy();
        }
    }

    /**
     * Get response by cutting only needed strings to reduce data trafic.
     */
    resultsFilter = () => {
        //First and last line needed
        let firstLineWanted = this.response.lastIndexOf(telnet.KEYWORDS.START_STRING) + telnet.KEYWORDS.START_STRING.length;
        let lastLineWanted = this.response.lastIndexOf(telnet.KEYWORDS.END_STRING);

        //Cut the text response with first and last line wanted
        this.response = this.response.substring(firstLineWanted, lastLineWanted);

        return this.resultsFinalFormat();
    }

    //Convert strings text to final format response.
    resultsFinalFormat = () =>{

        let objectProperties = ["date", "glxLon", "glxLat", "rightAscension", "declination", "Azimuth", "Elevation"];
        let finalResultObject = {};

        let stringToArr = this.response.split(',')
            .map(data => data.replace(/(?:\\[rn]|[\r\n]|[*]|[ ]+)+/g, ""))
            .filter(data => data.length)
            .map((data, index) => finalResultObject[objectProperties[index]] = data);

        return finalResultObject;
    }

    /**
     * Connect to the telnet server with the server's informations passed in connect parameters
     */
    connectToTelnet = () => {
        this.socket.connect(telnet.PORT, telnet.HOST, () => console.log('connected'));
    }

    /**
     * respond to the user with the req and res passed in constructor
     */
    respondToUser = (queryMessage, statusCode = 200) => {
        this.res.status(statusCode).json({
            message: queryMessage,
            method: this.req.method
        });
        this.deleteQueryInstance();
    }

    /**
     * Delete the query instances from telnetQuery to avoid unused instances.
     */
    deleteQueryInstance = () => {
        TelnetQueries.delete(this);
    }

}

module.exports = TelnetQuery;


