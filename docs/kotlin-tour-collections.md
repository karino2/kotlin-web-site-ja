---
layout: reference
title: "コレクション（ツアー）"
---
# コレクション（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-done.svg){:width="20" style="display:inline"} [基本型](kotlin-tour-basic-types.md)
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3.svg){:width="20" style="display:inline"} **コレクション**
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-control-flow.html">Control flow</a>
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-functions.html">Functions</a>
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-classes.html">Classes</a>
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} <a href="kotlin-tour-null-safety.html">Null safety</a>

プログラムをする時には、データを何らかの構造を持ったグループにグルーピングして後の処理に備えるのが便利な事がしばしばあります。
Kotlinはまさにこの用途のために、コレクションというものを提供します。

Kotlinはアイテムをグルーピングするのに以下のコレクションが使えます:

| **コレクションの種類** | **説明**                                                         |
|---------------------|-------------------------------------------------------------------------|
| リスト               | 順番のある要素のコレクション                                            |
| セット（集合）         | ユニーク（一意）で順番の無い要素のコレクション                                   |
| マップ               | キーと値のペアのセットのようなもの。キーはユニークで、各キーはただ一つの値に関連づけされている  |

これらの各コレクションに、mutableと読み取り専用（read only）の二種類があります。

## List

Listは要素を追加された順番に保持します。重複した要素も追加出来ます。

読み取り専用リスト　([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))を作るには、
`[listOf()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)` 関数を使います。

mutableなリスト([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))を作るには,
[`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)関数を使います。

リストを作るに際し、Kotlinは格納される要素の型を推論出来ます。
型を明示的に宣言したい時は、リストの宣言のあとに角括弧`<>`で型を指定します。


{% capture kotlin-tour-lists-declaration %}
fun main() { 
//sampleStart
    // 読み取り専用リスト
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutableなリストに明示的な型指定があるケース
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-lists-declaration %}

> 意図せぬ変更をまぎれこませない為に、mutableなリストから、その読み取り専用のviewを作る事が出来ます。それは`List`型変数に代入することで得られます:
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> これはまた、 **キャスト（casting）**とも呼ばれます。
> 
{: .tip}

Listは順番があるコレクションなので、要素にアクセスする時にはそのインデックスを用いた[インデックスアクセスのオペレータ](operator-overloading.md#indexed-access-operator) `[]`を使います:

{% capture kotlin-tour-list-access %}
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("このリストの最初の要素は: ${readOnlyShapes[0]}")
    // このリストの最初の要素は: triangle
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-list-access %}

リストの最初の要素を取り出す時は[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数を、
最後の要素を取り出す時には[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数を使う事が出来ます:

{% capture kotlin-tour-list-first %}
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("このリストの最初の要素は: ${readOnlyShapes.first()}")
    // このリストの最初の要素は: triangle
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-list-first %}

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数は、
> **extension**関数と呼ばれる関数の例にもなっています。あるオブジェクトのextension関数を呼ぶには、オブジェクトの後ろに `.` をつけて、
> その後に関数名をつなげれば呼ぶ事が出来ます。 
> extension関数についてもっと知りたければ、[Extension関数](extensions.md#extension-functions)を参照ください。
> ですがこのツアーを続けていくのに必要な事は、単にそれらをどう呼べば良いかだけです。
> 
{: .note}

リストの中に要素がいくつ入っているかを知るには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
関数を使います:

{% capture kotlin-tour-list-count %}
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("このリストには ${readOnlyShapes.count()}個の要素が入っています。")
    // このリストには 3個の要素が入っています。
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-list-count %}

ある要素がリストの中にあるかどうかを調べるには、[`in` 演算子](operator-overloading.md#in-operator)を使います:

{% capture kotlin-tour-list-in %}
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-list-in %}

mutableなリストに要素を追加するには[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数を、
mutableなリストから要素を削除するには[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使います:

{% capture kotlin-tour-list-add-remove %}
fun main() { 
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // リストに"pentagon"を追加（訳注：ペンタゴンは五角形）
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // 最初に見つかった"pentagon"をリストから削除
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-list-add-remove %}

## Set（集合）

リストが順番があり重複する要素も許すのに対し、セット（Set）は**順序なし（unordered）**なコレクションで、**一意（unique）**な要素だけを格納出来ます。

読み取り専用のセットを作るには、([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))、
[`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)関数を使います。

