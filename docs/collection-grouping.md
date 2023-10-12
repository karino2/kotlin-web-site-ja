---
layout: reference
title: "グルーピング"
---
# グルーピング

Kotlinの標準ライブラリは、コレクションの要素をグルーピングする拡張関数を提供しています。
基本となる関数は[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)関数で、
これはラムダ関数を引数にとって、`Map`を返します。
このマップには、ラムダの結果をキーとして、対応する値にはそのキーを返した要素が`List`で入ります。
この関数は、例えば`String`のリストを、最初の文字でグルーピングするのに使えたりします。

また、`groupBy()`に二つ目のラムダ引数を足して呼び出す事も出来ます。二番目のラムダ式は値をトランスフォームする関数です。
２つのラムダを引数に持つ`groupBy()`の結果のマップは、キーは`keySelector`関数で作られた値をキーとして、
値の方はそれを作り出した要素たちの代わりに、それをさらにトランスフォーム関数で変換したものが値となります。


{% capture group-by-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    println(numbers.groupBy { it.first().uppercase() })
    println(numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() }))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=group-by-ex %}

要素をグループ化して、さらにオペレーションを全グループに実行したければ、
[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)関数を使います。
この関数は、[`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)型のインスタンスを結果として返します。
`Grouping`インスタンスはすべてのグループにオペレーションをlazyに適用する事が出来るものです。
グループは実際にはオペレーションが実行され直前に生成されます。


具体的には、`Grouping`は以下のオペレーションをサポートします：

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html)は各グループの要素数をカウントします。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) と [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
   は[foldとreduce](collection-aggregate.md#foldとreduce)オペレーションを、個々のグループを別々のコレクションとして実行して結果を返します。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html)は渡されたオペレーションを各グループの全要素に対して順番に実行して結果を返します。
   これは任意のオペレーションを`Grouping`にほどこす一般的なやり方となります。foldやreduceでは不十分なカスタムなオペレーションを実装したい時にｈ使いましょう。

{% capture gropuing-by %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.groupingBy { it.first() }.eachCount())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=gropuing-by %}
