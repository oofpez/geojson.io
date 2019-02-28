# qs-hash

A simple querystring encoder and decoder, with an option to skip encoding
URL components if you're going to use the encoded strings in URL hashes
rather than the path segment.

As seen in [iD](https://github.com/systemed/iD) and [geojson.io](http://geojson.io/).

## usage

    npm install --save qs-hash

## api

### `qsString(object, noencode)`

Encode an object to a string, `noencode` decides whether it skips encoding

### `stringQs(string)`

Decode a string to an object.
