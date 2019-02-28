var gistBrowser = require('./')(require('./token'));

var container = document.body.appendChild(document.createElement('div'));

container.appendChild(gistBrowser.open().container);
