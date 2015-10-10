module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      clean: {
         build: {
            src: [
              "lib/",
              "source/pow-core/**/*.js.map",
              "source/pow-core/**/*.js",
              "source/pow-core/**/*.d.ts",
              "test/pow-core/**/*.js.map",
              "test/pow-core/**/*.js",
              "test/pow-core/**/*.d.ts"
            ]
         }
      },
      ts: {
         options: {
            module: 'system',
            target: 'es5',
            rootPath: 'source',
            sourceMap: true,
            declaration: false
         },
         source: {
            src: [
               "source/pow-core/*.ts",
               "source/pow-core/**/*.ts"
            ]
         },
         tests: {
            src: [
               "test/pow-core/*.ts",
               "test/pow-core/**/*.ts"
            ]
         }

      },
      uglify: {
         options: {
            sourceMap:true,
            banner: '\n/*!\n  <%= pkg.name %> - v<%= pkg.version %>\n  built: <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
         },
         build: {
            files: {
               'lib/<%= pkg.name %>.min.js'    : ['lib/<%= pkg.name %>.js']
            }
         }
      },
      watch: {
         options:{
            spawn: true
         },
         tests: {
            files: [
               '<%= ts.tests.src %>'
            ],
            tasks: ['ts:tests']
         },
         source: {
            files: [
               '<%= ts.source.src %>'
            ],
            tasks: ['ts:source', 'dist-bundle']
         }
      },

      /**
       * Release Tasks
       */
      bump: {
         options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: ['pkg'],
            commit: true,
            commitMessage: 'chore(deploy): release v%VERSION%',
            commitFiles: [
               'package.json',
               'bower.json',
               'CHANGELOG.md'
            ],
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: true,
            pushTo: 'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
         }
      },
      artifacts: {
         options:{
            files: [
               'lib/pow-core.d.ts',
               'lib/pow-core.js',
               'lib/pow-core.js.map',
               'lib/pow-core.min.js',
               'lib/pow-core.min.map'
            ]
         }
      },
      changelog: {},

      'npm-contributors': {
         options: {
            commitMessage: 'chore(attribution): update contributors'
         }
      },

     dtsGenerator: {
       options: {
         name: 'pow-core',
         baseDir: './source/pow-core/',
         out: 'lib/<%=pkg.name%>.d.ts'
       },
       default: {
         src: ['<%=ts.source.src%>']
       }
     }
   });
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-ts');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-systemjs-builder');
   grunt.loadNpmTasks('dts-generator');
   grunt.registerTask('default', ['ts', 'dtsGenerator', 'dist-bundle']);
   grunt.registerTask('develop', ['default', 'watch']);

   // Release a version
   grunt.loadNpmTasks('grunt-bump');
   grunt.loadNpmTasks('grunt-conventional-changelog');
   grunt.loadNpmTasks('grunt-npm');
   grunt.registerTask('release', 'Build, bump and tag a new release.', function(type) {
      type = type || 'patch';
      grunt.task.run([
         'clean',
         'ts:source',
         'npm-contributors',
         'uglify',
         'bump:' + type + ':bump-only',
         'changelog',
         'artifacts:add',
         'bump-commit',
         'artifacts:remove'
      ]);
   });

  grunt.registerTask('dist-bundle', 'Build a single-file javascript output.', function () {
    var buildConfig = {
      baseUrl: 'source/',
      defaultJSExtensions: true
    };
    var Builder = require('systemjs-builder');
    var builder = new Builder('source/', buildConfig);
    var done = this.async();
    builder.bundle('pow-core/**/*', 'lib/pow-core.js', {minify: false, sourceMaps: true}).then(function() {
      done();
    });
  });


   var exec = require('child_process').exec;
   grunt.registerTask('artifacts', 'temporarily version output libs for release tags', function(type) {
      var opts = this.options({
         files: [],
         pushTo: 'origin',
         commitAdd:"chore: add artifacts for release",
         commitRemove:"chore: remove release artifacts"
      });
      var done = this.async();
      console.log(opts.files);
      if(type === 'add') {
         exec('git add -f ' + opts.files.join(' '), function (err, stdout, stderr) {
            if (err) {
               grunt.fatal('Cannot add the release artifacts:\n  ' + stderr);
            }
            var commitMessage = opts.commitAdd;
            exec('git commit ' + opts.files.join(' ') + ' -m "' + commitMessage + '"', function (err, stdout, stderr) {
               if (err) {
                  grunt.fatal('Cannot create the commit:\n  ' + stderr);
               }
               grunt.log.ok('Committed as "' + commitMessage + '"');
               done();
            });
         });
      }
      else if(type === 'remove'){
         exec('git rm -f ' + opts.files.join(' ') + ' --cached', function(err, stdout, stderr) {
            if (err) {
               grunt.fatal('Cannot remove the release artifacts:\n  ' + stderr);
            }
            var commitMessage = opts.commitRemove;
            exec('git commit -m "' + commitMessage + '"', function(err, stdout, stderr) {
               if (err) {
                  grunt.fatal('Cannot create the commit:\n  ' + stderr);
               }
               grunt.log.ok('Committed as "' + commitMessage + '"');
               exec('git push ' + opts.pushTo, function(err, stdout, stderr) {
                  if (err) {
                     grunt.fatal('Can not push to ' + opts.pushTo + ':\n  ' + stderr);
                  }
                  grunt.log.ok('Pushed to ' + opts.pushTo);
                  done();
               });
            });
         });
      }
      else {
         grunt.fatal('Invalid type to artifacts');
      }
   });


};
