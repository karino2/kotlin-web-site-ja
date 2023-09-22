---
layout: reference
title: "関数（ツアー）"
---
# 関数（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-done.svg){:width="20" style="display:inline"} [基本型](kotlin-tour-basic-types.md)
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-done.svg){:width="20" style="display:inline"} [コレクション](kotlin-tour-collections.md)
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-done.svg){:width="20" style="display:inline"} [制御フロー](kotlin-tour-control-flow.md)
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5.svg){:width="20" style="display:inline"} **関数**
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-classes.html">Classes</a>
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-null-safety.html">Null safety</a>

Kotlinでは、自分の関数を宣言するのは`fun`キーワードで行う事が出来ます。

{% capture kotlin-tour-function-demo %}
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-function-demo %}

Kotlinでは:
* 関数のパラメータはカッコ `()`　の中に書く
* 各パラメータは型指定が必要で、複数のパラメータはカンマ `,` で区切る
* 戻り値の型は関数のカッコ `()` の後ろに、コロン `:` で区切って置く
* 関数のボディは中括弧 `{}` の中に書きます
* 関数から出たり、何かを返したりするには `return` キーワードを使います

> もし関数が何も役に立つ何かを返す事が無ければ、 `return` キーワードは無しでも構いません。
> より詳細には後述の[戻り値の無い関数](#戻り値の無い関数)を参照の事
>
{: .note}

以下の例で:
* `x` と `y` は関数のパラメータ
* `x` と `y` は型としては `Int`.
* 関数の戻りの型は `Int`.
* この関数が呼ばれると、`x` と `y`　を足したものを返す

{% capture kotlin-tour-simple-function %}
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-simple-function %}

> [コーディング規約](coding-conventions.md#function-names)では、関数の名前は小文字で始めて 
> アンダースコア無しのcamel caseを推奨しています（訳注：小文字始まりのcamel caseとはkotlinTourSampleなどのように単語の区切りを大文字で表すコンベンション）
> 
{: .note}



## 名前付き引数

簡潔にコードを書きたい場合は、関数を呼ぶ時にパラメータの名前を含める必要はありません。
しかし、パラメータの名前を含める事でコードを読みやすく出来る場合もあります。
これは **名前付き引数(named arguments)** と呼ばれる機能です。
もしパラメータの名前をつける場合、パラメータの順番は自由に出来ます。

> 以下の例では [文字列テンプレート](strings.md#文字列テンプレート) (`$`) を使って
> パラメータの値にアクセスして、`String` 型に変換して、それを文字列の中に結合して出力しています。
> 
{: .tip}

{% capture kotlin-tour-named-arguments-function %}
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 名前付き引数を使う事で引数の順番を入れ替えている
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-named-arguments-function %}

## デフォルトのパラメータ値

関数のパラメータにデフォルトの値を定義する事が出来ます。
デフォルトの値があるパラメータは関数を呼ぶ時に省く事が出来ます。
デフォルトの値を宣言するには、アサイン演算子 `=` を型の後に書きます：

{% capture kotlin-tour-default-param-function %}
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 両方のパラメータを指定して関数呼び出し
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // messageパラメータのみで関数呼び出し
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    // 名前付き引数で関数呼び出し
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-default-param-function %}

> デフォルト値つきのパラメータ全部では無く、そのうちの一部だけを省く、という事も出来ます。
> けれどその場合は、最初に省いたパラメータより後はすべて名前付き引数で指定しなくてはいけません。
>
{: .note}

## 戻り値の無い関数

関数がなにも有用な値を返さない場合は、その戻り値の型は `Unit` です。
 `Unit` は、唯一の値 ( `Unit` ) だけを持つ型です。
この場合は、明示的に宣言する必要もありませんし、関数本体で明示的に返す必要もありません。
つまり、`return` キーワードを使う必要もありません：

{% capture kotlin-tour-unit-function %}
fun printMessage(message: String) {
    println(message)
    // `return Unit` や `return` と書いても良いが書かなくても良い
}

