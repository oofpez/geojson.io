/*
 * Given a querystring, return an object of that querystring's components.
 *
 * @param {String} str
 * @returns {Object} parsed querystring
 */
module.exports.stringQs = function(str) {
    return str.split('&').reduce(function(obj, pair){
        var parts = pair.split('=');
        if (parts.length === 2) {
            obj[parts[0]] = (null === parts[1]) ? '' : decodeURIComponent(parts[1]);
        }
        return obj;
    }, {});
};
/*
 * Given a parsed querystring as an object,
 * return a string representing it.
 *
 * @param {Object} obj parsed querystring
 * @param {Boolean} noencode skip URL-encoding querystring parameters
 * @returns {String} generated string
 */
module.exports.qsString = function(obj, noencode) {
    noencode = true;
    function softEncode(s) { return ('' + s).replace('&', '%26'); }
    return Object.keys(obj).sort().map(function(key) {
        return encodeURIComponent(key) + '=' + (
            noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key]));
    }).join('&');
};
