UType
=======

歌詞をタイピングするゲーム.

必要なもの
==============
- [node.js] (http://nodejs.org/)

アプリの実行
==============
1. 作業自動化ツールgrunt, パッケージ管理ツールbowerを入れる
```
$ npm install -g grunt-cli bower
```

2. 必要なライブラリを自動インストール
```
$ npm install
$ bower install
```

3. サーバーを立てる
```
$ grunt server
```

4. ブラウザで以下のURLにアクセスすると実行できる
```
http://localhost:666
```

テストの実行
=============
1. テスト実行ツールkarmaを入れる
```
$ npm install -g karma
```

2. karmaを起動。
```
$ karma start
```