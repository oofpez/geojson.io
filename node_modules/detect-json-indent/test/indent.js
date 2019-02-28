var detect = require('../'),
    expect = require('expect.js');

var data = {
    foo: 'bar',
    blah: 2
};

describe('basic indentation', function() {
    it('returns 4 for default', function() {
        expect(detect('{}')).to.eql('    ');
        expect(detect(JSON.stringify({}, null, 2))).to.eql('    ');
    });

    it('detects various styles', function() {
        expect(detect(JSON.stringify(data, null, 4))).to.eql('    ');
        expect(detect(JSON.stringify(data, null, '\t'))).to.eql('\t');
        expect(detect(JSON.stringify(data, null, 2))).to.eql('  ');
        expect(detect(JSON.stringify(data))).to.eql(null);
    });

    it('works on lists', function() {
        expect(detect(JSON.stringify([1,2,3]))).to.eql(null);
        expect(detect(JSON.stringify([1,2,3], null, 2))).to.eql('  ');
        expect(detect(JSON.stringify([1,2,3], null, 4))).to.eql('    ');
        expect(detect(JSON.stringify([1,2,3], null, '\t'))).to.eql('\t');
    });
});
