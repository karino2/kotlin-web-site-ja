---
layout: reference
title: "配列"
---
# 配列

Kotlinでの配列は Array クラスで表され、`get()`と`set()`関数を持ち、`[]`演算子はオーバーロードされていてこの二つの関数の呼び出しにつながっています。
また、`size`プロパティやいくつかの有用なメンバ関数もあります：

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ...
}
```

配列を作るには、`arrayOf()`関数に要素の値を渡してください。
つまり、`arrayOf(1, 2, 3)`は`[1, 2, 3]`の配列を作成します。
あるいは`arrayOfNulls()`関数で、null要素で埋められた指定サイズの配列を作ることができます。

他のやり方として、配列のサイズと配列のインデックス値から要素を生成する関数を引数にとるコンストラクタがあります：

{% capture array-sample %}
fun main() {
//sampleStart
    // ["0", "1", "4", "9", "16"]のArray<String>を作成
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { println(it) }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=array-sample %}

`[]`演算子はメンバ関数の`get()`と`set()`の呼び出しを意味します。

Kotlinの配列は**不変(invariant)**です。つまりKotlinでは`Array<Any>`へ`Array<String>`を代入することができないということを表します。
これは実行時エラーを回避するためです（しかし、`Array<out Any>`を使えば代入できます。[Type Projections](generics.md#type-projections)を参照してください）。

## プリミティブ型の配列

Kotlinはプリミティブ型の配列について、オーバーヘッド無しでボクシングができる特別なクラスを持ちます：（`ByteArray`、`ShortArray`、`IntArray`等）

これらのクラスは`Array`クラスと継承関係を持ちませんが、同じメソッドとプロパティを持ちます。 それぞれのクラスにおいて、対応するファクトリ関数もあります：

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

```kotlin
// intの配列でサイズは5、値は[0, 0, 0, 0, 0]
val arr = IntArray(5)

// 定数で初期化した値を持つ配列の例
// intの配列でサイズは5、値は[42, 42, 42, 42, 42]
val arr = IntArray(5) { 42 }

// 配列の、ラムダ式を使った値の初期化の例
// intの配列でサイズは5、値は [0, 1, 2, 3, 4] (値はインデックスと同じ値に初期化されている)
var arr = IntArray(5) { it * 1 } 
```