var OSM_ATTRIBUTION = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var map;
var locationMarker = L.circle(L.latLng(0, 0), {
  color: '#0000ff',
  fillColor: '#0000ff',
  fillOpacity: 0.2,
  stroke: true,
  weight: 1,
  radius: 8
});

var currentLatLng;
var zoomToPositionPending = false;
var positionWatchId;

var forms = {};
var recordsByFormId = {};
var layersByFormId = {};

/** Creates a map with an OSM base layer. */
function newOsmMap(elementId) {
  var map = new L.Map(elementId);
  map.setView(new L.LatLng(-6.806, 39.273), 13);  // Dar es Salaam
  map.addLayer(new L.TileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {minZoom: 8, maxZoom: 20, attribution: OSM_ATTRIBUTION, opacity: 0.6}
  ));
  return map;
}

/** Handles a position update event from the Geolocation API. */
function updatePosition(e, onFix) {
  debug('Update position: ' + e.coords.latitude.toFixed(4) + ', ' +
        e.coords.longitude.toFixed(4) + ' @ ' +
        e.coords.accuracy.toFixed(1) + ' m');
  if (e.coords.accuracy < 400) {  // ignore fixes coarser than 400 m
    currentLatLng = L.latLng(e.coords.latitude, e.coords.longitude);
    locationMarker.setLatLng(currentLatLng);
    locationMarker.setRadius(e.coords.accuracy);
    locationMarker.addTo(map);
    if (zoomToPositionPending) {
      zoomToPositionPending = false;
      zoomToCurrentLocation();
    }
    onFix();
  }
}
 
function zoomToCurrentLocation(onFix) {
  if (currentLatLng) {
    map.setView(currentLatLng, Math.max(map.getZoom(), 16));
    return true;
  } else {
    debug('Waiting for first location fix...');
    zoomToPositionPending = true;
    startWatchingPosition(onFix);
    return false;
  }
}

function startWatchingPosition(onFix) {
  if (!positionWatchId) {
    positionWatchId = navigator.geolocation.watchPosition(function(e) {
      updatePosition(e, onFix);
    }, null, {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 5000
    });
  }
}

/** Displays the geometry for a form's records on the map. */
function showRecords(map, formId, minSubmissionTime) {
  if (!layersByFormId[formId]) {
    if (!recordsByFormId[formId]) {
      syncRecords(formId, function () { showRecords(map, formId); });
    }
    layersByFormId[formId] = createLayers(
      recordsByFormId[formId],
      selectRule(config.form_rules, forms[formId]).features || []
    );
  }
  layersByFormId[formId].forEach(function (pair) {
    if (pair.time >= minSubmissionTime) {
      pair.layer.addTo(map);
    } else {
      pair.layer.removeFrom(map);
    }
  });
}

/** Removes the geometry for a form's records from the map. */
function hideRecords(map, formId) {
  (layersByFormId[formId] || []).forEach(function (pair) {
    pair.layer.removeFrom(map);
  });
}

/** Pulls the metadata for all forms from the server and stores them locally. */
function syncForms(callback) {
  fetchForms(function (result) {
    result.forEach(function (form) {
      forms[form['formid']] = form;
    });
    callback();
  });
}

/** Pulls the records for a form from the server and stores them locally. */
function syncRecords(formId, callback) {
  fetchRecords(formId, null, function (records) {
    recordsByFormId[formId] = records;
    callback();
  });
}

/** Fetches forms from a KoboToolbox API server. */
function fetchForms(callback) {
  $.get({
    url: config.api_url + '/forms',
    data: {'format': 'jsonp'},
    dataType: 'jsonp',
    success: callback
  });
}

/** Fetches records from a KoboToolbox API server. */
function fetchRecords(formId, minSubmissionTime, callback) {
  data = {'format': 'jsonp'};
  if (minSubmissionTime) {
    data.query = {'_submission_time': {'$gte': minSubmissionTime}};
  }
  $.get({
    url: config.api_url + '/data/' + formId,
    data: data,
    dataType: 'jsonp',
    success: callback
  });
}

