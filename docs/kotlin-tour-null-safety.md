---
layout: reference
title: "Nullセーフティ（ツアー）"
---
# Nullセーフティ（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-done.svg){:width="20" style="display:inline"} [基本型](kotlin-tour-basic-types.md)
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-done.svg){:width="20" style="display:inline"} [コレクション](kotlin-tour-collections.md)
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-done.svg){:width="20" style="display:inline"} [制御フロー](kotlin-tour-control-flow.md)
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-done.svg){:width="20" style="display:inline"} [関数](kotlin-tour-functions.md)
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-done.svg){:width="20" style="display:inline"} [クラス](kotlin-tour-classes.md)
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7.svg){:width="20" style="display:inline"} [Nullセーフティ](kotlin-tour-null-safety.md)

Kotlinでは、`null`の値をとる事がある。
プログラムにおける`null`にまつわる問題を防ぐため、
KotlinにはNullセーフティというものがあります。
Nullセーフティは、`null`にまつわる潜在的な問題を、実行時では無くコンパイル時に検出します。


Nullセーフティは以下を可能にする機能の組み合わせです：
* `null`の値がプログラムのどこで許容されるかを明示的に宣言
* `null`値のチェック
* `null`値かもしれないオブジェクトのプロパティや関数の安全な呼び出し（セーフコール）
* `null`が検出された時のアクションの宣言

## Nullable型

KotlinはNullable型をサポートしています。Nullable型とは`null`の値が入っても良い型というものです。
デフォルトでは、型は`null`を受け入れ**ません**。Nullable型は明示的に`?`を型の後ろにつけることで宣言します。

例：

{% capture kotlin-tour-nullable-type %}
fun main() {
    // neverNullはString型
    var neverNull: String = "これはnullにはなり得ない"

    // コンパイルエラー
    neverNull = null

    // nullable変数はnullableはString型
    var nullable: String? = "ここにはnullも格納出来る"

    // これはOK
    nullable = null

    // デフォルトではnullは受け付けない
    var inferredNonNull = "コンパイラはnullableでは無いと想定する"

    // コンパイルエラー
    inferredNonNull = null

    // notNullはnullを受け付けない
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // コンパイルエラー
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-nullable-type %}

> `length`は[String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)クラスのプロパティで、
> 文字列に含まれる文字の数を保持します。
>
{: .tip}


## null値のチェック

条件式の中で`null`かどうかをチェック出来ます。
以下の例では、`describeString()`関数の`if`文で、
`maybeString`が`null`では**ない**か、そして長さが0より大きいかをチェックしています：

{% capture kotlin-tour-check-nulls %}
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "長さ${maybeString.length}の文字列"
    } else {
        return "空かnullの文字列"
    }
}

fun main() {
    var nullString: String? = null
    println(describeString(nullString))
    // 空かnullの文字列
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-check-nulls %}


## セーフコール

`null`値かもしれないオブジェクトのプロパティに安全にアクセスする為に、セーフコール演算子 `?.` が使えます。
セーフコール演算子はオブジェクトがnullの時にはプロパティがnullを返すようにします。
これは`null`だった時にエラーが起こるのを防ぐのに有用です。

以下の例で、`lengthString()`関数はセーフコールを使って、文字列の長さか`null`のどちらかを返します：


{% capture kotlin-tour-safe-call-property %}
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    var nullString: String? = null
    println(lengthString(nullString))
    // null
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-safe-call-property %}

> セーフコールはつなげる事（チェイン）が出来ます。その時はプロパティのどれかが`null`だったらnullを返す事になります。
> 例：
> ```kotlin
>   person.company?.address?.country
> ```
>
{: .note}

セーフコール演算子はまた、extension関数やメンバ関数を安全に呼ぶのにも使えます。
この場合、nullチェックは関数の実行をする前に行われます。
もしこのチェックが`null`値を検出したら、関数の呼び出しはスキップされ`null`が返されます。

以下の例では、`nullString`は`null`なので、
[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)の呼び出しはスキップされて、
`null`が返されます。

{% capture kotlin-tour-safe-call-function %}
fun main() {
    var nullString: String? = null
    println(nullString?.uppercase())
    // null
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-safe-call-function %}

## Elvis演算子を使おう！


**Elvis演算子（Elvis operator）** `?:`を使う事で、`null`値が検出された時に返すデフォルトの値を提供する事が出来ます。

Elvis演算子の左には、`null`値かどうかをチェックしたい対象を書きます。
Elvis演算子の右には、`null`値が検出された時に返したい値を書きます。

以下の例では、`nullString`は`null`なので、`length`プロパティのセーフコールは`null`値を返します。
結果として、Elvis演算子は`0`を返します：

{% capture kotlin-tour-elvis-operator %}
fun main() {
    var nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-elvis-operator %}

KotlinにおけるNullセーフティについてのより詳細な情報は、[Nullセーフティ](null-safety.md)を参照ください。

## 練習問題

あなたの手元には`employeeById`関数があります。これは会社の会社員に関するデータベースへのアクセスを提供しています。
残念なことに、この関数は`Employee?`型を返します。だから結果が`null`な事がありえます。
以上を踏まえて、社員の`id`が渡されたら給料（salary）を返す関数を書いてください。ただしデータベースに社員が存在しなかったら`0`を返してください。

{% capture kotlin-tour-null-safety-exercise %}
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here
    
fun main() { 
    println((1..5).sumOf { id -> salaryById(id) })
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-null-safety-exercise %}

{% capture kotlin-tour-null-safety-solution %}
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
 println((1..5).sumOf { id -> salaryById(id) })
}
```
{% endcapture %}
{% include collapse_quote.html body=kotlin-tour-null-safety-solution title="解答例" %}

## 次は何をやるべき？

おめでとうございます！今やKotlinのツアーを無事終了したあなたとしては、Kotlinの人気の使い道のチュートリアルを要チェックです！

* [Create a backend application](https://kotlinlang.org/docs/jvm-create-project-with-spring-boot.html) （未翻訳）
* [Create a cross-platform application for Android and iOS](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html) （未翻訳）