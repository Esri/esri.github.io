var _ = require('lodash');
var async = require('async');
var request = require('request');
var path = require('path');
var config = require('../config.json');

var GITHUB_TOKEN = process.env.GITHUB_TOKEN || config.GITHUB_TOKEN;
var DEVTOPIA_TOKEN = process.env.DEVTOPIA_TOKEN || config.DEVTOPIA_TOKEN;
var extensions = {
  '.cs': 'cs',
  '.m': 'objectivec',
  '.h': 'objectivec',
  '.swift': 'swift',
  '.java': 'java',
  '.xaml': 'xml'
};

module.exports = function (acetate) {
  acetate.prerender('**/*', function fetchSampleCodeFiles (page, next) {
    if (!page.source || !page.repo || !page.path || !page.files || !page.files.length) {
      next(null, page);
      return;
    }

    var filesToRequest = _.map(page.files, function (filename, index) {
      var base = (page.source === 'github') ? 'https://api.github.com' : 'https://devtopia.esri.com/api/v3'

      return {
        index: index,
        filename: path.basename(filename),
        url: base + '/repos/' + page.repo + '/contents/' + page.path + '/' + filename
      };
    });

    async.map(filesToRequest, function (fileRequest, done) {
      var token = (page.source === 'github') ? GITHUB_TOKEN : DEVTOPIA_TOKEN;

      request({
        url: fileRequest.url,
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
        fileRequest.highlightAs = extensions[path.extname(fileRequest.filename)]

        if (!error && body && body.content) {
          acetate.info('samples', 'content fetched for %s', fileRequest.url)
          fileRequest.content = new Buffer(body.content, 'base64').toString()
        } else {
          acetate.error('samples', 'Error getting %s: %j', fileRequest.url, body || error)
          fileRequest.content = '';
        }

        done(null, fileRequest);
      });
    }, function (error, files) {
      page.sampleCode = _.sortBy(files, 'index');
      acetate.info('samples', '%s requests completed for %s', files.length, page.src)
      next(error, page);
    });
  });
};
