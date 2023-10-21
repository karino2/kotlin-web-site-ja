---
layout: reference
title: "集約オペレーション（aggregate）"
---
# 集約オペレーション（aggregate）

Kotlinのコレクションは良く使われる**集約(aggregate)オペレーション**の関数を含んでいる。
集約オペレーションとは、コレクションの中身を元に単一の値を返すオペレーションの事です。
多くのものは良く知られていて、他のプログラム言語のものと同様に振る舞います：

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) と [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) は最小と最大の要素をそれぞれ返す。空のコレクションに対して行うと`null`を返す。
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)は数値のコレクションの平均値を返す。
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)は数値のコレクションの合計を返す。
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)コレクションの要素数を返す。

{% capture aggregate-ex1 %}

fun main() {
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.maxOrNull()}")
    println("Min: ${numbers.minOrNull()}")
    println("平均: ${numbers.average()}")
    println("合計: ${numbers.sum()}")
}
{% endcapture %}
{% include kotlin_quote.html body=aggregate-ex1 %}

最小と最大の要素を、何らかのセレクタ関数やカスタムな[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)を元にして返す関数もある：

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) と [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)はセレクタ関数を引数にとり、そのセレクタが返した値が最大の要素と最小の要素をそれぞれ返す。
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) と [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)は`Comparator`オブジェクトを引数に取り、その`Comparator`による最大と最小の要素をそれぞれ返す。
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) と [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)はセレクタ関数を引数に取り、セレクタが返した最大の値か最小の値をそれぞれ返す。
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) と [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html) は`Comparator`オブジェクトを引数に取り、セレクタの返した値を`Comparator`基準で最大の値か最小の値を返す。（訳注：`Comparator`とセレクタの２つの関数を引数に取る）

これらの関数は、空のコレクションに対しては`null`を返す。
この挙動だけが違う代替バージョンもある。
[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、 [`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、 [`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html)、 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)などです。
これらの関数はそれぞれの対応するものと同じ挙動をするけれど、空のコレクションに対しては`NoSuchElementException`を投げます。

{% capture aggre-by-ex %}

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=aggre-by-ex %}

普通の`sum()`の他に、より高度なsum関数、[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)関数もあります。
これはセレクタ関数を引数に取り、それを全要素に適応した結果の合計を返します。
セレクタは異なる数値型を返しても構いません：`Int`, `Long`, `Double`, `UInt`, `ULong`など (JVMの場合は `BigInteger` と `BigDecimal`もOK)。

{% capture sum-of-ex %}

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sum-of-ex %}

## foldとreduce

より特殊なケースのためには、[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) と [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)関数があります。これは渡されたオペレーションをコレクションの要素に順番に適用していって、累積した結果を返します。
オペレーションは引数２つを取ります：前回までに累積した値と、コレクションの要素です。

reduceとfoldの違いは、`fold()`は初期値を引数に取り、それを最初のステップでの累積値として用いるのに対し、
`reduce()`は最初のステップとしては１つ目と２つ目の要素を引数に実行する所が違いです。

{% capture fold-reduce-ex %}
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //間違い: 結果を見ると最初の要素は2倍されていないのが分かる。
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=fold-reduce-ex %}

上の例は両者の違いを示しています： `fold()`を使って要素を二倍したものの合計を計算しています。
同じ関数を`reduce()`に渡すと、異なった結果を返します。
なぜならリストの最初と二番目の要素を最初のステップの引数にしますが、
そのため最初の要素が2倍されない為です。

逆順に関数を適用していきたければ、
[`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)と[`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)関数を使いましょう。
これらの関数は`fold()` と `reduce()`　と似たように振る舞いますが、
最後の要素から始まって一つ前、その一つ前、と続いていく所が違います。
reduceRightとfoldRightはオペレーションの引数の順番が変わる事に注意してください： １つ目の引数が要素で二つ目の引数が累積値となります。

{% capture fold-right-ex %}

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=fold-right-ex %}

要素のインデックスも引数に取るオペレーションを適用する事も出来ます。
この場合は[`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)
と[`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)関数を使います。
要素のインデックスはオペレーションには最初の引数として渡されます。

最後に、そのようなオペレーションを右から左に適用する関数もあります。[`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)
と[`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)です。


{% capture fold-index-ex %}

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element -> if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum -> if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=fold-index-ex %}

すべてのreduce系の関数は空のコレクションには例外を投げます。代わりに`null`を受け取りたければ、それらの対応する`*OrNull()`バージョンを使ってください：
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

途中の累積値を保存したい場合は、
[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (またはその省略名の [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)) 
と[`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)関数があります。

{% capture running-ex %}

fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("\n", "runningReduceによる最初のN要素の合計:\n"))
    println(runningFoldSum.mapIndexed(transform).joinToString("\n", "runningFoldによる最初のN要素の合計:\n"))
}
{% endcapture %}
{% include kotlin_quote.html body=running-ex %}

オペレーションにインデックスのパラメータが必要な場合は、[`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)か
[`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)を使ってください。
