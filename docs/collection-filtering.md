---
layout: reference
title: "コレクションをフィルタ処理する"
---
# コレクションをフィルタ処理する

フィルタ処理はコレクションの処理のうちもっとも良くあるタスクの一つです。
Kotlinでは、フィルタ条件は　**述語（predicate）** で定義します ー 要素を引数に取りBoolean値を返すラムダ関数の事です：
`true`は渡された要素が条件にマッチする事を意味し、`false`はその反対を意味します。

標準ライブラリは呼び出し一つでコレクションをフィルタ処理する拡張関数をいろいろ用意しています。
これらの関数は元のコレクションは変更しません。つまり、これらの関数は[ミュータブルと読み取り専用](collections-overview.md#コレクションの種類)のどちらにも使う事が出来ます。
フィルタ処理した結果に何か操作をしたければ、結果を変数に格納するかフィルタ処理のあとにさらに関数をチェインするかする必要があります。

## 述語でフィルタ

基本的なフィルタ処理関数は[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)です。
述語とともに呼ばれると、`filter()`は述語にマッチした要素だけを返します。
`List`と`Set`に対しては結果のコレクションは`List`になり、`Map`の場合は結果も`Map`になります。

{% capture filter-ex1 %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=filter-ex1 %}

`filter()`の述語は要素の値だけをチェックします。
もしフィルタ処理で要素の位置も使いたければ、[`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)を使いましょう。
この関数は述語として２つの引数を取る関数を取ります。その２つの引数とはインデックスと要素の値です。

コレクションを否定の条件でフィルタ処理したければ、[`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)を使いましょう。
これは述語が`false`を返した要素のリストを返します。

{% capture filter-not-ex1 %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=filter-not-ex1 %}

型を与える事でコレクション内の要素をその型に属するものだけに絞る関数もあります：


* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)は与えられた型と同じ型の要素を返します。
    `List<Any>`に対して呼び出す場合、 `filterIsInstance<T>()`は`List<T>`を返します。つまりその要素に対して`T`型にある関数を呼び出す事が出来るようになります。

    {% capture filter-is-instance-ex1 %}
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    {% endcapture %}
    {% include kotlin_quote.html body=filter-is-instance-ex1 %}

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) はnullでない要素をすべて返す。
    `List<T?>`に対して呼び出すと、`filterNotNull()`は`List<T: Any>`を返す。かくして要素をnullでないものとして扱う事が出来るようになる。

    {% capture filter-not-null-ex1 %}
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // lengthはnullableなStringには使えない
        }
    //sampleEnd
    }
    {% endcapture %}
    {% include kotlin_quote.html body=filter-not-null-ex1 %}

## Partition（分割）

さらに別のフィルタ関数として、[`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)があります。
これは、述語にマッチする要素を集めたコレクションを作ると同時に、マッチしなかった要素を別のリストに作ります。
つまり、戻りの値として`List`の`Pair`が返ってくる訳です：最初のリストは述語にマッチした方の要素が含まれていて、
２つ目のリストはそれ以外の要素がすべて入ります。

{% capture partition-ex1 %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=partition-ex1 %}

## 述語のテスト

最後に、コレクションの要素たちに単に述語をテストしていく関数というのがあります：

* [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) は少なくとも１つ述語にマッチしたら `true` を返す。
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 述語に一つもマッチしなければ `true` を返す。
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 述語が全ての要素にマッチしたら `true` を返す。
    空のコレクションに述語を渡すと、`all()` は `true` を返す事に注意しましょう。そのような振る舞いは論理学では **[vacuous truth](https://en.wikipedia.org/wiki/Vacuous_truth)** と呼ばれています。

{% capture vacuoous-truth %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=vacuoous-truth %}

`any()` と `none()` は述語無しで使う事も出来ます：この場合はコレクションが空かどうかを単にチェックします。
`any()` は要素があれば `true` を返し、そうでなければ `false` を返す。`none()` はその反対を行います。

{% capture non-predict %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=non-predict %}
