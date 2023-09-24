---
layout: reference
title: "例外"
---
# 例外(Exceptions)

## Exceptionクラス

Kotlinのすべての例外クラスは`Throwable`クラスを継承しています。
すべてのexceptionはメッセージ、スタックトレース、そしてオプショナルですが理由（cause）を持ちます。

例外オブジェクトを投げるには、`throw`式を使います：

{% capture hello-exception %}
fun main() {
//sampleStart
    throw Exception("Hi There!")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=hello-exception %}

例外をcatchするには、`try` ... `catch`式を使います：

```kotlin
try {
    // 適当なコード
} catch (e: SomeException) {
    // 例外ハンドラー
} finally {
    //　finallyブロック（オプショナル）
}
```

`catch`ブロックは一つもなかったり、もっとたくさんあっても良いです。
そしてfinallyブロックは省略しても良いです。
しかし、`catch`か`finally`ブロックのどちらか一つは最低でも必要です。

### tryは式である

`try`は式です。つまり、それは値を返す事が出来ます：

```kotlin
val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
```

`try`式の返す値は`try`ブロックの最後の式か`catch`ブロックの最後の値です。
`finally`ブロックの中身は式の結果となる値には影響を与えません。

## Checked例外（検査例外）

Kotlinにはchecked例外(checked exception)はありません。
それにはたくさんの理由がありますが、どうして無いのかを示す簡単な例を挙げておきましょう。

以下は、JDK実装から持ってきた`StringBuilder`クラスのインターフェースです：

``` java
Appendable append(CharSequence csq) throws IOException;
```

このシグニチャは何か(何らかの`StringBuilder`、例えばログとかコンソールとか)に文字列を追加（append）する都度、
`IOException`をcatchしなくてはいけない、と言っています。
なぜでしょう？それは実装によってはIOオペレーションを実行するかもしれないらです（`Writer`も`Appendable`を実装しています）。
結果としてコードは、いたる所で以下のようになります：

```kotlin
try {
    log.append(message)
} catch (IOException e) {
    // 必ず問題無い
}
```

そしてこれは良くない事です。

[Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html)を見てみると、Item 77には、*Exceptionを無視してはいけない（Don't ignore exceptions）*とあります。

Bruce Eckelはchecked例外についてこう述べています：

> 小さいプログラムを調査すると、例外仕様を要求するのは、開発者の生産性もコードの質も上がり得る、と結論出来ます。
> ですが大規模なソフトウェアプロジェクトの経験は、違う結論を示唆しています。生産性は低下し、コードの質の向上もほとんどあるいは全く無い、というものです。
>
{: .tip}

このトピックについてのさらなる考察を以下にリンクしておきます：

* [Javaのchecked例外は誤りだった（Java's checked exceptions were a mistake）](https://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [checked例外の問題点（The Trouble with Checked Exceptions）](https://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)

Java, Swift, Objective-CなどからKotlinのコードを呼ぶ時に呼び出し元に発生しうる例外を警告したければ、
`@Throws`アノテーションを使う事が出来ます。
このアノテーションについては、[Javaについてはこちらを](java-to-kotlin-interop.md#checked-exceptions)、
[SwiftとObjective-Cはこちら](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions)を参照ください。

## Nothing型

`throw`はKotlinにおいては式です。だからそれを例えば、Elvis式などの一部として使えます：

```kotlin
val s = person.name ?: throw IllegalArgumentException("名前が必要です")
```

`throw`式は`Nothing`型を持ちます。
この型は値を持たず、そこには絶対にコードが到達しない事を表します。
あなたのコードでも、決して戻ってこない関数には`Nothing`でその旨マークすることが出来ます：

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```

この関数を呼ぶ時は、コンパイラは実行はそのコードの続きに行く事は無いという事を認識出来ます：

```kotlin
val s = person.name ?: fail("名前が必要です")
println(s)     // この地点では 's' は初期化されていると分かっている
```

あなたはまた、型推論の所でもNothing型と遭遇する事があるかもしれません。
Nothing型のnullable版である`Nothing?`は、一つだけ可能な値があります。それは`null`です。
あなたがもし推論される型の所で`null`の値を用いて初期化し、他に何も型情報を推測する手がかりが無いケースでは、
コンパイラはこれを`Nothing?`型だと推測します：

```kotlin
val x = null           // 'x' は`Nothing?`型
val l = listOf(null)   // 'l' は`List<Nothing?>型
```

## Javaインターオペラビリティ

例外に関してのJavaとのインターオペラビリティの詳細については、[Javaとのインターオペラビリティのページ](java-interop.md)を参照ください。