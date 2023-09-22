---
layout: reference
title: "基本型（ツアー）"
---
# 基本型（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2.svg){:width="20" style="display:inline"} **基本型**
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-todo.svg){:width="20" style="display:inline"} [コレクション](kotlin-tour-collections.md)
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-todo.svg){:width="20" style="display:inline"} [制御フロー](kotlin-tour-control-flow.md)
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-todo.svg){:width="20" style="display:inline"} [関数](kotlin-tour-functions.md)
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} [クラス](kotlin-tour-classes.md)
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} [Null safety](kotlin-tour-null-safety.md)

Kotlinでは、すべての変数とデータ構造にはデータの型があります。データの型はコンパイラに対して、あなたがその変数やデータ構造にどういう操作を許しているかを伝えるという重要な役割を果たしています。
言い換えると、その変数やデータ構造がどのような関数やプロパティを持っているか、という事を伝えているという事です。

前の章で、Kotlinは`customers`が[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)型を持つという事を分かっていました。
Kotlinがデータの型を**推測**する機能を、**型推論(type inference)**と呼びます。`customers`には整数の値がセットされました。
この事から、Kotlinは`customers`が数値のデータ型、つまり`Int`であろうと推論した訳です。
その結果として、コンパイラはあなたが算術演算を`customers`に出来る、という事を理解出来る訳です。

{% capture kotlin-tour-basic-types-arithmetic %}
fun main() {
//sampleStart
    var customers = 10

    // 何人かの客が列から離脱
    customers = 8

    customers = customers + 3 // 足し算の例: 11
    customers += 7            // 足し算の例: 18
    customers -= 3            // 引き算の例: 15
    customers *= 2            // 掛け算の例: 30
    customers /= 3            // 割り算の例: 10

    println(customers) // 10
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-basic-types-arithmetic %}

> `+=`, `-=`, `*=`, `/=`, `%=` は、拡張代入演算子と呼ばれるものです。もっと詳しく知りたければ、[拡張代入](operator-overloading.md#augmented-assignments)を参照してください。
> 
{: .tip }

全体としては、Kotlinには以下の基本型があります：

|**カテゴリ**| **基本型**|
|--|--|
| 整数 | `Byte`, `Short`, `Int`, `Long` |
| 符号無し整数 | `UByte`, `UShort`, `UInt`, `ULong` |
| 浮動小数点数 | `Float`, `Double` |
| Boolean型 | `Boolean` |
| 文字型 | `Char` |
| 文字列型 | `String` |

基本型についてのより詳細な情報やプロパティについては、[基本型](basic-types.md)を参照ください。

以上の知識があれば、変数を先に宣言しておいて初期化は後回しにする、という事が出来るようになります。
最初に変数が読まれる前に初期化をしてさえあれば、どこまでも初期化を後回しに出来ます。

初期化せずに変数を宣言するには、型を`:`で指定して宣言します。

例を挙げましょう：

{% capture kotlin-tour-basic-types-initialization %}
fun main() {
//sampleStart
    // 変数を初期化せずに宣言
    val d: Int
    // 変数を初期化
    d = 3

    //　明示的に型を指定した変数を初期化
    val e: String = "hello"

    // 変数は初期化済みなので読んでOK
    println(d) // 3
    println(e) // hello
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-basic-types-initialization %}

基本型をどう宣言するかをマスターしたので、[コレクション](kotlin-tour-collections.md)について学ぶ時が来ました。

## 練習問題

以下の変数を明示的に型指定して宣言せよ：

{% capture kotlin-tour-basic-types-exercise %}
fun main() {
    val a = 1000
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '\n'
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-basic-types-exercise %}

{% capture kotlin-tour-basic-types-solution %}
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000
    val e: Boolean = false
    val f: Char = '\n'
}
```
{% endcapture %}
{% include collapse_quote.html body=kotlin-tour-basic-types-solution title="解答例" %}

## 次回

[コレクション](kotlin-tour-collections.md)