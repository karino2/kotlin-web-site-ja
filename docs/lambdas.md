---
layout: reference
title: "高階関数とラムダ"
---
# 高階関数とラムダ

Kotlinでは関数は[ファーストクラス](https://en.wikipedia.org/wiki/First-class_function)です、
つまり関数を変数やデータ構造に格納したり、そのほかの[高階関数](#高階関数)に引数で渡したりそこからreturnされたり出来ます。
関数以外の変数に対して出来るような演算をいろいろ関数にも行う事が出来ます。

Kotlinは静的に型づけされる言語なので、
これらの機能を使いやすくする為に、
関数を表す為の一連の[関数の型](#関数の型)を使ったり、
[ラムダ式](#ラムダ式と無名関数)などのこの用途に特化したような言語機能を提供しています。

## 高階関数

<!--original
## Higher-Order Functions
-->

高階関数はパラメータとして関数を取るか、関数を返す関数です。

高階関数の良い例としては、コレクションに対する
[関数型言語のイディオムである`fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))が挙げられます。
foldはaccumulator（訳注：結果を累積的に保持するようなもの）の初期値と畳み込み関数（combining function）を引数にとり、
コレクションの要素に順番にaccumulatorの現在の値と要素の値で畳み込んで、結果の値でaccumulatorを更新する、
を繰り返して、最終的な値を返します：

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

上のコードで、`combine`パラメータは[関数の型](#関数の型)　`(R, T)->R`を持ちます。
つまり、二つの引数で型がそれぞれ`R`と`T`のものを受け取り`R`を返す関数を受け入れます。
それは`for`ループの中で[呼び出され](#関数の型のインスタンスの呼び出し)、
その戻り値は`accumulator`に代入されています。

`fold`を呼ぶためには、[関数の型の何らかのインスタンス](#関数の型のインスタンス生成)を引数にわたす必要があります。
高階関数の呼び出し側ではこの目的にラムダ式（[詳細は以下で説明する](#ラムダ式と無名関数)）が広く使われています：

{% capture fold-sample %}
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // ラムダは中括弧で囲まれたコードブロックで表される
    items.fold(0, { 
        // ラムダにパラメータがある時は、パラメータを先に置いて、 '->' を後につける
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // ラムダの最後の式はreturnの値とみなされる
        result
    })
    
    // 推測可能な時はラムダの中のパラメータの型指定はオプショナル：
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // 高階関数の呼び出しには関数リファレンスも使える
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
{% endcapture %}
{% include kotlin_quote.html body=fold-sample %}

## 関数の型


Kotlinは `(Int) -> String` のような関数の型を使用して、
関数に関連する宣言などを扱います： `val onClick: () -> Unit = ...`。

これらの型は関数のシグニチャ、つまりパラメータと戻りの値に対応した、特別な記法となっています：

* すべての関数の型にはカッコ書きされたパラメータの型のリストと戻りの型があります： `(A, B) -> C`は、
  型 `A`と`B`の二つの引数を取り、型`C`の値を返す関数を表す。
  `() -> A`のように、パラメータの型リストは空の場合もある。[`Unit`が戻り値の型](functions.md#unit-を返す関数)の場合にも省略は出来ない。

* 関数の型は追加で *レシーバ* の型を持つ事も出来ます。レシーバの型はドットの前に置きます：
  型、`A.(B) -> C`は、レシーバオブジェクトの型が`A`に対して呼べる関数で、パラメータが`B`、戻りの型が`C`のものを表します。
  [レシーバ付き関数リテラル](#レシーバ付き関数リテラル)はこの種の型と合わせて良く使われます。

* [Suspend関数（未翻訳）](https://kotlinlang.org/docs/coroutines-basics.html#extract-function-refactoring)は特別な種類の関数の型になっていて、表記に*suspend*修飾子があります。
  例えば`suspend () -> Unit` や `suspend A.(B) -> C`といった風です。

関数の型の記法は関数のパラメータの名前を含める事も出来ます：  `(x: Int, y: Int) -> Point` など。
これらの名前はパラメータの意味を表すドキュメント的な役割を果たす場合があります。

関数の型が[nullable](null-safety.md#Nullable型と非nullable型)であると指定する為には、
カッコを以下のように使います： `((Int, Int) -> Int)?`


関数の型はカッコをつかって組み合わせる事もできます： `(Int) -> ((Int) -> Unit)`

> アロー記法は右結合です。`(Int) -> (Int) -> Unit`は先程の例と同じ意味であって、`((Int) -> (Int)) -> Unit`ではありません。
>
{: .note}

関数の型に[Typeエイリアス](type-aliases.md)を使って別の名前を与える事も出来ます：

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```


### 関数の型のインスタンス生成

関数の型のインスタンスを得るには幾つかの方法があります：

* 以下の形式のどれかの関数リテラルの中にコードブロックを書く事で
    * [ラムダ式](#ラムダ式と無名関数): `{ a, b -> a + b }`,
    * [無名関数](#無名関数): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [レシーバ付き関数リテラル](#レシーバ付き関数リテラル)はレシーバ付きの関数の型の値として使う事が出来ます。

* 既存の宣言の呼び出し可能リファレンス（callable reference）を使う事で：
    * トップレベル、ローカル、メンバ、または拡張の[関数](reflection.md#関数リファレンス)： `::isOdd`, `String::toInt`,
    * トップレベル、ローカル、メンバ、または拡張の [プロパティ](reflection.md#プロパティリファレンス): `List<Int>::size`,
    * [コンストラクタ](reflection.md#コンストラクタリファレンス): `::Regex`

  これらには特定のインスタンスのメンバを指すような、[束縛された呼び出し可能リファレンス](reflection.md#束縛された関数やプロパティのリファレンス)も含みます: `foo::toString`.

* 関数の型をインターフェースとして実装しているカスタムクラスのインスタンスを使う事で：

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

十分な情報があれば、コンパイラは変数の持つ関数の型を推論出来ます：

```kotlin
val a = { i: Int -> i + 1 } // 推論される型は (Int) -> Int
```

レシーバ有りとレシーバ無しの、*リテラルで無い*関数の型の値は相互に交換可能です。
レシーバが最初の引数になったり、その最初の引数がレシーバになる事によって。
例えば、型 `(A, B) -> C` の値は、`A.(B) -> C`が期待されている所に渡したり代入したり出来ますし、
反対も可能です：

{% capture receiver-interchangable %}
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
{% endcapture %}
{% include kotlin_quote.html body=receiver-interchangable %}

> デフォルトの推論ではレシーバ無しの方が選ばれます、たとえ拡張関数のリファレンスで変数を初期化してもです。
> この挙動を変えたければ、変数に明示的に型を指定しましょう。
>
{: .note}

### 関数の型のインスタンスの呼び出し

関数の型の値は、[`invoke(...)` 演算子](operator-overloading.md#invoke演算子)を用いる事で実行出来る:
`f.invoke(x)` や、単に `f(x)` とする事で。

値がレシーバ型を持つなら、レシーバオブジェクトは最初の引数として渡される必要があります。
レシーバを持つ関数の型を呼ぶそれ以外の方法としては、レシーバーオブジェクトを前に置いて[拡張(extension)関数](extensions.md)のように呼ぶというのも出来ます： `1.foo(2)`

例：

{% capture call-receiver-type %}
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension関数のような呼び方
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=call-receiver-type %}


### インライン関数


高階関数を使う時に、
[インライン関数](inline-functions.md)を使うとより柔軟な制御フローを使えるようになります。
この事が便利な事が時々あります。

<!--original
Sometimes it is beneficial to use [inline functions](inline-functions.md), which provide flexible control flow, for higher-order functions.
-->

## ラムダ式と無名関数

<!--original
## Lambda Expressions and Anonymous Functions
-->

ラムダ式や無名関数は「*関数リテラル*」です。すなわち、その関数は宣言されるのではなく、式としてすぐに渡されるということです。次の例を考えてみます：

<!--original
Lambda expressions and anonymous functions are *function literals*. Function literals are functions that are not declared
but are passed immediately as an expression. Consider the following example:
-->

``` kotlin
max(strings, { a, b -> a.length < b.length })
```

<!--original
``` kotlin
max(strings, { a, b -> a.length < b.length })
```
-->

関数 `max` は高階関数です。すなわち2番目の引数として関数値をとります。この2番目の引数はそれ自体が関数である式、すなわち関数リテラルです。関数としては、次の名前付き関数と等価です：

<!--original
The function `max` is a higher-order function, as it takes a function value as its second argument. This second argument
is an expression that is itself a function, called a function literal, which is equivalent to the following named function:
-->

``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

<!--original
``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```
-->

### ラムダ式の構文

<!--original
### Lambda Expression Syntax
-->

ラムダ式の完全な構文形式は、次のとおりです。

<!--original
The full syntactic form of lambda expressions is as follows:
-->

``` kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

<!--original
``` kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```
-->

* ラムダ式は常に中括弧で囲まれる。
* 完全な構文形式のパラメータ宣言は中カッコ内にあり、オプショナルな型注釈を持つことができる。
* 本体は `->` 記号の後に置かれる。
* ラムダの推論された戻りの型が`Unit`の場合を除いて、ラムダの本体の最後の（場合によってはたった一つの）式は戻りの値として扱われる。

必須ではない注釈をすべて省略した場合、残ったものは次のようになります：

<!--original
* A lambda expression is always surrounded by curly braces.
* Parameter declarations in the full syntactic form go inside curly braces and have optional type annotations.
* The body goes after the `->`.
* If the inferred return type of the lambda is not `Unit`, the last (or possibly single) expression inside the lambda body is treated as the return value.

If you leave all the optional annotations out, what's left looks like this:
-->

``` kotlin
val sum = { x: Int, y: Int -> x + y }
```

<!--original
``` kotlin
val sum = { x: Int, y: Int -> x + y }
```
-->

### トレーリングラムダを渡す

(訳注：Passing trailing lambdas)

Kotlinの規約により、関数の最後のパラメータが関数だった場合、
その対応する引数としてラムダ式を渡す場合はカッコの外側に置く事が出来ます：


<!--original
According to Kotlin convention, if the last parameter of a function is a function, then a lambda expression passed as the
corresponding argument can be placed outside the parentheses:
-->


```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

そのような構文は*トレーリングラムダ(trailing lambda)*という名前でも知られています。

もしラムダが呼び出しの唯一の引数の場合、カッコそのものも含めて省略する事も出来ます：

```kotlin
run { println("...") }
```

### `it` : 単一パラメータの暗黙の名前

<!--original
### `it`: implicit name of a single parameter
-->

ラムダ式がパラメータを1つしか持っていないことはよくあることです。

もしコンパイラがパラメータ無しのシグニチャをパースすることができるケースなら、
パラメータを宣言する必要は無く、`->`も省略出来ます。
パラメータは暗黙のうちに `it` という名で宣言されます。

<!--original
It's very common for a lambda expression to have only one parameter.

If the compiler can parse the signature without any parameters, the parameter does not need to be declared and `->` can
be omitted. The parameter will be implicitly declared under the name `it`:
-->

``` kotlin
ints.filter { it > 0 } // このリテラルは '(it: Int) -> Boolean' 型
```

<!--original
``` kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```
-->

### ラムダ式から値を返す

[限定子付きreturn](returns.md#ラベルにreturnする)構文を使えば、
ラムダから明示的に値を返す事が出来ます。
それ以外の場合では、最後の式の値が暗黙的に返されます。

つまり、以下の二つのコード片は等価です：

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

この規約と、[カッコの外にラムダ式を渡す](#トレーリングラムダを渡す)を組み合わせると、
[LINQスタイル](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) のコードを書くことができます：

<!--original
This convention, along with [passing a lambda expression outside of parentheses](#passing-trailing-lambdas), allows for
[LINQ-style](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) code:
-->

``` kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 使わない変数のアンダースコア

ラムダのパラメータが使われない時は、名前の代わりにアンダースコアを使う事が出来ます：

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### ラムダにおけるdestructuring

ラムダにおけるdestructuringは、[分解宣言（destructuring declaration）](destructuring-declarations.md#ラムダでのdestructuring)に解説されています。

### 無名関数

<!--original
### Anonymous Functions
-->

上記のラムダ式の構文から一つ欠落しているのは、関数の戻り値の型を指定する機能です。ほとんどの場合は、戻り型を自動的に推論することができるので不要です。しかし、それを明示的に指定する必要がある場合、別の構文を使用することができます。*無名関数*です。

<!--original
The lambda expression syntax above is missing one thing – the ability to specify the function's return type. In most cases,
this is unnecessary because the return type can be inferred automatically. However, if you do need to specify it explicitly,
you can use an alternative syntax: an *anonymous function*.
-->

``` kotlin
fun(x: Int, y: Int): Int = x + y
```

<!--original
``` kotlin
fun(x: Int, y: Int): Int = x + y
```
-->

無名関数は、その名が省略されていることを除いて、通常の関数の宣言と非常によく似ています。
その本体は、式（上記のように）、またはブロックのいずれかになります：

<!--original
An anonymous function looks very much like a regular function declaration, except that its name is omitted. Its body
can be either an expression (as shown above) or a block:
-->

``` kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

<!--original
``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```
-->

パラメータおよび戻り型は、通常の関数と同じ方法で指定されますが、
文脈からパラメータの型を推測出来る場合がある所が違います：その場合はパラメータの型を省略することができます。

<!--original
The parameters and the return type are specified in the same way as for regular functions, except that the parameter
types can be omitted if they can be inferred from context:
-->

``` kotlin
ints.filter(fun(item) = item > 0)
```

<!--original
``` kotlin
ints.filter(fun(item) = item > 0)
```
-->

無名関数の戻り値の型推論は普通の関数のように動作します：
無名関数の関数本体が式の時は戻りの型は自動的に推論され、
無名関数の巻数本体がブロックの時は明示的に指定されなくてはいけません（無ければ `Unit` と想定されます）。

<!--original
The return type inference for anonymous functions works just like for normal functions: the return type is inferred automatically
for anonymous functions with an expression body, but it has to be specified explicitly (or is assumed to be `Unit`) for anonymous
functions with a block body.
-->

> 無名関数をパラメータとして渡す時は、常にかっこ内に渡されることに注意してください。
> 括弧の外に関数を残すことができる簡略シンタックスは、ラムダ式に対してのみ機能します。
>
{: .note}

<!--original
> When passing anonymous functions as parameters, place them inside the parentheses. The shorthand syntax that allows you to leave
> the function outside the parentheses works only for lambda expressions.
>
{type="note"}
-->

ラムダ式と無名関数の間のもう一つの違いは、[非局所的なリターン](inline-functions.md#非局所リターン)の動作です。
ラベルなしの *return*{: .keyword } 文は、常に *fun*{: .keyword } キーワードで宣言された関数からreturnします。
これは、ラムダ式の内側からの *return*{: .keyword } は囲んでいる関数からreturnする一方で、
無名関数の内部 *return*{: .keyword } は無名関数自体からreturnすることを意味します。

<!--original
Another difference between lambda expressions and anonymous functions is the behavior of [non-local returns](inline-functions.md#non-local-returns).
A `return`  statement without a label always returns from the function declared with the `fun` keyword. This means that
a `return` inside a lambda expression will return from the enclosing function, whereas a `return` inside an anonymous
function will return from the anonymous function itself.
-->

### クロージャ

<!--original
### Closures
-->

ラムダ式や無名関数（ならびに[ローカル関数](functions.md#ローカル関数)や[object式](object-declarations.html#object式)）は、その *クロージャ* 、すなわち、外側のスコープで宣言された変数にアクセスすることができます。
クロージャに取り込まれた変数をラムダで変更することができます：

<!--original
A lambda expression or anonymous function (as well as a [local function](functions.md#local-functions) and an [object expression](object-declarations.md#object-expressions))
can access its *closure*, which includes the variables declared in the outer scope. The variables captured in the closure
can be modified in the lambda:
-->

``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```


<!--original
``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```

-->

### レシーバ付き関数リテラル

<!--original
### Function literals with receiver
-->

レシーバのある[関数の型](#関数の型)、つまり `A.(B) -> C` のようなものは、
特別な形の関数リテラルでインスタンス化出来ます。
それはレシーバ付き関数リテラルという形式です。

<!--original
[Function types](#function-types) with receiver, such as `A.(B) -> C`, can be instantiated with a special form of function
literals – function literals with receiver.
-->

さきに述べた通り、
Kotlinは、レシーバ付きの関数の型の[インスタンスを呼ぶ機能](#関数の型のインスタンスの呼び出し)を提供していて、
この時には*レシーバオブジェクト*を（訳注：呼び出される関数オブジェクトに）提供します。

<!--
As mentioned above, Kotlin provides the ability [to call an instance](#invoking-a-function-type-instance) of a function
type with receiver while providing the *receiver object*.
-->

リテラル関数の本体内では、呼び出しに渡されるレシーバオブジェクトは*暗黙の* `this`となり、
任意の追加の修飾子なしでそのレシーバオブジェクトのメソッドを呼び出したり、
[`this` 式](this-expressions.md)を使ってレシーバオブジェクトにアクセスしたり出来ます。

これは、関数の本体内でレシーバオブジェクトのメンバにアクセスすることを可能にする[拡張関数](extensions.md)に似ています。

<!--original
Inside the body of the function literal, the receiver object passed to a call becomes an *implicit* `this`, so that you
can access the members of that receiver object without any additional qualifiers, or access the receiver object using
a [`this` expression](this-expressions.md).

This behavior is similar to that of [extension functions](extensions.md), which also allow you to access the members of
the receiver object inside the function body.
-->

以下はレシーバ付き関数リテラルに型指定をつけた例で、`plus`はレシーバオブジェクトの物が呼ばれています：

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

無名関数の構文は、直接関数リテラルのレシーバの型を指定することができます。
これはレシーバを持つ関数の型の変数を宣言し、後でそれを使用する必要がある場合に役立ちます。

<!--original
The anonymous function syntax allows you to specify the receiver type of a function literal directly.
This can be useful if you need to declare a variable of a function type with receiver, and to use it later.
-->

``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```

<!--original
``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```
-->

ラムダ式は、レシーバの型を文脈から推測することができる場合、レシーバ付き関数リテラルとして使用することができます。
それらの使用法の最も重要な例の一つは、[Typeセーフビルダー](type-safe-builders.md)です。

<!--original
Lambda expressions can be used as function literals with receiver when the receiver type can be inferred from context.
One of the most important examples of their usage is [type-safe builders](type-safe-builders.md):
-->

``` kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // レシーバオブジェクトを生成
    html.init()        // そのレシーバオブジェクトをラムダに渡す
    return html
}


html {       // レシーバ付きラムダがここから始まる
    body()   // レシーバオブジェクトのメソッドを呼んでいる
}
```

<!--original
``` kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
  val html = HTML()  // create the receiver object
  html.init()        // pass the receiver object to the lambda
  return html
}


html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```
-->
