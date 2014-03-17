handlebars = require("handlebars")
sysPath = require("path")
fs = require("fs")
glob = require("glob")
mkdirp = require("mkdirp")
debug = require("debug")("brunch:staticHandlebars")
progeny = require("progeny")

module.exports = class StaticHandlebarsCompiler
  brunchPlugin: true
  type: "template"
  extension: "hbs"
  defaults: {
    outputDirectory: 'public'
    templatesDirectory: 'app/templates'
    partials: {
      directory: 'app/templates'
      prefix: '_'
    }
    data: {}
  }

  constructor: (@config) ->
    @config = @config || {}
    @config.plugins = @config.plugins || {}
    @config.plugins.staticHandlebars = @config.plugins.staticHandlebars || {}
    @config.plugins.staticHandlebars.partials = @config.plugins.staticHandlebars.partials || {}

    @rootPath = @config.paths?.root || process.cwd()
    @outputDirectory = @config.plugins.staticHandlebars.outputDirectory || 'public'
    @templatesDirectory = @config.plugins.staticHandlebars.templatesDirectory || 'app/templates'
    @staticData = @config.plugins.staticHandlebars.data || {}
    @partialsDirectory = @config.plugins.staticHandlebars.partials.directory || @templatesDirectory
    @partialsPrefix =  '_'

    # empty string is valid but is falsy so check for it explicitly
    if 'string' == typeof @config.plugins.staticHandlebars.partials.prefix
      @partialsPrefix = @config.plugins.staticHandlebars.partials.prefix
    
    @getDependencies = progeny({
      rootPath: @rootPath
      extension: 'hbs'
      extensionsList: ['hbs']
      regexp: /^\s*\{\{> ([\w]*)\}\}/
      exclusion: /a^/
      prefix: @partialsPrefix
    })

  withPartials: (callback) ->
    partials = {}
    errThrown = false

    glob sysPath.join(@partialsDirectory, @partialsPrefix + '*.hbs'), (err, files) =>
      if err?
        callback(err)
      else if !files.length
        callback(null, partials)
      else
        files.forEach (file) ->
          name = sysPath.basename(file, ".hbs")
          if @partialsPrefix?
            name = name.substr(@partialsPrefix.length)

          fs.readFile file, (err, data) ->
            if err? and !errThrown
              errThrown = true
              callback(err)
            else
              partials[name] = data.toString()

              callback(null, partials) if Object.keys(partials).length == files.length

  compile: (data, path, callback) ->
    try
      basename = sysPath.basename(path, ".hbs")
      template = handlebars.compile(data)

      @withPartials (err, partials) =>
        if err?
          callback(err)
        else
          html = template(@staticData, partials: partials, helpers: @makeHelpers(partials))
          relPath = sysPath.relative(@templatesDirectory, path)
          newPath = sysPath.join(@outputDirectory, relPath.slice(0, -4) + ".html")

          mkdirp.sync(sysPath.dirname(newPath))

          debug 'writing file', newPath
          fs.writeFile newPath, html, (err) ->
            callback(err, null)

    catch err
      callback err, null

  makeHelpers: (partials) ->
    partial: (partial, options) ->
      new handlebars.SafeString(
        handlebars.compile(partials[partial])(options.hash)
      )
