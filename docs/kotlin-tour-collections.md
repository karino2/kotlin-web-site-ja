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
| Lists               | 順番のある要素のコレクション                                            |
| Sets                | ユニーク（一意）で順場の無い要素のコレクション                                   |
| Maps                | キーと値のペアのSets。キーはユニークで、各キーはただ一つの値に関連づけされている  |

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

Maps store items as key-value pairs. You access the value by referencing the key. You can imagine a map like a food menu.
You can find the price (value), by finding the food (key) you want to eat. Maps are useful if you want to look up a value
without using a numbered index, like in a list.

> * Every key in a map must be unique so that Kotlin can understand which value you want to get. 
> * You can have duplicate values in a map.
>
{type="note"}

To create a read-only map ([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)), use the 
[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) function.

To create a mutable map ([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)),
use the [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) function.

When creating maps, Kotlin can infer the type of items stored. To declare the type explicitly, add the types
of the keys and values within angled brackets `<>` after the map declaration. For example: `MutableMap<String, Int>`.
The keys have type `String` and the values have type `Int`.

The easiest way to create maps is to use [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) between each 
key and its related value:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration"}

> To prevent unwanted modifications, obtain read-only views of mutable maps by casting them to `Map`:
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{type="tip"}

To access a value in a map, use the [indexed access operator](operator-overloading.md#indexed-access-operator) `[]` with
its key:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access"}

To get the number of items in a map, use the [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
function:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count"}

To add or remove items from a mutable map, use [`.put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)
and [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) functions respectively:

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.put("coconut", 150) // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190, coconut=150}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove"}

To check if a specific key is already included in a map, use the [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)
function:

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-contains-keys"}

To obtain a collection of the keys or values of a map, use the [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)
and [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) properties respectively:

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-keys-values"}

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) and [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)
> are examples of **properties** of an object. To access the property of an object, write the property name
> after the object appended with a period `.`
>
> Properties are discussed in more detail in the [Classes](kotlin-tour-classes.md) chapter.
> At this point in the tour, you only need to know how to access them.
>
{type="note"}

To check that a key or value is in a map, use the [`in` operator](operator-overloading.md#in-operator):

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in"}

For more information on what you can do with collections, see [Collections](collections-overview.md).

Now that you know about basic types and how to manage collections, it's time to explore the [control flow](kotlin-tour-control-flow.md)
that you can use in your programs.

## Practice

### Exercise 1 {initial-collapse-state="collapsed"}

You have a list of “green” numbers and a list of “red” numbers. Complete the code to print how many numbers there
are in total.

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-1"}

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-collections-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed"}

You have a set of protocols supported by your server. A user requests to use a particular protocol. Complete the program
to check whether the requested protocol is supported or not (`isSupported` must be a Boolean value).

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here 
    println("Support for $requested: $isSupported")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-2"}

<deflist collapsible="true" id="kotlin-tour-collections-exercise-2-hint">
    <def title="Hint">
        Make sure that you check the requested protocol in upper case. You can use the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html"><code>.uppercase()</code></a>
function to help you with this.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-collections-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed"}

Define a map that relates integer numbers from 1 to 3 to their corresponding spelling. Use this map to spell the given 
number.

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-3"}

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-collections-solution-3"}

## Next step

[Control flow](kotlin-tour-control-flow.md)