---
layout: reference
title: "関数的インターフェース（SAM）"
---
# 関数的インターフェース（SAM）

抽象メソッド一つだけを持つインターフェースを **関数的インターフェース（functional interface）**、
または **Single Abstract Method（SAM）インターフェース**（訳注：単一抽象メソッド）と呼ばれます。
関数的インターフェースは複数の非抽象メンバを持つ事も出来ますが、抽象メンバは一つだけです。

Kotlinで関数的インターフェースを定義するには、`fun`修飾子を使います。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAMコンバージョン

関数的インターフェースに対しては、
SAMコンバージョンというものを使って、
[ラムダ式](lambdas.md#ラムダ式と無名関数)を使ってコードを読みやすく簡潔に書く事が出来ます。

関数的インターフェースを実装したクラスを手作業で作る代わりに、
ラムダ式を使う事が出来ます。
SAMコンバージョンを用いると、Kotlinはインターフェースの単一のメソッドのシグニチャとマッチするラムダ式を、
動的にインターフェース実装をしたインスタンスとして生成するコードに変換出来ます。


例として、以下のようなKotlinの関数的インターフェースを考えましょう：

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

SAMコンバージョンを使わなければ、以下のようなコードを書かなくてはいけない所です：

```kotlin
// クラスのインスタンスを作成
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

KotlinのSAMコンバージョンの力を使えば、同等の以下のようなコードを書く事が出来ます：

```kotlin
// ラムダを使ってインスタンスを作成
val isEven = IntPredicate { it % 2 == 0 }
```

短いラムダ式が不要なすべてのコードを置き換えてしまいました。

{% capture sam-conversion-lambda %}
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("7 は偶数？ - ${isEven.accept(7)}")
}
{% endcapture %}
{% include kotlin_quote.html body=sam-conversion-lambda %}

[Javaのインターフェースに対するSAMコンバージョン](java-interop.md#sam-conversions)というのもあります。

## コンストラクタ関数付きインターフェース、から関数的インターフェースへのマイグレーション

（訳注：良く知らない機能なので原題を残しておく： Migration from an interface with constructor function to a functional interface）

1.6.20から、Kotlinは「[呼び出し可能リファレンス](reflection.md#callable-references)から関数的インターフェースのコンストラクタへ」、という機能をサポートしている。
（訳注：callable references to functional interface constructors という名前の機能らしい）

これはコンストラクタ関数付きのインターフェースから関数的インターフェースへのソース互換を保ったままのマイグレーション方法を提供する。
以下のコードを考えてみよう：

<!-- Starting from 1.6.20, Kotlin supports [callable references](reflection.md#callable-references) to functional interface constructors, which
adds a source-compatible way to migrate from an interface with a constructor function to a functional interface.
Consider the following code:
-->


```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

「呼び出し可能リファレンスから関数的インターフェースのコンストラクタへ」がenableだと、
このコードは単なる関数的インターフェースの宣言に置き換える事が出来る：

<!-- 
With callable references to functional interface constructors enabled, this code can be replaced with just a functional interface declaration:
-->

```kotlin
fun interface Printer { 
    fun print()
}
```

コンストラクタは暗黙で作られて、`::Printer`関数のリファレンスを使うどんなコードでもコンパイル出来るようになります。
例えば：

```kotlin
documentsStorage.addPrinter(::Printer)
```

バイナリ互換を保つためには、レガシーとなる`Printer`関数の方に
[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションを、
`DeprecationLevel.HIDDEN`で付けます:


```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 関数的インターフェース vs. typeエイリアス

先程のコードを関数の型に[typeエイリアス](type-aliases.md)を使って単純に以下のように書き直す事も出来ますが：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("7は偶数？ - ${isEven(7)}")
}
```

しかしながら、関数的インターフェースと[typeエイリアス](type-aliases.md)は違う目的に使われるものです。
Typeエイリアスは既存の型に対する単なる名前に過ぎず、新しい型を作る訳でｈありません。
一方、関数的インターフェースは新しい型を作ります。
特定の関数的インターフェースに拡張を提供する事が出来て、
それらの拡張は単なる関数やそのエイリアスには適用出来ない、という風に出来ます。

Typeエイリアスはメンバを一つしか持てませんが、
関数的インターフェースは非abstractのメンバを複数持つ事が出来ます（abstractのメンバが一つあれば）。
関数的インターフェースは他のインターフェースを実装したりextendしたり出来ます。

関数的インターフェースはtypeエイリアスと比べて、より柔軟でより多くの機能を提供します。しかし、実行コストもシンタックス的にもよりコストが掛かりもします。
なぜなら特定のインターフェースへの変換を必要とするからです。
あなたのコードでどちらを使ったらいいかを選ぶ時には、以下の必要性について考えてみましょう：
* もしあなたのAPIがある特定のパラメータと戻りの型の関数ならなんでも受け付ける、というものなら、単純な関数の型かそのtype aliasを使って短い名前を与えたものを使いましょう。
* もしあなたのAPIが単なる関数よりも複雑な何かを受け取るというものなら ー 例えば、関数の型のシグニチャで表現出来ないような、非自明のコントラクトやオペレーションを持っているなど ー その場合は別個の関数的インターフェースをそれ専用に定義しましょう。
