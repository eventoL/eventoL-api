module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    env : {
      dev : {
        XUNIT_FILE: 'results/xunit.xml'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results/results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['./tests/**/*.js']
      },
      unit: {
        options: {
          reporter: 'spec',
          captureFile: 'results/results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['./tests/unit/**/*.js']
      },
      functional: {
        options: {
          reporter: 'spec',
          captureFile: 'results/results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['./tests/functional/**/*.js']
      }
    },

    eslint: {
      jenkins: {
          options: {
            format: './node_modules/eslint-formatter-checkstyle-relative-paths',
            outputFile: 'eslint.xml'
          },
          src: ['./lib/**/*.js']
      },
      dev: {
          options: {
              format: 'stylish'
          },
          src: ['./lib/**/*.js']
      },
      watch: {
          options: {
              format: 'stylish'
          },
          src: ['./lib/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: ['./lib/**/*.js', './tests/**/*.js'],
        tasks: ['eslint:watch', 'mochaTest'],
        options: {
          event: ['added', 'changed', 'deleted']
        }
      }
    },

    mocha_istanbul: {
      test: {
        src: "tests/**/*.js",
        options: {
          coverage: true,
          excludes: ['node_modules/**', 'tests/**', 'results/**', 'main.js'],
          istanbulOptions: ['--include-all-sources=true'],
          root: './lib',
          coverageFolder: 'results',
          reporter: 'xunit-file',
          reportFormats: ['cobertura','lcovonly', 'html'],
          quiet: false
        }
      },
      unit: {
        src: "tests/unit/**/*.js",
        options: {
          coverage: true,
          excludes: ['node_modules/**', 'tests/**', 'results/**', 'main.js'],
          istanbulOptions: ['--include-all-sources=true'],
          root: './lib',
          coverageFolder: 'results',
          reporter: 'xunit-file',
          reportFormats: ['cobertura','lcovonly', 'html'],
          quiet: false
        }
      },
      functional: {
        unit: {
          src: "tests/functional/**/*.js",
          options: {
            coverage: true,
            excludes: ['node_modules/**', 'tests/**', 'results/**', 'main.js'],
            istanbulOptions: ['--include-all-sources=true'],
            root: './lib',
            coverageFolder: 'results',
            reporter: 'xunit-file',
            reportFormats: ['cobertura', 'lcovonly', 'html'],
            quiet: false
          }
        }
      }
    }
  });

  grunt.registerTask('test', [
    'env:dev', 'eslint:jenkins', 'mocha_istanbul:test'
  ]);
  grunt.registerTask('unittest', [
    'env:dev', 'eslint:jenkins', 'mocha_istanbul:unit'
  ]);
  grunt.registerTask('functionaltest', [
    'env:dev', 'eslint:jenkins', 'mocha_istanbul:functional'
  ]);

};
