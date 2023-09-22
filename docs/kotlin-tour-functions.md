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
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} [クラス](kotlin-tour-classes.md)
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} [Null safety](kotlin-tour-null-safety.md)

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
デフォルトの値を宣言するには、代入演算子 `=` を型の後に書きます：

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

中括弧を省いて代入演算子の`=`を使って関数の本体を宣言することが出来ます。
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

Kotlinはさらに簡潔に関数を書く方法を提供します。ラムダ式（lambda expression）です。

例を挙げましょう。以下の `uppercaseString()` 関数：

{% capture kotlin-tour-lambda-function-before %}
fun uppercaseString(string: String): String {
    return string.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-function-before %}

これはラムダ式を用いて、以下のようにも書けます：

{% capture kotlin-tour-lambda-function-after %}
fun main() {
    println({ string: String -> string.uppercase() }("hello"))
    // HELLO
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-function-after %}

ラムダ式は初めて見た時は理解が難しく感じるかもしれません。
だから以下では細かく見てみましょう。
ラムダ式はカッコ`{}`の中に書きます。

ラムダ式の中では、以下を書きます：
* パラメータを書いて、その後に `->` をつけます
* `->` の後に、関数の本体を置きます

前の例に当てはめると：
* `string` が関数のパラメータです
* `string` の型は `String` です
* 関数は、`string` に対して [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)を呼んだ結果を返します

> もしパラメータの無いラムダを宣言する時は `->` 無しで構いません。例：
> ```kotlin
> { println("Log message") }
> ```
>
{: .note}

