var request = require('browser-request'),
    token;

var base = 'https://api.github.com';

module.exports = function(_, endpoint) {
    token = _;
    base = endpoint || base;
    return module.exports;
};

module.exports.open = open;

function ce(t, k) {
    var elem = document.createElement(t);
    if (k) elem.className = k;
    return elem;
}

function open() {
    var container = ce('div', 'gist-map-browser'),
        p = 0;

    function loadPage() {
        page('/gists?page=' + p, function(err, res) {
            if (err) throw err;
            res.filter(isMap).forEach(append);
            appendNext();
        });
    }

    var onclick = function(elem) { };

    function isMap(gist) {
        var is = false;
        for (var i in gist.files) {
            if (i.match(/\.(geo)?json/i)) is = true;
        }
        return is;
    }

    function appendNext(n) {
        var olds = container.getElementsByClassName('gist-map-next');
        for (var i = 0; i < olds.length; i++) { olds[i].parentNode.removeChild(olds[i]); }
        var c = container.appendChild(ce('div', 'gist-map-next'));
        c.innerHTML = 'load more';
        c.onclick = function() {
            p++;
            loadPage();
        };
    }

    function append(gist) {
        var c = container.appendChild(ce('div', 'gist-map-item'));
        var t = c.appendChild(ce('div', 'gist-map-title'));
        t.textContent = gist.description;
        var contents = c.appendChild(ce('div', 'gist-map-contents'));
        contents.textContent = Object.keys(gist.files).join(', ');
        c.onclick = function(elem) {
            page('/gists/' + gist.id, function(err, res){
                onclick(res, elem);
            });
        };
    }

    var o = {
        container: container,
        onclick: function(_) {
            onclick = _;
            return o;
        },
        appendTo: function(elem) {
            elem.appendChild(container);
            return o;
        }
    };

    loadPage();

    return o;
}

function page(postfix, callback) {
    request({
        uri: base + postfix,
        headers: {
            Authorization: 'token ' + token
        },
        json: true,
        crossOrigin: true
    }, function(err, res, body) {
        callback(null, body);
    });
}
