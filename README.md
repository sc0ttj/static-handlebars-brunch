# static-handlebars-brunch

static-handlebars-brunch is a Brunch plugin that facilitates the use of
Handlebars as a build-time templating engine. This is useful if you have many
"static" pages that need the ability to include partials or other dynamic
content at build time.

## Installation

Add `static-handlebars-brunch` to your `package.json` file:

```json
"dependencies": {
  "static-handlebars-brunch": "~ 0.1.0"
}
```

And install dependecies.

```bash
$ npm install
```

## How it works

Any `.tmpl` file found in `src/app/templates` will be compiled to `.html` and copied
into `src/app/assets`. Brunch will then copy `src/app/assets` to `www`.

## Partials

A partial is any `.tmpl` file in `src/app/templates` that begins with an underscore,
for example: `src/app/templates/_header.tmpl`.

You can use the standard Handlebars partial helper to include partials in a
template.

Example = include the partials `_header.tmpl` and `_footer.tmpl` inside another page:

```tmpl
{{> _header}}

<p>This is a page!</p>

{{> _footer}}
```

A custom partial helper is available which allows you to pass variables to your
partials.

```tmpl
{{partial "header" title="My great page"}}

<p>This is a page!</p>

{{> "footer"}}
```

## Configuration

### Output directory

You can customize the output directory (default: `app/assets`)

```coffee
exports.config =
  plugins:
    staticHandlebars:
      outputDirectory: 'app/another_directory'
```

### Templates directory

You can customize the source directory (default: `app/templates`)

```coffee
exports.config =
  plugins:
    staticHandlebars:
      templatesDirectory: 'app/another_directory'
```

### Partials

You can customize the way partials are processed

```coffee
exports.config =
  plugins:
    staticHandlebars:
      partials:
        directory: 'app/partials'
        prefix: '_'
```

* `directory`: Source directory for partials. Defaults to templatesDirectory
* `prefix`: Expected prefix. Defaults to '_'

### Default template data

You can pass in an initial set of data to be statically compiled into your handlebars templates

```coffee
exports.config =
  plugins:
    staticHandlebars:
      data: myAPIKey: 'FOOBAR'
```

## TODO

This library has a long way to go in terms of configurability and compatability
with other workflows. The following are known features which we would like to
support. Feel free to send a pull request if you end up implementing any.

* Support a custom source path (ie. `app/templates`).
* Play nicely with `handlebars-brunch` (ie. figure out how to support both
  plugins in one app).
* Support custom extensions (only `.tmpl` is supported now).
* Cache partials (right now partials are recompiled up every time a file is
  changed).
* Write tests

## Contribution

* Fork this repository
* Create a feature branch on your fork
* Recompile the coffeescript: `coffee -c -o lib/ src/index.coffee`
* Make a Pull Request

## License

static-handlebars-brunch is an open source project released under the MIT
License. See `MIT-LICENSE` in the project root for more details.
