---
layout: reference
title: "コレクション概要"
---
# コレクション概要

Kotlinの標準ライブラリは *コレクション* を管理する為の十分な仕組みを提供しています。
コレクションとは、要素数が可変（0の場合もある）の要素のグループで、
解決したい問題に重要で良く使われるものです。

コレクションはほとんどのプログラム言語において共通の概念なので、
もしJavaとかPythonといった他の言語のコレクションに良く慣れ親しんでいるのなら、
このイントロダクションはスキップして先に続く各詳細に関してのセクションに進んでしまって良いでしょう。

コレクションは通常、同じ型のたくさんのオブジェクト（0個の場合もあるけれど）を保持します。
コレクションの中のオブジェクトは*要素*とか*アイテム*と呼ばれます。
例えば、学部の生徒全員、などはコレクションを形成し、
そのコレクションを使って平均の年齢を計算したり出来ます。

Kotlinでは、以下のコレクションの型が関連しています：

* **リスト** 順番のある要素のコレクションで要素にインデックスでアクセスする - インデックスとはその位置を表す整数値
リストには同じ要素が複数回現れ得る。リストの例としては電話番号などが考えられる。電話番号は数字のグループで、順番が大切で、同じ番号が出てくる場合がある。
* **セット** ユニークな要素のコレクション。数学の集合（セット）と対応した概念。同じオブジェクトが繰り返し出てくる事が無い、オブジェクトのグループ。
一般的に、セットの要素の順番は重要では無い。例えば（訳注：10枚組とかの）宝くじの番号などはセットを形成する。
それらの番号はユニークで、（くじの）順番は重要では無い。
* **マップ** (または **辞書** ) キーと値のペアの集まり。キーはユニークで、各キーはちょうど一つの値に対応(map)している。
値は重複していても良い。マップはオブジェクト間の論理的なつながりを格納するのに便利。
例えば社員IDとその役職など。

Kotlinではコレクションの操作を、格納されているオブジェクトの型によらず同一のやり方で行えます。
言い換えると、`String`を`String`のリストに追加するのと同じように、`Int`を`Int`のリストに追加出来るし、
`Int`をユーザー定義のクラスに置き換えても同様です。
つまり、Kotlinの標準ライブラリはコレクションを作成、生成、管理するのに、
ジェネリックなインターフェース、クラス、関数を提供していると言えます。

コレクションのインターフェースや関連する関数などは
`kotlin.collections`パッケージに置かれています。

その中身の概要を見ていきましょう。

> 配列はコレクションの型ではありません。詳細は[配列](arrays.md)を見てください。
>
{: .note}

## コレクションの種類

Kotlinの標準ライブラリは基本的な種類のコレクションの実装を提供します： セット、リスト、マップです。
1ペアのインターフェースが各種類のコレクションを表します：

* **読み取り専用**インターフェース：コレクションの要素へのアクセスを提供する
* **ミュータブル**インターフェース：**読み取り専用**のインターフェースを継承してさらに書き込みオペレーションを追加する： 要素の追加、削除、更新など

ミュータブルなコレクションの中身を変更するために、[`var`](basic-syntax.md#変数)である必要は無い事には注意が必要です。
書き込みオペレーションは同じミュータブルなコレクションのオブジェクトを変更するだけなので、
リファレンスは変わりません。
`val`のコレクションに再代入しようとすればコンパイルエラーにはなりますが。


{% capture mutable-val %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // これはOK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // コンパイルエラー
//sampleEnd

}
{% endcapture %}
{% include kotlin_quote.html body=mutable-val %}

読み取り専用コレクションは[共変](generics.md#分散)です。
それの意味する所は、`Shape`を継承した`Rectangle`クラスがあれば、
`List<Shape>`を要求するすべての場所で`List<Rectanble>`が使える、という事です。
言い換えると、コレクションの型は要素の型と同じ型継承関係となる、という事です。
マップは値の型に対して共変ですが、キーの型についてはそうではありません。

一方、ミュータブルなコレクションは共変ではありません： もしそうなら、実行時失敗を起こしてしまいますから。
もし`MutableList<Rectangle>`が`MutableList<Shape>`のサブタイプなら、
そのほかの`Shape`（例えば`Circle`とか）を挿入出来てしまい、
`Rectangle`という型引数に違反する事になってしまいます。


以下はKotlinのコレクションのインターフェースのダイアグラムです：

<img src="images/collections-diagram.png" alt="Collection interfaces hierarchy" width="500">

インターフェースとその実装をウォークスルーしていきましょう。
`Collection`について学ぶなら、以下のセクションを読んで見てください。
`List`、`Set`、`Map`について学ぶなら、それぞれのセクションを読むか、Kotlin Developer AdvocateのSebastian Aignerの以下の動画を見ると良いでしょう：

<iframe width="560" height="315" src="https://www.youtube.com/embed/F8jj7e-_jFA?si=o41RgVf6l7ivGuym" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)はコレクションの継承階層のルートに位置します。
このインターフェースは読み取り専用コレクションに共通な振る舞いを表します：サイズの取得、特定の要素が入っているかのチェック、などなどです。
`Collection`は`Iterable<T>`を継承しています。`Iterable<T>`は要素のイテレーションのオペレーションを定義するインターフェースです。
異なる種類のコレクションを同時に引き受けるようなパラメータの型として`Collection`型を使う事が出来ます。
より具体的な場合なら、
`Collection`の継承先を使うと良いでしょう：
[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)
 と [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)です。
 
 {% capture collection-type %}
fun printAll(strings: Collection<String>) {
    for(s in strings) print("$s ")
    println()
}
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
{% endcapture %}
{% include kotlin_quote.html body=collection-type %}

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)
は、`Collection`に書き込みオペレーションを追加したものです：書き込みというのは`add`とか`remove`などです。