fun main() {
    printMessage("Hello")
    // Hello
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-unit-function %}

## 単一式関数

コードをもっと簡潔にする為の仕組みとして、単一式関数（single-expression function）というものがあります。
例えば　`sum()` 関数はもっと短く書く事が出来ます。

{% capture kotlin-tour-simple-function-before %}
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-simple-function-before %}

中括弧を省いてアサイン演算子の`=`を使って関数の本体を宣言することが出来ます。
さらにKotlinの型推論の機能により、戻りの型も省く事が出来ます。
以上を用いる事で、 `sum()` 関数はたった1行で書けてしまいます：

{% capture kotlin-tour-simple-function-after %}
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-simple-function-after %}

> 関数の戻りの型が`Unit`なケースを除けば、戻りの型が省略出来るのは　関数の本体 (`{}`) が無いケースだけです。
> 
{: .note}

## 関数の練習問題

### 練習問題 1

`circleArea` という関数を定義せよ（訳注：areaは面積という意味、つまり円の面積を求める関数）。
円の半径をIntのフォーマットでradiusというパラメータで取り、円の面積を出力せよ。

> この課題では、円周率を`PI`でアクセス出来るようにパッケージをインポートしています。
> パッケージのインポートについては、[パッケージとインポート](packages.md)を参照ください。
>
{: .note}

{% capture kotlin-tour-functions-exercise-1 %}
import kotlin.math.PI

fun circleArea() {
    // ここにコードを書いてね
}
fun main() {
    println(circleArea(2))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-functions-exercise-1 %}

{% capture kotlin-tour-functions-solution-1 %}
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-functions-solution-1 %}

### 練習問題 2

前述の `circleArea` を単一式関数（single-expression function）で書き直せ。

{% capture kotlin-tour-functions-exercise-2 %}
import kotlin.math.PI

// ここにコードを書いてね

fun main() {
    println(circleArea(2))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-functions-exercise-2 %}

{% capture kotlin-tour-functions-solution-2 %}
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-functions-solution-2 %}

### 練習問題 3

時、分、秒を渡されて、その秒換算での時間間隔を返す関数がある。
多くのケースでは時、分、秒の幾つかだけを渡して結果がほしいだけで、全部を指定したい訳では無い（指定されない時は0とみなす）。
この関数を名前付き引数とデフォルト値を使ってコードを読みやすく改善せよ。

{% capture kotlin-tour-functions-exercise-3 %}
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-functions-exercise-3 %}

{% capture kotlin-tour-functions-solution-3 %}
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-functions-solution-3 %}

## ラムダ式

Kotlin allows you to write even more concise code for functions by using lambda expressions.

For example, the following `uppercaseString()` function:

