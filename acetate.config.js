var path = require('path');
var fs = require('fs');
var _ = require('lodash');

// load environment variables
require('dotenv').config({
  silent: true
});

// Configuration of acetate build
module.exports = function (acetate) {
  /**
   * Set a global to point to where JS files should come from
   */
  acetate.global('assetPath', acetate.args.assetPath);

  /**
   * Load all html and markdown pages, set default layouts and margin to footer
   */
  acetate.load('**/*.+(html|md)', {
    footer_margin: 3,
    layout: 'layouts/_layout:main'
  });

  /**
   * Configure Nunjucks
   */
  acetate.renderer.nunjucks.addFilter('date', require('nunjucks-date-filter'));

  /**
   * Configure robots.txt
   */
  acetate.load('robots.txt', {
    layout: false
  });

  /**
   * Configure templates for the angular apps
   */
  acetate.metadata('assets/js-es6/ng/**/*.html', {
    ignore: true,
    layout: false
  });

  /**
   * Setup config.js files for passing config values to clients
   */
  acetate.data('site_config', 'data/config.yml');
  acetate.global('ENV', acetate.args.env || 'local');

  /**
   * Configure a `build.json` file with basic info
   */
  acetate.load('build.json', {
    layout: false,
    sitemap: false,
    current_time: new Date(),
    current_user: process.env.USER
  });

  /**
   * Load misc files
   */
  acetate.load('crossdomain.xml', {
    layout: false
  });

  acetate.load('BingSiteAuth.xml', {
    layout: false
  });

  /**
   * Helper for determining if a current path is active
   * @TODO replace this with the built-in {% link %} helper
   */
  acetate.helper('is_active', function (context, pathname, currentPath) {
    var currentUrl = currentPath || context.page.url;
    return (currentUrl.lastIndexOf(path) === 0) ? ' is-active ' : '';
  });

  /**
   * Custom filter to stringify a JSON object
   */
  acetate.filter('stringify', function (object) {
    return JSON.stringify(object);
  });

  /**
   * helper to generate a sidebar link
   * @TODO replace this with the built-in {% link %} helper
   * @TODO figure out a way to find a pages `title` from it's url
   */
  acetate.helper('menu_item', function (context, title, pathname, test) {
    var isCurrentPage = false;

    if (test instanceof Array) {
      isCurrentPage = test.some(function (t) {
        return context.page.url.match(t);
      });
    } else if (test) {
      isCurrentPage = context.page.url.match(test);
    } else {
      var fullPath = context.page.url[0] !== '/' ? '/' + context.page.url : context.page.url;
      var comparePath = pathname[pathname.length - 1] !== '/' ? pathname + '/' : pathname;
      isCurrentPage = fullPath.match(comparePath);
    }

    var classes = isCurrentPage ? 'is-active' : '';

    if (!title.length) {
      title = context.page.queries.titlesByUrl[pathname];
    }

    return '<a href=\'' + pathname + '\' class=\'side-nav-link ' + classes + '\'>' + title + '</a>';
  });

  /**
   * Helper to generate a url to a CSS stylesheet
   */
  acetate.helper('stylesheet_url', function (context, css) {
    if (css.indexOf('//') >= 0) {
      return css;
    }
    return '/assets/css/' + css;
  });

  /**
   * Helper to generate a URL to a JS file
   */
  acetate.helper('javascript_url', function (context, js) {
    if (js.indexOf('//') >= 0) {
      return js;
    }
    return '/assets/js/' + js;
  });

  /**
   * Helper to figure out if an accordian section should be active
   */
  acetate.helper('accordian_is_active', function (context, files) {
    var linkName = _(context.page.url.split('/')).compact().last();

    var match = files.some(function (file) {
      var fileparts = _(file.split('/')).compact().last();
      return fileparts === linkName;
    });

    if (match) {
      return 'is-active';
    }

    return '';
  });

  /**
   * Format a screenshot for a sample code page
   */
  acetate.helper('sample_screenshot_for', function (context) {
    var u = context.page.url.substring(0, context.page.url.length - 1);
    var i = u.lastIndexOf('/');
    var imgPath = u.substring(0, i) + '/images' + u.substring(i) + '.png';

    try {
      if (fs.statSync(path.join(acetate.src, imgPath)).isFile()) {
        return '<p><img src=\'' + imgPath + '\'/></p>';
      }
    } catch (e) {
      return '';
    }
  });

  /**
   * Filter a string to use as an id by removing any html tags and entities and converting spaces to '-'
   */
  acetate.filter('to_page_id', function (str) {
    return str.replace(/&(?:.|\n)*?;/gm, '-').replace(/<(?:.|\n)*?>/gm, '').replace(/[.;,\/()]/g, '').replace(/\s+/g, '-').toLowerCase();
  });

  /**
   * Filter an array of objects with a name property to include objects
   * with specific names
   */
  acetate.filter('select_by_name', function (objectArray, namesArray) {
    return _.filter(objectArray, function (obj) {
      return namesArray.some(function (name) {
        return obj.name === name;
      });
    });
  });

  /**
   * get a array of values from an array of objects with a specific key
   */
  acetate.filter('collectionOf', function (value, key) {
    return value.map(function (item) {
      return item[key];
    });
  });

  /**
   * Configure sitemap and sitemap_index
   */
  acetate.load('sitemap.xml', {
    layout: false
  });

  acetate.load('sitemap_index.xml', {
    layout: false
  });

  acetate.query('sitemap', '**/*', function (page) {
    if (!page.sitemap) {
      return;
    }

    var entry = {
      url: page.url
    };

    if (page.sitemap.priority) {
      entry.priority = page.sitemap.priority;
    }

    return entry;
  }, function (sitemap, entry) {
    sitemap.push(entry);
    return sitemap;
  }, []);

  /**
   * Create a query that organizes titles keyed by URL.
   * This is for the {% menu_item %} helper.
   */
  acetate.query('titlesByUrl', '**/*', function (page) {
    return {
      url: page.url,
      title: page.title
    };
  }, function (titlesByUrl, page) {
    titlesByUrl[page.url] = page.title;
    return titlesByUrl;
  }, {});

  acetate.data('projects', 'data/projects.yml');
  acetate.data('searchTags', 'data/search-topics.yml');
};
