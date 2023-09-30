---
layout: reference
title: "this式"
---
# this式

現在の*レシーバ*を指し示すには、`this`式が使えます：

* [クラス](classes.md#継承)のメンバの場合、`this`はそのクラスの現在のオブジェクトを指します。
* [拡張関数](extensions.md)や[レシーバ付き関数リテラル](lambdas.md#レシーバ付き関数リテラル)の場合は、`this`はドットの左に渡された`レシーバ`パラメータを指します。

`this`に限定子が無ければ、それは*一番内側の囲んでるスコープ*を指します。
外側のスコープの`this`を参照するためには、`ラベル限定子`が使われます：

## 限定子付きthis 

（訳注：qualified this）

外側のスコープの`this`（外側の[クラス](classes.md)、[拡張関数](extensions.md)、ラベル付けされた[レシーバ付き関数リテラル](lambdas.md#レシーバ付き関数リテラル)の`this`）にアクセスするには、
`this@label`という形式を使います。ここで`@label`はアクセスしたいスコープの[ラベル](returns.md)です：

```kotlin
class A { // 暗黙のラベル @A
    inner class B { // 暗黙のラベル @B
        fun Int.foo() { // 暗黙のラベル @foo
            val a = this@A // Aの this
            val b = this@B // Bの this

            val c = this // foo()のレシーバ、Int
            val c1 = this@foo // foo()のレシーバ、Int

            val funLit = lambda@ fun String.() {
                val d = this // funLitのレシーバ、String
            }

            val funLit2 = { s: String ->
                // foo()のレシーバ、なぜなら囲んでるラムダ式はレシーバを持たないから
                val d1 = this
            }
        }
    }
}
```

## 暗黙のthis

`this`のメンバ関数を呼ぶ時は、`this.`の部分をスキップする事が出来る。
同じ名前の非メンバ関数があった場合は、注意してこの機能を使う事。なぜならそちらが代わりに呼ばれてしまう場合もあるから：

{% capture implicit-this %}
fun main() {
//sampleStart
    fun printLine() { println("トップレベル関数") }
    
    class A {
        fun printLine() { println("メンバ関数") }

        fun invokePrintLine(omitThis: Boolean = false)  { 
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // メンバ関数
    A().invokePrintLine(omitThis = true) // トップレベル関数
//sampleEnd()
}
{% endcapture %}
{% include kotlin_quote.html body=implicit-this %}

