このレポジトリは、kotlin-web-siteの和訳のサイトです。

[@dogwood008](https://github.com/dogwood008)氏が行った翻訳の続きを、@karino2 が引き継いで翻訳をしています。

- [本家](https://github.com/JetBrains/kotlin-web-site/)
- [Kotlin日本語リファレンス](https://karino2.github.io/kotlin-web-site-ja/)

## 確認方法

基本的にはjekyll servで動くようにしています。

以下のように作ったイメージで、

```
$ pushd docker
$ docker build -t karino2/jekyll . 
$ popd
```

以下のようにしています。

```
$ docker run --rm --volume="$PWD:/srv/jekyll" -it -p 4000:4000 karino2/jekyll jekyll serve
```

本家のビルド手順の再現は目指さず、minimaでマークダウンを省エネでレンダリングする程度にし、
翻訳したmdファイルを揃える事に注力します。

## 翻訳のベースとなるバージョン

当面は本家のcommit 5fb195b10e2325d0364607784cb1eddeb1ef6db4 をベースに作業します。

## 当面の作業方針

- ~~とりあえずツアーを追加していきます~~
- ツアーが終わったら既存の和訳をv1.19.0のものにアップデートしていきます ＜　今ここ
- それが終わったらまだ手がついてないファイルを翻訳していきます
