---
layout: reference
title: "基本的な構文"
---
# 基本的な構文

ここでは、基本的な構文を例とともに集めてみました。
各セクションの終わりには、関連するトピックのより詳しい解説へのリンクがあります。

また、Kotlinの基本をJetBrains Academyのフリーの[Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)で学ぶ事も出来ます。

## パッケージの定義とインポート

パッケージの記述は、ソースファイルの先頭に置かなければなりません。

``` kotlin
package my.demo

import kotlin.text.*

// ...
```

ディレクトリとパッケージと一致する必要はありません。ソースファイルは、ファイルシステム内の任意の場所に配置することができます。

<!--original
It is not required to match directories and packages: source files can be placed arbitrarily in the file system.
-->

[パッケージ](packages.html)を参照してください。

## プログラムのエントリーポイント

Kotlinアプリケーションのエントリーポイントは`main`関数です。

{% capture kotlin-basic-syntax-hello-world %}
fun main() {
    println("Hello world!")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-hello-world %}

`main`の別の形式として、可変長の`String`の引数を受け付けるものもあります。

{% capture kotlin-basic-syntax-hello-world-2 %}
fun main(args: Array<String>) {
    println(args.contentToString())
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-hello-world-2 %}

## 標準出力へのプリント

`print`は引数を標準出力へとプリントします。

{% capture kotlin-basic-syntax-print-1 %}
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-print-1 %}

`println`は引数をプリントし、その後に改行を追加します。
そうする事で次にプリントしたものが次の行に出るようになります。

{% capture kotlin-basic-syntax-println-1 %}
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-println-1 %}


## 関数の定義

<!--original
## Defining functions
-->

2つの`Int`型の引数を持ち、`Int`型を戻り値とする関数：

<!--original
Function having two `Int` parameters with `Int` return type:
-->

{% capture kotlin-basic-syntax-return-int-1 %}
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("3と5の合計は ")
    println(sum(3, 5))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-return-int-1 %}


関数の本体は式でも構いません。その場合の戻りの型は型推論で推測されます。


<!--original
Function with an expression body and inferred return type:
-->

{% capture kotlin-basic-syntax-function-expression-1 %}
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("19と23の合計は ${sum(19, 23)}")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-function-expression-1 %}

意味のある値を返さない関数：

<!--original
Function returning no meaningful value:
-->

