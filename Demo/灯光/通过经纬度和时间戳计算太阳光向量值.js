/*
 * @Author: Lemon C
 * @Date: 2024-06-26 18:31:25
 * @LastEditTime: 2024-06-27 16:49:32
 */
function calculateSunVector(timestamp, latitude, longitude) {
    // Helper functions for the calculations
    function toRadians(deg) {
        return deg * Math.PI / 180;
    }

    function toDegrees(rad) {
        return rad * 180 / Math.PI;
    }

    function julianDay(year, month, day, hour) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        var A = Math.floor(year / 100);
        var B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 - 1524.5 + B;
    }

    function solarPosition(julianDate, latitude, longitude) {
        var n = julianDate - 2451545.0;
        var L = (280.46 + 0.9856474 * n) % 360;
        var g = toRadians((357.528 + 0.9856003 * n) % 360);
        var lambda = toRadians(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));

        var epsilon = toRadians(23.439 - 0.0000004 * n);
        var alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
        var delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));

        var H = toRadians((280.46061837 + 360.98564736629 * (julianDate - 2451545) - longitude) % 360) - alpha;

        var altitude = Math.asin(Math.sin(toRadians(latitude)) * Math.sin(delta) + Math.cos(toRadians(latitude)) * Math.cos(delta) * Math.cos(H));
        var azimuth = Math.atan2(-Math.sin(H), Math.tan(delta) * Math.cos(toRadians(latitude)) - Math.sin(toRadians(latitude)) * Math.cos(H));

        return {
            altitude: altitude,
            azimuth: azimuth
        };
    }

    // Convert timestamp to date and time
    var date = new Date(timestamp);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // JavaScript months are 0-11
    var day = date.getUTCDate();
    var hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

    var julianDate = julianDay(year, month, day, hour);
    var sunPos = solarPosition(julianDate, latitude, longitude);

    // Convert altitude and azimuth to a direction vector
    var altitude = sunPos.altitude;
    var azimuth = sunPos.azimuth;
    
    var x = Math.cos(altitude) * Math.cos(azimuth);
    var y = Math.cos(altitude) * Math.sin(azimuth);
    var z = Math.sin(altitude);

    return [x, y, z];
}

// Example usage:
var timestamp = Date.UTC(2024, 5, 26, 12, 0, 0); // June 26, 2023, 12:00 UTC
var latitude = 34.7466; // New York City latitude
var longitude = 113.6254; // New York City longitude
var sunVector = calculateSunVector(timestamp, latitude, longitude);
console.log(sunVector);
