// ┌───────────┐
// │ Gruntfile │
// └───────────┘

var webpackConfig = require('./webpack.config.js');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');

module.exports = function (grunt) {
  // ┌───────────────┐
  // │ Configuration │
  // └───────────────┘

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      options: webpackConfig,
      build: {
        // configuration for this build
      }
    },

    // Build static site
    acetate: {
      options: {
        config: 'acetate.config.js'
      },

      build: {
        options: {
          mode: 'build',
          args: {
            env: process.env.JOB_ENV || 'dev',
            assetPath: '/assets/js/',
            generateSamples: grunt.option('generateSamples') || false
          }
        }
      }
    },

    // Minify all images
    imagemin: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'build/'
        }]
      }
    },

    // minify js for production, run *after* js bundling and copying
    uglify: {
      js: {
        files: [{
          expand: true,
          cwd: 'build/assets/js',
          src: '**/*.js',
          dest: 'build/assets/js'
        }]
      }
    },

    // Build site Sass
    'sass': {
      options: {
        includePaths: ['node_modules/calcite-web/dist/sass/', 'src/assets/sass/']
      },
      site: {
        expand: true,
        cwd: 'src/assets/css',
        src: ['**/*.scss'],
        dest: 'build/assets/css',
        ext: '.css'
      }
    },

    // Watch sass files
    'watch': {
      sass: {
        files: ['src/assets/sass/**'],
        tasks: ['sass']
      },
      js: {
        files: ['src/assets/js/**'],
        tasks: ['copy:js']
      },
      css: {
        files: ['src/assets/css/**'],
        tasks: ['copy:css']
      },
      json: {
        files: ['src/messages.json'],
        tasks: ['copy:json']
      }
    },

    copy: {
      json: {
        files: [
          {expand: true, cwd: 'src/', src: ['messages.json'], dest: 'build'}
        ]
      },
      js: {
        files: [
          {expand: true, cwd: 'src/assets/js/', src: ['**/*'], dest: 'build/assets/js/'}
        ]
      },
      css: {
        files: [
          {expand: true, cwd: 'src/assets/css/', src: ['**/*.css'], dest: 'build/assets/css/'}
        ]
      },
      static: {
        files: [
          {expand: true, cwd: 'src/', src: ['favicon.ico'], dest: 'build'},
          {expand: true, cwd: 'src/', src: ['**/*.{png,jpg,gif,svg,webm,ogg}'], dest: 'build'},
          {expand: true, cwd: 'node_modules/calcite-web/dist/', src: ['css/**', 'fonts/**', 'img/**'], dest: 'build/assets/'},
          {expand: true, cwd: 'static/', src: ['**/*'], dest: 'build'},
          {expand: true, cwd: 'src/fonts/', src: ['**/*'], dest: 'build/fonts/'}
        ]
      },
      deploy: {
        files: [
          {expand: true, cwd: 'build/', src: ['**/*'], dest: grunt.option('out')}
        ]
      }
    },

    concurrent: {
      dev: {
        tasks: ['server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    clean: {
      build: ['build']
    },

    'gh-pages': {
      options: {
        base: 'build',
        branch: 'gh-pages',
        repo: 'https://github.com/Esri/esri.github.io.git'
      },
      src: ['**']
    }

  });

  // Load all grunt dependencies
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['karma:run']);
  grunt.registerTask('dev', ['clean', 'sass', 'assets', 'concurrent:dev']);
  grunt.registerTask('build', ['clean', 'sass', 'assets', 'imagemin', 'webpack', 'acetate']);
  grunt.registerTask('deploy', ['build', 'copy:deploy']);
  grunt.registerTask('assets', ['copy:json', 'copy:js', 'copy:css', 'copy:static', 'buildConfig']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);
  grunt.registerTask('buildConfig', function () {
    var done = this.async();

    fs.readFile(path.join(__dirname, 'src', 'data', 'config.yml'), function (error, contents) {
      if (error) {
        throw error;
      }

      var doc = yaml.safeLoad(contents.toString());
      var config = doc[process.env.JOB_ENV || 'local'];
      var configString = `
        var SiteConfig = ${JSON.stringify(config)};

        var dojoConfig = {
          async: true,
          locale: 'en-us',
          useDeferredInstrumentation: true,
          packages: [{
            name: "calcite-web",
            location: "/assets/js",
            main: "calcite-web"
          }]
        };
      `;

      fs.writeFile(path.join(__dirname, 'build', 'assets', 'js', 'config.js'), configString, done);
    });
  });

  grunt.registerTask('server', 'My start task description', function () {
    var done = this.async(); // eslint-disable-line no-unused-vars

    grunt.util.spawn({
      cmd: 'node',
      args: [path.join(process.cwd(), 'bin', 'dev-server.js')],
      opts: {
        env: {
          FORCE_COLOR: 1 // https://github.com/chalk/chalk/issues/115#issuecomment-222627467
        },
        stdio: 'inherit'
      }
    });
  });
};
