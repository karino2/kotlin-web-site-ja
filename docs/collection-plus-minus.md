---
layout: reference
title: "プラスとマイナス演算子"
---
# プラスとマイナス演算子

Kotlinでは、コレクションに[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) と [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`)演算子が定義されています。
それらは最初のオペランドにはコレクションをとり、二番目のオペランドには要素か別のコレクションのどちらかを取ります。
返される値は新しく作られる読み取り専用のコレクションです：

* `plus`の結果は、元のコレクションに二番目のオペランドを**加えた**もの
* `minus`の結果は、元のコレクションから二つ目のオペランドを**除いた**もの。
   もし２つ目のオペランドが要素の時は、`minus`は最初の一致した要素を取り除く。二番目のオペランドがコレクションの場合は、**すべての**一致した要素を取り除きます。

{% capture col-plus-minus %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=col-plus-minus %}

マップの`plus`と`minus`の詳細については、[マップ特有のオペレーション](map-operations.md)を参照ください。
[拡張代入演算子](operator-overloading.md#拡張代入) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) と [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) もコレクションに実装されています。
しかし、読み取り専用コレクションに対してはこれらは実際には`plus`や`minus`演算子を使って、結果を同じ変数に再代入しようとします。
つまり、それらの演算子は`var`の読み取り専用コレクションにしか使えません。
ミュータブルなコレクションの場合、もし`val`だったらばコレクションを直接変更します。
より詳しくは[コレクションの書き込みオペレーション](collection-write.md)を参照ください。