{% capture mutable-collection %}
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-collection %}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)は要素を指定された順番に格納して、
その要素へのインデックスによるアクセスを提供します。
インデックスは0から始まり（0は最初の要素を指します）、`lastIndex`までにわたります。`lastIndex`は`(list.size-1)`です。

{% capture list-sample %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("要素の数: ${numbers.size}")
    println("3番目の要素: ${numbers.get(2)}")
    println("4番目の要素: ${numbers[3]}")
    println("要素 \"two\" のインデックス ${numbers.indexOf("two")}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=list-sample %}

リストの要素は（nullも含め）、重複しえます。
リストは等しいオブジェクトをいくらでも保持する事が出来るし、
一つのオブジェクトが何度も現れても問題ありません。
二つのリストは、サイズが同じで各位置にある要素が[structurally equal](equality.md#structural-equality)ならイコールだとみなされます。

{% capture list-equal %}
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=list-equal %}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)は`List`に、
さらにリスト固有の書き込みオペレーション、例えば特定の位置に要素を足したり特定の位置の要素を削除したり、といったものを追加したものです。

{% capture mutable-list %}
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-list %}

見ての通り、リストは幾つかの点でとても配列に似ています。
しかし、一つ重要な違いがあります： 配列のサイズは初期化の時点で決まり、決して変わりません。
一方、リストは最初に決められたサイズはありません。
リストのサイズは書き込みオペレーション、つまり要素を追加したり更新したり削除したりする事に伴って変わっていきます。


Kotlinでは、`MutableList`のデフォルトの実装は[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)で、
これはサイズ変更可能な配列のようなものとみなせるでしょう。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)はユニークな要素を格納します。
順番は一般的には定義されません。`null`要素もユニークです：
`Set`はたかだか一つしか`null`を含む事が出来ません。
二つのセットは、サイズが等しく、片方のセットの各要素が、それと等しい要素をもう一方のセットに持つならイコールだとみなされます。

{% capture set-sample %}
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("要素の数: ${numbers.size}")
    if (numbers.contains(1)) println("1はセットに含まれている")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("これらのセットは等しい: ${numbers == numbersBackwards}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=set-sample %}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)は`Set`に`MutableCollection`の書き込みオペレーションを加えたものです。

`MutableSet`のデフォルトの実装は[`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)です。
これは要素の挿入の順番を保存します。
だから順番に依存するような関数、`first()` とか `last()`も、
予測可能な結果を返します。

{% capture linked-hash-aset %}
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSetがデフォルトの実装
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=linked-hash-aset %}

それとは代替的な実装としては、[`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)があります。
こちらは要素の順番には何も保証していません。
このコレクションに対してさきほどのような関数を呼んでも、
結果は予測不能です。
しかしながら`HashSet`の方が同じ数の要素を格納するのに少ないメモリで済みます。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)は`Collection`を継承していません。
しかしこれもKotlinのコレクションの一種です。
`Map`は**キーと値**のペア（**エントリ**とも言う）を格納します。
キーはユニークですが、異なるキーが同じ値を指しても構いません。
`Map`インターフェースは`Map`固有の関数、例えばキーによる値へのアクセスやキーの検索や値の検索など、を提供します。

{% capture map-example %}
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("全部のキー: ${numbersMap.keys}")
    println("全部の値: ${numbersMap.values}")
    if ("key2" in numbersMap) println("\"key2\"の値は: ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("値 1 はマップに有り")
    if (numbersMap.containsValue(1)) println("値 1 はマップに有り") // 前と同様
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=map-example %}

同じペアからなるマップは、順番がどうであれイコールと見なされます。

{% capture map-equal %}
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("マップは等しい: ${numbersMap == anotherMap}")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=map-equal %}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)は`Map`にマップの書き込みオペレーションを加えたものです。
書き込みオペレーションは新しい キーと値のペアを追加したり、あるキーに関連付けされた値を更新したり、などです。

{% capture mutable-map %}
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-map %}

`MutableMap`のデフォルトの実装は[`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)です。
これはマップをイテレートする時に挿入した順番を保ちます。
一方、その代替的な実装である [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)は要素の順番について何も規定していません。