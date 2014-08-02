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
      }
   });
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-typescript');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.registerTask('default', ['typescript']);
   grunt.registerTask('release', ['typescript','uglify']); // TODO: Build js/min-js and commit along with other release tasks like changelog
   grunt.registerTask('develop', ['default', 'watch']);
};
