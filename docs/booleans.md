---
layout: reference
title: "真偽値（Booleans）"
---
# 真偽値（Booleans）

`Boolean`型は真偽値を表し、`true`と`false`の2つの値があります。

`Boolean`にはそのnullable版の `Boolean?`型もあり、こちらは`null`の値も持ち得ます。


Booleanのビルトイン演算は次を含みます：

* `||` – 論理和 (ロジカル`OR`)
* `&&` – 論理積 (ロジカル`AND`)
* `!` – 否定 (ロジカル `NOT``)

`||` and `&&` work lazily.

{% capture boolean-sample %}
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null
    
    println(myTrue || myFalse)
    println(myTrue && myFalse)
    println(!myTrue)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=boolean-sample %}

> **JVMの場合**: Booleanのオブジェクトのnullableなリファレンスは[数値](numbers.md#数値のJVM上での表現)の場合と同じような感じでboxingされます。
>
{: .note}