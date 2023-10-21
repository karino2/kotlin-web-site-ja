---
layout: reference
title: "並べ替え"
---
# 並べ替え

要素の順番は、ある種のコレクションには重要な側面です。
例えば、同じ要素を持つ２つのリストでも、要素の順番が異なればこれらのリストは等しいとはみなされません。

Kotlinでは、オブジェクトの順番を定義する方法はいくつかあります。

最初の方法としては、**自然(natural)**な順番があります。
これは[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)インターフェースの実装により定義される順番です。
自然な順番はその他の順番が指定されていない場合のソートで使われる順番です。

多くのビルトインの型は比較可能（comparable）です：

* 数値型は伝統的な数値の順番を使います：`1`は`0`よりも大きく、`-3.4f`は`-5f`よりも大きい、などです。
* `Char` と `String`は[辞書式順序](https://ja.wikipedia.org/wiki/%E8%BE%9E%E6%9B%B8%E5%BC%8F%E9%A0%86%E5%BA%8F)を使います：`b`は
   `a`より大きく、`world`は`hello`より大きいです。

ユーザー定義型に自然な順番を定義するためには、その型で`Comparable`インターフェースを実装する必要があります。
これは`compareTo()`関数を実装する事を意味します。
`compareTo()`は同じ型の別のオブジェクトを引数に取り、
どちらのオブジェクトが大きいかを示すIntの値を返します：

* 正の値はレシーバオブジェクトの方が大きい事を示します。
* 負の値はレシーバオブジェクトの方が小さい事を示します。
* 0はオブジェクトが等しい事を示します。

以下はバージョンクラスの順番を、メジャーとマイナーのバージョン番号から決める例です。

{% capture compare-to-custom %}
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo()の中置形式 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
{% endcapture %}
{% include kotlin_quote.html body=compare-to-custom %}

**カスタムな**順番は、どんな型のインスタンスでもお好みなようにソートする事を可能にしてくれます。
とりわけ、Comparableでは無いオブジェクトの順番を定義したり、Comparableな型の自然な順番以外の順番を定義したり出来ます。
ある型のカスタムな順番を定義するためには、[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)を作ります。
`Comparator`は`compare()`関数を持ちます：これは、指定されたクラスの２つのインスタンスを引数に取り、それらの比較結果を数値として返します。
結果の数値は先に述べた`compareTo()`と同様に解釈されます。


{% capture custom-order %}
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=custom-order %}

`lengthComparator`を使えば、辞書順では無く長さで文字列を並べる事が出来ます。

`Comparator`を定義するもっと短い方法としては、標準ライブラリの[`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)関数を使う方法があります。
`compareBy()`は、インスタンスから`Comperable`な値を返すラムダ関数を引数に取り、
その生成された値の自然な順番をカスタムな順番とします。

`compareBy()`を使えば、上記のlengthComparatorの例は以下のように書く事が出来ます：

{% capture compare-by-ex %}
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=compare-by-ex %}

Kotlinのコレクションpackageは、自然な順番、カスタムな順番、ランダムな順番などに並べ替える関数を提供しています。
このページでは、[読み取り専用](collections-overview.md#コレクションの種類)のコレクションをソートする関数を説明します。
これらの関数は指定された順番に並べ替えたコレクションを新しく生成して返します。
[ミュータブル](collections-overview.md#コレクションの種類)をインプレイスにソートする関数を知りたければ、
[List特有のオペレーション](list-operations.md#ソート)を参照してください。

## 自然な順番

（訳注：Natural order）

基本となる関数、[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)と[`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)は、
コレクションの要素をその自然の順番で昇順、または降順に並べ替えたコレクションを生成して返します。
これらの関数は`Comparable`な要素のコレクションに対して使う事が出来ます。

{% capture sorted-natural %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sorted-natural %}

## カスタムな順番

カスタムな順番でソートしたり、そもそもComperableで無いオブジェクトをソートしたい場合には、
[`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) と [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)関数があります。
これらは、コレクションの要素を`Comperable`な値にマップするセレクタ関数を引数に取り、その値の自然な順番でコレクションをソートします。

{% capture sort-by-ex %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("長さの昇順でソート： $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("最後の文字で降順にソート： $sortedByLast")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sort-by-ex %}

コレクションのソートに使う為にカスタムな順番を定義するために、独自の`Comparator`を渡す事も出来ます。
そのためには、[`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html)関数を使い、
独自に定義した`Comparator`をこれに渡します。
この関数を使って文字列を長さでソートする例は以下のようになります：

{% capture sorted-with-ex %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sorted-with-ex %}

## 逆順

コレクションを逆順にしたものを取り出す事も出来ます。
[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)関数を使います。

{% capture reversed-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=reversed-ex %}

`reversed()`は要素のコピーを含む新規のコレクションを返します。
だからあとになって元となるコレクションを変更しても、変更前に取得した`reversed()`の結果には影響を与えません。
（訳注：要素のコピーと言っているが、要素はコピーでは無く同じオブジェクトへの参照だと思う。ここではコレクションが新規に作られると言いたいのだと思われる。）

これとは別のリバースの関数、[`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)は同じコレクションインスタンスの、
逆順のビューを返すので、元のコレクションが変更されない事が分かっているなら`reversed()`よりも軽量で望ましい場合があります。

{% capture as-reversed-ex %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=as-reversed-ex %}

オリジナルのリストがミュータブルなら、オリジナルのコレクションへの変更はリバースのビューにも影響を与えるし、リバースのビューへの変更もオリジナルのコレクションに影響を与えます。
（訳注：説明には書いていないが、MutableListのasReversedはMutableListを返す）

{% capture as-reversed-mutable-ex %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=as-reversed-mutable-ex %}

しかしながら、リストのミュータビリティが不明だったり、そもそも元となるコレクションがリストで無い場合などは、`reversed()`の方が結果がコピーになって勝手に変わる事が無い事が保証されるので、
より望ましいと言えます。

## ランダムな順番

最後に、ランダムな順番の新たな`List`を返す関数があります ー [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)です。
この関数は引数無しで呼び出す事も出来ますし、[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)オブジェクトを引数に呼び出す事も出来ます。

{% capture shuffle-ex %}
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=shuffle-ex %}

