---
layout: reference
title: "コレクションを作る"
---
# コレクションを作る


## 要素から作る

コレクションを作る一番普通のやり方は、標準ライブラリの関数[`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)を使う方法です。
コレクションの要素をカンマで区切って引数に与えると、コンパイラが要素の型を自動で検出してくれます。
空のコレクションを作りたい時は型を明示的に指定します。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

マップの同様の関数もあって、[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)と[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)です。
マップのキーと値を`Pair`のオブジェクトとして渡します（通常は`to`中置関数を使って作る）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

`to`記法は短寿命の`Pair`オブジェクトを作る事に注意。
だからパフォーマンスがクリティカルでない所でのみ使う事をオススメします。
メモリの過剰使用を避けるためには、別の手段を使いましょう。
例えば、ミュータブルなマップを作って書き込みオペレーションで作るとか。
[`apply()`](scope-functions.md#apply)関数はこの手の初期化を流暢に書く助けとなります。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## コレクションビルダー関数で作る

コレクションを作る別の方法としては、ビルダー関数を呼ぶ、というのがあります。
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)、
[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)などです。
それらは新たに対応する型のミュータブルなコレクションを作って、[書き込みオペレーション](collection-write.md)でデータを生成し、
最後に同じ要素を含んだ読み取り専用のコレクションを返します。

```kotlin
val map = buildMap { // this は MutableMap<String, Int>。キーと値の型は以下の`put()`呼び出しから推論される
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空のコレクション

要素無しでコレクションを作る関数もある。
 [`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html)、
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)です。
空のコレクションを作る時には、コレクションが保持する要素の型を指定する必要があります。

```kotlin
val empty = emptyList<String>()
```

## リスト用の初期化関数

リストには、リストのサイズと初期化関数を取るコンストラクタのような関数があります。
初期化関数はインデックスを元に要素の値を決めます。

{% capture collection-initializer %}
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // もしあとで中身を変更したければMutableListにする
    println(doubled)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=collection-initializer %}

## 具体的な型のコンストラクタ

具体的な型のコレクション、`ArrayList` や `LinkedList` などを直接作りたければ、
これらの型が提供しているコンストラクタを使う事が出来ます。
`Set`や`Map`にも似たようなコンストラクタの実装があります。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## コピー

既存のコレクションと同じ要素のコレクションを作りたければ、コピー関数を使う事が出来ます。
標準ライブラリのコレクションのコピー関数は、コレクションの**シャロー**コピーを作ります。
つまり、同じ要素を指すコレクションとなります。
つまり、コレクションの要素に行った変更はすべてのコピーされたコレクションに反映されます。


[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html)やそのほかのコレクションコピー関数は、
その時点でのコレクションのスナップショットを作ります。
元となるコレクションに要素を追加したり削除したりしても、コピーされたコレクションには影響ありません。
コピーされたコレクションはコピー元とは独立に変更され得るものです。


{% capture copy-snapshot %}
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("最初の要素の名前: 元の方は ${sourceList[0].name}、コピーの方は ${copyList[0].name}")
    println("リストのサイズ: 元の方は ${sourceList.size}、コピーの方は ${copyList.size}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=copy-snapshot %}

これらの関数はコレクションを別の種類のコレクションに変換するのにも使う事が出来ます。
リストからセットを作ったり、その反対を行ったり出来ます。

{% capture collection-conversion %}
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=collection-conversion %}

代わりに、同じコレクションのインスタンスに対する新しい参照を作る事も出来ます。
新しい参照はコレクション変数を既存のコレクションで初期化すると作られます。
参照を通してコレクションのインスタンスが変更されると、全ての参照に変更は波及します。

{% capture collection-reference %}
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("元のサイズ: ${sourceList.size}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=collection-reference %}

コレクションによる初期化はミュータビリティを制限するのにも使えます。
例えば、`MutableList`を指す`List`型の参照を作れば、
その参照を通してコレクションを変更しようとすると、コンパイラはエラーを生成してくれます。

{% capture immutable-reference %}
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //コンパイルエラー
    sourceList.add(4)
    println(referenceList) // sourceListの現在の状態を表示
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=immutable-reference %}

## 別のコレクションの関数を呼び出して

コレクションは別のコレクションに対するいろいろなオペレーションの結果生成される事もある。
例えば、[フィルタリング](collection-filtering.md)はフィルターにマッチする要素を集めたリストを作る：

{% capture list-filter %}
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=list-filter %}

[map](collection-transformations.md#map)はトランスフォーム（変形）した結果からなるリストを作り出す：

{% capture list-map %}
fun main() {
//sampleStart 
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=list-map %}

[アソシエーション](collection-transformations.md#associate)はマップを生成する:

{% capture association-map %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=association-map %}

Kotlinにおけるコレクションに対するオペレーションについてもっと知りたければ、[コレクションのオペレーション概要](collection-operations.md)を参照されたし。
