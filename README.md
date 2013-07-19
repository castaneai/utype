UType
=======

歌詞をタイピングするゲーム.

必要なもの
==============
- [node.js] (http://nodejs.org/)

アプリの実行
==============
1. 作業自動化ツールgruntを入れる
```
$ npm install -g grunt-cli
```

2. 必要なライブラリを自動インストール
```
$ npm install
```

3. コンパイルが自動で行われる
```
$ grunt init
```

4. サーバーを立てる
```
$ grunt server
```

5. ブラウザで以下のURLにアクセスすると実行できる
```
http://localhost:666
```

テストの実行
=============
1. テスト実行ツールtestemを入れる
```
$ npm install -g testem
```

2. testemを起動。インストールされているブラウザが順番に立ち上がりテストを実行する。
```
$ testem ci
```