mutableなセットを作るには、([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/))、
[`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)関数を使います。

セットを作る時には、Kotlinは格納される要素の型を推論します。
型を明示的に宣言したい時は、セットの宣言の後に角括弧`<>`をつけて、その中に型を書きます。

{% capture kotlin-tour-sets-declaration %}
fun main() {
//sampleStart
    // 読み取り専用のセット
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // mutableなセットを明示的な型指定ありで作るケース
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-sets-declaration %}

この例で、セットはユニークな要素だけを保持する事から、重複しているはずの`"cherry"`の重複が除去されています。

> 意図せぬ変更を防ぐために、mutableなセットから読み取り専用のビューをセットにキャストする事で作る事が出来ます:
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{: .tip}

> セットは**順序なし（unordered）**のコレクションなので、特定のインデックスの要素にアクセスする方法はありません。
> 
{: .note}

セットに含まれる要素の数を得るためには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数が使えます:

{% capture kotlin-tour-set-count %}
fun main() { 
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("このセットには ${readOnlyFruit.count()}個の要素が含まれています")
    // このセットには 3個の要素が含まれています
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-set-count %}

ある要素がセットの中にあるかどうかは、[`in` 演算子](operator-overloading.md#in-operator)で知る事が出来ます:

{% capture kotlin-tour-set-in %}
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-set-in %}

mutableなセットに要素を追加するには[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数を、
要素を削除するには[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使います:

{% capture kotlin-tour-set-add-remove %}
fun main() { 
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // "dragonfruit"をセットに追加
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // "dragonfruit"をセットから削除
    println(fruit)              // [apple, banana, cherry]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-set-add-remove %}

## Map

マップはキーと値のペアとして要素を保持するコレクションです。キーを指定する事で対応する値にアクセスする事が出来ます。
マップというのはレストランなどのメニューのようなものと考えると近いかもしれません。
食べたい料理で探すと、対応する価格を知る事が出来ます。
マップは数字のインデックスでは無い何かで値を探したい、という時に便利です。（数字のインデックスならListで良いので）

> * マップのそれぞれのキーはユニークでなくてはいけません。キーがユニークなのでKotlinはあなたが指定したキーでどの値を取り出そうとしているかが判断出来ます。
> * ですが値は重複があっても問題ありません。
>
{: .note}

読み取り専用のマップ([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))を作るには、 
[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)関数を使えば良いです.

mutableなマップ([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))を作りたければ、
[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)関数を使いましょう。

マップを作る時、Kotlinは格納される要素の型を推測してくれる。
もしキーと値の型を指定したいなら、マップの宣言の後に角括弧`<>`を続けて、この角括弧の中にキーと値の型を掛けば良い。
例えば、`MutableMap<String, Int>`のような感じ。この場合キーは`String`型で値は`Int`型となる。

マップをつくる　一番カンタンな方法は、
キーと値の間に[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)を置く、という手法になる：

{% capture kotlin-tour-maps-declaration %}
fun main() {
//sampleStart
    // 読み取り専用のマップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // mutableなマップに明示的な型宣言をつけるケース
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-maps-declaration %}

> 意図せぬ変更を防ぐため、mutableなマップから読み取り専用のビューを、`Map`へのキャストで取得出来る：
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{: .tip}

マップの値にアクセスするためには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator) `[]` にキーを渡せば良い:

{% capture kotlin-tour-maps-access %}
fun main() {
//sampleStart
    // 読み取り専用のマップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("リンゴジュースの値段は: ${readOnlyJuiceMenu["apple"]}")
    // リンゴジュースの値段は: 100
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-maps-access %}

マップの中の要素数を得るためには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使えば良い：

{% capture kotlin-tour-maps-count %}
fun main() {
//sampleStart
    // 読み取り専用のマップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("このマップには${readOnlyJuiceMenu.count()}個のキーと値のペアがある")
    // このマップには3個のキーと値のペアがある
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-maps-count %}

mutableなマップに要素を追加するには[`.put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)関数を使い、
要素を削除するには[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使う：

{% capture kotlin-tour-maps-put-remove %}
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.put("coconut", 150) // キー"coconut"を値150でマップに追加
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

    juiceMenu.remove("orange")    // キー"orange"をマップから削除
    println(juiceMenu)
    // {apple=100, kiwi=190, coconut=150}
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-maps-put-remove %}

