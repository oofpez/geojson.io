var expect = require('expect.js'),
    qs = require('../');

describe('iD.Util', function() {
    it('#stringQs', function() {
        expect(qs.stringQs('foo=bar')).to.eql({foo: 'bar'});
        expect(qs.stringQs('foo=bar&one=2')).to.eql({foo: 'bar', one: '2' });
        expect(qs.stringQs('')).to.eql({});
    });

    it('#qsString', function() {
        expect(qs.qsString({ foo: 'bar' })).to.eql('foo=bar');
        expect(qs.qsString({ foo: 'bar', one: 2 })).to.eql('foo=bar&one=2');
        expect(qs.qsString({})).to.eql('');
    });
});
