---
layout: reference
title: "分解宣言 （destructuring declaration）"
---
# 分解宣言 （destructuring declaration）

時々、オブジェクトを複数の変数に*分解(destructure)*すると便利な事があります。
例えば：

```kotlin
val (name, age) = person 
```

このシンタックスは*分解宣言（destructuring declaration）*と呼ばれています。
分解宣言は複数の変数を一度に作ります。
二つの新しい変数、 `name` と `age` を宣言していて、それぞれ独立に使う事が出来ます。

 ```kotlin
println(name)
println(age)
```

分解宣言は以下のコードにコンパイルされます：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` と `component2()` はKotlin言語全体で広く見られる、*コンベンション原則（principle of conventions）*の一例です。
(`+`や`*`といったオペレータ、`for`ループなどを見よ)。
必要とされるcomponent関数を呼ぶ事が出来る対象ならなんでも分解宣言の右辺に来る事が出来ます。
なお、もちろん`component3()`とか`component4()`などもあります。


> 分解宣言で使う為には、`componentN()`関数は`operator`キーワードでマークする必要があります。
>
{: .note}

分解宣言は`for`ループでも機能します：

```kotlin
for ((a, b) in collection) { ... }
```

変数`a`と`b`は、collectionの要素に対して`component1()`と`component2()`を呼び出した結果が入る事になります。

## 例： 関数から値を二つ返す

関数から二つの値を返したい場合を考えてみます ー 例えば結果のオブジェクトと何らかのステータスとか。
Kotlinでこれを行うコンパクトな方法としては、[データクラス](data-classes.md)を宣言してそのインスタンスを返す、というものです：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // なにか計算
    
    return Result(result, status)
}

// この関数をこんな風に使う:
val (result, status) = function(...)
```

データクラスは自動的に`componentN()`関数を生成してくれるので、分解宣言が使えます。

> 標準のクラス`Pair`を使って`function()`から`Pair<Int, Status>`をreturnするという事も出来ますが、
> データにちゃんと名前をつける方が多くの場合はベターでしょう
>
{: .note}

## 例： 分解宣言とマップ

マップを一番良い感じに巡回する方法としては、たぶん以下みたいなものでしょう：

```kotlin
for ((key, value) in map) {
   // keyとvalueを使ってなにかをする
}
```

このように出来るためには、以下の二つを満たしている必要があります：

* `iterator()`関数を提供する事で、mapを値の列として見せる
* 個々の要素が、`component1()` と `component2()` を提供する事でペアとして見せる

そしてまさに、標準ライブラリはこのような拡張を提供しています：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

だから、`for`ループとマップを使う時は自由に分解宣言が使えます（データクラスのインスタンスのコレクションなどと似たような感じで）。

## 使わない変数にはアンダースコア

分解宣言の中に不要な変数があったら、変数名の代わりにアンダースコアを置く事が出来ます：

```kotlin
val (_, status) = getResult()
```

このようにしてスキップされた要素には、`componentN()`オペレータ関数は呼ばれません。


## ラムダでのdestructuring

ラムダのパラメータに分解宣言のシンタックスを使う事が出来ます。
ラムダのパラメータが`Pair`型（または`Map.Entry`とかとにかく適切な`componentN`関数を持つものならなんでも）の時、
それに対応した一つのパラメータとせずにカッコでくくって複数のパラメータにする事が出来ます：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

二つのパラメータを宣言するのと、一つのパラメータの代わりに分解宣言でペアを宣言する事の違いに注目してください：

```kotlin
{ a -> ... } // 1 パラメータ
{ a, b -> ... } // 2 パラメータ
{ (a, b) -> ... } // 分解されたペア
{ (a, b), c -> ... } // 分解されたペアともうひとつのパラメータ
```

分解宣言のパラメータの一部を使わない時は、
アンダースコアを使ってわざわざ変数の名前を編み出す手間を省く事が出来ます：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

分割されるパラメータ全体に型をつける事も、個々の構成要素に別々に型をつける事も出来ます：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```

