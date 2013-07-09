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
          declaration: true
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

    # bowerのライブラリの出力
    bower:
      development:
        dest: 'client/js'
        options:
          basePath: 'components'

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
        files: '*.html'
        tasks: ['']

    # サーバー
    connect:
      livereload:
        options:
          port: 666

  # npmからとってくるプラグイン
  pkg = grunt.file.readJSON('package.json')
  for taskName of pkg.devDependencies
    if taskName.substr(0, 6) == 'grunt-'
      grunt.loadNpmTasks(taskName)

  # Gruntタスクの登録 grunt compile のようにして呼び出す
  grunt.registerTask('compile', ['typescript', 'less', 'bower'])
  grunt.registerTask('server', ['connect', 'watch'])
