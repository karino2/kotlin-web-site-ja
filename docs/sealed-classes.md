---
layout: reference
title: "sealedクラスとsealedインターフェース"
---
# sealedクラスとsealedインターフェース

**sealed**クラスと**sealed**インターフェースは、
制限されたクラスヒエラルキーを表現し、継承のさらなる制御の方法を提供します。
sealedクラスの直接のサブクラスは、全てコンパイル時にしられている必要があります。
それ以外のサブクラスがsealedクラスの定義されているパッケージやモジュールの外にあらわれてはいけません。
例えば、サードパーティーのクライアントはあなたのsealedクラスを彼らのコードの中で継承する事は出来ません。
かくして、sealedクラスの各インスタンスは、
このクラスがコンパイルされた時点で知られている限られた種類だけからなる型を持ち得ます。

<!--original
_Sealed_ classes and interfaces represent restricted class hierarchies that provide more control over inheritance.
All direct subclasses of a sealed class are known at compile time. No other subclasses may appear outside
the module and package within which the sealed class is defined. For example, third-party clients can't extend your sealed class in their code.
Thus, each instance of a sealed class has a type from a limited set that is known when this class is compiled.

-->

同様の事はsealedインターフェースとその実装についても言えます：
ひとたびsealdインターフェースのあるモジュールがコンパイルされれば、
それ以後新たな実装が現れる事はありえません。

<!--original
The same works for sealed interfaces and their implementations: once a module with a sealed interface is compiled,
no new implementations can appear.
-->


ある意味では、[`enum`](enum-classes.md)クラスに似ています。
enum型の値の種類も同じく制限されています。
けれど、それぞれのenum定数はシングルインスタンスとしてのみ存在するのに対し、
sealedクラスのサブクラスは複数のインスタンスをもつことができ、それぞれが独自の状態を保持できます。

<!--original
In some sense, sealed classes are similar to [`enum`](enum-classes.md) classes: the set of values
for an enum type is also restricted, but each enum constant exists only as a _single instance_, whereas a subclass
of a sealed class can have _multiple_ instances, each with its own state.
-->

例として、ライブラリのAPIを考えてみましょう。
ライブラリにはライブラリのユーザーがハンドルしたりthrow出来るエラーを含む場合があります。
そのようなエラーの継承ツリーにインターフェースや抽象クラスが含まれていてパブリックなAPIとして可視であるなら、
クライアント側でそのエラーを実装したり継承したりする事を防ぐ方法はありません。
ですがライブラリ側は外側で定義されたそんなエラーを知らないので、
自身のエラーの時と一貫した形で扱う事は出来ません。
sealedな継承階層のエラークラスなら、
ライブラリの作者は可能なすべてのエラーの型を確実に知る事が出来て、
後からそれ以外のものが追加されない事を確信出来ます。

<!--
As an example, consider a library's API. It's likely to contain error classes to let the library users handle errors 
that it can throw. If the hierarchy of such error classes includes interfaces or abstract classes visible in the public API,
then nothing prevents implementing or extending them in the client code. However, the library doesn't know about errors
declared outside it, so it can't treat them consistently with its own classes. With a sealed hierarchy of error classes,
library authors can be sure that they know all possible error types and no other ones can appear later.
 -->

sealedクラスやsealedインターフェースを宣言するには、
`sealed` 修飾子を名前の前に置きます：

<!--original
To declare a sealed class or interface, put the `sealed` modifier before its name:
-->

``` kotlin
sealed interface Error

sealed class IOError(): Error

class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

object RuntimeError : Error
```

