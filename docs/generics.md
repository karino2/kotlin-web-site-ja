---
layout: reference
title: "ジェネリクス： in, out, where"
---
# ジェネリクス： in, out, where

<!--original
# Generics
-->

Javaと同じように、Kotlinのクラスは型パラメータを持つ事が出来ます：

<!--original
Classes in Kotlin can have type parameters, just like in Java:
-->

``` kotlin
class Box<T>(t: T) {
    var value = t
}
```

<!--original
``` kotlin
class Box<T>(t: T) {
  var value = t
}
```
-->

このようなクラスのインスタンスを作成するためには、単に型引数を提供すればよろしい：

<!--original
To create an instance of such a class, simply provide the type arguments:
-->

``` kotlin
val box: Box<Int> = Box<Int>(1)
```

<!--original
``` kotlin
val box: Box<Int> = Box<Int>(1)
```
-->

しかし、パラメータを推測することができる場合には、（例えば、コンストラクタの引数からとか）、型引数を省略することができます：

<!--original
But if the parameters can be inferred, for example, from the constructor arguments,
you can omit the type arguments:
-->

``` kotlin
val box = Box(1) // 1 は Int型のため、コンパイラはBox<Int>だとわかる
```

<!--original
``` kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that it is Box<Int>
```
-->

## 分散

（訳注： varianceの事。アンカのidになるのでサブタイトルには括弧書きでは足していない）

<!--original
## Variance
-->

Javaの型システムの最もトリッキーな部分の一つは、ワイルドカード型（[JavaのジェネリックのFAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)を参照してください）です。
そして、Kotlinにはありません。
その代わり、2つの別のものがあります：宣言箇所の分散(declaration-site variance)と型プロジェクション(type projections)です。

<!--original
One of the trickiest aspects of Java's type system is the wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
Kotlin doesn't have these. Instead, Kotlin has declaration-site variance and type projections.
-->

まずは、Javaがこれらの神秘的なワイルドカードを必要とする理由について考えてみましょう。
この問題は[Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目31「APIの柔軟性を高めるためのバインドされたワイルドカードの使用」で説明されています。
まず、Javaでジェネリック型は **不変(invariant)** です。
これは、 `List<String>` は `List<Object>` のサブタイプ **ではない** ことを意味します。
もしリストが **不変** でなかった場合は、次のコードはコンパイルされ、実行時に例外を発生させていたので、それは、Javaの配列より良いものではなかったでしょう。

<!--original
Let's think about why Java needs these mysterious wildcards. The problem is explained well in 
[Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), 
Item 31: _Use bounded wildcards to increase API flexibility_.
First, generic types in Java are _invariant_, meaning that `List<String>` is _not_ a subtype of `List<Object>`.
If `List` were not _invariant_, it would have been no better than Java's arrays, as the following code would have 
compiled but caused an exception at runtime:
-->

``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! ここでのコンパイルエラーが、後のruntime exceptionを防いでくれます。
objs.add(1); // Integer を Strings のリストへ入れる
String s = strs.get(0); // !!! ClassCastException: Integer を String へキャストできない
```

実行時の安全性を保証するために、Javaはそのようなことを禁止しているのです。
しかし、これはいくつかの含意があります。
例えば、 `Collection` インタフェースの `addAll()` メソッドを考えます。
このメソッドのシグネチャは何でしょうか？
直感的には、こう書けそうなものだと思うでしょう：

<!--original
```java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! A compile-time error here saves us from a runtime exception later.
objs.add(1); // Put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```

Java prohibits such things in order to guarantee run-time safety. But this has implications. For example,
consider the `addAll()` method from the `Collection` interface. What's the signature of this method? Intuitively,
you'd write it this way:
-->

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```

<!--original
``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```
-->

しかしこれだと、次のような簡単なこと（完全に安全である）を行うことができなくなります。

<!--original
But then, we would not be able to do the following simple thing (which is perfectly safe):
-->

``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! addAllのネイティブの宣言ではコンパイルできません：
                   //       Collection<String> は Collection <Object> のサブタイプではありません
}
```

<!--original
``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! Would not compile with the naive declaration of addAll:
                   //       Collection<String> is not a subtype of Collection<Object>
}
```
-->

