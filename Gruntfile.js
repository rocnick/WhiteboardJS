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
            src: [
              '**/*.js',
              '**/*.map'
            ]
          }
        ]
      }
    },
    express: {
      options: {
        port: 1092
      },
      server: {
        options: {
          script: './app.js'
        }
      }
    },
    jshint: {
      files: [
        './Gruntfile.js',
        './public/javascripts/*.js',
        './app.js',
        './routes/*.js',
        '!./public/javascripts/*angular*.js',
        '!./public/javascripts/*d3*.js',
        '!*.sql'
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
          './controllers/*.js',
          './dal/*.js',
          '!*.sql'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
          event: ['all'],
          livereload: true
        },
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['copy', 'jshint', 'express:server', 'watch']);
};