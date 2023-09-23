---
layout: reference
title: "数値"
---
# 数値

## 整数型

Kotlinは数値を扱ういくつかのビルドイン型を提供しています。
整数の数値に対しては、4つの型があり、それらはサイズと、その結果として値の範囲が異なります：

| 型	 |サイズ (bits)| 最小値| 最大値|
|--------|-----------|----------|--------- |
| `Byte`	 | 8         |-128      |127       |
| `Short`	 | 16        |-32768    |32767     |
| `Int`	 | 32        |-2,147,483,648 (-2<sup>31</sup>)| 2,147,483,647 (2<sup>31</sup> - 1)|
| `Long`	 | 64        |-9,223,372,036,854,775,808 (-2<sup>63</sup>)|9,223,372,036,854,775,807 (2<sup>63</sup> - 1)|

When you initialize a variable with no explicit type specification, the compiler automatically infers the type with the 
smallest range enough to represent the value starting from `Int`. If it is not exceeding the range of `Int`, the type is `Int`.
If it exceeds, the type is `Long`. To specify the `Long` value explicitly, append the suffix `L` to the value. 
Explicit type specification triggers the compiler to check the value not to exceed the range of the specified type.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

> In addition to integer types, Kotlin also provides unsigned integer types. For more information, see [Unsigned integer types](unsigned-integer-types.md).
>
{type="tip"}

## Floating-point types

For real numbers, Kotlin provides floating-point types `Float` and `Double` that adhere to the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754).
`Float` reflects the IEEE 754 _single precision_, while `Double` reflects _double precision_.

These types differ in their size and provide storage for floating-point numbers with different precision:

| Type	 |Size (bits)|Significant bits|Exponent bits|Decimal digits|
|--------|-----------|--------------- |-------------|--------------|
| `Float`	 | 32        |24              |8            |6-7            |
| `Double` | 64        |53              |11           |15-16          |    

You can initialize `Double` and `Float` variables  with numbers having a fractional part.
It's separated from the integer part by a period (`.`)
For variables initialized with fractional numbers, the compiler infers the `Double` type:

```kotlin
val pi = 3.14 // Double
// val one: Double = 1 // Error: type mismatch
val oneDouble = 1.0 // Double
```

To explicitly specify the `Float` type for a value, add the suffix `f` or `F`.
If such a value contains more than 6-7 decimal digits, it will be rounded:

```kotlin
val e = 2.7182818284 // Double
val eFloat = 2.7182818284f // Float, actual value is 2.7182817
```

Unlike some other languages, there are no implicit widening conversions for numbers in Kotlin.
For example, a function with a `Double` parameter can be called only on `Double` values, but not `Float`,
`Int`, or other numeric values:

```kotlin
fun main() {
    fun printDouble(d: Double) { print(d) }

    val i = 1    
    val d = 1.0
    val f = 1.0f 

    printDouble(d)
//    printDouble(i) // Error: Type mismatch
//    printDouble(f) // Error: Type mismatch
}
```

To convert numeric values to different types, use [explicit conversions](#explicit-number-conversions).

## 数値のリテラル定数

整数値のためのリテラル定数は、次の種類があります：

There are the following kinds of literal constants for integral values:

* 数値: `123`
* Long型の数を表すには大文字の`L`を末尾につける: `123L`
* 16進数: `0x0F`
* 2進数: `0b00001011`


> Kotlinでは8進数のリテラルはサポートされていません。
>
{: .note}

Kotlinは従来の浮動小数点数の表記法もサポートしています：

* デフォルトではdouble型: `123.5`, `123.5e10`
* float型を表すには `f` or `F` でタグ付けする: `123.5f` 

読みやすくするために、定数の数値を作るのにアンダースコアを混ぜる事も出来ます：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

> 符号無し整数リテラルにも特別なタグがあります。
> 詳細は[符号なし整数型のリテラル](unsigned-integer-types.md)を参照ください。
> 
{: .tip}

## 数値のJVM上での表現

Javaプラットフォームでは、JVMプリミティブ型、つまり`int`や`double`として数値が物理的に格納されています。
そうで無くなるのは、null許容型な数値の参照（例：`Int?`）やジェネリクスが関与している場合です。
そうしたケースでは数値はJavaの`Integer`クラスや`Double`クラスなどにボクシングされています。

同じ数値のNullableなリファレンスは、別のオブジェクトを参照する場合がありえます：

{% capture nullable-number-identify %}
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedA === anotherBoxedA) // true
    println(boxedB === anotherBoxedB) // false
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=nullable-number-identify %}

`a`についてのすべてのnullableなリファレンスは、実際にはすべて同じオブジェクトを指します。
これはJVMが`Integer`のうち`-128`から`127`の数値には特別な最適化を施すためです。
これは`b`には適用されない為、nullableリファレンスはそれぞれ違うオブジェクトを指します。

一方、`==`では同一と判定されます：

