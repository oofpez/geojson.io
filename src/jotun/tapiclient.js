var payload = {
    'client_id': 'transitapipostman_transitapi',
    'client_secret': 'wimt85!',
    'grant_type': 'client_credentials',
    'scope': 'transportapi:all routethink:locations:read'
};

var getBearerToken = function () {
    return new Promise(
        (resolve, reject) => {
            if (window.token_expires_in != false && window.token_expires_in > new Date().getTime()) {
                resolve(window.token);
            }
            else {
                var request = new XMLHttpRequest();
                request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
                request.addEventListener('load', function () {
                    var response = JSON.parse(this.responseText);
                    var token = response.access_token;
                    window.token = token;
                    window.token_expires_in = new Date().getTime() + response.expires_in;
                    resolve(token);
                });
                request.addEventListener("error", error => reject({ message: 'error', err: error }));
                request.addEventListener("abort", error => reject({ message: 'abort', err: error }));

                request.setRequestHeader('Accept', 'application/json');
                var formData = new FormData();
                for (var key in payload) {
                    formData.append(key, payload[key]);
                }
                request.send(formData);
            }
        }
    )
};

var getStopIsochronesWithToken = function (token, stopId) {
  return new Promise(
      (resolve, reject) => {
          var request = new XMLHttpRequest();
          request.open('GET', 'https://platform.whereismytransport.com/api/isochrones?stopIds=' + stopId , true);
          request.setRequestHeader('Content-type', 'application/json');
          request.setRequestHeader('Authorization', 'Bearer ' + token);
          request.addEventListener('load', function () {
              resolve(JSON.parse(this.responseText));
          });

          request.addEventListener("error", error => reject({ message: 'error', err: error }));
          request.addEventListener("abort", error => reject({ message: 'abort', err: error }));
          request.send();
      }
  )
}

var saveStopIsochronesWithToken = function (token, data) {
  return new Promise(
      (resolve, reject) => {
          var request = new XMLHttpRequest();
          request.open('POST', 'https://platform.whereismytransport.com/api/isochrones', true);
          request.setRequestHeader('Content-type', 'application/json');
          request.setRequestHeader('Authorization', 'Bearer ' + token);
          request.setRequestHeader('Accept', 'application/json');
          request.addEventListener('load', function () {
              resolve(JSON.parse(this.responseText));
          });

          request.addEventListener("error", error => reject({ message: 'error', err: error }));
          request.addEventListener("abort", error => reject({ message: 'abort', err: error }));
          request.send(JSON.stringify(data));
      }
  )
}

module.exports.getStopIsochrones = function (stopId) {
    return getBearerToken()
            .then(token => getStopIsochronesWithToken(token, stopId))
            .catch(error => reject(error.message));
}


module.exports.saveStopIsochrones = function ( data) {
    return getBearerToken()
            .then(token => saveStopIsochronesWithToken(token, data))
            .catch(error => reject(error.message));
}
