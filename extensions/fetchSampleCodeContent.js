var request = require('request');
var config = require('../config.json');
var nunjucks = require('nunjucks');
var GITHUB_TOKEN = process.env.GITHUB_TOKEN || config.GITHUB_TOKEN;
var DEVTOPIA_TOKEN = process.env.DEVTOPIA_TOKEN || config.DEVTOPIA_TOKEN;

module.exports = function (acetate) {
  acetate.prerender('**/*', function fetchSampleCodeContent (page, next) {
    if (!page.source || !page.repo || !page.path || !page.content) {
      next(null, page);
      return;
    }

    var base = (page.source === 'github') ? 'https://api.github.com' : 'https://devtopia.esri.com/api/v3'
    var token = (page.source === 'github') ? GITHUB_TOKEN : DEVTOPIA_TOKEN;
    var url = base + '/repos/' + page.repo + '/contents/' + page.path + '/' + page.content;

    request({
      url: url,
      json: true,
      method: 'GET',
      headers: {
        'User-Agent': 'ArcGIS for Developers',
        'Authorization': 'token ' + token
      },
      qs: {
        ref: page.version || 'master'
      }
    }, function (error, response, body) {
      if (!error && body && body.content) {
        page.readmeContent = new nunjucks.runtime.SafeString(new Buffer(body.content, 'base64').toString().replace(/^(#.+)$/m, '').replace(/^(#+(?!\s))(\w.+)/gm, function (match, header, text) {
          return header + ' ' + text;
        }));
      } else {
        acetate.error('samples', 'Error getting %s: %j', url, body);
      }

      next(error, page);
    });
  });
};

