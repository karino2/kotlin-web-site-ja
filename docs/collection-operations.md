---
layout: reference
title: "コレクションのオペレーション概要"
---
# コレクションのオペレーション概要

Kotlinの標準ライブラリはコレクションに対する幅広いオペレーションを実行するための様々な関数を提供しています。
これらの中には単なる要素の取得や追加などの基本的なものから、より複雑な検索、ソート、フィルタ、変形などまで様々なものがあります。

## 拡張関数とメンバ関数

標準ライブラリでは、コレクションのオペレーションは２つの形態で定義されています：コレクションのインターフェースに[メンバ関数](classes.md#クラスメンバ)として、
あるいは[拡張関数(extension function)](extensions.md#拡張関数)として。

メンバ関数はコレクションの型にとって必須のオペレーションを定義します。
例えば、 [`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)は自身が空かどうかをチェックする為に [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)関数があり、
[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)には要素にアクセスする為に
[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)がある、などです。

あなたがコレクションのインターフェースの独自の実装を作りたい、と思ったら、そのメンバ関数を実装する必要があります。
新規の実装を簡単にする為に、標準ライブラリのスケルトン的な実装を使用する事が出来ます：
[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、
[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、
[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、
[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)と、
そのmutableバージョンです。

必須でないそれ以外のオペレーションは拡張関数として宣言されています。
これらには、フィルタ、変形、並べかえ、そのほかのコレクションの処理関数などが該当します。

## 共通のオペレーション

共通のオペレーションは、[読み取り専用とミュータブルなコレクション](collections-overview.md#コレクションの種類)の両方で使う事が出来ます。
共通のオペレーションは以下のグループに分ける事が出来ます：

* [変形（Transformations）](collection-transformations.md)
* [フィルタ（Filtering）](collection-filtering.md)
* [`plus` と `minus` オペレータ](collection-plus-minus.md)
* [グルーピング](collection-grouping.md)
* [部分コレクションの取り出し](collection-parts.md)
* [一つの要素の取り出し](collection-elements.md)
* [並べ替え](collection-ordering.md)
* [集約オペレーション（Aggregate operations）](collection-aggregate.md)

これらのページに書かれているオペレーションは、どれも元となるコレクションには影響を与えません。
例えば、フィルタオペレーションは、フィルタの述語（predicate）に位置する要素を含む**新しいコレクション**を作り出します。
そのようにして得られた結果は変数に格納したり、その他の用途、例えば別の関数に渡したり出来ます。


{% capture collection-operation-1 %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // `numbers`には何の影響も無い。結果は捨てられる。
    println("numbers は依然として $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 結果は`longerThan3`に格納される
    println("3文字より長い numbers は $longerThan3")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=collection-operation-1 %}

幾つかのコレクションのオペレーションには、**行き先（destination）**オブジェクトを指定するものもあります。
行き先オブジェクトは、ミュータブルなコレクションで、これを取るオペレーションはオペレーションの結果を新規のコレクションとして返すのでは無く、この行き先オブジェクトに追加していきます。
行き先つきのオペレーションは、それを行う`To`が末尾についた関数を使う事になります。
例えば、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) の代わりに
[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) を使ったり、
[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)の代わりに[`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html)を使う、
といった具合に。
これらの`To`が末尾につく関数は、行き先となるコレクションを追加のパラメータとして引数に取ります。

{% capture destination-sample %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  // 行き先オブジェクト
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 両方のオペレーションの結果を含んでいる
//sampleEnd
}

{% endcapture %}
{% include kotlin_quote.html body=destination-sample %}

利便性のために、これらの関数は行き先オブジェクトを返します。
これを活用すれば、関数呼び出しをする時の行き先オブジェクトに対応する引数の所で新規の行き先オブジェクトを作る、なんて事が出来ます：


{% capture destination-return %}

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // numbersをフィルタして新しく作ったハッシュセットに入れる。
    // こうしてresultに入る要素（長さ）の重複を除去している
    // （訳注：numbersの単語のlengthのセットを作ってresultとしている）
    val result = numbers.mapTo(HashSet()) { it.length }
    println("重複を除いた長さたちは： $result")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=destination-return %}

行き先指定つきの関数で用意されてるものとしては、フィルタ、関連付け（association）、グルーピング、フィルタリングなどがあります。
行き先指定つきの全オペレーションを知りたければ、[Kotlinコレクションリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)を参照ください。

## 書き込みオペレーション

ミュータブルなコレクションには、ここまで述べてきたものに加えて**書き込みオペレーション（write operations）**があり、
これはコレクションの状態を変更します。
そのようなオペレーションには、要素の追加、削除、更新などが含まれます。
書き込みオペレーションは[書き込みオペレーション](collection-write.md)のページと、
[List特有のオペレーション](list-operations.md#リストの書き込みオペレーション) と [マップ特有のオペレーション](map-operations.md#マップの書き込みオペレーション)のそれ系のセクションに書かれています。

ある種のオペレーションに関しては、同じオペレーションを行うペアの関数があります：
一つはオペレーションをそのコレクション自身に（in-placeで）行うものと、
もう一つは別個の新しいコレクションとして結果を返すものの２つです。
例えば、[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)はミュータブルなコレクションをin-placeでソートし、つまりはそのコレクション自身の状態を変更するのに対し、
[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)は同じ要素をソートした順番に収めた新しいコレクションを作ります。


{% capture sort-sorted %}

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sort-sorted %}
