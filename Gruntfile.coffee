module.exports = (grunt) ->
  grunt.initConfig
    # Typescriptのコンパイル
    typescript:
      client:
        src: 'client/js/**/*.ts'
        dest: 'client/js/utype.js'
        options:
          target: 'es5'
          sourcemap: true
          base_path: 'client/js'
      server:
        src: 'server/**/*.ts'
        dest: 'server/app.js'
        options:
          target: 'es5'
          sourcemap: false
          base_path: 'server'

    # LESSのコンパイル
    less:
      development:
        files: [
          expand: true,
          cwd: 'client/css'
          src: ['*.less']
          dest: 'client/css'
          ext: '.css'
        ]

    # bowerのライブラリ出力
    bower:
      install:
        options:
          targetDir: 'client/js'
          install: true

    # ファイルの更新を監視する
    watch:
      options:
        livereload: true
      typescript_client:
        files: 'client/**/*.ts'
        tasks: 'typescript:client'
      typescript_server:
        files: 'server/**/*.ts'
        tasks: 'typescript:server'
      less:
        files: 'client/css/**/*.less'
        tasks: 'less'
      html:
        files: '**/*.html'
        tasks: ''
      express:
        files: 'server/**/*.js'
        tasks: ['express:dev:stop', 'express:dev']
        options:
          nospawn: true

    # サーバー
    connect:
      livereload:
        options:
          port: 666
          base: 'client'

    express:
      dev:
        options:
          script: 'server/app.js'
          port: 666

  # npmからとってくるプラグイン
  pkg = grunt.file.readJSON('package.json')
  for taskName of pkg.devDependencies
    if taskName.substr(0, 6) == 'grunt-'
      grunt.loadNpmTasks(taskName)

  # Gruntタスクの登録 grunt compile のようにして呼び出す
  grunt.registerTask('compile:client', ['typescript', 'less'])
  grunt.registerTask('compile:server', ['typescript:server'])
  grunt.registerTask('compile', ['compile:client', 'compile:server'])
  grunt.registerTask('server', ['compile:server', 'express:dev', 'watch'])
  grunt.registerTask('init', ['bower:install', 'compile'])
