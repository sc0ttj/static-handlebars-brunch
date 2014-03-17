var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

describe('Plugin', function () {
  var cwd = process.cwd();
  var publicDir;

  afterEach(function () {
    if (fs.existsSync(publicDir)) {
      rimraf.sync(publicDir);
    }
    process.chdir(cwd);
  });

  it('should be an object', function () {
    var plugin = new Plugin();
    expect(plugin).to.be.ok;
  });

  it('gets dependencies', function (done) {
    process.chdir('test/app1');

    var config = {
      paths: {
        root: process.cwd()
      },
      plugins: {
        staticHandlebars: {
          partials: {
            prefix: ''
          }
        }
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

  it('gets dependencies (w/ prefix)', function (done) {
    process.chdir('test/app2');

    var config = {
      paths: {
        root: process.cwd()
      },
      plugins: {
        staticHandlebars: {
          partials: {
            prefix: '_'
          }
        }
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

  describe('#withPartials', function () {
    it('should be ok', function (done) {
      process.chdir('test/app3');
      var plugin = new Plugin({
        plugins: {
          staticHandlebars: {
            partials: {
              prefix: '_'
            }
          }
        }
      });
      plugin.withPartials(function (err, partials) {
        if (err) throw err;
        expect(Object.keys(partials).length).to.be.ok;
        done();
      });
    });
  });

  describe('#compile', function () {
    it('should work with custom partial and template directories', function (done) {
      process.chdir('test/app4');
      publicDir = path.join(process.cwd(), 'public');

      var plugin = new Plugin({
        plugins: {
          staticHandlebars: {
            templatesDirectory: 'app/custom-templates',
            partials: {
              directory: 'app/custom-partials',
              prefix: ''
            }
          }
        }
      });
      var indexHbs = path.join(process.cwd(), 'app/custom-templates/index.hbs');

      fs.readFile(indexHbs, { encoding: 'utf8' }, function (err, data) {
        if (err) throw err;
        plugin.compile(data, indexHbs, function (err2, res) {
          if (err2) throw err2;
          done();
        });
      });
    });
  });
});