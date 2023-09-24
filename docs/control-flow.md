---
layout: reference
title: "条件式とループ"
---
# 条件式とループ

<!--original
# Control Flow
-->

## if式

<!--original
## If Expression
-->

Kotlinでは、*if*{: .keyword }は式であり、すなわち値を返します。従って、三項演算子は存在しません（`条件 ? 真の時 : 偽の時`）。なぜなら普通の *if*{: .keyword } がその役割を果たすためです。

<!--original
In Kotlin, *if*{: .keyword } is an expression, i.e. it returns a value.
Therefore there is no ternary operator (condition ? then : else), because ordinary *if*{: .keyword } works fine in this role.
-->

{% capture if-else-if-kotlin %}
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // else付き
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // 式として
    max = if (a > b) a else b

    // `else if`も式の中で使える:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b

    //sampleEnd
    println("max は $max")
    println("maxOrLimit は $maxOrLimit")
}
{% endcapture %}
{% include kotlin_quote.html body=if-else-if-kotlin %}



*if*{: .keyword } の分岐はブロックにすることができ、最後の式がそのブロックの値となります：

<!--original
*if*{: .keyword } branches can be blocks, and the last expression is the value of a block:
-->

``` kotlin
val max = if (a > b) { 
    print("aを選びます") 
    a 
} else { 
    print("bを選びます") 
    b 
}
```

<!--original
``` kotlin
val max = if (a > b) { 
    print("Choose a") 
    a 
  } 
  else { 
    print("Choose b") 
    b 
  }
```
-->

もし*if*{: .keyword }を文ではなく式として使用する（例えば値を返したり変数に代入したりする）ならば、その式には`else`分岐が必要です。 

## when式

<!--original
## When Expression
-->

*when*{: .keyword } は一つの条件式に複数の分岐を定義します。
C系の言語におけるswitch式に似ています。最も簡単な形式では、次のようになります：

``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> {
    print("x は1でも2でもありません")
  }
}
```

*when*{: .keyword } はその引数が満たされる分岐が現れるまで、順番に全ての分岐に対して比較されます。

*when*{: .keyword } は式としても文としても使うことができます。
もし式として使用されれば、その値は条件が最初に満たされた分岐の値が式全体の値となります。
もし文として使用されれば、個別の分岐の値は無視されます。
*if*{: .keyword }と同様に各分岐はブロックでも良く、その場合は値はブロック内の最後の式のものとなります。

<!--original
`when` matches its argument against all branches sequentially until some branch condition is satisfied.

`when` can be used either as an expression or as a statement. If it is used as an expression, the value
of the first matching branch becomes the value of the overall expression. If it is used as a statement, the values of
individual branches are ignored. Just like with `if`, each branch can be a block, and its value
is the value of the last expression in the block.
-->

*else*{: .keyword }節は他の分岐の条件が全て満たされなかった際に評価されます。

もし`when`が**式**として使用されれば、全てのあり得る場合を分岐条件で網羅できていることをコンパイラが保証出来ない限りは、*else*{: .keyword }節は必須です。
全部の分岐条件を網羅出来ている事をコンパイラが保証出来るケースとしては、
[列挙型クラス](enum-classes.md)のエントリや[`sealed`クラス](sealed-classes.md)のサブタイプなどが挙げられます。

<!--original
If `when` is used as an _expression_, the `else` branch is mandatory,
unless the compiler can prove that all possible cases are covered with branch conditions,
for example, with [`enum` class](enum-classes.md) entries and [`sealed` class](sealed-classes.md) subtypes).
-->

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    Bit.ZERO -> 0
    Bit.ONE -> 1
    // 全部のケースをカバー出来ているので 'else' は不要
}
```

`when`**文**では、以下のケースでは `else`節は必須です：
* `when`の条件が`Boolean`、[`enum`](enum-classes.md)、[`sealed`](sealed-classes.md) 型か、そのnullableバージョンの場合（訳注：この文は誤りな気がする、たぶんBooleanの場合だけが正解）
* `when`の分岐が対象のすべてのケースをカバーしていない場合

<!-- original
In `when` _statements_, the `else` branch is mandatory in the following conditions:
* `when` has a subject of a `Boolean`, [`enum`](enum-classes.md),
or [`sealed`](sealed-classes.md) type, or their nullable counterparts.
* branches of `when` don't cover all possible cases for this subject.
 -->

 ```kotlin
enum class Color {
    RED, GREEN, BLUE
}

when (getColor()) {  
    Color.RED -> println("red")
    Color.GREEN -> println("green")   
    Color.BLUE -> println("blue")
    // 全部のケースがカバーされているので 'else' は不要
}

when (getColor()) {
    Color.RED -> println("red") // GREENとBLUEについての分岐が無い
    else -> println("not red") // 'else' が必要
}
```

複数のケースに対して共通の処理をしたい場合は、分岐の条件を一行でカンマでまとめる事が出来ます：

<!--original
To define a common behavior for multiple cases, combine their conditions in a single line with a comma: 
-->

``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("それ以外")
}
```

<!--original
``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("otherwise")
}
```
-->

分岐条件として任意の式（定数に限らない）を使用することができます：

<!--original
We can use arbitrary expressions (not only constants) as branch conditions
-->

``` kotlin
when (x) {
  parseInt(s) -> print("sはxをエンコードする")
  else -> print("sはxをエンコードしない")
}
```

<!--original
``` kotlin
when (x) {
  parseInt(s) -> print("s encodes x")
  else -> print("s does not encode x")
}
```
-->

*in*{: .keyword }または*!in*{: .keyword }を使用すると、コレクションや [範囲 (range)](ranges.html) に入っているかをチェックすることもできます： 

