---
layout: reference
title: "コレクションの書き込みオペレーション"
---
# コレクションの書き込みオペレーション

[ミュータブルなコレクション](collections-overview.md#コレクションの種類)はコレクションの中身を変更するオペレーションをサポートしています、
例えば要素の追加や削除などの事です。
このページでは、`MutableCollection`のすべての実装で使用可能な書き込みオペレーションについて説明します。
`List`や`Map`専用のオペレーションについては、[リスト特有のオペレーション](list-operations.md) と [マップ特有のオペレーション](map-operations.md)をそれぞれ参照ください。

## 要素の追加

リストやセットに要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数を使います。指定したオブジェクトはコレクションの最後に追加されます。

{% capture add-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=add-ex %}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)は引数のオブジェクトの各要素をリストまたはセットに追加します。その引数は`Iterable`、`Sequence`、`Array`のどれかです。
レシーバと引数の型は違っても構いません。例えば`Set`の要素をすべて`List`に追加する、という事が出来ます。

リストに対して`addAll()`を呼ぶと、新しく追加される要素は、引数に入ってきたのと同じ順番で追加されます。
`addAll()`に要素の場所を指定する引数を最初に追加して呼ぶ事も出来ます。
引数のコレクションの最初の要素がこの位置に挿入されます。
引数のコレクションのそれ以外の要素がこの後に続き、レシーバの要素は終端側にシフトします。

{% capture add-all-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=add-all-ex %}

インプレース版の [`plus` 演算子](collection-plus-minus.md) - [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)
を使う事で、も要素を追加する事が出来ます。
 ミュータブルなコレクションに適用すると、`+=` は二番目のオペランド（要素か別のコレクションのどちらか）をコレクションのお尻に追加します。


{% capture plus-assign-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=plus-assign-ex %}

## 要素の削除

ミュータブルなコレクションから要素を削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使います。
`remove()`は要素の値を引数にとって、この値に一致する１つ目を削除します。

{% capture remove-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 最初の`3`を削除
    println(numbers)
    numbers.remove(5)                    // 何も削除しない
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=remove-ex %}

複数の要素を一括で削除したければ、以下の関数があります：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)は引数のコレクションに存在する要素をすべて削除します。
   引数はコレクションの代わりに、述語を引数にする事も出来ます。この場合は、述語が`true`を返すすべての要素を削除します。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)は`removeAll()`のちょうど反対になります：引数のコレクションに存在する要素以外のすべてを削除します。
   述語で呼ぶと、述語にマッチする要素だけを残します。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html)はリストから全ての要素を削除して、空にします。

{% capture remove-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=remove-ex %}

コレクションから要素を削除する別の方法としては、
[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子を使うというものがあります。
これはインプレース版の[`minus`](collection-plus-minus.md)演算子です。 
二番目の引数は要素の型と同じ型の単一のインスタンスでも良いですし、別のコレクションでも構いません。
右辺に単一のインスタンスが来る場合、`-=` は**最初に**一致した要素を削除します。
一方、コレクションが来る場合は、**すべての**一致する要素を削除します。
例えば、リストが重複する要素を保持している場合、それらが一度に全部削除されます。
二番目のオペランドはコレクションに無い要素が入っていても構いません。
そのような要素はオペレーションの結果には影響を与えません。

{% capture minus-assign-ex %}

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 上と同じ事をする
    println(numbers)    
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=minus-assign-ex %}

## 要素の更新

リストとマップは要素の更新のオペレーションも提供しています。
それらに関しては[リスト特有のオペレーション](list-operations.md) と [マップ特有のオペレーション](map-operations.md)に説明があります。
セットに関しては、更新というのは成立しません、なぜならそれは単に要素を削除して別の要素を追加している事になってしまうからです。
