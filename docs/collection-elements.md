---
layout: reference
title: "要素を一つ取り出す"
---
# 要素を一つ取り出す

Kotlinのコレクションは、コレクションから要素を一つ取り出すための一連の関数を提供します。
このページに書かれている関数は、セットとリストの両方に使う事が出来ます。

[リストの定義](collections-overview.md)で述べたように、
リストは順番のあるコレクションです。
つまり、各要素にはポジションがあり、それを使って要素を参照する事が出来ます。
このページに書かれた関数たちに加えて、リストはインデックスによる、より広範な要素の取得や検索方法を提供します。
より詳しくは、[リスト特有のオペレーション](list-operations.md)を参照ください。

一方、セットは[定義により](collections-overview.md)、順番の無いコレクションです。
しかしながら、Kotlinでは`Set`は要素をある順番で格納しています。
これらの順番は挿入した順番だったり（`LinkedHashSet`の場合）、自然なソートの順番（natual sorted order）だったり（`SortedSet`の場合）、
またそれ以外の場合も考えられます。
セットの要素の順番が不明な場合もあります。
そのような場合、要素はそれでも何らかの順番で並べられていて、
要素の位置に依存するような関数は何かの結果を返す事は出来ます。
ですが、そのような結果は`Set`の特定の実装を呼ぶ人が知っている場合を除いては予測不能となります。

## 位置による取り出し

指定した位置にある要素を取り出すための、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)という関数があります。
この関数を整数の引数で呼び出すと、渡した位置にある要素を受け取る事になります。
最初の要素は位置`0`で、最後の要素の位置は`(size - 1)`です。

`elementAt()`はインデックスアクセスを提供してないコレクションや、または静的にはその提供が分からないようなケースで便利です。
`List`の場合は、[インデックスアクセス演算子](list-operations.md#インデックスによる要素の取り出し)(`get()` あるいは `[]`)を使う方がより慣用的(idiomatic)です。
 
{% capture element-at-ex %}

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 要素は昇順(ascending order)で格納されています
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=element-at-ex %}

コレクションの最初と最後の要素を取り出す便利なエイリアスもあります： [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
と [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)です。

{% capture first-last-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=first-last-ex %}

存在しない位置で要素を取り出してしまった時のexceptionを避けるためには、`elementAt()`のセーフな亜種を使ってください：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)はコレクションの範囲の外の位置を指定するとnullを返します。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) は追加のラムダ関数をとります。そのラムダ関数　は`Int`の引数を要素の型にマップするものです。
   範囲外の位置で呼ぶと、`elementAtOrElse()`は指定された値でのラムダの結果を返します。

{% capture element-at-or-else-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "インデックス $index の値は未定義です"})
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=element-at-or-else-ex %}

## 条件による取り出し

[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) と [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数は、
与えた条件にマッチする要素を探し出すのにも使えます。
`first()`をコレクションの要素に対する述語（predicate）とともに呼び出すと、述語が最初に`true`を返した要素を返します。
同様に、`last()`を述語つきで呼び出すと、最後に述語がマッチした要素を返します。

{% capture first-last-predicate %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=first-last-predicate %}

どの要素も述語にマッチしない場合は、どちらの関数も例外を投げます。
例外を避けたければ、[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
と [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html) を代わりに使いましょう：
これらの関数はマッチする要素が見つからなければどちらも`null`を返します。


{% capture first-or-null-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=first-or-null-ex %}

もし用途によりふさわしいと思うなら、以下のエイリアスを使いましょう：

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) は `firstOrNull()` の代わりに使えます
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) は `lastOrNull()` の代わりに使えます

{% capture find-last-ex %}

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=find-last-ex %}

## セレクタによる取り出し

要素を取り出す前にマップをする必要があるなら、 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)関数があります。
これは２つのアクションを一気に行います：
- コレクションをセレクタ関数でマップします
- 結果の最初の非null値を返します

`firstNotNullOf()`は、結果のコレクションに非nullの要素がなければ`NoSuchElementException`を投げます。
その場合にnullを返して欲しければ、[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) を使いましょう。

{% capture first-not-null-of %}
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 各要素を文字列に変換して所定の長さより大きい最初の要素を返す
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=first-not-null-of %}

## ランダムな要素

コレクションの要素を何かてきとうに取り出したい場合は、[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)関数を使うと良いでしょう。
引数無しで呼び出す事も出来ますし、ランダムさの元として[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)オブジェクトを引数に呼び出す事も出来ます。

{% capture col-random %}

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=col-random %}

空のコレクションに対して`random()`を呼ぶと例外が投げられます。
代わりに`null`を受け取りたければ、[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)を使いましょう。

## 要素が存在するかを確認する

コレクションにある要素が存在するかどうかを確認したければ、[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html)関数を使いましょう。
この関数は、渡された引数と`equals()`な要素がコレクションにあれば`true`を返します。
`in`キーワードを使ってオペレータの形で、`contains()`を呼び出す事も出来ます。

複数のインスタンスが存在するかをまとめてチェックしたければ、[`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)をそのチェックしたいインスタンスのコレクションを引数に呼び出せばよろしい。

{% capture contains-all-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=contains-all-ex %}

さらに、要素のどれか一つを含んでいるかをチェックしたければ、
[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)か[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)が使用出来ます。

{% capture is-not-empty-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=is-not-empty-ex %}