{% capture nullable-number-equivalent %}
fun main() {
//sampleStart
    val b: Int = 10000
    println(b == b) // 'true'を出力する
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    println(boxedB == anotherBoxedB) // 'true'を出力する
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=nullable-number-equivalent %}

## 数値の明示的な変換

異なる表現であるため、小さな型は大きな型の**サブタイプではありません**。 もし仮にそうであったならば、次の種類の悩みを抱えたでしょう：

```kotlin
// 仮説のコードであり、実際はコンパイルできません：
val a: Int? = 1 // ボクシングされたInt型 (java.lang.Integer)
val b: Long? = a // 暗黙の変換がLong型 (java.lang.Long)へのボクシングを引き起こします
print(a == b) // 仰天！これはLong型のequals()チェックで他の部分がLong型になるのと同等に "false" を出力します
```

つまり、同一性だけでなくequalityでさえも何も言わずに失われたのです。

その結果、小さな型は、大きな型に**暗黙的に変換される事はありません。**これは明示的変換無しで`Byte`型の値を`Int`型へ代入することができないことを意味します。

{% capture number-no-implicit-cast %}
fun main() {
//sampleStart
    val b: Byte = 1 // OK, リテラルは静的にチェックされています
    // val i: Int = b // ERROR
    val i1: Int = b.toInt()
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=number-no-implicit-cast %}

すべての数値型は、他の型への変換をサポートします：
* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

多くの場合、明示的変換の必要はありません。
なぜなら型は文脈から推測され、算術演算が適切にオーバロードされていてそこで必要な変換がされるからです。例えば：


```kotlin
val l = 1L + 3 // Long + Int => Long
```

## 数値に対する演算

Kotlinは数値に対する標準的な算術計算は一通りサポートしています：  `+`, `-`, `*`, `/`, `%` など。
それらは適切なクラスのメンバとして宣言されています：

{% capture number-arithmetic %}
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=number-arithmetic %}

カスタムなクラスでも、これらの演算子をオーバーロードする事が出来ます。
[演算子のオーバーロード](operator-overloading.html)を参照してください。


### 整数の割り算

二つの整数型の間の割り算の結果は、必ず整数型になります。端数は切り捨てられます。

{% capture number-int-div %}
fun main() {
//sampleStart
    val x = 5 / 2
    //println(x == 2.5) // ERROR: '==' 演算子は 'Int' と 'Double'の組み合わせに対しては適用出来ない
    println(x == 2)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=number-int-div %}

これはどの二つの整数型の間の割り算でも適用されます：

{% capture number-int-long-div %}
fun main() {
//sampleStart
    val x = 5L / 2
    println(x == 2L)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=number-int-long-div %}

浮動小数点型の結果がほしければ、引数のどちらかを明示的に浮動小数点型に変換する必要があります：

{% capture number-int-div-as-double %}
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=number-int-div-as-double %}

### Bitwise operations

Kotlinは、整数値に対する一通りの**ビット演算（bitwise operations）**を提供します。
それらの演算は数値の内部表現レベルでビットに直接演算を行います。
ビット演算は中置形で呼ぶ事の出来る関数として表されます。
それらは`Int`と`Long`にしかありません：

```kotlin
val x = (1 shl 2) and 0x000FF000
```

これらはビット演算の全リストです：

* `shl(bits)` – 符号付き左シフト
* `shr(bits)` – 符号付き右シフト
* `ushr(bits)` – 符号無し右シフト
* `and(bits)` – ビット演算の**AND**
* `or(bits)` – ビット演算の**OR**
* `xor(bits)` – ビット演算の**XOR**
* `inv()` – 各ビットを反転


### Floating-point numbers comparison

The operations on floating-point numbers discussed in this section are:

* Equality checks: `a == b` and `a != b`
* Comparison operators: `a < b`, `a > b`, `a <= b`, `a >= b`
* Range instantiation and range checks: `a..b`, `x in a..b`, `x !in a..b`

When the operands `a` and `b` are statically known to be `Float` or `Double` or their nullable counterparts (the type is
declared or inferred or is a result of a [smart cast](typecasts.md#smart-casts)), the operations on the
numbers and the range that they form follow the [IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754).

However, to support generic use cases and provide total ordering, the behavior is different for operands that are **not**
statically typed as floating-point numbers. For example, `Any`, `Comparable<...>`, or `Collection<T>` types. In this case, the 
operations use the `equals` and `compareTo` implementations for `Float` and `Double`. As a result:

* `NaN` is considered equal to itself
* `NaN` is considered greater than any other element including `POSITIVE_INFINITY`
* `-0.0` is considered less than `0.0`

Here is an example that shows the difference in behavior between operands statically typed as floating-point numbers 
(`Double.NaN`) and operands **not** statically typed as floating-point numbers (`listOf(T)`).

```kotlin
fun main() {
    //sampleStart
    println(Double.NaN == Double.NaN)                 // false
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true
    
    println(0.0 == -0.0)                              // true
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}