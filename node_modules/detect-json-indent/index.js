module.exports = function(_, def) {
    def = def === undefined ? 4 : def;
    if (_ === '{}') return '    ';
    var lines = _.split('\n');
    if (lines.length < 2) return null;
    var space = lines[1].match(/^(\s*)/);
    return space[0];
};
