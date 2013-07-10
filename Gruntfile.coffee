module.exports = (grunt) ->
  grunt.initConfig
    # Typescriptのコンパイル
    typescript:
      client:
        src: ['client/js/**/*.ts']
        dest: 'client/js'
        options:
          target: 'es5'
          sourcemap: true
          base_path: 'client/js'

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
      typescript:
        files: ['client/js/**/*.ts']
        tasks: 'typescript'
      less:
        files: ['client/css/**/*.less']
        tasks: 'less'
      html:
        files: '**/*.html'
        tasks: ''

    # サーバー
    connect:
      livereload:
        options:
          port: 666
          base: 'client'

  # npmからとってくるプラグイン
  pkg = grunt.file.readJSON('package.json')
  for taskName of pkg.devDependencies
    if taskName.substr(0, 6) == 'grunt-'
      grunt.loadNpmTasks(taskName)

  # Gruntタスクの登録 grunt compile のようにして呼び出す
  grunt.registerTask('compile', ['typescript', 'less'])
  grunt.registerTask('server', ['compile', 'connect', 'watch'])
  grunt.registerTask('init', ['bower:install', 'compile'])
