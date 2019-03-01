module.exports.generateIsochrone = function (pid, limit) {
  return new Promise(
      (resolve, reject) => {
          var request = new XMLHttpRequest();
          request.open('GET', 'http://13.94.102.177/isochrone?point=' + pid + '&vehicle=foot&time_limit=' + limit , true);
          request.addEventListener('load', function () {
              resolve(JSON.parse(this.responseText));
          });

          request.addEventListener("error", error => reject({ message: 'error', err: error }));
          request.addEventListener("abort", error => reject({ message: 'abort', err: error }));
          request.send();
      }
  )
}
