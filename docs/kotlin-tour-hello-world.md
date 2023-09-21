---
layout: reference
title: "Hello World"
---
# Hello World

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1.svg){:width="20" style="display:inline"} **Hello world**
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-basic-types.md">Basic types</a>
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-collections.md">Collections</a>
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-control-flow.md">Control flow</a>
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-functions.md">Functions</a>
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-classes.md">Classes</a>
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-null-safety.md">Null safety</a>

"Hello, world!"と出力するプログラムは以下のようになります：

{% capture hello-world-kotlin %}
fun main() {
    println("Hello, world!")
    // Hello, world!
}
{% endcapture %}
{% include kotlin_quote.html body=hello-world-kotlin %}

Kotlinでは:
* 関数を定義するのに `fun` が使われる
* `main()` 関数からプログラムが開始する
* 関数のボディは中括弧の中に書かれる `{}`
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) と [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 関数は引数を標準出力にプリントする

> 関数は続く章でより詳細に議論します。そこまでは、`main()` 関数しか出てきません
{: .note }

## 変数

プログラムというものは、基本的にはデータを保持する必要があるものです。そして変数というものは、まさにそれを行うだけのものです。Kotlinでは、変数を宣言するのに以下の二つのキーワードがあります：
* 読み取り専用（read-only）の変数： `val`
* 値を変更する（mutableな）変数： `var`

値を設定するには、`=` オペレータを使います。

例を見てみましょう：

{% capture kotlin-tour-variables %}
fun main() { 
//sampleStart
    val popcorn = 5    // ポップコーンが5箱あります
    val hotdog = 7     // ホットドッグが7つあります
    var customers = 10 // 列に10人の客が並んでいます
    
    // 何人かの客が列から去りました
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-variables %}

> 変数はプログラムの最初、`main()`関数の外にも定義出来ます。このように定義された変数は **トップレベル（top level）**と呼ばれます。
{: .note }

`customers` はmutableな変数なので、定義した後にも値の再設定が可能となっている。

> 基本的にはすべての変数を読み取り専用(つまり`val`)にするのがオススメです。
> 必要な時だけmutableな変数 (つまり`var`)にするようにしましょう。 
> 
{: .note}

## 文字列テンプレート

It's useful to know how to print the contents of variables to standard output. You can do this with **string templates**. 
You can use template expressions to access data stored in variables and other objects, and convert them into strings.
A string value is a sequence of characters in double quotes `"`. Template expressions always start with a dollar sign `$`.

To evaluate a piece of code in a template expression, place the code within curly braces `{}` after the dollar sign `$`.

For example:

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

For more information, see [String templates](strings.md).

You will notice that there aren't any types declared for variables. Kotlin has inferred the type itself: `Int`. This tour
explains the different Kotlin basic types and how to declare them in the [next chapter](kotlin-tour-basic-types.md).

## 練習問題

Complete the code to make the program print `"Mary is 20 years old"` to standard output:

{% capture kotlin-tour-hello-world-exercise %}

fun main() {
    val name = "Mary"
    val age = 20
    // Write your code here
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-hello-world-exercise %}

{% capture kotlin-tour-hello-world-solution %}
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```
{% endcapture %}
{% include collapse_quote.html body=kotlin-tour-hello-world-solution title="解答例" %}

## Next step

[Basic types](kotlin-tour-basic-types.md)