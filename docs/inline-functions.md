---
layout: reference
title: "インライン関数"
---
# インライン関数

<!--original
# Inline Functions
-->

[高階関数](lambdas.html)を使用すると、ある種のランタイムペナルティを課せられます。
各関数はオブジェクトであり、それはクロージャ、すなわち、関数の本体でアクセスされるそれらの変数をキャプチャします。
メモリ割り当て（関数オブジェクトとクラス用の両方）と仮想呼び出しは、実行時のオーバーヘッドを招きます。

<!--original
Using [higher-order functions](lambdas.html) imposes certain runtime penalties: each function is an object, and it captures a closure,
i.e. those variables that are accessed in the body of the function.
Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.
-->

しかし、多くの場合、オーバーヘッドはこの種のラムダ式をインライン化することによって解消することができると思われます。
以下に示す関数は、このような状況の良い例です。
すなわち、`lock()` 関数は、簡単に呼び出し箇所でインライン化することができました。次のケースを考えてみます。

<!--original
But it appears that in many cases this kind of overhead can be eliminated by inlining the lambda expressions.
The functions shown above are good examples of this situation. I.e., the `lock()` function could be easily inlined at call-sites.
Consider the following case:
-->

``` kotlin
lock(l) { foo() }
```

<!--original
``` kotlin
lock(l) { foo() }
```
-->

パラメータために関数オブジェクトを作成してコールを生成する代わりに、
コンパイラは次のコードを生成しても良いでしょう：

<!--original
Instead of creating a function object for the parameter and generating a call, the compiler could emit the following code
-->

``` kotlin
l.lock()
try {
    foo()
}
finally {
    l.unlock()
}
```

<!--original
``` kotlin
l.lock()
try {
  foo()
}
finally {
  l.unlock()
}
```
-->

コンパイラがこのようにできるようにするためには、 `inline` 修飾子で `lock()` 関数をマークする必要があります：

<!--original
To make the compiler do this, we need to mark the `lock()` function with the `inline` modifier:
-->

``` kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

<!--original
``` kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```
-->

`inline` 修飾子は、関数自体や関数の引数に渡されたラムダの両方を呼び出し箇所にインライン化させるはたらきをもちます。

<!--original
The `inline` modifier affects both the function itself and the lambdas passed to it: all of those will be inlined
into the call site.
-->

インライン化では生成されるコードが大きくなる可能性がありますが、合理的な方法で（大きな関数をインライン化しないで）実行すると、
パフォーマンスの向上で割に合います、
特にループ内の 「メガモーフィック (megamorphic)」な呼び出し箇所では。

<!--original
Inlining may cause the generated code to grow, but if we do it in a reasonable way (do not inline big functions)
it will pay off in performance, especially at "megamorphic" call-sites inside loops.
-->

## `noinline``

<!--original
## noinline
-->

インライン関数に渡されたラムダのうち、インライン化したくないものがある場合は、 `noinline` 修飾子を付けることができます：

<!--original
In case you want only some of the lambdas passed to an inline function to be inlined, you can mark some of your function
parameters with the `noinline` modifier:
-->

``` kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

<!--original
``` kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```
-->

インライン化可能なラムダは、インライン関数内で呼び出すか、
インライン可能な引数として他に渡すかのどちらかくらいしか出来ません。
ですが、 `noinline` は、好きなように操作できます。例えば、フィールドに保持したり、誰かに渡したり等。

<!--original
Inlinable lambdas can only be called inside the inline functions or passed as inlinable arguments,
but `noinline` ones can be manipulated in any way we like: stored in fields, passed around etc.
-->

> インライン関数にインライン化できる関数の引数がなく、
> [reified型パラメータ](#reified型パラメータ)が指定されていない場合、
> コンパイラは警告を発します。
> このような関数のインライン展開が有益な事はめったに無いためです
> （自分のケースではインライン展開が必要と確信を持っているなら、`@Suppress("NOTHING_TO_INLINE")`
> アノテーションで警告を抑制できます）。
>
{: .note}
<!--original
> If an inline function has no inlinable function parameters and no
> [reified type parameters](#reified-type-parameters), the compiler will issue a warning, since inlining such functions
> is very unlikely to be beneficial (you can use the `@Suppress("NOTHING_TO_INLINE")` annotation to suppress the warning
> if you are sure the inlining is needed).
>
{type="note"}
-->

## 非局所リターン

<!--original
## Non-local returns
-->

Kotlinでは、名前付き関数または無名関数から抜けるためには、通常、ラベル無し `return` のみが使用できます。
ラムダを終了するには[ラベル](returns.md#ラベルにreturnする)を使用しなければなりません。
ラムダが自身を囲んでいる関数からの `return` を作ることができないため、ラムダ内での裸のリターンは禁止されています。

<!--original
In Kotlin, we can only use a normal, unqualified `return` to exit a named function or an anonymous function.
This means that to exit a lambda, we have to use a [label](returns.html#return-at-labels), and a bare `return` is forbidden
inside a lambda, because a lambda can not make the enclosing function return:
-->

{% capture lambda-no-return %}
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // エラー: `foo` をここで return することはできない
    }
}
//sampleEnd
fun main() {
    foo()
}

{% endcapture %}
{% include kotlin_quote.html body=lambda-no-return %}


しかし、ラムダが渡された関数がインライン関数の場合、
returnも同様にインライン化することができます。
その場合はそれ（訳注：ラムダの中のreturn）が許可されています：

<!--original
But if the function the lambda is passed to is inlined, the return can be inlined as well, so it is allowed:
-->

{% capture lambda-return-inline %}
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: ラムダはインライン化される
    }
}
//sampleEnd
fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=lambda-return-inline %}

（ラムダに位置するが、それを囲んでいる関数から抜ける）このようなリターンは、 *非局所リターン(non-local return)* と呼ばれています。
このような構造は通常はループで起こるもので、
そこではしばしばインライン関数に囲まれています：

<!--original
Such returns (located in a lambda, but exiting the enclosing function) are called *non-local* returns. This sort of
construct usually occurs in loops, which inline functions often enclose:
-->

``` kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // hasZeros から return する
    }
    return false
}
```

<!--original
``` kotlin
fun hasZeros(ints: List<Int>): Boolean {
  ints.forEach {
    if (it == 0) return true // returns from hasZeros
  }
  return false
}
```
-->

インライン関数の中には、パラメータとして渡されたラムダを、関数本体から直接ではなく、
ローカルオブジェクトやネストされた関数などの別の実行コンテキストから呼び出すものがあります。
このような場合には、ラムダの中の非局所制御フローは許可されません。
インライン関数のパラメータのラムダが非局所リターンを使えないという事を示すために、
ラムダパラメータを `crossinline` 修飾子でマークする必要があります：

<!--original
Note that some inline functions may call the lambdas passed to them as parameters not directly from the function body,
but from another execution context, such as a local object or a nested function. In such cases, non-local control flow
is also not allowed in the lambdas. To indicate that the lambda parameter of the inline function cannot use non-local
returns, mark the lambda parameter with the `crossinline` modifier:
-->

``` kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```


<!--original
``` kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

-->

> `break` と `continue` はインライン化されたラムダではまだ利用できませんが、我々はそれらをサポートすることを計画しています。
>
{: .note}

<!--original
> `break` and `continue` are not yet available in inlined lambdas, but we are planning to support them, too.
>
{type="note"}
-->

## reified型パラメータ

(訳注：reifyは具体化する、というような意味)

<!--original
## Reified type parameters
-->

時にはパラメータとして渡された型にアクセスする必要があります。

<!--original
Sometimes we need to access a type passed to us as a parameter:
-->

``` kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

<!--original
``` kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p?.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T
}
```
-->

ここでは、ツリーをたどってリフレクションを使用して、ノードに特定のタイプがあるかどうかを確認します。全く問題はないのですが、呼び出し箇所はそれほど美味しくなりません：

<!--original
Here, we walk up a tree and use reflection to check if a node has a certain type.
It’s all fine, but the call site is not very pretty:
-->

``` kotlin
treeNode.findParentOfType(MyTreeNodeType::class.java)
```

<!--original
``` kotlin
myTree.findParentOfType(MyTreeNodeType::class.java)
```
-->

この関数に単に型を渡せる方が良い解決策でしょう。それなら、以下のように呼び出せます：

<!--original
A better solution would be to simply pass a type to this function. You can call it as follows:
-->

``` kotlin
treeNode.findParentOfType<MyTreeNodeType>()
```

<!--original
``` kotlin
myTree.findParentOfType<MyTreeNodeType>()
```
-->

これを実現するために、インライン関数は *reified型パラメータ* をサポートしています。
そのおかげで、私たちは以下のように書くことができます：

<!--original
To enable this, inline functions support *reified type parameters*, so we can write something like this:
-->

``` kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

<!--original
``` kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p?.parent
    }
    return p as T
}
```
-->

上のコードでは `reified` 修飾子で型パラメータを修飾しています。
これで、関数内で型がアクセス可能になり、これは通常のクラスとまるで同じであるかのように機能します。
関数はインライン化されているので、リフレクションは必要ありません。
`!is` や `as` のような通常の演算子が動作するようになります。
また、前述したようなやりかたで呼び出すことができます：`myTree.findParentOfType<MyTreeNodeType>()`

<!--original
The code above qualifies the type parameter with the `reified` modifier to make it accessible inside the function,
almost as if it were a normal class. Since the function is inlined, no reflection is needed and normal operators like `!is`
and `as` are now available for you to use. Also, you can call the function as shown above: `myTree.findParentOfType<MyTreeNodeType>()`.
-->

リフレクションは多くの場合に必要とされないかもしれませんが、reified型パラメータではリフレクションを使う事も出来ます：

<!--original
Though reflection may not be needed in many cases, we can still use it with a reified type parameter:
-->

``` kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("\n"))
}
```

<!--original
``` kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
  println(membersOf<StringBuilder>().joinToString("\n"))
}
```
-->

通常の関数（`inline`としてマークされていない）はreifiedパラメータをもつことはできません。
実行時表現を持たない型（例えば、reifiedされていない型パラメータや `Nothing` のような架空の型）は、reified 型のパラメータの引数として使用できません。

<!--original
Normal functions (not marked as inline) can not have reified parameters.
A type that does not have a run-time representation (e.g. a non-reified type parameter or a fictitious type like `Nothing`)
can not be used as an argument for a reified type parameter.
-->

## インラインプロパティ

`inline`の修飾子はプロパティのアクセサにも、
[バッキングフィールド](properties.md#バッキングフィールド)を持たないプロパティであればつける事が出来ます。
プロパティの個々のアクセサにアノテート出来ます。

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

プロパティ全体をアノテートする事も出来ます。その場合は両方とも`inline`になります：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

呼び出し側では、インラインのアクセサは通常のインライン関数と同様にインライン化されます。

## パブリックなAPIでのインライン関数の制限

インライン関数が`public`か`protected`で、しかも`private`や`internal`の宣言の一部で無い場合は、
[モジュール](visibility-modifiers.md#モジュール)のパブリックAPIとみなされます。
それは他のモジュールから呼ばれ得るし、
つまりは他のモジュールの呼び出し側でインライン化されます。

これは、モジュールがインライン関数として宣言しているものの中身を変更した時に呼び出し側を再コンパイルしない場合にバイナリ非互換になるリスクがあります。

モジュールが*非*パブリックAPIを変更した時にそのようなリスクを引き起こすのを避ける為に、
パブリックなAPIのインライン関数では、非パブリックなAPIとして宣言されたものを使う事は許されていません。
つまり、`private`や`internal`宣言されているものをそうした関数の本体で使う事は出来ません。

`internal`宣言に`@PublishedApi`アノテーションをつけると、パブリックなAPIのインライン関数で使う事が出来るようになります。
`internal`なインライン関数に`@PublishedApi`マークをつけると、
その本体もパブリックであるかのようにチェックされるようになります。