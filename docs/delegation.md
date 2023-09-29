---
layout: reference
title: "委譲 (Delegation)"
---
# 委譲 (Delegation)

[Delegationパターン](https://en.wikipedia.org/wiki/Delegation_pattern)は、実装継承の良い代替手段であることが証明されており、Kotlinはネイティブでそれをサポートし、かつ定型コードを必要としません。

`Derived` クラスは、
指定されたオブジェクトへ public メンバのすべてを委譲することで、
 `Base` インターフェースを実装する事が出来ます：

<!--original
The [Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern) has proven to be a good alternative to 
implementation inheritance, and Kotlin supports it natively requiring zero boilerplate code.

A class `Derived` can implement an interface `Base` by delegating all of its public members to a specified object:
-->

{% capture delegation-base %}
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val b = BaseImpl(10)
    Derived(b).print()
}
{% endcapture %}
{% include kotlin_quote.html body=delegation-base %}


`Derived` の基底型のリスト中の *by*{:.keyword} 節は、 `b` が `Derived` のオブジェクトに内部的に格納されることを示し、コンパイラは `Base` のすべてのメソッドを`b`に取り次ぐものとして生成します。

<!--original
The `by`-clause in the supertype list for `Derived` indicates that `b` will be stored internally in objects 
of `Derived` and the compiler will generate all the methods of `Base` that forward to `b`.
-->

## 委譲で実装されるインターフェースのoverride

[オーバーライド](inheritance.md#メソッドのオーバーライド)は期待される通りの振る舞いをします：
コンパイラはあなたの作った`override`の実装の方をdelegateオブジェクトの物の代わりに使います。
`Derived`クラスに`override fun printMessage() { print("abc") }`を足せば、
プログラムは`printMessage`が呼ばれた時に*10*の代わりに*abc*を出力するようになります：

{% capture delegate-override %}
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val b = BaseImpl(10)
    Derived(b).printMessage()
    Derived(b).printMessageLine()
}
{% endcapture %}
{% include kotlin_quote.html body=delegate-override %}

しかしながら、delegateオブジェクトからはこのようにオーバーライドしたメンバは呼ばれない事には注意が必要です。
delegateオブジェクトは自身の実装にしかアクセス出来ないのですから：

{% capture delegate-override-pitfall %}
interface Base {
    val message: String
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // このプロパティは、bの`print`実装からはアクセスされない
    override val message = "Derivedのメッセージ"
}

fun main() {
    val b = BaseImpl(10)
    val derived = Derived(b)
    derived.print()
    println(derived.message)
}
{% endcapture %}
{% include kotlin_quote.html body=delegate-override-pitfall %}

[委譲プロパティ](delegated-properties.md)でさらに詳しく学ぼう。