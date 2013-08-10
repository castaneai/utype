'use strict'

module.exports = (grunt) ->
  # load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  dirConfig =
    client: 'client'
    server: 'server'
    tmp: '.tmp'
    dist: 'dist'
    test: 'test'

  grunt.initConfig
    dirConfig: dirConfig

    typescript:
      client:
        src: '<%= dirConfig.client %>/scripts/{,*/}*.ts'
        dest: '<%= dirConfig.tmp %>/<%= dirConfig.client %>/scripts/utype.js'
        options:
          target: 'es5'
      server:
        src: '<%= dirConfig.server %>/{,*/}*.ts'
        dest: '<%= dirConfig.tmp %>/<%= dirConfig.server %>/server.js'
        options:
          target: 'es5'
      test:
        src: '<%= dirConfig.test %>/{,*/}*.ts'
        dest: '<%= dirConfig.tmp %>/<%= dirConfig.test %>/test.js'
        options:
          target: 'es5'
          base_path: 'test'

    watch:
      options:
        livereload: true
      typescript_client:
        files: '<%= dirConfig.client %>/scripts/{,*/}*.ts'
        tasks: 'typescript:client'
      typescript_server:
        files: '<%= dirConfig.server %>/{,*/}*.ts'
        tasks: 'typescript:server'

    open:
      server:
        url: 'http://localhost:<%= express.server.options.port %>'

    express:
      server:
        options:
          # 外部に公開したい場合 #を外して0.0.0.0をホストにする
          #hostname: '0.0.0.0'
          port: 10800
          server: '<%= dirConfig.tmp %>/<%= dirConfig.server %>/server.js'
          bases: ['<%= dirConfig.client %>', '<%= dirConfig.tmp %>/<%= dirConfig.client %>']
          livereload: true

  # Gruntタスクの登録 grunt compile のようにして呼び出す
  grunt.registerTask('compile', ['typescript:client', 'typescript:server'])
  grunt.registerTask('server', ['compile', 'express', 'open', 'watch'])