```kotlin
fun uppercaseString(string: String): String {
    return string.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

Can also be written as a lambda expression:

```kotlin
fun main() {
    println({ string: String -> string.uppercase() }("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-after"}

Lambda expressions can be hard to understand at first glance so let's break it down. Lambda expressions are written 
within curly braces `{}`.

Within the lambda expression, you write:
* the parameters followed by an `->`.
* the function body after the `->`.

In the previous example:
* `string` is a function parameter.
* `string` has type `String`.
* the function returns the result of the [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)
function called on `string`.

> If you declare a lambda without parameters, then there is no need to use `->`. For example:
> ```kotlin
> { println("Log message") }
> ```
>
{type="note"}

Lambda expressions can be used in a number of ways. You can:
* [assign a lambda to a variable that you can then invoke later](#assign-to-variable)
* [pass a lambda expression as a parameter to another function](#pass-to-another-function)
* [return a lambda expression from a function](#return-from-a-function)
* [invoke a lambda expression on its own](#invoke-separately)

### Assign to variable

To assign a lambda expression to a variable, use the assignment operator `=`:

```kotlin
fun main() {
    val upperCaseString = { string: String -> string.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

### Pass to another function

A great example of when it is useful to pass a lambda expression to a function, is using the [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)
function on collections:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val positives = numbers.filter { x -> x > 0 }
    val negatives = numbers.filter { x -> x < 0 }
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

The `.filter()` function accepts a lambda expression as a predicate:
* `{ x -> x > 0 }` takes each element of the list and returns only those that are positive.
* `{ x -> x < 0 }` takes each element of the list and returns only those that are negative.

> If a lambda expression is the only function parameter, you can drop the function parentheses `()`.
> This is an example of a [trailing lambda](#trailing-lambdas), which is discussed in more detail at the end of this
> chapter.
>
{type = "note"}

Another good example, is using the [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 
function to transform items in a collection:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    val tripled = numbers.map { x -> x * 3 }
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

The `.map()` function accepts a lambda expression as a predicate:
* `{ x -> x * 2 }` takes each element of the list and returns that element multiplied by 2.
* `{ x -> x * 3 }` takes each element of the list and returns that element multiplied by 3.

### Function types

Before you can return a lambda expression from a function, you first need to understand **function
types**.

You have already learned about basic types but functions themselves also have a type. Kotlin's type inference 
can infer a function's type from the parameter type. But there may be times when you need to explicitly
specify the function type. The compiler needs the function type so that it knows what is and isn't 
allowed for that function.

The syntax for a function type has:
* each parameter's type written within parentheses `()` and separated by commas `,`.
* the return type written after `->`.

For example: `(String) -> String` or `(Int, Int) -> Int`.

This is what a lambda expression looks like if a function type for `upperCaseString()` is defined:

```kotlin
val upperCaseString: (String) -> String = { string -> string.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

If your lambda expression has no parameters then the parentheses `()` are left empty. For example: `() -> Unit`

> You must declare parameter and return types either in the lambda expression or as a function type. Otherwise, the
> compiler won't be able to know what type your lambda expression is.
> 
> For example, the following won't work:
> 
> `val upperCaseString = { str -> str.uppercase() }`
>
{type="note"}

### Return from a function

Lambda expressions can be returned from a function. So that the compiler understands what type the lambda
expression returned is, you must declare a function type.

In the following example, the `toSeconds()` function has function type `(Int) -> Int` because it always returns a lambda
expression that takes a parameter of type `Int` and returns an `Int` value.

This example uses a `when` expression to determine which lambda expression is returned when `toSeconds()` is called:

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### Invoke separately

Lambda expressions can be invoked on their own by adding parentheses `()` after the curly braces `{}` and including
any parameters within the parentheses:

```kotlin
fun main() {
    //sampleStart
    println({ string: String -> string.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### Trailing lambdas

As you have already seen, if a lambda expression is the only function parameter, you can drop the function parentheses `()`.
If a lambda expression is passed as the last parameter of a function, then the expression can be written outside the
function parentheses `()`. In both cases, this syntax is called a **trailing lambda**.

For example, the [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) function accepts an 
initial value and an operation:

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

For more information on lambda expressions, see [Lambda expressions and anonymous functions](lambdas.md#lambda-expressions-and-anonymous-functions).

The next step in our tour is to learn about [classes](kotlin-tour-classes.md) in Kotlin.

## Lambda expressions practice

### Exercise 1 {initial-collapse-state="collapsed" id="lambdas-exercise-1"}

You have a list of actions supported by a web service, a common prefix for all requests, and an ID of a particular resource.
To request an action `title` over the resource with ID: 5, you need to create the following URL: `https://example.com/book-info/5/title`.
Use a lambda expression to create a list of URLs from the list of actions.

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
        println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" id="lambdas-exercise-2"}

Write a function that takes an `Int` value and an action (a function with type `() -> Unit`) which then repeats the 
action the given number of times. Then use this function to print “Hello” 5 times.

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-2"}

## Next step

[Classes](kotlin-tour-classes.md)