---
layout: reference
title: "符号なし整数型"
---
# 符号なし整数型

[整数型](numbers.md#整数型)の他に、Kotlinは以下の符号なし整数(unsigned integer)の型を提供します：

* `UByte`:符号なし 8-bit 整数, 範囲は 0 から 255
* `UShort`:符号なし 16-bit 整数, 範囲は 0 から 65535
* `UInt`:符号なし 32-bit 整数, 範囲は 0 から 2^32 - 1
* `ULong`:符号なし 64-bit 整数, 範囲は 0 から 2^64 - 1

符号なし型は、対応する符号有り型でサポートされている演算はだいたいサポートされています。

> 符号なし整数は[inline classes](inline-classes.md)を用いて、同じ幅の対応する符号あり型の単一格納プロパティ（single storage property）として実装されています。
> にもかかわらず、符号なし型から符号あり型へ変える（またはその逆）と、**binary incompatible**な変更となります。
> (訳注: chageとあったので変更と訳したが、それが何を意味するのかは良く分からなかった)
>
{: .note}


## 符号なし配列と範囲（range）

> 符号なし配列とその演算は[Beta](components-stability.md)の機能です。いつでも互換性を保たないような変更がされ得る段階です。
> また、Opt-inする必要があります（詳細は以下を参照）。
>
{: .warning}

プリミティブ型と同様、符号なし型もそれに対応する配列の専用クラスがあります：


* `UByteArray`: 符号なし byte の配列
* `UShortArray`: 符号なし short の配列
* `UIntArray`: 符号なし int の配列
* `ULongArray`: 符号なし long の配列

符号ありの整数の配列と同様に、これらは`Array`クラスと類似のAPIをboxingのオーバーヘッド無しで提供します。

符号なし配列を使おうとすると、このフィーチャーはまだstableじゃないという事を示す警告(warning)が出るでしょう。
この警告を消すには、`@ExperimentalUnsignedTypes`でオプトイン(opt-in)します。
あなたのAPIを使う側が明示的にオプトインしないといけないようにするかはあなた次第です。
ですが、符号なし配列はstableなフィーチャーでは無く、それを使ったAPIは言語側の変更で壊れ得る事を心に留めておきましょう。
[オプトインの要求についてもっと学ぶ](opt-in-requirements.md)

`UInt`と`ULong`の[Rangeと数列](ranges.md)は`UIntRange`、`UIntProgression`、`ULongRange`、`ULongProgression`クラス達によりサポートされています。
符号なし整数型と合わせて、これらのクラスはstableです。

## 符号なし整数リテラル

符号なし整数を使いやすくするために、Kotlinは整数リテラルに接尾辞（suffix）をつけて特定の符号なし型だとタグ付けする事が出来ます（`Float`や`Long`と同様）：

* `u` と `U` は符号なしリテラルのタグです。実際の型は期待される型により決まります。
  期待される型が指定されなければ、コンパイラは`UInt`か`ULong`をリテラルのサイズに応じて選びます。

  ```kotlin
  val b: UByte = 1u  // UByte, 期待される型が提供されている
  val s: UShort = 1u // UShort, 期待される型が提供されている
  val l: ULong = 1u  // ULong, 期待される型が提供されている
  
  val a1 = 42u // UInt: 期待される型が無い。定数は UInt に収まっている
  val a2 = 0xFFFF_FFFF_FFFFu // ULong: 期待される型が無い。定数は UInt に収まっていない
  ```

* `uL` と `UL` は明示的にリテラルが符号なしのLong型である事を表すタグ：

  ```kotlin
  val a = 1UL // ULong、期待される型も無くて定数もUIntに収まっているにも関わらず
  ```

## ユースケース

符号なし整数の主なユースケースとしては、整数の全bitを正の値として使い切りたい、というもの。
例えば、32ビットの整数の正の範囲に収まりきらないような16進数定数、Colorを`AARRGGBB`フォーマットで表すようなケースです：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

バイト配列を初期化する時にも、符号なし整数を使えば、明示的に`toByte()`でリテラルをキャストしていかなくても良い：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

そのほかのユースケースとしてはネイティブAPIとのインターオペラビリティの為です。
Kotlinでは、ネイティブの宣言に符号なし型があるという事をシグニチャに含める事が出来ます。
その場合のマッピングは符号なし整数を符号あり整数に置き換えず、セマンティクスが変わらないようになります。

### 目標では無いもの（Non-goals）

符号なし整数は0と正の整数だけを表すものではあるけれど、
アプリケーションのドメインとして非負の整数が必要な所で使う事は符号なし整数の目標とはしていません。
例えばコレクションのサイズやコレクションのインデックスの値などです。

それには幾つかの理由があります：

* 符号あり整数を用いる事で、偶発的なオーバーフローを検出したりエラー状態を伝えたり出来ます。例えば、[`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)が空のリストに対しては-1を返す、などです。
* 符号なし整数は符号あり整数の範囲の制約を厳しくしたバージョンとはみなせません。それは許容される範囲が違い、片方が他方のサブセットになっていないからです。
また、同様の理由で符号あり、符号なしが、どちらかがどちらかのサブクラスにする事も出来ません。
