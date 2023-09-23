---
layout: reference
title: "文字"
---
# 文字

文字は、`Char`型で表されます。
文字リテラルを表現するには、シングルクォートで囲みます： `'1'`

特殊文字はエスケープ文字のバックスラッシュ `\` から始まります。
以下のエスケープシーケンスがサポートされています：

* `\t` – タブ
* `\b` – バックスペース
* `\n` – 改行 (LF)
* `\r` – キャリッジリターン (CR)
* `\'` – シングルクオーテーションマーク
* `\"` – ダブルクオーテーションマーク
* `\\` – バックスラッシュ
* `\$` – ドル記号

その他の文字をエンコードしたければ、Unicodeエスケープシーケンスの構文を使用します：`'\uFF00'`

{% capture character-sample %}
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('\n') // Prints an extra newline character
    println('\uFF00')
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=character-sample %}

文字の値が数値を表す文字だったらば、[`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)関数ｗ使って明示的に`Int`の数値にする事が出来ます。

> **JVMの場合**: [数値](numbers.md#数値のJVM上での表現)の場合と同様, nullableなリファレンスが必要な所では文字もbox化されます。
> 同一性（identity）はboxingされている型に対しては保持されません。
>
{: .note}