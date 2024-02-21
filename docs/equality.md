---
layout: reference
title: "Equality"
---

# Equality

Kotlinでは、二種類のequalityがあります：

* _Structural_ equality (`==` - `equals()`でチェックされる)
* _Referential_ equality (`===` - 二つの参照が同じオブジェクトを指しているかどうか)

（訳注：普通は同値性と同一性などと言われるが、原文もidentityといった用語を使っていないので、
一般的な用語にはしない事にした。適当な訳語をあてようかとも思ったが意味が分からないだろうから元の単語のままにしておく）

## Structural equality

Structural equalityは`==`演算でチェックされて、その否定は`!=`でチェックされる。
規約により、`a == b`は、以下のように翻訳される：

```kotlin
a?.equals(b) ?: (b === null)
```

`a`が`null`でなければ、`a`の`equals(Any?)`関数を呼び出し、
そうでなければ（`a`が`null`なら）`b`が`null`とreferentially equalかをチェックする。

`null`と明示的に比較しても最適化される余地は無い事に注意してください：
`a == null`は自動的に`a === null`に変換されます。

カスタムな同値判定を提供したければ、
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)をオーバーライドしてください。
同じ名前でも違うシグニチャの関数、例えば`equals(other: Foo)`などを定義しても、
`==`と`!=`演算子には影響を与えません。

Structural equalityは`Comparable<...>`インターフェースで定義される比較とは一切関係がありません。
この演算子に影響を与えるのはただ`equals(Any?)`をカスタム実装する事だけです。

## Referential equality

Referential equalityは`===`演算でチェックされて、その否定は`!==`でチェックされます。
`a === b`がtrueと評価されるのは、`a`と`b`が同じオブジェクトを指している時のみです。
実行時にプリミティブ型で表現される値（例えば`Int`とか）では、
`===`によるequality判定は`==`によるチェックと等価です。

## 浮動小数点数のイコール

イコールのチェックの対象が静的に`Float`か`Double`と知れている場合は（nullableかどうかに関わらず）、
その判定は[IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754)標準に従います。

それ以外の場合はstructural equalityが使われ、幾つかのケースで標準に準拠していません。
`NaN`は自身と等しく、`NaN`は`POSITIVE_INFINITY`も含めてそのほかのすべての値より大きいとされ、
`-0.0`は`0.0`とは等しく有りません。

参考： [浮動小数点数の比較](numbers.md#浮動小数点数の比較)
