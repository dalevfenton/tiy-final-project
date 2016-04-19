module.exports = {
  haversine: haversine,
  distance: distance
}

//extend Number prototype with toRadians and toDegrees methods
if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}

/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
}

//Haversine formula found at: http://www.movable-type.co.uk/scripts/latlong.html
function haversine(coord1, coord2){
  //this assumes the lat and long are stored as
  // [ long, lat ] in each coordinate array

  //you can set R to your constant of choice to get the appropriate units
  //on the final distance, or convert from the output
  // R is the mean radius of the Earth in your preferred units
  var R = 3959; // miles
  // var R = 6371000; // metres
  var lat1 = coord1[1];
  var lat2 = coord2[1];
  var lon1 = coord1[0];
  var lon2 = coord2[0];
  var φ1 = lat1.toRadians(); //lat1 in radians
  var φ2 = lat2.toRadians(); //lat2 in radians
  var Δφ = (lat2-lat1).toRadians(); // lat difference in rad
  var Δλ = (lon2-lon1).toRadians(); // long difference in rad
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2); //do crazy trig math
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); //more math
  return (R * c);
}

//simple coordinate distance between two points on a cartesian plane
function distance(pt1, pt2){
  var dX = pt1[0] - pt2[0];
  var dY = pt1[1] - pt2[1];
  return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
};
