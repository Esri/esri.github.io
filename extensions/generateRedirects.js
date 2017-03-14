var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');

const TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <title>Redirect</title>
    <meta charset="utf-8"/>
    <meta http-equiv="refresh" content="0; URL={{ redirectTo }}">
  </head>
  <body>
  </body>
</html>`;

module.exports = function (acetate) {
  acetate.generate(function (pages, createPage, callback) {
    fs.readFile(path.join(acetate.sourceDir, 'data/redirects.yml'), function (error, contents) {
      if (error) {
        callback(error);
        return;
      }

      try {
        var doc = yaml.safeLoad(contents.toString());
      } catch (e) {
        callback(e, acetate);
      }

      var pages = _.map(doc, function (newUrl, oldUrl) {
        return createPage(oldUrl, TEMPLATE, {
          prettyUrl: false,
          redirectTo: newUrl,
          layout: false
        });
      });

      acetate.info(`Generated ${pages.length} redirects`);

      callback(null, pages);
    });
  });
};
