---
layout: reference
title: "基本の型"
---
# 基本の型

Kotlinでは、すべての変数に対して何らかのメンバ関数やプロパティを呼ぶ事が出来るという意味では、全てがオブジェクトであると言えます。
いくつかの型では特別な内部表現、例えば数値や文字列やBooleanは実行時にはプリミティブな値として表現され得ますが、
ユーザーから見るとそれらも通常のクラスのように見えます。

このセクションでは、Kotlinの基本型について解説します：
* [数値](numbers.md)とその[符号なしバージョン](unsigned-integer-types.md)
* [真偽値（Booleans）](booleans.md)
* [文字](characters.md)
* [文字列](strings.md)
* [配列](arrays.md)

## 文字列

<!--original
## Strings
-->

文字列は、`String`型で表されます。文字列は不変（イミュータブル）です。
文字列の要素は、`s[i]`といったインデックスの演算でアクセスできます。
文字列は *for*{: .keyword }ループで文字単位でイテレート（繰り返し操作）できます。以下の例を参照してください。

<!--original
Strings are represented by the type `String`. Strings are immutable.
Elements of a string are characters that can be accessed by the indexing operation: `s[i]`.
A string can be iterated over with a *for*{: .keyword }-loop:
-->

``` kotlin
for (c in str) {
  println(c)
}
```

<!--original
``` kotlin
for (c in str) {
  println(c)
}
```
-->

### 文字列リテラル

<!--original
### String Literals
-->

Kotlinは2つの種類の文字列リテラルを持ちます：1つはエスケープされた文字列を持ちうるエスケープ済み文字列で、もう1つは改行と任意の文字を含む生文字列です。 エスケープ済み文字列はJavaの文字列に非常によく似ています：

<!--original
Kotlin has two types of string literals: escaped strings that may have escaped characters in them and raw strings that can contain newlines and arbitrary text. An escaped string is very much like a Java string:
-->

``` kotlin
val s = "Hello, world!\n"
```

<!--original
``` kotlin
val s = "Hello, world!\n"
```
-->

エスケープは、バックスラッシュを用いて従来の方法で行われます。サポートされているエスケープシーケンスのリストについては、[文字列](#characters)を参照してください。

<!--original
Escaping is done in the conventional way, with a backslash. See [Characters](#characters) above for the list of supported escape sequences.
-->

生文字列は三連クオート (`"""`) で区切られます。エスケープは含まれておらず、改行や他の文字を含めることができます：

<!--original
A raw string is delimited by a triple quote (`"""`), contains no escaping and can contain newlines and any other characters:
-->

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```

<!--original
``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```
-->

先頭の空白を[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数で削除することができます。

<!--original
You can remove leading whitespace with [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function:
-->

``` kotlin
val text = """
    |Tell me and I forget. 
    |Teach me and I remember. 
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

<!--original
``` kotlin
val text = """
    |Tell me and I forget. 
    |Teach me and I remember. 
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```
-->

デフォルトでは`|`はマージンの接頭辞として使用されますが、`trimMargin(">")`のように、パラメータとして別の文字を渡すとそれを接頭辞として使用することができます。

<!--original
By default `|` is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.
-->

### 文字列テンプレート

<!--original
### String Templates
-->

文字列はテンプレート式、すなわち、評価され、その結果が文字列と結合されるコードの断片を含むことができます。テンプレート式は、ドル記号（`$`）で始まり、簡単な名前で構成されます：

<!--original
Strings may contain template expressions, i.e. pieces of code that are evaluated and whose results are concatenated into the string.
A template expression starts with a dollar sign ($) and consists of either a simple name:
-->

``` kotlin
val i = 10
val s = "i = $i" // "i = 10"と評価される
```

<!--original
``` kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```
-->

または、波括弧を使った（従来の）記法もあります：

<!--original
or an arbitrary expression in curly braces:
-->

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // "abc.length is 3"と評価される
```

<!--original
``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```
-->

テンプレートは生文字列、エスケープ済み文字列のどちらに含まれていても動作します。
もし`$`の文字リテラルを生文字列内（バックスラッシュでのエスケープをサポートしない）で表現する必要がある場合は、次の文法を使用できます：

<!--original
Templates are supported both inside raw strings and inside escaped strings.
If you need to represent a literal `$` character in a raw string (which doesn't support backslash escaping), you can use the following syntax:
-->

``` kotlin
val price = """
${'$'}9.99
"""
```

<!--original
``` kotlin
val price = """
${'$'}9.99
"""
```
-->
