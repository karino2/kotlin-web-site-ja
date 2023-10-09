---
layout: reference
title: "コレクションのトランスフォームオペレーション"
---
# コレクションのトランスフォームオペレーション

Kotlinの標準ライブラリは、コレクションの **トランスフォーム（変形）** のための拡張関数を幾つか提供しています。
これらの関数は、既存のコレクションから指定されたルールに従い変形した新しいコレクションを作り出します。
このページでは、提供されているコレクションの変形関数の概要を提示します。

## Map

（訳注：コレクションのマップとは別なので注意）

**マッピング**トランスフォームはあるコレクションの要素に対して関数を適用した結果をもとに新しいコレクションを作り出すものです。
基本的なマッピング関数としては、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)が挙げられます。
これは渡されたラムダ関数を個々の要素に適用して、その結果のリストを返します。
結果の順番は元の要素の順番と同じです。
要素の他に要素のインデックスも使う変形を行いたければ、[`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)を使います。

{% capture trans-map %}
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=trans-map %}

もし変形がある種の要素に対して`null`を生成する場合、`map()`関数の代わりに[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)関数を使う事で、
`null`を結果のコレクションから除外する事が出来ます。
`mapIndexed()`の代わりにも同様に[`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)があります。


{% capture trans-map-notnull %}
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value -> if (idx == 0) null else value * idx })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=trans-map-notnull %}

（コレクションの）マップをトランスフォームする場合は、２つの選択肢があります：
値を変更せずにキーだけをトランスフォームするか、逆にキーを変更せずに値だけをトランスフォームするかです。
キーをトランスフォームしたい場合は [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)を使います。
値をトランスフォームしたい場合は[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html)を使います。
どちらの関数もトランスフォーム関数にはマップのエントリが引数としてやってくるので、キーと値の両方を使って変換を行う事が出来ます。


{% capture trans-map-map %}

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=trans-map-map %}

## Zip

**zip**トランスフォーメーションは２つのコレクションの同じ位置にある要素から、それらのペアを持ったコレクションを作り出します。
Kotlinの標準ライブラリでは、これは[`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html)拡張関数で行う事が出来ます。

コレクションか配列に対してコレクション（か配列）を引数として指定すると、
`zip()`は`Pair`オブジェクトの`List`を返します。（訳注：わかりにくいので後の例を見ると良い）
レシーバのコレクションの要素が、各ペアの最初の方の要素となります。

２つのコレクションのサイズが異なる場合、`zip()`の結果は小さい方のサイズとして生成されます。
長い方の残りの要素は結果には含まれません。

`zip()`関数は中置型（infix）で`a zip b`の形式で使う事も出来ます。

{% capture zip-example %}
fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=zip-example %}

`zip()`に２つのパラメータを持つトランスフォーメーション関数をさらに渡す事も出来ます：
２つのパラメータはレシーバの要素と引数の要素です。
この場合、結果の`List`は、それぞれ同じ位置のレシーバの要素と引数の要素のペアに対して呼ばれた変形関数の結果から作られる`List`となります。

{% capture trans-zip-trans %}

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal -> "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=trans-zip-trans %}

`Pair`の`List`がある場合に、逆の変換、**unzip**する事が出来ます。
つまり、ペアのリストから、２つのバラしたリストを作る訳です：

* 最初のリストは各`Pair`の１つ目の要素からなるリスト
* 二番目のリストはペアの２つ目の要素からなるリスト

ペアのリストをunzipするためには、[`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)関数を呼びます：

{% capture unzip-example %}

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=unzip-example %}

## Associate

**Association（連想、関連付け）**トランスフォーメーションはコレクションの要素から、それに関連づけした値を持つマップを作る。
associationの種類によって、要素は結果のマップのキーの方にも値の方にもなります。

基本的なassociation関数、 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)は、
元のコレクションの要素がキーで、提供されるトランスフォーム関数で生成される結果が値となる`Map`を作りだします。
２つの等しい要素がある場合は、後に来た方だけが結果のマップに残ります。


{% capture associate-example %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=associate-example %}