ラムダ式は幾つもの用途で使う事が出来ます。例えば以下のような事が出来ます：
* [変数にラムダ式を代入して、後で呼ぶ事が出来ます](#変数に代入)
* [他の関数へのパラメータとしてラムダ式を渡す](#他の関数に渡す)
* [関数からラムダ式をreturnする](#関数から返す)
* [ラムダ式を単体でそのまま呼び出す](#単独で呼び出す)

### 変数に代入

変数にラムダ式を代入するには、代入演算子 `=` を使います：

{% capture kotlin-tour-lambda-variable %}
fun main() {
    val upperCaseString = { string: String -> string.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-variable %}

### 他の関数にわたす

ラムダ関数を他の関数に渡すケースの素晴らしい実例といえば、
コレクションの [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 関数を使う時でしょう：

{% capture kotlin-tour-lambda-filter %}
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
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-filter %}

`.filter()` 関数は述語としてラムダ式を引数に取ります：
* `{ x -> x > 0 }` リストの各要素を取り出し、それらのうち正なものだけを返す。
* `{ x -> x < 0 }` リストの各要素を取り出し、それらのうち負のものだけを返す。

（訳注：述語は「trueかfalseを返す関数」くらいの意味）

> もしラムダ式が唯一の関数のパラメータの場合、関数のカッコ `()` を省略出来ます。
> これは [トレーリングラムダ（Trailing lambdas）](#トレーリングラムダ) の一種で、この章の最後にもっと詳しく説明します。
>
{: .note}

もう一つの良い例としては、コレクションの中の要素を変換する [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 関数があります：

{% capture kotlin-tour-lambda-map %}
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
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-map %}

`.map()` 関数はラムダ式を述語として受け取ります：
* `{ x -> x * 2 }` リストの各要素を受け取り、それらに2を掛けたものを返す。
* `{ x -> x * 3 }` リストの各要素を受け取り、それらに3を掛けたものを返す。

### 関数の型

ラムダ式を関数から返す話に進む前に、**関数の型（function type）** について知る必要があります。

ここまででも既に基本型については学んできましたが、関数も関数自体に型があります。
Kotlinの型推論はパラメータを渡す時などにはそのパラメータから型を推論してくれるので型を明示的に書く必要はありません。
ですが、時には関数の型を明示的に指定する必要がある場合もあります。
コンパイラはその関数に、何を渡せて何は渡せないかなどを知る為にその関数の型を知る必要があります。

関数の型のシンタックスは以下のようになります：
* 各パラメータの型はカッコ `()` の中に書き、カンマ `,` で区切ります
* 戻りの型は `->` の後に書きます

例： `(String) -> String` や `(Int, Int) -> Int` など。

`upperCaseString()`に型を指定すると以下のようになります：

{% capture kotlin-tour-lambda-function-type %}
val upperCaseString: (String) -> String = { string -> string.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-function-type %}

もしラムダ式にパラメータが無い場合は、カッコ `()` の中は空っぽにしておきます。例：`() -> Unit`

> ラムダ式か関数の型のどちらかにはパラメータとreturnの型を指定する必要があります。
> そうしないとコンパイラはラムダ式の型を知る事が出来ません。
>
> 例えば、以下のコードはコンパイル出来ません：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{: .note}

### 関数から返す

ラムダ式は関数から返す事が出来ます。
コンパイラが返すラムダ式の型が何かを知る為には、関数の型を宣言する必要があります。

以下の例では、`toSeconds()`関数の戻りの型は関数の型、`(Int) -> Int`となります。
何故なら、toSecondsはいつもラムダ関数で、引数として`Int`を取り`Int`の値を返すものを返すからです。

この例では、`toSeconds()`が呼ばれた時にどのラムダ式を返すかを、`when`式を使って決定しています：

{% capture kotlin-tour-lambda-return-from-function %}
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
    println("トータルの時間は $totalTimeInSeconds 秒")
    // トータルの時間は 1680 秒
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-return-from-function %}

### 単独で呼び出す

ラムダ式はそれ単体で呼び出す事が出来ます。
その為には中括弧 `{}` のあとにカッコ `()` をつけて、パラメータをカッコの中に並べます：


{% capture kotlin-tour-lambda-standalone %}
fun main() {
    //sampleStart
    println({ string: String -> string.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-standalone %}

### トレーリングラムダ

既に見てきたように、ラムダ式が唯一の関数の引数のケースでは、関数呼び出しのカッコ `()` を省略する事が出来ます。
また、もしラムダ式を関数の最後の引数に渡す場合は、そのラムダ式を関数のカッコ `()` の外に出す事が出来ます。
どちらのケースも、このシンタックスを **トレーリングラムダ（trailing lambda）** といいます。
（訳注：トレーリングはトレーラーとかと同じ単語で後ろに引きずってくるようなイメージ。良い訳が思いつかなかったのでカタカナでトレーリングラムダと呼ぶ事にします）

例えば、 [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html)関数は初期値と行う演算を引数に取ります：

{% capture kotlin-tour-trailing-lambda %}
fun main() {
    //sampleStart
    // 初期値はゼロ。 
    // 演算としては初期値を、各要素に対して累積的に和を取る。
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // トレーリングラムダを使ってこうも書く事が出来る。
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-trailing-lambda %}

ラムダ式についてのより詳細な情報は、[ラムダ式と無名関数](lambdas.md#ラムダ式と無名関数)を参照ください。

我らのツアーの次なるステップは、Kotlinにおける[クラス](kotlin-tour-classes.md)を学ぶ、です。

## ラムダ式の練習問題

### 練習問題 1

あなたのwebサービスとしてサポートされているアクションのリストがあります。
また、全てのリクエスト共通のprefixと、
特定のリソースを表すIDがあります。
リソースIDが5のリソースに`title`というアクションをリクエストする為には、以下のURLを組み立てる必要があります：`https://example.com/book-info/5/title`。
アクションのリストからURLのリストを、ラムダ式を使って作りなさい。


{% capture kotlin-tour-lambda-exercise-1 %}
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // ここにコードを書いてね
        println(urls)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-exercise-1 %}

{% capture kotlin-tour-lambda-solution-1 %}
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-lambda-solution-1 %}

### 練習問題 2

`Int`の値とアクション（`() -> Unit`型の関数）を引数にとり、
その引数で指定された値の回数分だけアクションを繰り返す関数を書け。
そしてこの関数を使って“Hello”と5回printlnせよ。

{% capture kotlin-tour-lambda-exercise-2 %}
fun repeatN(n: Int, action: () -> Unit) {
    // ここにコードを書いてね
}

fun main() {
    // ここにコードを書いてね
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lambda-exercise-2 %}

{% capture kotlin-tour-lambda-solution-2 %}
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
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-lambda-solution-2 %}

## 次回

[クラス](kotlin-tour-classes.md)