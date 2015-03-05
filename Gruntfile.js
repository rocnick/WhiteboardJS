//  Project:    WhiteboardJS
//  Author:     Nick Snyder

module.exports = function(grunt)
{
  grunt.initConfig({
    copy: {
      angular: {
        files: [
          {
            expand: true,
            dest: './public/javascripts',
            cwd: './node_modules/angular',
            src: ['**/*.js', '**/*.map']
          }
        ]
      }
    },
    express: {
      options: {
        port: 1092,
        spawn: false
      },
      dev: {
        options: {
          script: './bin/www'
        }
      }
    },
    jshint: {
      files: [
        './Gruntfile.js',
        './public/javascripts/*.js',
        './bin/*',
        './app.js',
        './routes/*.js',
        '!./public/javascripts/*angular*.js'
      ],
      options: { 
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      scripts: {
        files: [
          './Gruntfile.js',
          './public/javascripts/*.js',
          './app.js',
          './routes/*.js',
          './bin/www'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
          event: ['all']
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['jshint', 'copy', 'watch', 'express:dev']);
};