{% capture kotlin-basic-syntax-return-unit-1 %}
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("$a と $b の合計は ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-return-unit-1 %}

`Unit`型の戻り値は省略できます：

<!--original
`Unit` return type can be omitted:
-->




{% capture kotlin-basic-syntax-function-omit-unit %}
//sampleStart
fun printSum(a: Int, b: Int) {
    println("$a と $b の合計は ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-function-omit-unit %}



[関数](functions.html)を参照してください。

<!--original
See [Functions](functions.html).
-->

## 変数


読み取り専用のローカル変数はキーワード`val`を用いて定義出来ます。
そうして作った変数は一回しか代入できない：

{% capture kotlin-basic-syntax-val %}
fun main() {
//sampleStart
    val a: Int = 1  // 即座の代入
    val b = 2   // `Int`型が推論される
    val c: Int  // 初期値が与えられない場合、型指定が必要
    c = 3       // あとから代入
//sampleEnd
    println("a = $a, b = $b, c = $c")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-val %}

再代入可能な変数を作るためには、`var`キーワードを使います。

{% capture kotlin-basic-syntax-var %}
fun main() {
//sampleStart
    var x = 5 // `Int`型が推論される
    x += 1
//sampleEnd
    println("x = $x")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-var %}

変数をトップレベルで定義する事も出来ます。

{% capture kotlin-basic-syntax-variable-top-level %}
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() { 
    x += 1 
}
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-variable-top-level %}

[プロパティとフィールド](properties.html)も参照してください。

<!--original
See also [Properties And Fields](properties.html).
-->

## クラスとインスタンスの作成

クラスを定義するには、`class`キーワードを使います。

```kotlin
class Shape
```

クラスのプロパティは宣言や本体の所に並べる事が出来ます。

```kotlin
class Rectangle(var height: Double, var length: Double) {
    var perimeter = (height + length) * 2 
}
```

クラスの宣言に並べられたパラメータによるデフォルトのコンストラクタが自動的に生成されて使う事が出来ます。

{% capture kotlin-basic-syntax-class-constructor %}
class Rectangle(var height: Double, var length: Double) {
    var perimeter = (height + length) * 2 
}
fun main() {
//sampleStart
    val rectangle = Rectangle(5.0, 2.0)
    println("外周は ${rectangle.perimeter}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-class-constructor %}

クラスの継承はコロン(`:`)で宣言出来ます。
クラスはデフォルトではfinalです。
クラスを継承出来るようにするためには、`open`で印をつけます。

```kotlin
open class Shape

class Rectangle(var height: Double, var length: Double): Shape() {
    var perimeter = (height + length) * 2 
}
```

[クラス](classes.md)と[object式と宣言](object-declarations.md)を参照ください。

## コメント

<!--original
## Comments
-->

ほとんどの他のモダンな言語と同様に、Kotlinは1行コメント（または行末コメント）と複数行コメント（ブロックコメント）をサポートしています。


``` kotlin
// これは行末コメントです

/* これは複数行にわたる
   ブロックコメントです。 */
```

Kotlinのブロックコメントは入れ子にすることができます。

```kotlin
/* The comment starts here
/* contains a nested comment *&#8288;/     
and ends here. */
```

ドキュメンテーションコメントの構文の詳細については、[Kotlinコードの文書化](kotlin-doc.html)を参照してください。

## 文字列テンプレートの使用

<!--original
## Using string templates
-->

{% capture kotlin-basic-syntax-string-templates %}
fun main() {
//sampleStart
    var a = 1
    // テンプレートの中にシンプルに名前だけのケース:（訳：aは$aです）
    val s1 = "a is $a" 
    
    a = 2
    // 任意の式をテンプレートに入れる:（訳：aは$aだったが、今は$aです）
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-string-templates %}

詳細は[文字列テンプレート](strings.md#文字列テンプレート)を参照してください。

## 条件式

{% capture kotlin-basic-syntax-conditional-expressions %}
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("0 と 42 で大きい方は ${maxOf(0, 42)}")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-conditional-expressions %}

<!--original
``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```
-->

Kotlinでは、`if`を式としても使用出来ます。

{% capture kotlin-basic-syntax-expressions %}
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("0 と 42 で大きい方は ${maxOf(0, 42)}")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-expressions %}

[`if`式](control-flow.html#if式)を参照してください。

## forループ

{% capture kotlin-basic-syntax-for-loop %}
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-for-loop %}

または

{% capture kotlin-basic-syntax-for-loop-indices %}
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("$index 番目の要素は ${items[index]}")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-for-loop-indices %}


[forループ](control-flow.md#forループ)を参照してください。

## whileループ

{% capture kotlin-basic-syntax-while-loop %}
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("$index 番目の要素は ${items[index]}")
        index++
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-while-loop %}

[whileループ](control-flow.md#whileループ)を参照してください。


## when式

{% capture kotlin-basic-syntax-when-expression %}
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "挨拶"
        is Long    -> "Long"
        !is String -> "文字列では無い"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}

{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-when-expression %}


[when式](control-flow.html#when-expression)を参照してください。

<!--original
See [when expression](control-flow.html#when-expression).
-->

## 範囲(Range)


`in`演算子を使用すると、数が範囲内にあるかどうかを確認できます：

<!--original
Check if a number is within a range using *in*{: .keyword } operator:
-->

{% capture kotlin-basic-syntax-range-in %}
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("範囲内です")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-range-in %}

<!--original
``` kotlin
if (x in 1..y-1)
  print("OK")
```
-->

数が範囲外であるかどうかを確認します：

<!--original
Check if a number is out of range:
-->

{% capture kotlin-basic-syntax-out-of-range %}
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 は範囲外")
    }
    if (list.size !in list.indices) {
        println("listのsizeも、有効なインデックスの範囲外です")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-out-of-range %}

範囲内で反復処理：

<!--original
Iterating over a range:
-->

{% capture kotlin-basic-syntax-iterate-range %}
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-iterate-range %}

等差数列の上を反復処理する例：

{% capture kotlin-basic-syntax-iterate-progression %}
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-iterate-progression %}

[範囲](ranges.html)を参照してください。

<!--original
See [Ranges](ranges.html).
-->

## コレクション


コレクション内で反復処理：

<!--original
Iterating over a collection:
-->

{% capture kotlin-basic-syntax-iterate-collection %}
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-iterate-collection %}


コレクションがあるオブジェクトを含むかを`in`演算子で調べる：

<!--original
Checking if a collection contains an object using *in*{: .keyword } operator:
-->

{% capture kotlin-basic-syntax-collection-in %}
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("ジューシー")
        "apple" in items -> println("りんごでもいいよ")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-collection-in %}

<!--original
``` kotlin
if (text in names) // names.contains(text) is called
  print("Yes")
```
-->

コレクションをフィルタしたりマップするのにラムダ式を使用します：

<!--original
Using lambda expressions to filter and map collections:
-->

{% capture kotlin-basic-syntax-collection-filter-map %}
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-collection-filter-map %}


[コレクション概要](collections-overview.md)を参照してください。


## Nullableな値とnullチェック

<!--original
## Using nullable values and checking for *null*{: .keyword }
-->

参照が`null`値を取り得る場合、明示的にnullableとしてマークする必要があります。
Nullableな型は`?`が最後にあるものです。

<!--original
A reference must be explicitly marked as nullable when *null*{: .keyword } value is possible.
-->

`str`が整数を保持していない場合は`null`を返します：

<!--original
Return *null*{: .keyword } if `str` does not hold an integer:
-->

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

<!--original
``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```
-->

nullableを返す関数を使用：

<!--original
Use a function returning nullable value:
-->

{% capture kotlin-basic-syntax-function-nullable-value %}
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x`, `y`はnullが入っていることがあるので、`x * y`はエラーを引き起こす
    if (x != null && y != null) {
        // xとyは、nullチェックの後、自動的に非nullable型へキャストされる
        println(x * y)
    }
    else {
        println("'$arg1' か '$arg2' は数値では無い")
    }    
}
//sampleEnd

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-function-nullable-value %}



または

<!--original
or
-->

{% capture kotlin-basic-syntax-function-null-check %}
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("arg1の数値のフォーマットが誤りです: '$arg1'")
        return
    }
    if (y == null) {
        println("arg2の数値のフォーマットが誤りです: '$arg2'")
        return
    }

    // xとyは、nullチェックの後、自動的に非nullable型へキャストされる
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-function-null-check %}


[Nullセーフティ](null-safety.html)を参照してください。

<!--original
See [Null-safety](null-safety.html).
-->

## 型チェックと自動キャスト


`is`演算子は、ある式がある型のインスタンスであるかのチェックを行います。
読み取り専用のローカル変数やプロパティが特定の型であるかチェックされている場合は、明示的にキャストする必要はありません：

<!--original
The *is*{: .keyword } operator checks if an expression is an instance of a type.
If an immutable local variable or property is checked for a specific type, there's no need to cast it explicitly:
-->

{% capture kotlin-basic-syntax-is-operator %}
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` はこのブランチ内では自動的に`String`へキャストされる
        return obj.length
    }

    // `obj` は型チェックが行われたブランチ外では、まだ`Any`型である
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("'$obj'の長さを取得。 結果: ${getStringLength(obj) ?: "エラー: オブジェクトは文字列ではありません"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-is-operator %}

<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` is automatically cast to `String` in this branch
    return obj.length
  }

  // `obj` is still of type `Any` outside of the type-checked branch
  return null
}
```
-->

または

<!--original
or
-->

{% capture kotlin-basic-syntax-is-operator-expression %}
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` はこのブランチ内では自動的に`String`へキャストされる
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("'$obj'の長さを取得。 結果: ${getStringLength(obj) ?: "エラー: オブジェクトは文字列ではありません"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-is-operator-expression %}


<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` is automatically cast to `String` in this branch
  return obj.length
}
```
-->

あるいは

<!--original
or even
-->

{% capture kotlin-basic-syntax-is-operator-logic %}
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` は`&&`の右側では自動的に`String`へキャストされる
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("'$obj'の長さを取得。 結果: ${getStringLength(obj) ?: "エラー: オブジェクトは文字列ではありません"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-basic-syntax-is-operator-logic %}

<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` is automatically cast to `String` on the right-hand side of `&&`
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```
-->

[クラス](classes.md)と[型のキャスト](typecasts.md)を参照してください。

<!--original
See [Classes](classes.html) and [Type casts](typecasts.html).
-->