コレクションの要素を結果のマップの値の方にするものとしては、
 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)関数があります。
`associateBy()`は引数に、要素の値を元にキーを返す関数を取ります。
もし２つの要素に対応するキーの値が等しい場合は、後に来た方だけが結果のマップに残ります。

`associateBy()`はvalueの方を変換する関数（valueTransform）をつけて呼ぶ事も出来ます。

{% capture value-transform %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=value-transform %}

キーと値の両方を渡された関数が生成するようなマップの生成方法としては、
[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)関数があります。
`associate()`は`Pair`を返す関数を引数に取ります。このペアがキーと値として結果のマップのエントリになります。

`associate()`は短寿命の`Pair`オブジェクトを生成するので、パフォーマンスに影響があるかもしれない事に注意しましょう。
だから`associate()`の使用はパフォーマンスが問題にならないか、他の選択肢よりこちらの方が良い場合に限って使うようにしましょう。

後者の例としては、元の要素からキーと値の両方が一緒に作り出されるような場合です。

{% capture assoc-ex %}

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

//sampleStart
    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name -> parseFullName(name).let { it.lastName to it.firstName } })  
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=assoc-ex %}

ここでは要素に変形をする関数をまず適用して、その結果のプロパティからペアを作っています。

## Flatten

ネストしたコレクションを操作している時には、ネストしたコレクションの要素に対するフラットなアクセスを提供する標準ライブラリを便利に使える事があるでしょう。

そのような関数の最初のものは、[`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)です。
この関数はコレクションのコレクション、例えば`Set`の`List`などに呼ぶ事が出来ます。
この関数は、ネストしたコレクションに含まれた全要素を含む単独の`List`を返します。

{% capture flatten-example %}

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=flatten-example %}

他の関数としては[`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html)があります。
これはネストしたコレクションを処理する柔軟な方法を提供します。
`flatMap()`はコレクション要素を別のコレクションに変換する関数を引数に取ります。
結果としては`flatMap()`は単一のリストで、その要素は返された全要素を含むものとなります。
つまり`flatMap()`は`map()`関数（コレクションをコレクションに変換する）を実行したあとに、その結果に`flatten()`を適用する、
というように続けて２つを呼び出したかのように振る舞います。

{% capture flatmap-ex %}

data class StringContainer(val values: List<String>)

fun main() {
//sampleStart
    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })
//sampleEnd
}

{% endcapture %}
{% include kotlin_quote.html body=flatmap-ex %}

## 文字列表現

もしコレクションの内容を人間に読めるようなフォーマットで取り出したいと思うなら、
コレクションを文字列に変形するような関数を使うのが良いでしょう：
[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) と
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)の出番です。

`joinToString()`は渡された引数を元にコレクションの要素達から一つの`String`を組み立てます。
`joinTo()`は同じ事を、渡された[`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html)オブジェクトに結果を追加してく事で行います。

デフォルトの引数で呼ぶと、この関数はコレクションの`toString()`を呼んだのと似たような結果を返します：
要素の文字列表現をカンマとスペースで区切った`String`です。

{% capture join-to-string-sample %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("数字のリスト: ")
    numbers.joinTo(listString)
    println(listString)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=join-to-string-sample %}

カスタムな文字列表現を作りたければ、関数の引数で`separator`, `prefix`, `postfix`を指定する事が出来ます。
結果の文字列は`prefix`で始まり、`postfix`で終わります。
`separator`は最後の要素を除いた各要素のあとに来ます。

{% capture join-to-string-custom1 %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=join-to-string-custom %}

より大きなコレクションに対しては、`limit`を指定したいと思うかもしれません。
これは、結果に含める総数の上限です。
もしコレクションのサイズが`limit`を超えたら、それ以後のすべての要素の代わりに`truncated`引数で指定された値一つに置き換わる事になります。


{% capture join-to-string-limit %}

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=join-to-string-limit %}

最後に、要素自身の表現をカスタマイズしたければ、
`transform`関数を渡す事が出来ます。

{% capture join-to-string-trans %}

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "要素: ${it.uppercase()}"})
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=join-to-string-trans %}
