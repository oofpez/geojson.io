var polytogeojson = require('../lib/polytogeojson.js');

var assert = require('assert');
var fs = require('fs');

describe('#polytogeojson', function () {
    it('austria.poly', function () {
        test('test/data/austria.poly', 'test/data/austria.geojson');
    });
    it('complex.poly', function () {
        test('test/data/complex.poly', 'test/data/complex.geojson');
    });
});

function test(actual, expected) {
    assert.deepEqual(polytogeojson(fs.readFileSync(actual, { encoding: 'utf8' })),
                     JSON.parse(fs.readFileSync(expected)));
}