（あたながJavaを学んでいるなら、この事を苦労して学んだ事だろう。[Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目28「 *配列よりリストを使え* 」を参照してください。）

<!--original
(In Java, you probably learned this the hard way, see [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), 
Item 28: _Prefer lists to arrays_)
-->

これが、 `addAll()` の実際のシグネチャが以下の通りになる理由です：

<!--original
That's why the actual signature of `addAll()` is the following:
-->

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

<!--original
``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```
-->

**ワイルドカード型引数** `? extends E` は、このメソッドが受け入れるコレクションは `E` または**そのサブタイプ** のオブジェクトであって、 `E` だけではないことを示します。
この事は、私たちが安全に `E` をitemsから **読み取る** ことができる（このコレクションの要素は `E` のサブクラスのインスタンスです）けれど、
未知の `E` のサブタイプに対して、どのオブジェクトなら準拠しているかが分からないため、 **書き込みができない** という事を意味します。
この制限と引き換えに、私たちは望んだ動作を得ます： `Collection<String>` は `Collection<? extends Object>` のサブタイプ *である* ということ。
言い換えると、_extends_\-bound (上限（_upper_ bound)）付きのワイルドカードは型を_共変(covariant)_にします。

<!--original
The _wildcard type argument_ `? extends E` indicates that this method accepts a collection of objects of `E`
_or a subtype of_ `E`, not just `E` itself. This means that you can safely _read_ `E`'s from items
(elements of this collection are instances of a subclass of E), but _cannot write_ to
it as you don't know what objects comply with that unknown subtype of `E`.
In return for this limitation, you get the desired behavior: `Collection<String>` _is_ a subtype of `Collection<? extends Object>`.
In other words, the wildcard with an _extends_\-bound (_upper_ bound) makes the type _covariant_.
-->

このトリックがなぜ働くのかを理解するための鍵は、かなりシンプルです：
コレクションからアイテムを **取り出す** ことだけ出来れば、`String` のコレクションを使用して、 `Object` で読み出すのは何も問題ありません。
反対に、コレクションにアイテムを _入れる_ ことだけできるのならば、 `Object` のコレクションを使用し、 `String` を入れても良いのです。 
Javaには `List<? super String>` があって、これは`String`の他に、その基底型ならなんでも受け付けます。

<!--original
The key to understanding why this works is rather simple: if you can only _take_ items from a collection,
then using a collection of `String`s and reading `Object`s from it is fine. Conversely, if you can only _put_ items
into the collection, it's okay to take a collection of `Object`s and put `String`s into it: in Java there is
`List<? super String>`, which accepts `String`s or any of its supertypes.
-->
 
後者は **反変性(contravariance)** と呼ばれ、 
あなたは`List<? super String>` の`String`を引数としたメソッドを呼ぶことのみができます（例えば、 `add(String)` や `set(int, String)` を呼ぶことができます）。
もし`List<T>` の中にある `T` を返す何かを呼んだとき、得るのは `String` ではなく `Object` となります。

<!--original
The latter is called _contravariance_, and you can only call methods that take `String` as an argument on `List<? super String>`
(for example, you can call `add(String)` or `set(int, String)`).  If you call something that returns `T` in `List<T>`,
you don't get a `String`, but rather an `Object`.
-->

ジョシュア・ブロック (Joshua Bloch) はこれらのオブジェクトを 「 **プロデューサ（生産者）** からのみ **読み込み** 、**コンシューマ（消費者）** にのみ **書き込む** 」と呼びました。彼の勧めによると：

> 「最大の柔軟性を得るために、プロデューサやコンシューマを表す入力パラメータにワイルドカードタイプを使用する」
>  次の記憶術 (mnemonic) も提案しています。
> 
> _PECS, Producer-Extends, Consumer-Super を意味します。_
>
{: .tip}

<!--original
>"For maximum flexibility, use wildcard types on input parameters that represent producers or consumers",
> and proposes the following mnemonic:
>
>_PECS stands for Producer-Extends, Consumer-Super._
>
{type="tip"}
-->


> プロデューサオブジェクトを使用する場合（たとえば、 `List<? extends Foo>` ）、このオブジェクト上の `add()` や `set()` を呼び出すことができません。
> しかし、このオブジェクトは **イミュータブル（不変）** であるというわけでもありません。例えば、 `clear()` は全くパラメータを取らないため、リストからすべての項目を削除するために `clear()` を呼び出しても構いません。
>
> ワイルドカード（または分散の他の型）によって唯一保証されるのは **型の安全性** です。不変性(immutability)は全く別の話です。
>
{: .note}

<!--original
> If you use a producer-object, say, `List<? extends Foo>`, you are not allowed to call `add()` or `set()` on this object,
> but this does not mean that it is _immutable_: for example, nothing prevents you from calling `clear()`
> to remove all the items from the list, since `clear()` does not take any parameters at all.
>
>The only thing guaranteed by wildcards (or other types of variance) is _type safety_. Immutability is a completely different story.
>
{type="note"}
-->

### 宣言箇所分散(declaration-site variance)

<!--original
### Declaration-site variance
-->

ジェネリックインターフェイスの `Source<T>` があると仮定します。また、パラメータとして `T` をとるメソッドを持たず、 `T` を返すメソッドのみを持つとします。 

<!--original
Suppose we have a generic interface `Source<T>` that does not have any methods that take `T` as a parameter, only methods that return `T`:
-->

``` java
// Java
interface Source<T> {
    T nextT();
}
```

<!--original
``` java
// Java
interface Source<T> {
  T nextT();
}
```
-->

この場合、 `Source<Object>` 型の変数で `Source<String>` のインスタンスへの参照を保持するのに完全に安全です - 呼び出せるコンシューマメソッドがないからです。しかし、Javaはその事を知らず、そういうコードを禁止します：

<!--original
Then, it would be perfectly safe to store a reference to an instance of `Source<String>` in a variable of
type `Source<Object>` - there are no consumer-methods to call. But Java does not know this, and still prohibits it:
-->

``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Java では許可されていない
  // ...
}
```

<!--original
``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```
-->

これを修正するために、`Source<? extends Object>` 型のオブジェクトを宣言する必要があります。
そうする事は実際の所、意味はありません。
なぜならそのように定義した変数でも、全てのメソッドを以前と同様呼び出せてしまうからです。
より複雑な型にした所で、なんのご利益も得られていません。
しかし、コンパイラはそれを知りません。

<!--original
To fix this, you should declare objects of type `Source<? extends Object>`. Doing so is meaningless,
because you can call all the same methods on such a variable as before, so there's no value added by the more complex type.
But the compiler does not know that.
-->

Kotlinでは、コンパイラにこの種の事柄を説明する方法があります。これは、 **宣言箇所分散(declaration-site variance)** と呼ばれています：
`Source`の **型パラメータ** `T` を `Source<T>` のメンバから **返す** （プロデュースする）のみで、消費されることがない(consumeされることが無い）ということを保証するために、
アノテーションを付けることができます。そのためには、**out** 修飾子を使います：

<!--original
In Kotlin, there is a way to explain this sort of thing to the compiler. This is called _declaration-site variance_:
you can annotate the _type parameter_ `T` of `Source` to make sure that it is only _returned_ (produced) from members
of `Source<T>`, and never consumed.
To do this, use the `out` modifier:
-->

``` kotlin
abstract class Source<out T> {
    abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // これは OK 、なぜなら T はoutパラメータのため
    // ...
}
```

<!--original
``` kotlin
abstract class Source<out T> {
  abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
  val objects: Source<Any> = strs // This is OK, since T is an out-parameter
  // ...
}
```
-->

一般的なルールは次のとおりです。クラス `C` の型パラメータ `T` が、 **out** として宣言されているとき、
`C` のメンバの中で **out** の位置でのみTが現れ得る。
しかしその制約のおかげで、 `C<Base>` は 安全に`C<Derived>` のスーパータイプになる事が出来ます。

<!--original
The general rule is this: when a type parameter `T` of a class `C` is declared `out`, it may occur only in the _out_-position
in the members of `C`, but in return `C<Base>` can safely be a supertype of `C<Derived>`.
-->

言い換えると、クラス `C` は、パラメータ `T` に **共変(covariant)** である、または `T` が **共変** の型パラメータであるとなります。
`C` は `T` の **プロデューサ** であり、 `T` の **コンシューマ** ではない、と考えることができます。

<!--original
In "clever words" they say that the class `C` is **covariant** in the parameter `T`, or that `T` is a **covariant** type parameter. 
You can think of `C` as being a **producer** of `T`'s, and NOT a **consumer** of `T`'s.
-->

**out** 修飾子は、 **分散アノテーション** と呼ばれ、それは型パラメータの宣言箇所で提供されているので、**宣言箇所分散(declaration-site variance)** を提供します。
これは、型を使用する側にワイルドカードをつけて共変にする、Javaの **使用箇所分散(use-site variance)** とは対照的です。

<!--original
The `out` modifier is called a _variance annotation_, and  since it is provided at the type parameter declaration site,
it provides _declaration-site variance_.
This is in contrast with Java's _use-site variance_ where wildcards in the type usages make the types covariant.
-->

**out** に加えて、Kotlinは **in** という補完的な分散(variance)アノテーションを提供します。
これは、型パラメータを **反変(contravariant)** にします。
消費される(consumeされる)のみであり、決してプロデュース（生産）されない、という意味です。
反変クラスの良い例は `Comparable` です：

<!--original
In addition to **out**, Kotlin provides a complementary variance annotation: **in**. It makes a type parameter **contravariant**: it can only be consumed and never 
produced. A good example of a contravariant class is `Comparable`:
-->

``` kotlin
abstract class Comparable<in T> {
    abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 は Number のサブタイプである Double 型をもつ
    // それゆえ、 x を Comparable<Double> 型の変数へ代入できる
    val y: Comparable<Double> = x // OK!
}
```

<!--original
``` kotlin
abstract class Comparable<in T> {
  abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
  x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
  // Thus, we can assign x to a variable of type Comparable<Double>
  val y: Comparable<Double> = x // OK!
}
```
-->

（C#で随分前から使われて成功しているように）**in** と **out** は自己説明的であるゆえに、以前述べたような記憶術（ニーモニック）は不要となります。
より高次の目的のために言い換えることすらできます：

<!--original
The words _in_ and _out_ seem to be self-explanatory (as they've already been used successfully in C# for quite some time),
and so the mnemonic mentioned above is not really needed.  It can in fact be rephrased at a higher level of abstraction:
-->

**[実存的](http://en.wikipedia.org/wiki/Existentialism)言い換え：コンシューマ（消費者）は in、プロデューサ（生産者）は out ！** :-)

<!--original
**[The Existential](http://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)
-->

## タイププロジェクション（型投影）

<!--original
## Type projections
-->

### 利用箇所の分散(Use-site variance)：タイププロジェクション

<!--original
### Use-site variance: Type projections
-->

型パラメータTを*out*として宣言し、使用箇所でサブタイプする問題を避ける事はとても簡単ですが、
ある種のクラスでは`T`は返すだけ、と制限するのが**不可能**な場合もあります。
その良い例は、`Array`です。

<!--original
It is very easy to declare a type parameter `T` as `out` and avoid trouble with subtyping on the use site,
but some classes _can't_ actually be restricted to only return `T`'s!
A good example of this is `Array`:
-->

``` kotlin
class Array<T>(val size: Int) {
    fun get(index: Int): T { /* ... */ }
    fun set(index: Int, value: T) { /* ... */ }
}
```

<!--original
``` kotlin
class Array<T>(val size: Int) {
  fun get(index: Int): T { /* ... */ }
  fun set(index: Int, value: T) { /* ... */ }
}
```
-->

このクラスは `T` の共変または反変のいずれかにもなることはできません。
そして、これはある種の柔軟性に欠けます。
次の関数を考えてみます：

<!--original
This class cannot be either co\- or contravariant in `T`. And this imposes certain inflexibilities. Consider the following function:
-->

``` kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

<!--original
``` kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
  assert(from.size == to.size)
  for (i in from.indices)
    to[i] = from[i]
}
```
-->

この関数は、ある配列から別の配列へ、要素をコピーしようとしています。
それでは、実際にそれを使ってみましょう：

<!--original
This function is supposed to copy items from one array to another. Let's try to apply it in practice:
-->

``` kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3)
copy(ints, any) // エラー： (Array<Any>, Array<Any>) が期待されている
```

<!--original
``` kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3)
copy(ints, any) // Error: expects (Array<Any>, Array<Any>)
```
-->

ここで以前と同様のおなじみの問題に遭遇します： `Array<T>` は `T` において **不変(invariant)** であり、ゆえに `Array<Int>` も `Array<Any>` も、どちらも他方のサブタイプではありません。
どうして違うのか？
コピーが何か予想外の事、たとえば`from` への`String`の **書き込み** などをやっている **可能性がある** ためです。
もしそんなケースの場合にそこに `Int` の配列を実際に渡したら、`ClassCastException` が後になって投げられるでしょう。

<!--original
Here you run into the same familiar problem: `Array<T>` is _invariant_ in `T`, and so neither `Array<Int>` nor `Array<Any>`
is a subtype of the other. Why not? Again, this is because `copy` could have an unexpected behavior, for example, it may attempt to
write a `String` to `from`, and if you actually pass an array of `Int` there, a `ClassCastException` will be thrown later.
-->

`copy()` が `from` に書き込むことを禁止する為には、以下のようにします：

<!--original
To prohibit the `copy` function from _writing_ to `from`, you can do the following:
-->

``` kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

これが **タイププロジェクション（型投影）** です。
この意味する所は、`from` は単純に配列なのではなく、制限された（ **投影された** ）ものであるということです。
型パラメータ `T` を返すメソッドだけを呼ぶ事が出来ます。
つまりこの場合は `get()` を呼ぶことのみができるということです。
これが、 **使用箇所分散(use-site variance)** のための我々のアプローチであり、Javaの `Array<? extends Object>` に対応しますが、少しだけシンプルなものになっています。

<!--original
This is _type projection_, which means that `from` is not a simple array, but is rather a restricted (_projected_) one.
You can only call methods that return the type parameter `T`, which in this case means that you can only call `get()`.
This is our approach to _use-site variance_, and it corresponds to Java's `Array<? extends Object>` while being slightly simpler.
-->

`in` も同様にタイププロジェクション（型投影）で使用できます：

<!--original
You can project a type with `in` as well:
-->

``` kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` は Javaの `Array<? super String>` に対応します。
すなわち、 `CharSequence` の配列や `Object` の配列を `fill()` 関数へ渡すことができます。

<!--original
`Array<in String>` corresponds to Java's `Array<? super String>`, i.e. you can pass an array of `CharSequence` or an array of `Object` to the `fill()` function.
-->

### スタープロジェクション (star-projections)

<!--original
### Star-projections
-->

型引数について何も知らないが、それでも安全な方法で使用したいと、時には言いたくなることもあるでしょう。
ここでの安全な方法とは、
個々のジェネリック型が実際にインスタンス化される時にそのプロジェクションのサブタイプになるような、
そんなジェネリック型のプロジェクションを定義する、という意味です。

<!--original
Sometimes you want to say that you know nothing about the type argument, but you still want to use it in a safe way.
The safe way here is to define such a projection of the generic type, that every concrete instantiation of that generic
type will be a subtype of that projection.
-->

Kotlinはこのために、いわゆる **スタープロジェクション (star-projection)** 構文を提供します：

<!--original
Kotlin provides so called **star-projection** syntax for this:
-->

 - `Foo <out T : TUpper>` の場合、`T` は上限 `TUpper` を持つ共変の型のパラメータであり、そのupper boundは`TUpper`で、`Foo <*>` は `Foo<out TUpper>` と等価となります。これは、 `T` が不明でも、安全に `Foo <*>` から `TUpper` の値を読み取ることができることを意味します。
 - `T` が反変(contravariant)の型パラメータである `Foo<in T>` については、 `Foo<*>` は `Foo <in Nothing>` と等価です。それは `T` が不明な時は `Foo <*>` には何も書き込めない事を意味します。
 - `Foo <T : TUpper>`で`T` は上限 `TUpper` を持つ不変(invariant)の型パラメータの場合は、`Foo<*>`は、値を読み込む時は `Foo<out TUpper>`と等しく、値を書き込む時は `Foo<in Nothing>` と等しくなります。

<!--original
- For `Foo<out T : TUpper>`, where `T` is a covariant type parameter with the upper bound `TUpper`, `Foo<*>` is
  equivalent to `Foo<out TUpper>`. This means that when the `T` is unknown you can safely _read_ values of `TUpper` from `Foo<*>`.
- For `Foo<in T>`, where `T` is a contravariant type parameter, `Foo<*>` is equivalent to `Foo<in Nothing>`. This means
  there is nothing you can _write_ to `Foo<*>` in a safe way when `T` is unknown.
- For `Foo<T : TUpper>`, where `T` is an invariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent
  to `Foo<out TUpper>` for reading values and to `Foo<in Nothing>` for writing values.
-->

ジェネリック型がいくつかの型パラメータをもつ場合、それらは独立してプロジェクション（投影）することができます。
例えば、型が `interface Function<in T, out U>` として宣言されている場合なら、次のようなスタープロジェクションを使用することができます：

<!--original
If a generic type has several type parameters, each of them can be projected independently.
For example, if the type is declared as `interface Function<in T, out U>` you could use the following star-projections:
-->

 - `Function<*, String>` は `Function<in Nothing, String>` を意味します
 - `Function<Int, *>` は `Function<Int, out Any?>` を意味します
 - `Function<*, *>` は `Function<in Nothing, out Any?>` を意味します

<!--original
 - `Function<*, String>` means `Function<in Nothing, String>`;
 - `Function<Int, *>` means `Function<Int, out Any?>`;
 - `Function<*, *>` means `Function<in Nothing, out Any?>`.
-->

> スタープロジェクションは非常にJavaの raw タイプににていますが、安全です。
>
{: .note}

<!--original
*Note*: star-projections are very much like Java's raw types, but safe.
-->

## ジェネリック関数

<!--original
## Generic functions
-->

型パラメータを持つことができるのはクラスだけではありません。関数も同じです。
型パラメータは、関数名の前に置かれます。

<!--original
Not only classes can have type parameters. Functions can, too. Type parameters are placed before the name of the function:
-->

``` kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString() : String {  // 拡張関数
    // ...
}
```

<!--original
``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}

fun <T> T.basicToString() : String {  // extension function
  // ...
}
```
-->

ジェネリック関数を呼び出すには、関数名の **後に** 呼び出し箇所で型引数を指定します。

<!--original
To call a generic function, specify the type arguments at the call site **after** the name of the function:
-->

``` kotlin
val l = singletonList<Int>(1)
```

<!--original
``` kotlin
val l = singletonList<Int>(1)
```
-->

型引数は文脈から推測出来る時には省略可能です。だから以下のようにも書く事が出来ます：

```kotlin
val l = singletonList(1)
```

## ジェネリックの制約

<!--original
# Generic constraints
-->

ある型パラメータに置換することができるすべての許容される型の集合を、 **ジェネリック制約(generic constraints)** によって制限する事が出来ます。

<!--original
The set of all possible types that can be substituted for a given type parameter may be restricted by **generic constraints**.
-->

### 上限

<!--original
## Upper bounds
-->

制約の最も一般的なタイプは、Javaの extends キーワードに対応する **上限(upper bound)** です。

<!--original
The most common type of constraint is an **upper bound** that corresponds to Java's *extends* keyword:
-->

``` kotlin
fun <T : Comparable<T>> sort(list: List<T>) { ... }
```

<!--original
``` kotlin
fun <T : Comparable<T>> sort(list: List<T>) {
  // ...
}
```
-->

コロンの後に指定されたタイプが **上限** です。 `Comparable<T>` のサブタイプだけを `T` として置換することができます。例えば：

<!--original
The type specified after a colon is the **upper bound**: only a subtype of `Comparable<T>` may be substituted for `T`. For example
-->

``` kotlin
sort(listOf(1, 2, 3)) // OK. Int は Comparable<Int> のサブタイプです
sort(listOf(HashMap<Int, String>())) // エラー： HashMap<Int, String> は Comparable<HashMap<Int, String>> のサブタイプではない
```

<!--original
``` kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```
-->

デフォルトの上限（いずれも指定されていない場合）は `Any?` です。角括弧内では上限は一つだけ指定することができます。
同じ型パラメータに複数の上限を必要とする場合、独立した **where** 句が必要になります：

<!--original
The default upper bound (if there was none specified) is `Any?`. Only one upper bound can be specified inside the angle brackets.
If the same type parameter needs more than one upper bound, you need a separate _where_\-clause:
-->

``` kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

<!--original
``` kotlin
fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable,
          T : Cloneable {
  return list.filter { it > threshold }.map { it.clone() }
}
```
-->

## Definitely non-nullable型

(訳注：確実にnullableじゃない型)

Javaのジェネリック型とインターオペラブルにする為に、
Kotlinはジェネリック型パラメータを**definitely non-nullable(確実にnullableじゃない)**として
宣言する事が出来ます。

ジェネリック型`T`をdefinitely non-nullableにするには、型を`& Any`をつけて宣言します。
例えば、`T & Any`のように。

definitely non-nullalbe型は[上限（upper bound）](#上限)としてnullableを持たなくてはいけません。

definitely non-nullalbe型を使うもっとも一般的なユースケースとしては、
`@NotNull`を引数に持つJavaのメソッドをオーバーライドしたい時です。
例えば、以下の`load`メソッドを考えます：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlin側でこの`load()`メソッドを正しくオーバーライドする為には、
以下のT1をdefinitely non-nullableとして宣言する必要があります：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 は definitely non-nullable
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlinだけで作業している分には、definitely non-nullable型を明示的に宣言する必要は無いでしょう。
というのは、Kotlinの型推論はこのケースを面倒見てくれるはずだからです。

## 型消去(Type erasure)

Kotlinが行うジェネリック宣言の使用の型安全性チェックはコンパイル時に行われます。
実行時には、ジェネリック型のインスタンスは実際の型引数について、何の情報も持ちません。
型情報は_消去された(erased)_と言います。
例えば、`Foo<Bar>`や`Foo<Baz?>`のインスタンスは消去されて単に`Foo<*>`になります。

### ジェネリクスの型チェックとキャスト

型消去の為に、実行時にジェネリック型のインスタンスがある引数で作られたかどうかをチェックする一般的な方法は存在しません。
そしてコンパイラはそのような`is`チェックを禁止しています。
つまり`ints is List<Int>`とか`list is T`(型パラメータ)とかは禁止です。
しかしながら、スタープロジェクトされた型のインスタンスかどうかについてはチェック出来ます：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // この要素は `Any?` と型づけされる
}
```

また、もしすでに(コンパイル時に)静的にチェックされた型引数を持っている場合、
ジェネリックと関係無い部分については`is`チェックをしたりキャストしたり出来ます。
この場合角括弧は省略される事に注意：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` は `ArrayList<String>` にスマートキャストされる
    }
}
```

型引数を考慮しないキャストもキャストと同様だけれど型引数を省略したシンタックスで行えます： `list as ArrayList`

ジェネリックな関数呼び出しの型引数のチェックもコンパイル時にだけチェックされます。
関数の本体（body）では型パラメータは型チェックには使えません。
型パラメータへのキャスト(`foo as T`)はチェックされません。
唯一の例外はインライン関数の[reified型パラメータ](inline-functions.md#reified型パラメータ)です。
そのケースでは、呼び出し箇所（call site）で実際の型引数を持っています。
この事が、型パラメータによる型チェックやキャストを可能にします。
しかしながら、上に述べた制限は、
内部でチェックやキャストに使われるジェネリック型のインスタンスに依然として適用されます。
例えば、型チェックの`arg is T`において、`arg`がジェネリック型自身のインスタンスだったならば、
その型引数は依然として除去されます。

（訳注：うまく訳せなかったが、ようするにargが`List<String>`などのように何らかのジェネリック型のインスタンスの場合、いくらTの方がreifiedであってもargの方の型の`String`がtype erasureで除去されてしまう事は同様、という事が言いたいのだと思う）

<!-- 
The type arguments of generic function calls are also only checked at compile time. Inside the function bodies,
the type parameters cannot be used for type checks, and type casts to type parameters (`foo as T`) are unchecked.
The only exclusion is inline functions with [reified type parameters](inline-functions.md#reified-type-parameters),
which have their actual type arguments inlined at each call site. This enables type checks and casts for the type parameters.
However, the restrictions described above still apply for instances of generic types used inside checks or casts.
For example, in the type check `arg is T`, if `arg` is an instance of a generic type itself, its type arguments are still erased.
-->

{% capture reified-erase %}
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)


val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // コンパイル出来てしまうけれど型安全性を損なう！
// より詳細を見たければ、Expandしてみてください

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // この行は ClassCastException をthrowします。なぜならリストの要素はStringでは無いからです。
}
{% endcapture %}
{% include kotlin_quote.html body=reified-erase %}

### チェック無しキャスト （Unchecked casts）

具体的な型引数を与えたジェネリック型への型キャスト、例えば`foo as List<String>`のようなものは、実行時にはチェック出来ない。
このようなチェック無しキャスト（Unchecked casts）は、高レベルのプログラムのロジックからは類推出来るけれどコンパイラが直接推測する事が出来ないようなケースで使われる事がある。
以下の例を見てください。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("文字列から任意の要素へのマップを読み出してください")
}

