var escape = require('escape-html'),
    geojsonRandom = require('geojson-random'),
    geojsonExtent = require('geojson-extent'),
    geojsonFlatten = require('geojson-flatten'),
    polyline = require('polyline'),
    wkx = require('wkx'),
    zoomextent = require('../lib/zoomextent'),
    tapiClient = require('../jotun/tapiclient.js');
    graphhopperclient= require('../jotun/graphhopperclient.js');

module.exports.adduserlayer = function(context, _url, _name) {
    var url = escape(_url), name = escape(_name);
    var layer = L.tileLayer(url, {
        maxZoom: context.map.getMaxZoom()
    });
    if (context.layerControl) {
        context.map.addLayer(layer);
        context.layerControl.addOverlay(layer, name);
    }
    else {
        context.layerControl = L.control.layers(null, {}, {
            position: 'bottomright',
            collapsed: false
        }).addTo(context.map).addOverlay(layer, name);
        context.map.addLayer(layer);
    }
};

module.exports.zoomextent = function(context) {
    zoomextent(context);
};

module.exports.clear = function(context) {
    context.data.clear();
};

module.exports.random = function(context, count, type) {
    context.data.mergeFeatures(geojsonRandom(count, type).features, 'meta');
};

module.exports.bboxify = function(context) {
    context.data.set({ map: geojsonExtent.bboxify(context.data.get('map')) });
};

module.exports.flatten = function(context) {
    context.data.set({ map: geojsonFlatten(context.data.get('map')) });
};

module.exports.polyline = function(context) {
    var input = prompt('Enter your polyline');
    try {
        var decoded = polyline.toGeoJSON(input);
        context.data.set({ map: decoded });
    } catch(e) {
        alert('Sorry, we were unable to decode that polyline');
    }
};

module.exports.wkxBase64 = function(context) {
    var input = prompt('Enter your Base64 encoded WKB/EWKB');
    try {
        var decoded = wkx.Geometry.parse(Buffer.from(input,'base64'));
        context.data.set({ map: decoded.toGeoJSON() });
        zoomextent(context);
    } catch(e) {
        console.error(e);
        alert('Sorry, we were unable to decode that Base64 encoded WKX data');
    }
};

module.exports.wkxHex = function(context) {
    var input = prompt('Enter your Hex encoded WKB/EWKB');
    try {
        var decoded = wkx.Geometry.parse(Buffer.from(input,'hex'));
        context.data.set({ map: decoded.toGeoJSON() });
        zoomextent(context);
    } catch(e) {
        console.error(e);
        alert('Sorry, we were unable to decode that Hex encoded WKX data');
    }
};

module.exports.wkxString = function(context) {
    var input = prompt('Enter your WKT/EWKT String');
    try {
        var decoded = wkx.Geometry.parse(input);
        context.data.set({ map: decoded.toGeoJSON() });
        zoomextent(context);
    } catch(e) {
        console.error(e);
        alert('Sorry, we were unable to decode that WKT data');
    }
};


module.exports.getTapiIsochrones = function (context){

  var input = prompt('Enter your Stop Id');
  var response = tapiClient.getStopIsochrones(input);

  response.then(result => {
    context.data.set({ map: result });

    zoomextent(context);
    context.data.set({ stopId: input});
    d3.select('span.stopIdDisplay').text(input);
    alert('Isochrone data loaded for stop: ' + input);
  })
  .catch(error =>  {
      console.error(error);
      alert('Sorry, we were unable to fetch the isochrone data');
  });
};

var swap = function (xy){
  let split = xy.split(",");
  return split[1] + ',' + split[0];
};

module.exports.generateTapiIsochrones = function (context){

  var stopId = context.data.get('stopId');
  if (!stopId)
  {
    alert('you need to have a stopId selected.');
    return;
  }
  var data = context.data.get('map');
  var pid = data.features[0].properties.pid;

  var distances = [120,180,300,480,780,1260,2040,3300];
  var results = [];
  for (var i = 0; i < distances.length; i++){
    results[i] = graphhopperclient.generateIsochrone(swap(pid), distances[i]);
  }

  Promise.all(results)
  .then(function(values) {

    var generated = {
      type: "FeatureCollection",
      features: []
    };

    for (var r = 0; r < results.length; r++){
      let f = values[r].polygons[0];
      f.properties.pid = pid;
      f.properties.maximumWalkingDurationInSeconds = distances[r].toString();
      generated.features[r] = f;
    }

    context.data.set({map : generated});

    alert('Isochrone data generated for stop: ' + stopId);
  })
  .catch(error =>  {
      console.error(error);
      alert('Sorry, we were unable to generate the isochrone data');
  });

};

module.exports.saveTapiIsochrones = function (context){
  var input = context.data.get('stopId');
  if (!input){
    input = '(?)';
  }
  var data = context.data.get('map');
  var response = tapiClient.saveStopIsochrones(data);

  response.then(result => {
    zoomextent(context);
    alert('Saving Isochrone for stop: ' + input + '.\n\n' + JSON.stringify(result, null, 2));
  })
  .catch(error =>  {
      console.error(error);
      alert('Sorry, we were unable to save the isochrone data. See the console for details.');
  });
};