sealedクラスはそれ自身は[abstract](classes.md#抽象クラス)で、直接インスタンシエートは出来ません。
また、`abstract`なメンバを持つ事が可能です。

<!-- 
A sealed class is [abstract](classes.md#abstract-classes) by itself, it cannot be instantiated directly and can have `abstract` members.
-->

sealedクラスのコンストラクタの[可視性](visibility-modifiers.md)は二つに一つです：
`protected` (こちらがデフォルト)　または `private` です：

```kotlin
sealed class IOError {
    constructor() { /*...*/ } // デフォルトなのでprotected
    private constructor(description: String): this() { /*...*/ } // privateはOK
    // public constructor(code: Int): this() {} // Error: publicとinternalは許可されない
}
```

## 直接のサブクラスの置き場所

sealedクラスやsealedインターフェースの直接のサブクラスは、同じパッケージに宣言されなくてはいけません。
それらはトップレベルでも他のクラスやインターフェースやオブジェクトにネストした中でも構いません。
サブクラスは通常のKotlinの継承ルールに従っている範囲の、
いかなる[可視性](visibility-modifiers.md)も持ち得ます。

sealedクラスのサブクラスはちゃんとした名前を持っていなくてはなりません。
ローカルオブジェクトや無名オブジェクトではいけません。

> `enum`クラスはsealedクラスを継承出来ません(sealedクラス以外のクラスと同様)が、sealedインターフェースを実装する事は出来ます。
>
{: .note}


sealedクラスの間接的なサブクラスにはこれらの制約は適用されません。
もしも直接のサブクラスがsealedとマークされていなければ、
そのサブクラスは通常の修飾子が許すいかなるようにも継承出来ます。

<!--original
These restrictions don't apply to indirect subclasses. If a direct subclass of a sealed class is not marked as sealed,
it can be extended in any way that its modifiers allow:
-->

```kotlin
sealed interface Error // 同じパッケージとモジュールにだけ実装を持つ

sealed class IOError(): Error // 同じパッケージとモジュールでだけ継承可能
open class CustomError(): Error // このクラスが見える所ならどこでも継承可能
```

### マルチプラットフォームプロジェクトでの継承

[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform-get-started.html)の場合はさらにもう一つ継承に関わる制約があります：
sealedクラスの直接のサブクラスは同じソースセットに存在していないといけません。
これは[`expect` と `actual` 修飾子](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)の無いsealed クラスに適用されるルールです。

もしsealedクラスがcommonソースセットの方で`expect`と定義されてプラットフォーム側のソースセットに`actual`として実装されていたら、
`expect`側も`actual`側もそれぞれのソースセットでサブクラスを持ち得ます。
さらに、[hierarchical structure](https://kotlinlang.org/docs/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)を用いると、
`expect`と`actual`の宣言の間のどのソースセットでもサブクラスを作る事が出来ます。

<!-- 
If a sealed class is declared as `expect` in a common source set and have `actual` implementations in platform source sets,
both `expect` and `actual` versions can have subclasses in their source sets. Moreover, if you use a [hierarchical structure](multiplatform-share-on-platforms.md#share-code-on-similar-platforms),
you can create subclasses in any source set between the `expect` and `actual` declarations. 
-->

[multiplatform projectsのhierarchical structureについてもっと学ぶ](https://kotlinlang.org/docs/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)

## Sealedクラスとwhen式


sealedクラスの主な利点は [`when`式](control-flow.md#when式) の中で使用されたときに発揮されます。
もし文が全てのケースをカバーすることを確認できれば、 `else` 句を追加する必要はありません。

<!--original
The key benefit of using sealed classes comes into play when you use them in a [`when` expression](control-flow.html#when-expression). If it's possible
to verify that the statement covers all cases, you don't need to add an `else` clause to the statement.
-->

``` kotlin
fun log(e: Error) = when(e) {
    is FileReadError -> { println("ファイルを読んでいる時にエラー： ${e.file}") }
    is DatabaseError -> { println("データベースを読んでいる時にエラー： ${e.source}") }
    is RuntimeError ->  { println("実行時エラー") }
    // 全てのケースをカバーした為、`else` 句は不要
}
```

<!--original
``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // the `else` clause is not required because we've covered all the cases
}
```
-->


> マルチプラットフォームプロジェクトのcommonコードの中で、
> [`expect`](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html) sealedクラスに対してwhen式を使う時は、
> `else`節は必要です。これはcommonコード側としてはプラットフォーム側のサブクラスとなる`actual`実装を知らないからです。
>
{: .note}
