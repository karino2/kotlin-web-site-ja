---
layout: reference
title: "範囲(Range)と数列(Progression)"
---
# 範囲(Range)と数列(Progression)

Kotlinはある範囲に渡る値を[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)関数
と[`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html)関数で簡単に作る事が出来ます。
これらの関数は`kotlin.ranges`パッケージにあります。

* 終端を含む範囲を作成するには、`..`演算子を使って`.rangeTo()`関数を呼びます
* 終端を含まない範囲を作成するには、`..<`演算子を使って`.rangeUntil()`関数を呼びます

例を挙げましょう:

{% capture close-open-range %}
fun main() {
//sampleStart
    // 終端を含む範囲
    println(4 in 1..4)
    // true
    
    // 終端を含まない範囲
    println(4 in 1..<4)
    // false
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=close-open-range %}

範囲は`for`ループでその上に渡ってイテレートしたい時に特に便利です：

{% capture range-for %}
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-for %}

数字を逆順にイテレートしたければ、`..`の代わりに[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)関数を使います.


{% capture range-downto %}
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-downto %}

数字を1以外の間隔でイテレートする事も可能です。
それには[`step`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)関数を使います。


{% capture range-step %}
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-step %}

## 数列

（訳注：Progression）

整数の型、`Int`、 `Long`、 `Char`の範囲は、[等差数列](https://en.wikipedia.org/wiki/Arithmetic_progression)として扱う事が出来ます。
Kotlinでは、これらの数列は特別な型として定義されます：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html)、
[`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)です。

数列には3つの重要なプロパティがあります：
`first`要素、`last`要素、そして非ゼロの`step`です。
最初の要素は`first`です。以後それに続く要素は前の要素に`step`を足したものです。
正のステップの数列をイテレートする事は、Java/JavaScriptのインデックスを使った`for`ループと同等です。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

範囲をイテレートする事で暗黙のうちに数列を作る場合、
その数列の`first`と`last`は範囲の両終端で、`step`は1となっています。

{% capture range-as-progressiono %}
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-as-progressiono %}

カスタムな差分による数列を定義したければ、`step`関数を範囲に使います。

{% capture range-step-progression %}
fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=range-step-progression %}

数列の`last`の要素は以下のように計算されます：
* 正のステップの時：以下を満たす中で終端を越えない最大の値 `(last - first) % step == 0`
* 負のステップの時：以下を満たす中で終端の値を下回らない最小の値 `(last - first) % step == 0`

つまり、`last`要素は指定された値と必ずしも等しくはなりません。

{% capture last-value-calc %}
fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // last要素は7
    // 147
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=last-value-calc %}

数列は`Iterable<N>`を実装しています、ここで`N`はそれぞれ`Int`、 `Long`、`Char`です。
だから、`map`や`filter`などの様々な[コレクションの関数](collection-operations.md)で使う事が出来ます。


{% capture progression-col %}
fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=progression-col %}

