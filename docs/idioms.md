---
layout: reference
title: "イディオム"
---
# イディオム

<!--original
# Idioms
-->

Kotlinでよく使用されるイディオムを集めました。もし好みのイディオムがあれば、プルリクエストを投げて貢献してください。

<!--original
A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it. Do a pull request.
-->

## DTOの作成（POJO/ POCO）

<!--original
### Creating DTO's (POJO's/POCO's)
-->

``` kotlin
data class Customer(val name: String, val email: String)
```

<!--original
``` kotlin
data class Customer(val name: String, val email: String)
```
-->

`Customer`クラスは次の機能を提供します：

<!--original
provides a `Customer` class with the following functionality:
-->

* 全てのプロパティのゲッター（と*var*{: .keyword }キーワードが使用されたときはセッターも）
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* すべてのプロパティに対して、`component1()`, `component2()`, …, （[Dataクラス](data-classes.html)を参照してください）
関数の引数に対するデフォルト値

<!--original
* getters (and setters in case of *var*{: .keyword }'s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))
-->

## 関数の引数に対するデフォルト値

<!--original
### Default values for function parameters
-->

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

<!--original
``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```
-->

## リストのフィルタリング

<!--original
### Filtering a list
-->

``` kotlin
val positives = list.filter { x -> x > 0 }
```

<!--original
``` kotlin
val positives = list.filter { x -> x > 0 }
```
-->

または、こう短くも書けます：

<!--original
Or alternatively, even shorter:
-->

``` kotlin
val positives = list.filter { it > 0 }
```

<!--original
``` kotlin
val positives = list.filter { it > 0 }
```
-->

JavaとKotlinの違いを学ぶには、 [JavaとKotlinのフィルタリング](java-to-kotlin-collections-guide.md#要素のフィルタリング)を参照のこと。

## コレクションの中に要素があるかの確認

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 文字列補完

<!--original
### String Interpolation
-->

``` kotlin
println("Name $name")
```

<!--original
``` kotlin
println("Name $name")
```
-->

JavaとKotlinの違いを学ぶには、 [JavaとKotlinの文字列の連結](java-to-kotlin-idioms-strings.md#文字列の連結)を参照のこと。


## インスタンスのチェック

<!--original
### Instance Checks
-->

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

<!--original
``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```
-->

## 読み取り専用リスト

```kotlin
val list = listOf("a", "b", "c")
```

## 読み取り専用マップ

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## mapのエントリへのアクセス

```kotlin
println(map["key"])
map["key"] = value
```

## mapやlistのペアを巡回する

<!--original
### Traversing a map/list of pairs
-->

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

<!--original
``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```
-->

`k`, `v`はどんな名前でも構いません。たとえば `name` と `age` とかでもOK。

## 範囲の反復

<!--original
## Iterate over a range
-->

```kotlin
for (i in 1..100) { ... }  // 右閉区間: 100を含む
for (i in 1..<100) { ... } // 右開区間のrange: 100を含まない
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

<!--original
``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```
-->

## 遅延評価プロパティ

<!--original
### Lazy property
-->

``` kotlin
val p: String by lazy { // 値は最初のアクセスの時だけ計算される
    // 文字列を計算
}
```

<!--original
``` kotlin
val p: String by lazy {
    // compute the string
}
```
-->

## 拡張関数(extension functions)

<!--original
### Extension Functions
-->

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

<!--original
``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```
-->

## シングルトンの作成

<!--original
### Creating a singleton
-->

``` kotlin
object Resource {
    val name = "Name"
}
```

<!--original
``` kotlin
object Resource {
    val name = "Name"
}
```
-->

## abstract classのインスタンシエート

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```


## if not nullの省略記法

<!--original
### If not null shorthand
-->

``` kotlin
val files = File("Test").listFiles()

println(files?.size) // filesがnullで無ければサイズが出力される
```

<!--original
``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```
-->

## if-not-null-elseの省略記法

<!--original
### If not null and else shorthand
-->

``` kotlin
val files = File("Test").listFiles()

// 単純なフォールバックの値
println(files?.size ?: "empty") // filesがnullなら"empty"と出力

// フォールバックの値としてより複雑な計算をコードブロックで行いたいなら、`run`を使う
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

<!--original
``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```
-->

## if null文の実行

<!--original
### Executing a statement if null
-->

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

<!--original
``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```
-->

## 空かもしれないコレクションから最初の要素を取る

```kotlin
val emails = ... // 空かもしれないコレクション
val mainEmail = emails.firstOrNull() ?: ""
```


## if not null文の実行

<!--original
### Execute if not null
-->

``` kotlin
val data = ...

data?.let {
    ... // nullでなければこのブロックを実行する
}
```

<!--original
``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```
-->

## nullableな値がnullでない時だけ変換

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// valueかtransformValueの結果がnullならdefaultValueが返される
```

## when文でreturnする

<!--original
### Return on when statement
-->

``` kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

<!--original
``` kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```
-->

## try-catch式

<!--original
### 'try/catch' expression
-->

``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // resultを使って何かする
}
```

<!--original
``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```
-->

