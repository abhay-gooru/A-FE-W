module.exports = function (grunt) {

  grunt.initConfig({
    exec: {
      "ember-test": 'ember test',
      "ember-test-cli": 'ember test --silent --reporter xunit',
      "ember-test-server": 'ember test --server',
      "ember-server-stubby": 'ember server --proxy http://localhost:8882/gooruapi',
    },

    stubby: {
      test: {
        options: {
          relativeFilesPath: true,
          persistent: false,
          mute: true
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
      },
      server: {
        options: {
          relativeFilesPath: true,
          persistent: true,
          mute: false
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-stubby');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', function (target) {

    var testExecTask = 'exec:ember-test' + ((target) ? '-' + target : '');
    var tasks = [
      'stubby:test',
      testExecTask
    ];
    grunt.task.run(tasks);
  });

  grunt.registerTask('run', function (target) {
    var serverExecTask = 'exec:ember-server-' + (target || 'stubby');
    var tasks = [
      'stubby:test',
      serverExecTask
    ];
    grunt.task.run(tasks);
  });

};
