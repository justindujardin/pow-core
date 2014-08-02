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
            basePath: 'source',
            sourceMap: true,
            declaration: true
         },
         source: {
            src: [
               "source/api.ts",
               "source/resource.ts",
               "source/events.ts",
               "source/*.ts",
               "source/resources/*.ts"
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
               'CHANGELOG.md',
               'lib/pow-core.d.ts',
               'lib/pow-core.js',
               'lib/pow-core.js.map',
               'lib/pow-core.min.js',
               'lib/pow-core.min.map'
            ],
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: true,
            pushTo: 'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
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
         "bump:" + type + ":bump-only",
         'changelog',
         'bump-commit'
      ]);
   });
};
