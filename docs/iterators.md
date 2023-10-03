---
layout: reference
title: "イテレータ"
---
# イテレータ

コレクションの要素を巡回するために、Kotlinの標準ライブラリは良く使われるメカニズムである **イテレータ**をサポートしている。
イテレータとは、コレクションの内部の構造を晒すこと無く、要素へシーケンシャルなアクセスを提供する。
イテレータはコレクションの全要素に対して一つずつ処理をしていく時に便利です。
例えば値をprintしたり、似たような更新を要素に行ったりする、などです。

イテレータは、[`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)インターフェースを継承しているオブジェクトなら、
[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)関数を呼ぶ事で取得する事が出来ます。
`Set`や`List`などは`Iterable<T>`を継承しています。

イテレータを取得したら、イテレータはその時点ではコレクションの最初の要素を指しています。
[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)関数を呼ぶとその要素を返し、
さらにイテレータの位置を次の要素（もし存在すれば）に進めます。

ひとたびイテレータが最後の要素を通過したら、もう要素を取得する事には使えません。
前の位置にリセットする事も出来ません。
もう一度コレクションをイテレートしたければ、新しいイテレータを作らなくてはいけません。


{% capture iterator-sample %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=iterator-sample %}

`Iterable`なコレクションを巡回する別の方法としては、良く知られている`for`ループを使う、というものもあります。
`for`をコレクションに使うと、
暗黙のうちにイテレータを取得します。
だから以下のコードはさきほどのコードと同等です：

{% capture for-loop %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=for-loop %}

最後に、便利な`forEach()`関数というものもあります。
これはコレクションを自動的にイテレートして、各要素に与えられたコードを実行していきます。
だから、これまでと同じ例を以下のようにも書けます：

{% capture foreach-fun %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=foreach-fun %}

## リストのイテレータ

リストには、特別なイテレータの実装があります：[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)です。
これは両方向へのイテレートをサポートしています：前方と後方です。

後方のイテレーションは[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)
と[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html)により実装されています。
さらに、`ListIterator`は要素のインデックスに関する情報を提供しています。
[`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)と[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html)です。


{% capture list-iterator %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    while (listIterator.hasPrevious()) {
        print("インデックス: ${listIterator.previousIndex()}")
        println(", 値: ${listIterator.previous()}")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=list-iterator %}

両方向にイテレート出来る能力があるので、`ListIterator`は最後の要素まで到達した後にも使う事が出来ます。

## ミュータブルなイテレータ

ミュータブルなコレクションをイテレートする場合、
`Iterator`を継承した[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)があります。
これは要素を削除する[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)関数があります。
これにより、コレクションをイテレートしつつ要素を削除する事が出来ます。

{% capture mutable-iterator %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-iterator %}

要素の削除に加えて、[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)
は挿入と置き換えもサポートしています。

{% capture mutable-iterator-add-set %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four") 
    val mutableListIterator = numbers.listIterator()
    
    mutableListIterator.next()
    mutableListIterator.add("two")
    mutableListIterator.next()
    mutableListIterator.set("three")   
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-iterator-add-set %}