/** Creates geometry features for all the given records and returns an array. */
function createLayers(records, features) {
  var layers = [];
  records.forEach(function (record) {
    features.forEach(function (feature) {
      var layer = createLayer(feature.type, record[feature.field], mergeStyles(
          feature.style,
          selectRule(feature.style_rules, record).style || {}
      ));
      if (layer) layers.push({time: record['_submission_time'], layer: layer});
    });
  });
  return layers;
}

/** Creates a single geometry feature layer. */
function createLayer(type, geometry, style) {
  if (geometry) {
    switch (type) {
      case 'polyline':
        return L.polyline(parsePolyline(geometry), style);
      case 'point':
        return L.circleMarker(parsePoint(geometry), style);
    }
  }
}

/** Parses a polyline from an ODK Collect record into a Leaflet polyline. */
function parsePolyline(geometry) {
  var latlons = [];
  var match = geometry.match(/LINESTRING *Z?M? *\((.*)\)/i);
  if (match) {
    // WKT format: "LINESTRING ZM (lon lat alt acc, lon lat alt acc, ...)"
    match[1].split(/,/).forEach(function (point) {
      var coords = point.trim().split(/ /);
      var lat = +coords[1], lon = +coords[0];
      if (!isNaN(lat) && !isNaN(lon)) {
        latlons.push([lat, lon]);
      }
    });
  } else {
    // JavaRosa format: "lat lon alt acc; lat lon alt acc; ..."
    geometry.split(/;/).forEach(function (point) {
      var coords = point.trim().split(/ /);
      var lat = +coords[0], lon = +coords[1];
      if (!isNaN(lat) && !isNaN(lon)) {
        latlons.push([lat, lon]);
      }
    });
  }
  return latlons;
}

/** Parses a point from an ODK Collect record into a Leaflet point. */
function parsePoint(geometry) {
  var match = geometry.match(/POINT *Z?M? *\((.*)\)/i);
  if (match) {
    // WKT format: "POINT ZM (lon lat alt acc)"
    var coords = match[1].trim().split(/ /);
    var lat = +coords[1], lon = +coords[0];
    if (!isNaN(lat) && !isNaN(lon)) {
      return [lat, lon];
    }
  } else {
    // JavaRosa format: "lat lon"
    var coords = geometry.trim().split(/ /);
    var lat = +coords[0], lon = +coords[1];
    if (!isNaN(lat) && !isNaN(lon)) {
      return [lat, lon];
    }
  }
}

/** Selects the first rule from an array whose selector matches the record. */
function selectRule(rules, record) {
  for (var i = 0; i < rules.length; i++) {
    if (matchSelectors(record, rules[i].selectors)) {
      return rules[i];
    }
  }
  return {};
}

/** Returns true if the given record matches all the selectors. */
function matchSelectors(record, selectors) {
  selectors = selectors || [];
  for (var i = 0; i < selectors.length; i++) {
    if (!matchSelector(record, selectors[i])) return false;
  }
  return true;
}

/** Returns true if the given record matches the given selector. */
function matchSelector(record, selector) {
  var specimen = record[selector.field];
  switch (selector.operator || '==') {
    case 'prefix':
      return specimen.startsWith(selector.value);
    case 'suffix':
      return specimen.endsWith(selector.value);
    case '==':
      return specimen === selector.value;
  }
}

/** Merges a set of style attributes on top of a base set of attributes. */
function mergeStyles(base, override) {
  var result = {};
  for (var key in base) {
    result[key] = base[key];
  }
  for (var key in override) {
    result[key] = override[key];
  }
  return result;
}

/** Displays or hides a status message box. */
function setStatus(message) {
  var status = document.getElementById('status');
  var sync = document.getElementById('sync');
  if (message) {
    status.innerText = message;
    status.style.display = 'block';
    sync.style.display = 'none';
  } else {
    status.style.display = 'none';
    sync.style.display = 'block';
  }
}

/** Displays or hides a debug message box, enabled by "#debug" in the URL. */
function debug(message) {
  if (window.location.hash == '#debug') {
    $('#debug').text(message);
    message ? $('#debug').show() : $('#debug').hide();
  }
}
