var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var request = require('request');
var config = require('../config.json');
var nunjucks = require('nunjucks');
var unzip = require('unzip');
require('shelljs/global');

/**
 * Updates the Arcade content by:
 * - Downloading the WebGIS/arcgis-arcade repo in a zip
 * - Extracting the repo
 * - Copying the guide and function reference content
 * - Generating and copying the Arcade Editor
 *
 * Sourced from below repo:
 * https://devtopia.esri.com/WebGIS/arcgis-arcade/
 */

var DIR = __dirname + '/../'; // Root of project (assumes that this file is in extensions folder)
var DEVTOPIA_TOKEN = process.env.DEVTOPIA_TOKEN || config.DEVTOPIA_TOKEN;
var base = 'https://devtopia.esri.com/api/v3'
var url = base + '/repos/WebGIS/arcgis-arcade/zipball'

console.log('Downloading arcgis-arcade zip file...');
request({
  url: url,
  json: true,
  method: 'GET',
  headers: {
    'User-Agent': 'ArcGIS for Developers',
    'Authorization': 'token ' + DEVTOPIA_TOKEN
  }
})
.on('error', function(err) { console.log(err); })
.pipe(fs.createWriteStream(DIR + 'static/arcade.zip'))
.on('error', function (err) { console.log("ERROR DOWNLOADING REPO\n", err); })
.on('close', function() {

  console.log('Extracting arcgis-arcade zip file...');
  fs.createReadStream(DIR + 'static/arcade.zip')
  .pipe(unzip.Extract({ path: DIR + 'static' }))
  .on('error', function (err) { console.log("ERROR EXTRACTING REPO\n", err); })
  .on('close', function () {

    console.log('Copying Function Reference...');
    exec('mv $(find static -type d -name "WebGIS-arcgis-arcade-*") static/arcade');
    exec('cp static/arcade/sdk/apiref/markdowns/* src/arcade/function-reference/ ');
    exec('cp static/arcade/sdk/apiref/src/*.json src/arcade/function-reference/ ');

    console.log('Copying Guide...');
    exec('cp static/arcade/sdk/guide/* src/arcade/guide/ ')

    console.log('Generating new Arcade Editor...');
    exec('cd static/arcade/playground && npm install && grunt release');

    console.log('Copying new Arcade Editor...');
    exec('cp -r static/arcade/playground/distribution/arcade-editor static/');
    console.log('Cleanup...');
    exec('rm -r static/arcade');
    exec('rm static/arcade.zip');
    console.log('Done.');
  });
});
