const planetsIds = {
    Sun : 10,
    Mercury: 199,
    Venus: 299,
    Moon : 301,
    Mars: 499,
    Jupiter: 599,
    Saturn: 699,
    Uranus: 799,
    Neptune: 899
};

/**
 * Get a planetId from a given name and check if it exist
 * @param {*} planetName 
 */
const getPlanetId = (planetName) =>{
    planetName = checkPlanetNameAndReplace(planetName);
    return planetsIds[planetName] ? planetsIds[planetName] : null;
}

/**
 * Take planet name passed in params, replace all special characters and
 * capitalize first letter to match a planet name.
 * @param {*} planetName 
 */
const checkPlanetNameAndReplace = (planetName) =>{
    let planetNameReplaced = planetName.replace(/[^A-Z0-9]/ig, "");
    let newPlanetName = '';

    for (let i = 0; i < planetNameReplaced.length; i++) {

        if (i == 0) {
            newPlanetName += planetNameReplaced[i].toUpperCase();
        }
        else {
            newPlanetName += planetNameReplaced[i].toLowerCase();
        }
    }

    return newPlanetName;
}

exports.getPlanetId = getPlanetId;
exports.planetsIds = planetsIds;