<!--original
You can also check a value for being `in` or `!in` a [range](ranges.md) or a collection:
-->

``` kotlin
when (x) {
  in 1..10 -> print("xは範囲内")
  in validNumbers -> print("xは有効")
  !in 10..20 -> print("xは範囲外")
  else -> print("どれにも該当せず")
}
```

<!--original
``` kotlin
when (x) {
  in 1..10 -> print("x is in the range")
  in validNumbers -> print("x is valid")
  !in 10..20 -> print("x is outside the range")
  else -> print("none of the above")
}
```
-->

値をチェックする他の方法として、特定の型の*is*{: .keyword }または*!is*{: .keyword }があります。
[スマートキャスト](typecasts.html#smart-casts)のおかげで、その型のメソッドやプロパティに追加のチェック無しでアクセスできることに注意してください。

<!--original
Another possibility is to check that a value *is*{: .keyword } or *!is*{: .keyword } of a particular type. Note that,
due to [smart casts](typecasts.html#smart-casts), you can access the methods and properties of the type without
any extra checks.
-->

```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```

<!--original
```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```
-->

*when*{: .keyword }は *if*{: .keyword}-*else*{: .keyword} *if*{: .keyword}連鎖を代替することもできます。 
引数が与えられない場合は、分岐条件は単純なbooleanの式となり、分岐はその条件がtrueの場合に実行されます：

<!--original
*when*{: .keyword } can also be used as a replacement for an *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } chain.
If no argument is supplied, the branch conditions are simply boolean expressions, and a branch is executed when its condition is true:
-->

``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```

<!--original
``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```
-->

以下のシンタックスを使って、*when*の対象を変数に捕捉する事が出来ます。

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

*when*の対象の所で導入された変数のスコープは、*when*の本体の中のみです。


## Forループ

<!--original
## For Loops
-->

*for*{: .keyword }ループはイテレータによって提供されるものを何でも繰り返し実行します。
これはC#などの言語の`foreach`と同等です。
`for`の構文は次のとおりです：

<!--original
The `for` loop iterates through anything that provides an iterator. This is equivalent to the `foreach` loop in languages like C#.
The syntax of `for` is the following:
-->

``` kotlin
for (item in collection) print(item)
```

`for`の本文をブロックにすることもできます。

<!--original
The body can be a block.
-->

``` kotlin
for (item: Int in ints) {
  // ...
}
```

<!--original
``` kotlin
for (item: Int in ints) {
  // ...
}
```
-->

前述したように、 *for*{: .keyword} はイテレータを提供するものを何でも繰り返し実行します。すなわち：

<!--original
As mentioned before, *for*{: .keyword } iterates through anything that provides an iterator, i.e.
-->

* メンバ関数や拡張関数の `iterator()`で`Iterator<>`型をすもの：
  * メンバ関数や拡張関数の `next()` を持つ
  * メンバ関数や拡張関数で`Boolean` を返す `hasNext()` を持つ

<!--original
* has a member or an extension function `iterator()` that returns `Iterator<>`:
  * has a member or an extension function `next()`
  * has a member or an extension function `hasNext()` that returns `Boolean`.
-->

これら3つの関数は全て `operator` としてマークされる必要があります。（訳注：operatorキーワードを指定する必要がある）

<!--original
All of these three functions need to be marked as `operator`.
-->

数字の範囲を繰り返し実行したい場合は、[range式](ranges.md) が使えます：

{% capture range-for-sample-1 %}
fun main() {
//sampleStart
    for (i in 1..3) {
        println(i)
    }
    for (i in 6 downTo 0 step 2) {
        println(i)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-for-sample-1 %}

rangeや配列の`for`ループはインデックスベースのループにコンパイルされ、
イテレータオブジェクトを作成しません。

<!--original
A `for` loop over an array is compiled to an index-based loop that does not create an iterator object.
-->

もし配列やリストをインデックス付きで繰り返し処理したいならば、以下の方法を使用できる： 

<!--original
If you want to iterate through an array or a list with an index, you can do it this way:
-->

{% capture array-indices %}
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        println(array[i])
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=array-indices %}

別方法として、ライブラリ関数の withIndex を使用することもできます：

<!--original
Alternatively, you can use the `withIndex` library function:
-->

{% capture array-with-index %}
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("$index 番目の要素は $value")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=array-with-index %}

## whileループ

<!--original
## While Loops
-->

`while`と`do-while`ループは与えられた条件が満たされている間、本体を実行し続けます。
両者の違いは条件を確認するタイミングです：
* `while`は条件をチェックし、それが満たされていたら、本体を実行してまた条件チェックに戻ります
* `do-while`は本体を実行し、それから条件をチェックします。もし条件が満たされていたら、ループをもう一度実行します。つまり、`do-while`の本体は条件によらず最低でも一回は実行されます。

<!--original
`while` and `do-while` loops execute their body continuously while their condition is satisfied.
The difference between them is the condition checking time:
* `while` checks the condition and, if it's satisfied, executes the body and then returns to the condition check.
* `do-while` executes the body and then checks the condition. If it's satisfied, the loop repeats. So, the body of `do-while`
executes at least once regardless of the condition. 
-->

``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // y はここで可視(visible)
```

<!--original
``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // y is visible here!
```
-->

## ループ内でのbreakとcontinue

<!--original
## Break and continue in loops
-->

Kotlinは従来通りの、ループ内の *break*{: .keyword }と*continue*{: .keyword } 演算子をサポートしています。[Returnとジャンプ](returns.html)を参照してください。

<!--original
Kotlin supports traditional *break*{: .keyword } and *continue*{: .keyword } operators in loops. See [Returns and jumps](returns.html).
-->