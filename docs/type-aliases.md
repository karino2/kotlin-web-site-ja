---
layout: reference
title: "Typeエイリアス"
---
# Typeエイリアス

Typeエイリアスは既存の型に別名を与える機能です。
もし型の名前が長すぎたら、短い別の名前を導入してそれを使う事が出来ます。

長いジェネリクスの型を短くするのは便利です。
例えば、コレクションの型はよく短くしたくなります：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

関数の型に別のエイリアスを提供する事も出来ます：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

内部クラスやネストされたクラスに新しい名前を持たせる事も出来ます：

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```

Typeエイリアスは別の型を導入する訳ではありません。
下地になっている型と等価なものです。

あなたのコードに`typealias Predicate<T>`を足して`Predicate<Int>`を使うと、
Kotlinコンパイラはいつでもその使っている場所を`(Int) -> Boolean`に展開します。
だからこそ、一般的な関数の型を必要としている所にいつでもエイリアスの型の変数を渡す事が出来るし、逆も出来るのです：

{% capture type-alias %}
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // "true"と出力

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // "[1]"と出力
}
{% endcapture %}
{% include kotlin_quote.html body=type-alias %}

