module.exports = function (data) {
    var lines = data.split('\n'),
                isNameLine = true,
                isRingSection = false,
                isInteriorRing = false,
                coordinates = [],
                currentPolygon = [],
                currentRing = [],
                gj = {
                    type: 'FeatureCollection',
                    features: []
                };

    for (var i = 1; i < lines.length; i++) {
        if (isEndMarker(lines[i])) {
            if (!isRingSection) {
                coordinates.push(currentPolygon);
                break;
            }
            isRingSection = false;
            isNameLine = true;
            if (currentRing.length > 0) {
                currentPolygon.push(currentRing);
                currentRing = [];
            }
        }
        else if (isNameLine) {
            isNameLine = false;
            isRingSection = true;
            isInteriorRing = lines[i].indexOf('!') === 0;
            if (currentPolygon.length > 0 && !isInteriorRing) {
                coordinates.push(currentPolygon);
                currentPolygon = [];
            }
        }
        else {
            currentRing.push(getCoordinate(lines[i]));
        }
    }

    gj.features.push({
        type: 'Feature',
        properties: {
        },
        geometry: {
            type: getGeometryType(coordinates),
            coordinates: getCoordinates(coordinates)
        }
    });
    function getGeometryType(coordinates) {
        return coordinates.length === 1 ? 'Polygon' : 'MultiPolygon';
    }
    function getCoordinates(coordinates) {
        return coordinates.length === 1 ? coordinates[0] : coordinates;
    }
    function isEndMarker(line) {
        return line.indexOf('END') === 0;
    }
    function getCoordinate(line) {
        var coord = line.replace(/^\s*|\s*$/g, '').split(/\s+/);
        return [parseFloat(coord[0]), parseFloat(coord[1])];
    }
    return gj;
};
