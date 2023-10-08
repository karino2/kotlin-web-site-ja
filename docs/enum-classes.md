---
layout: reference
title: "列挙型クラス  (Enum Classes)"
---
# 列挙型クラス (Enum Classes)

<!--original
# Enum Classes
-->

列挙型クラスの最も基本的な使用法は、型安全な列挙型を実装するのに使うというものです：

<!--original
The most basic usage of enum classes is implementing type-safe enums
-->

``` kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

<!--original
``` kotlin
enum class Direction {
  NORTH, SOUTH, WEST, EAST
}
```
-->

各列挙型の定数はオブジェクトです。列挙型定数はカンマで区切られます。

<!--original
Each enum constant is an object. Enum constants are separated with commas.
-->

個々の列挙型定数が列挙型クラスのインスタンスな事から、以下のように初期化する事も出来ます：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 無名クラス

<!--original
## Anonymous Classes
-->

列挙型定数は、独自の無名クラスを宣言することができ、
それらにメソッド、基底クラスのメソッドのオーバーライドも同様に併せて宣言できます：


<!--original
Enum constants can declare their own anonymous classes with their corresponding methods, as well as with overriding base
methods.
-->

``` kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

<!--original
``` kotlin
enum class ProtocolState {
  WAITING {
    override fun signal() = TALKING
  },

  TALKING {
    override fun signal() = WAITING
  };

  abstract fun signal(): ProtocolState
}
```
-->

列挙型クラスでメンバが定義されている場合は、
列挙型 定数定義とメンバ定義の間をセミコロンで区切る必要があります。

<!--original
If the enum class defines any members, separate the constant definitions from the member definitions with a semicolon.
-->

## 列挙型クラスでのインターフェースの実装

列挙型クラスはインターフェースを実装する事が出来ます（けれどクラスを継承する事は出来ません）。
その場合、全てのエントリに共通の実装を提供する事も出来ますし、
個々のエントリをその無名クラスで別々に提供する事も出来ます。
これは実装したいインターフェースを列挙型の宣言に以下のように追加する事で行なえます：

{% capture enum-interface %}
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.values()) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
{% endcapture %}
{% include kotlin_quote.html body=enum-interface %}

列挙型はすべて[Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)インターフェースをデフォルトで実装しています。
列挙型で定義される列挙型定数は自然な順番（natual order）で定義されます。
より詳細な情報は[並べ替え](collection-ordering.md)を参照ください。

## 列挙型定数を使用した作業

<!--original
## Working with Enum Constants
-->

Kotlinの列挙型クラスは、定義された列挙型定数を羅列したり、その名前で列挙型定数を得ることを可能にするメソッドを自動で持っています。
（列挙型クラスの名前を `EnumClass` と仮定して）これらのメソッドのシグネチャは次のとおりです。

<!--original
Just like in Java, enum classes in Kotlin have synthetic methods allowing to list
the defined enum constants and to get an enum constant by its name. The signatures
of these methods are as follows (assuming the name of the enum class is `EnumClass`):
-->

``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

<!--original
``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```
-->

以下はこれらのメソッドの使い方の例です：

{% capture enum-synthesize %}
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.values()) println(color.toString()) // RED, GREEN, BLUEと出力
    println("最初の色は: ${RGB.valueOf("RED")}") // "最初の色は: RED"と出力
}
{% endcapture %}
{% include kotlin_quote.html body=enum-synthesize %}


指定された名前が、クラスで定義されている列挙型定数のいずれとも一致しない場合、`valueOf()` メソッドは `IllegalArgumentException` をスローします。

<!--original
The `valueOf()` method throws an `IllegalArgumentException` if the specified name does
not match any of the enum constants defined in the class.
-->

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)関数と[`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html)関数を用いて、
列挙型クラスの定数にジェネリックなやり方でアクセスする事が出来ます。

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

printAllValues<RGB>() // prints RED, GREEN, BLUE
```

> インライン関数のreified型パラメータについてもっと知りたい方は、[インライン関数](inline-functions.md)を参照のこと
> 
{: .tip}

Kotlin 1.9.0では、`values()`関数を置き換えるべく`entries`プロパティが導入されました。
`entries`プロパティは列挙型定数を事前に確保されたイミュータブルなリストとして返します。
これは[コレクション](collections-overview.md)を扱っている時にとりわけ便利で、
また[パフォーマンスの問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)を避けるのにも役立ちます。

例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString())
    // prints RED, GREEN, BLUE
}
```

すべての列挙型定数は、
列挙型クラス宣言でその名前と位置を取得するためのプロパティ、
[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
と [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)があります。
位置は0から始まる列挙型クラス内の位置を返します：

<!--original
Every enum constant has properties to obtain its name and position in the enum class declaration:
-->


{% capture enum-props %}
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name) // REDと出力
    println(RGB.RED.ordinal) // 0と出力
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=enum-props %}
