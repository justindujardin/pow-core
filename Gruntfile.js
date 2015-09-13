module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      clean: {
         build: {
            src: ["lib/"]
         }
      },
      typescript: {
         options: {
            module: 'amd',
            target: 'es5',
            rootPath: 'source',
            sourceMap: true,
            declaration: true
         },
         source: {
            src: [
               "source/api.ts",
               "source/resource.ts",
               "source/events.ts",
               "source/*.ts",
               "source/resources/*.ts",
               "source/resources/tiled/*.ts"
            ],
            dest: 'lib/<%= pkg.name %>.js'
         },
         tests: {
            src: [
               "test/fixtures/*.ts",
               "test/fixtures/**/*.ts",
               "test/*.ts",
               "test/**/*.ts"
            ],
            dest: 'lib/test/<%= pkg.name %>.tests.js'
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
               '<%= typescript.tests.src %>'
            ],
            tasks: ['typescript:tests']
         },
         source: {
            files: [
               '<%= typescript.source.src %>'
            ],
            tasks: ['typescript:source']
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
      }
   });
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-typescript');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.registerTask('default', ['typescript']);
   grunt.registerTask('develop', ['default', 'watch']);

   // Release a version
   grunt.loadNpmTasks('grunt-bump');
   grunt.loadNpmTasks('grunt-conventional-changelog');
   grunt.loadNpmTasks('grunt-npm');
   grunt.registerTask('release', 'Build, bump and tag a new release.', function(type) {
      type = type || 'patch';
      grunt.task.run([
         'npm-contributors',
         'typescript:source',
         'uglify',
         'bump:' + type + ':bump-only',
         'changelog',
         'artifacts:add',
         'bump-commit',
         'artifacts:remove'
      ]);
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