あるキーがマップに既に含まれているかを調べるには、[`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)関数を使う：

{% capture kotlin-tour-map-contains-keys %}
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-map-contains-keys %}

キーや値のコレクショを得るには、[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)プロパティや
[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)プロパティを使います：

{% capture kotlin-tour-map-keys-values %}
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-map-keys-values %}

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)と[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)
> は、オブジェクトの **プロパティ（properties）** というものの例となっています。オブジェクトのプロパティにアクセスするには、オブジェクトの後ろに`.`をつけて、
> その後ろにプロパティ名を書けばよろしい。
>
> プロパティについては、[クラス](kotlin-tour-classes.md)の章でより詳細に扱います。
> ツアーのこの時点では、どうやってプロパティにアクセスするかだけ分かっていれば十分です。
>
{: .note}

キーや値がマップにあるかをチェックするには、[`in` 演算子](operator-overloading.md#in-operator)を使います：

{% capture kotlin-tour-map-in %}
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-map-in %}

コレクションについてより詳しい情報を知りたければ、[コレクション](collections-overview.md)を参照ください。

基本型を知り、コレクションをどう管理したらいいかを理解した今、あなたの書くプログラムの中で使える[制御フロー](kotlin-tour-control-flow.md)について学ぶ時が来ました。

## 練習問題

### 練習問題 1


“green”の数字のリストと、“red”の数字のリストがあったとします。
全体でいくつの数字があるかをprintするコードを完成させなさい。


{% capture kotlin-tour-collections-exercise-1 %}
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // ここにコードを書いてね
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-collections-exercise-1 %}

{% capture kotlin-tour-collections-solution-1 %}
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-collections-solution-1 %}

###  練習問題 2

あなたのサーバーがサポートするプロトコルの集合があるとします。
ユーザーは特定のプロトコルを使う、とリクエストする事とします。
リクエストされたプロトコルがサポートされているかどうかをチェックする以下のプログラムを完成させなさい（`isSupported`はBoolean型の値にならなくてはなりません）。


{% capture kotlin-tour-collections-exercise-2 %}
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // ここにコードを書いてね 
    println("Support for $requested: $isSupported")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-collections-exercise-2 %}

{% capture kotlin-tour-collections-exercise-2-hint %}
リクエストされたプロトコルがいつも大文字になるようにしましょう。
その為には[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)関数が助けになるかもしれません。
{% endcapture %}
{% include collapse_quote.html title="ヒント" body=kotlin-tour-collections-exercise-2-hint %}

{% capture kotlin-tour-collections-solution-2 %}
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-collections-solution-2 %}

### 練習問題 3

数字の1から3までと、それに対応した英語のスペリングを持つマップを作成せよ。
このマップを用いて、与えられた数字をスペリングに変更するコードを書け。

{% capture kotlin-tour-collections-exercise-3 %}
fun main() {
    val number2word = // ここにコードを書いてね
    val n = 2
    println("$n is spelt as '${<ここにもコードを書いてね >}'")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-collections-exercise-3 %}

{% capture kotlin-tour-collections-solution-3 %}
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-collections-solution-3 %}

## 次回

[制御フロー](kotlin-tour-control-flow.md)