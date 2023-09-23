---
layout: reference
title: "文字列"
---
# 文字列

Kotlinでは文字列は[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)型で表されます。
一般には、文字列の値はダブルクオート(`"`)の中に並んだ文字の列で表されます。


```kotlin
val str = "abcd 123"
```

文字列の要素は文字(Char)で、、`s[i]`といったインデックスの演算でアクセスできます。
文字列は `for`ループで文字単位でイテレート（繰り返し操作）できます。以下の例を参照してください：

{% capture string-sample-1 %}
fun main() {
val str = "abcd"
//sampleStart
for (c in str) {
    println(c)
}
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=string-sample-1 %}

文字列は不変（immutable）です。
ひとたび文字列を初期化すると、その値を変更したり新しい値を代入したりは出来ません。
文字列を変形するすべての演算は、新規の`String`オブジェクトを返し、
元の文字列は変更しません：


{% capture string-sample-2 %}
fun main() {
//sampleStart
    val str = "abcd"
    println(str.uppercase()) // 新しいStringオブジェクトを作ってプリントしてる
    println(str) // 元の文字列は元のまま
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=string-sample-2 %}

To concatenate strings, use the `+` operator. This also works for concatenating strings with values of other types, as long
as the first element in the expression is a string:

{% capture string-sample-3 %}
fun main() {
//sampleStart
val s = "abc" + 1
println(s + "def")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=string-sample-3 %}

> In most cases using [string templates](#string-templates) or [multiline strings](#multiline-strings) is preferable to string concatenation.
> 
{: .note}

## 文字列リテラル

Kotlinは2つの種類の文字列リテラルを持ちます：
Kotlin has two types of string literals:

* [エスケープ済み文字列(escaped strings)](#エスケープ済み文字列)
* [複数行文字列(multiline strings)](#複数行文字列)

### エスケープ済み文字列

**エスケープ済み文字列(Escaped strings)**はエスケープされた文字を持ちうる文字列です。
以下がエスケープ済み文字列の例になります：

```kotlin
val s = "Hello, world!\n"
```

エスケープは昔ながらのバックスラッシュ(`\`)を使ったやり方で行います。
[文字](characters.md)のページには、サポートされてるエスケープシーケンスの一覧があります。

### 複数行文字列

**複数行文字列(Multiline strings)**は、改行と任意のテキストを含む事が出来ます。
三連クオート (`"""`) で区切られ、エスケープは含まれておらず、改行や他の文字を含めることができます：

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""
```

先頭の空白を除去するには、[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数を使う事が出来ます：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

デフォルトではパイプ記号`|`がマージンの接頭辞として使用されますが、`trimMargin(">")`のように、パラメータとして別の文字を渡すとそれを接頭辞として使用することができます。

## 文字列テンプレート

文字列リテラルは、**テンプレート式(template expressions)**、すなわち、評価され、その結果が文字列と結合されるコードの断片を含むことができます。
テンプレート式は、ドル記号（`$`）で始まり、名前か：

String literals may contain _template expressions_ – pieces of code that are evaluated and whose results are concatenated into the string.
A template expression starts with a dollar sign (`$`) and consists of either a name:

{% capture string-template-sample-1 %}
fun main() {
//sampleStart
    val i = 10
    println("i = $i") // "i = 10"と出力される
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=string-template-sample-1 %}

または、中括弧を使った記法もあります：

{% capture string-template-sample-2 %}
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") // "abc.length is 3"と出力される
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=string-template-sample-2 %}

テンプレートは**複数行文字列**と、**エスケープ済み文字列**のどちらに含まれていても動作します。
もし`$`の文字リテラルを複数行字列内（バックスラッシュでのエスケープをサポートしない）で表現する必要があり、
しかもその後に続く文字が[identifier](https://kotlinlang.org/docs/reference/grammar.html#identifiers)として許されるものの場合には、
次の文法を使用できます：

```kotlin
val price = """
${'$'}_9.99
"""
```