// `Int`のマップをこのファイルに保存してある
val intsFile = File("ints.dictionary")

// Warning: チェック無しキャスト！: `Map<String, *>` から `Map<String, Int>` へ
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

最後の行ではワーニングが出ています。
コンパイラは実行時にMapの型引数の`Int`の部分をちゃんとチェックする事は出来ず、
型引数が`Int`である保証を与える事は出来ません。

チェック無しキャストを避ける為に、
プログラムの構造を再設計する事が出来ます。
上の例では、`DictionaryReader<T>` と `DictionaryWriter<T>` インターフェースに個々の型ごとに型安全な実装を提供する事で、
チェック無しキャストを呼び出し元から単なる実装の詳細へと移動できる、リーズナブルな抽象を導入出来ます。
適切な[ジェネリクスの分散（variance）](#分散)の利用もまたこの助けとなります。

ジェネリック関数の場合、[reified型パラメータ](inline-functions.md#reified型パラメータ)を使えば、
`arg as T`のようなキャストをチェック有りに出来ます。
けれどこの場合も`arg`の型が型除去（type erased）されてしまう型引数を持っている場合はやはりチェック無しキャストになってしまう事には注意しましょう。

<!--
For generic functions, using [reified type parameters](inline-functions.md#reified-type-parameters) makes casts
like `arg as T` checked, unless `arg`'s type has *its own* type arguments that are erased.
-->

チェック無しキャストのワーニングは[アノテーション](annotations.md)で抑制する事が出来ます。
ワーニングの出ている式や宣言に`@Suppress("UNCHECKED_CAST")`をつけると抑制出来ます：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**JVMでは**: [配列型](arrays.md) (`Array<Foo>`) はその要素に関する型除去(type erased)された情報を保持していて、
> 配列型へのキャストは部分的にはチェックされます：
> nullablityや要素がさらに型引数を持っている場合のその型引数などはやはり除去されます。
> 例えば、キャスト `foo as Array<List<String>?>` は、
> `foo`が`List<*>`を保持する配列なら成功します。
> nullableかどうかも関係ありません。
>
{: .note}

## 型引数に対するアンダースコア演算子

アンダースコア演算子 `_` を型引数に使う事が出来ます。
他の明示的に指定した型引数から推論出来る場合に使います：

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // TはStringと推論される。なぜならSomeImplementationはSomeClass<String>を継承しているから
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // TはIntと推論される。なぜならOtherImplementationはSomeClass<Int>を継承しているから
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```
