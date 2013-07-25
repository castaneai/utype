'use strict'

mountFolder = (connect, dir) ->
  return connect['static'](require('path').resolve(path))

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

    # Typescriptのコンパイル
    typescript:
      client:
        src: '<%= dirConfig.client %>/js/{,*/}*.ts'
        dest: '<%= dirConfig.tmp %>/js/utype.js'
        options:
          target: 'es5'
          sourcemap: true
      test:
        src: '<%= dirConfig.test %>/{,*/}*.ts'
        dest: '<%= dirConfig.test %>/test.js'
        options:
          target: 'es5'
          sourcemap: false
          base_path: 'test'

    # ファイルの更新を監視する
    watch:
      options:
        livereload: true
      typescript_client:
        files: '<%= dirConfig.client %>/{,*/}*.ts'
        tasks: 'typescript:client'
      html:
        files: '<%= dirConfig.client %>/{,*/}*.html'
      css:
        files: '{<%= dirConfig.tmp %>,<%= dirConfig.client %>}/css/{,*/}*.css'
      express:
        files: '<%= dirConfig.server %>/{,*/}*.js'
        tasks: ['express:dev:stop', 'express:dev']
        options:
          nospawn: true

    # サーバー
    connect:
      options:
        port: 666
        hostname: 'localhost'
      livereload:
        options:
          middleware: (connect) ->
            return [
              require('connect-livereload')()
              mountFolder(connect, dirConfig.tmp)
              mountFolder(connect, dirConfig.client)
            ]

    open:
      server:
        url: 'http://localhost:<%= connect.options.port %>'

    express:
      dev:
        options:
          script: '<%= dirConfig.server %>/app.js'
          port: 666

  # Gruntタスクの登録 grunt compile のようにして呼び出す
  grunt.registerTask('compile', ['typescript'])
  grunt.registerTask('server', ['compile', 'express:dev', 'watch'])