## if式

<!--original
### 'if' expression
-->

``` kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

<!--original
``` kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```
-->

## Unitを返すメソッドをビルダースタイルで使用する

<!--original
### Builder-style usage of methods that return `Unit`
-->

``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

<!--original
``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```
-->


## 単一式関数

<!--original
### Single-expression functions
-->

``` kotlin
fun theAnswer() = 42
```

<!--original
``` kotlin
fun theAnswer() = 42
```
-->

これは次と等価です：

<!--original
This is equivalent to
-->

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

<!--original
``` kotlin
fun theAnswer(): Int {
    return 42
}
```
-->


これは他のイディオムと組み合わせることができ、コードを短くすることにつながります。例） *when*{: .keyword }-式：

<!--original
This can be effectively combined with other idioms, leading to shorter code. E.g. with the *when*{: .keyword }-expression:
-->

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

<!--original
``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
-->

## 'with' を使って、あるオブジェクトのインスタンスに対して複数の関数を呼ぶ

<!--original
### Calling multiple methods on an object instance ('with')
-->

``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100pxの四角形を描く
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

<!--original
``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```
-->

## オブジェクトのプロパティを設定（apply）

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

これはコンストラクタに存在しないプロパティを設定するのに便利です。

## Java 7のtry-with-resources

<!--original
### Java 7's try with resources
-->

``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

<!--original
``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```
-->

## ジェネリック型の型情報を必要とするジェネリック関数

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## NullableなBoolean

```kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b`はfalseかnull
}
```

## 2つの値のスワップ

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## コードが未完成だとマークする（TODO）

Kotlinの標準ライブラリには`TODO()`関数があり、これはいつも`NotImplementedError`をthrowします。
戻りの型は`Nothing`なので、どのような型が期待される所でも使用出来ます。
また、理由を示す引数を受け取るオーバーロード版もあります。

```kotlin
fun calcTaxes(): BigDecimal = TODO("会計部からのフィードバック待ち")
```

IntelliJ IDEAのkotlinプラグインは`TODO()`の意味を理解し、TODOツールウィンドウに自動的にコードの位置を追加してくれます。

## この次は？

* [Advent of Code puzzles](https://kotlinlang.org/docs/advent-of-code.html)（未翻訳）をKotlinのイディオムを使って解いていこう
* [文字列に関する典型的なタスクをJavaとKotlinで実行](java-to-kotlin-idioms-strings.md)する方法を学ぶ
* [コレクションに関する典型的なタスクをJavaとKotlinで実行](java-to-kotlin-collections-guide.md)する方法を学ぶ
* [nullabilityをJavaとKotlinで対応](java-to-kotlin-nullability-guide.md)する方法を学ぶ
