const TelnetQuery = require('./TelnetQuery');
const planets = require('./planets');

const getPlanetPosition = (req, res) =>{
    let planetName = req.params.name;
    let userLocation = req.body;

    if(planetName.length){
        new TelnetQuery(req, res, planets.getPlanetId(planetName), userLocation);
    }
    else{
        res.status(403);
    }
}

const getPlanetsName = (req, res) =>{
    let planetsName = Object.keys(planets.planetsIds);

    return res.status(200).json({
        planets : planetsName,
        method: req.method
    });
}

exports.getPlanetPosition = getPlanetPosition;
exports.getPlanetsName = getPlanetsName;