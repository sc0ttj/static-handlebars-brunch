var fs = require('fs');
var path = require('path');

describe('Plugin', function () {
  var cwd = process.cwd();

  it('should be an object', function () {
    var plugin = new Plugin();
    expect(plugin).to.be.ok;
  });

  it('gets dependencies', function (done) {
    process.chdir('test/app1');

    var config = {
      paths: {
        root: process.cwd()
      }
    };
    var plugin = new Plugin(config);
    var indexHbs = path.join(process.cwd(), 'index.hbs');
    var expected = path.join(process.cwd(), 'head.hbs');

    fs.readFile(indexHbs, function (err, data) {
      if (err) throw err;
      plugin.getDependencies(data, indexHbs, function (err, deps) {
        expect(deps.length).gte(1);
        expect(deps[0]).equal(expected);
        done();  
      });
    });
  });
});