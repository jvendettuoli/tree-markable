/**
 * Format the coordinates incoming from json to Point type for 
 * PostgresQL. 
 * 
 * {"geolocation": {"latitude":48, "longitude": -123}} => '-123, 48'
 */

const formatCoordinates = (objCoordinates) => {
	return `${objCoordinates.longitude},
    ${objCoordinates.latitude}`;
};

module.exports = formatCoordinates;
