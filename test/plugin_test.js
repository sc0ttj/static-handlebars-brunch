var path = require('path');

describe('Plugin', function () {
  var cwd = process.cwd();

  it('should be an object', function () {
    var plugin = new Plugin();
    expect(plugin).to.be.ok;
  });

  
});