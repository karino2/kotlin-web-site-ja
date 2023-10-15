---
layout: reference
title: "コレクションの一部分を取り出す"
---
# コレクションの一部分を取り出す

Kotlinの標準ライブラリには、コレクションの一部分を取り出す拡張関数が含まれています。
これらの関数は結果のコレクションに含まれる要素をさまざまな方法で選ばせてくれます：
位置を明示的に列挙したり、結果のサイズを指定したり、その他いろいろな方法があります。

## slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html)は、指示されたインデックスたちに対応するコレクションの要素たちをリストで返します。
インデックスたちは[範囲（range）](ranges.md)で指定するか、整数の値のコレクションで指定するかのどちらかを選べます。


{% capture slice-ex %}

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=slice-ex %}

## takeとdrop

最初から数えて指定した数の要素を取り出すには、[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html)関数を使います。
最後の方の要素を取り出したければ、[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)を使います。
コレクションサイズより大きな数を指定すると、どちらの関数もコレクション全体を返します。

最初の数個の要素「以外」とか最後の数個「以外」を取り出したければ、 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)と
[`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html)関数をそれぞれ使います。


{% capture take-drop %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=take-drop %}

takeやdropする要素の数を定義する述語を渡す事もできます。
上に述べた関数とそれぞれ対応する、4つの関数があります：

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html)は`take()`に述語がるバージョン：最初にマッチしなくなる所まで要素を取り出す、マッチしなかった要素は含まない。最初の要素がマッチしなければemptyの結果を返す。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html)は`takeLast()`と同種のもの: コレクションの最後から述語にマッチしている範囲の要素を取り出す。最初の要素は、最初にマッチしなかった要素の次の要素となる。コレクションの最後の要素がそもそもマッチしない場合は、結果はemptyとなる。
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html)は`takeWhile()`の逆のようなものに述語があるバージョン：最初にマッチしなかった要素から最後までの要素を返す。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html)は`takeLastWhile()`の逆のようなものに述語があるバージョン：最初の要素から、最後にマッチしなかった要素までを返す。

{% capture take-drop-predicate %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=take-drop-predicate %}

## chunked

指定されたサイズごとにコレクションを分割するためには、 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html)関数を使うことが出来る。
`chunked()`は引数を一つ取り ー チャンクのサイズ ー 指定された`List`の`List`を返す。
最初のチャンクは最初の要素から始まり`size`個の要素を含み、二番目のチャンクは次の`size`個の要素を含み、、、となっている。
最後のチャンクは指定したサイズより小さいことがありうる。

{% capture chunked-ex %}

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=chunked-ex %}

返されたチャンクにその場で変形（transformation）を適用することも出来る。
そのためには、`chunked()`を呼ぶ時に変形を行うラムダ関数を渡せば良い。
ラムダ関数の引数はコレクションのチャンクだ。
`chunked()`が変形とともに呼ばれると、
チャンクは短寿命の`List`となりそのラムダでただちに消費されるべきものとなる。

{% capture chunked-transform %}

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it`は元のコレクションのチャンク
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=chunked-transform %}

## windowed

指定されたサイズのすべての可能な範囲（range）の要素を取り出すことも出来る。
それは[`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)関数と呼ばれる：
それはコレクションを指定したサイズのスライディングウィンドウで見ていく時に得られる要素の範囲のリストを返す。
`chunked()`と異なり、`windowed()`はコレクションの**各要素**から始まる要素の範囲（**ウィンドウ**）たちを返す。
すべてのウィンドウは結果として返される`List`の各要素となる。

{% capture windowed-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=windowed-ex %}

`windowed()`はオプショナルなパラメータを追加することでさらなる柔軟性を加えることが出来る：

* `step` は２つの隣接するウィンドウの間の距離を指定する。デフォルトは1で、この場合はすべての各要素が結果のウィンドウたちの開始となる（訳注：ウィンドウサイズを確保出来る全要素）。stepを2に増やすと、結果は奇数番目の要素から始まるウィンドウだけを含むことになる：1番目、3番目、、、という具合に。
* `partialWindows`は末尾付近のウィンドウサイズより小さい範囲も結果のウィンドウとして含めるようになる。例えば、3要素のウィンドウをリクエストすると、通常は最後の2要素（訳注：を開始とする）ウィンドウは含まれない。だが`partialWindows`を有効にすると最後にさらにサイズ2とサイズ1のリストが追加されることになる。

最後に、返される範囲に対して変形をその場で適用することも出来ます。
その為には、`windowed()`を呼ぶ時に変形をラムダ関数として渡せば良い。


{% capture windowed-optional %}

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=windowed-optional %}

2要素のウィンドウを作る場合は、
それ専用の関数もありますー[`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)です。
これはレシーバのコレクションの隣接する要素のペアを作ります。
`zipWithNext()`はコレクションをペアに分割するのでは無く、最後の要素を除いた**各要素**の`Pair`を作ることに注意してください。
つまり、`[1, 2, 3, 4]`の結果は`[[1, 2], [2, 3], [3, 4]]`であって、`[[1, 2], [3, 4]]`ではありません。
`zipWithNext()`も変形関数とともに呼ぶことが出来ます。
その場合はレシーバのコレクションの2つの要素を引数にとる関数となります。


{% capture zip-with-next-ex %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=zip-with-next-ex %}
