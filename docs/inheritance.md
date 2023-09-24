---
layout: reference
title: "継承"
---
# 継承

Kotlinの全てのクラスは共通の `Any` スーパークラスをもちます。これはスーパータイプの宣言がないクラスのデフォルトのスーパークラスです。

<!--original
All classes in Kotlin have a common superclass `Any`, that is a default super for a class with no supertypes declared:
-->

``` kotlin
class Example // Anyから暗黙の継承
```

<!--original
``` kotlin
class Example // Implicitly inherits from Any
```
-->

`Any` は `java.lang.Object` ではありません。特に注意すべきは、 `equals()` 、 `hashCode()` 、 `toString()` 以外のメンバを持ちません。 詳細については [Javaとの相互運用性](java-interop.html#object-methods) を参照してください。

<!--original
`Any` is not `java.lang.Object`; in particular, it does not have any members other than `equals()`, `hashCode()` and `toString()`.
Please consult the [Java interoperability](java-interop.html#object-methods) section for more details.
-->

クラスヘッダ内のコロンの後に型を書くと、明示的にスーパータイプを宣言できます：

<!--original
To declare an explicit supertype, we place the type after a colon in the class header:
-->

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

<!--original
``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```
-->

もしこのような（明示的にスーパータイプを宣言する）クラスがプライマリコンストラクタをもつなら、基底の型をプライマリコンストラクタの引数を使用して、そこで初期化できる（し、しなければいけません）。

<!--original
If the class has a primary constructor, the base type can (and must) be initialized right there,
using the parameters of the primary constructor.
-->

もしこのようなクラスがプライマリコンストラクタを持たないならば、セカンダリコンストラクタはそれぞれ基底の型を *super*{: .keyword } キーワードを使って初期化するか、他の初期化してくれるコンストラクタに委譲しなければいけません。この事例では異なるセカンダリコンストラクタが異なる基底の型を持つコンストラクタを呼び出していることに注意すること：

<!--original
If the class has no primary constructor, then each secondary constructor has to initialize the base type
using the *super*{: .keyword } keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:
-->

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

<!--original
``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```
-->

クラスの *open*{: .keyword } アノテーションは、Javaの *final*{: .keyword } と反対です：他のクラスがこのクラスから継承することができます。デフォルトでは、Kotlinのすべてのクラスは [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html) のアイテム17（ *継承またはそれの禁止のためのデザインとドキュメント* ）に合致する final です。

<!--original
The *open*{: .keyword } annotation on a class is the opposite of Java's *final*{: .keyword }: it allows others
to inherit from this class. By default, all classes in Kotlin are final, which
corresponds to [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 17: *Design and document for inheritance or else prohibit it*.
-->

### メンバのオーバーライド

<!--original
### Overriding Members
-->

前述の通り、私たちはKotlinに明示的にすることにこだわります。そして、Javaとは異なり、Kotlinはメンバをオーバーライドできるメンバ（私たちは *open* と呼んでいます）とオーバライド自体に明示的アノテーションを必要とします。

<!--original
As we mentioned before, we stick to making things explicit in Kotlin. And unlike Java, Kotlin requires explicit
annotations for overridable members (we call them *open*) and for overrides:
-->

``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

<!--original
``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```
-->

*override*{: .keyword } アノテーションは `Derived.v()` のために必要です。もしなければ、コンパイラは文句を言うでしょう。もし `Base.nv()` のように *open*{: .keyword } アノテーションが関数になければ、メソッドをサブクラス内で同じ識別子で宣言することは *override*{: .keyword } の有無にかかわらず文法違反です。ファイナルクラス（例えば、 *open*{: .keyword } アノテーションを持たないクラス）の中では、openメンバは禁止されています。

<!--original
The *override*{: .keyword } annotation is required for `Derived.v()`. If it were missing, the compiler would complain.
If there is no *open*{: .keyword } annotation on a function, like `Base.nv()`, declaring a method with the same signature in a subclass is illegal,
either with *override*{: .keyword } or without it. In a final class (e.g. a class with no *open*{: .keyword } annotation), open members are prohibited.
-->

*override*{: .keyword } としてマークされているメンバは、それ自身がopenです。すなわち、サブクラス内でオーバライドされる可能性があります。もし再オーバライドを禁止したければ、 *final*{: .keyword } キーワードを使ってください：

<!--original
A member marked *override*{: .keyword } is itself open, i.e. it may be overridden in subclasses. If you want to prohibit re-overriding, use *final*{: .keyword }:
-->

``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

<!--original
``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```
-->

プロパティのオーバライドもメソッドのオーバライドと同じように動きます。プライマリコンストラクターでプロパティ宣言の一部として、overrideキーワードを使用できることに注意してください。

<!--original
Overriding properties works in a similar way to overriding methods.
Note that you can use the `override` keyword as part of the property declaration in a primary constructor:
-->

``` kotlin
open class Foo {
    open val x: Int get { ... }
}

class Bar1(override val x: Int) : Foo() {

}
```

<!--original
``` kotlin
open class Foo {
    open val x: Int get { ... }
}

class Bar1(override val x: Int) : Foo() {

}
```
-->

`val` プロパティを `var` プロパティでオーバライドすることもでき、その逆もまた然りです（逆もまた同じです）。これは、`val` のプロパティは、本質的にgetterメソッドを宣言しているためであり、それを `var` としてオーバライドすることは、さらにsetterメソッドを派生クラスに宣言しているためです。

<!--original
You can also override a `val` property with a `var` property, but not vice versa.
This is allowed because a `val` property essentially declares a getter method, and overriding it as a `var` additionally declares a setter method in the derived class.

-->

#### 待って！じゃあどうやって自分のライブラリをハックすれば良いの？！

<!--original
#### Wait! How will I hack my libraries now?!
-->

オーバライドのKotlinでの方法（クラスやメンバはデフォルトでfinal）には1つ問題があります。あなたが使用しているライブラリ内の何かをサブクラス化し、 いくつかのメソッドをオーバライドして（ライブラリの設計者はそれを意図していない） そこにいくつかの厄介なハックを導入するのが難しくなる、という問題です。

<!--original
One issue with our approach to overriding (classes and members final by default) is that it would be difficult to subclass something inside the libraries you use to override some method that was not intended for overriding by the library designer, and introduce some nasty hack there.
-->

私たちは、次のような理由から、これは欠点ではないと考えています：

<!--original
We think that this is not a disadvantage, for the following reasons:
-->

* ベストプラクティスは「とにかくこれらのハックを許可すべきではない」ということである
* 同様のアプローチを取っている他の言語 (C++, C#) はうまくいっている
* もし本当にこのハックが必要ならば、それでも方法は残っている：いつでもハックをJavaで書き、Kotlinから呼ぶことができる（ *[Java Interop](java-interop.html)を参照* してください ）し、Aspectフレームワークはいつもこれらの目的にかないます

<!--original
* Best practices say that you should not allow these hacks anyway
* People successfully use other languages (C++, C#) that have similar approach
* If people really want to hack, there still are ways: you can always write your hack in Java and call it from Kotlin (*see [Java Interop](java-interop.html)*), and Aspect frameworks always work for these purposes
-->

### ルールのオーバーライド


<!--original
### Overriding Rules
-->

Kotlinでは、継承の実装は次のルールで定められています：もしクラスが直接のスーパークラスから同じメンバの多くの実装を継承する場合、クラスはこのメンバを継承し、その独自の実装（おそらく、継承されたものの一つを使用して）を提供しなければいけません。スーパータイプの名前を角括弧で記述し、 super キーワードを使用すると、継承された実装のスーパータイプであることを示すことができます。 例： `super<Base>`

<!--original
In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits many implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).
To denote the supertype from which the inherited implementation is taken, we use *super*{: .keyword } qualified by the supertype name in angle brackets, e.g. `super<Base>`:
-->

``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // インタフェースのメンバはデフォルトで'open'
  fun b() { print("b") }
}

class C() : A(), B {
  // オーバライドするためにコンパイラは f() を要求する
  override fun f() {
    super<A>.f() // A.f()の呼び出し
    super<B>.f() // B.f()の呼び出し
  }
}
```

<!--original
``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // interface members are 'open' by default
  fun b() { print("b") }
}

class C() : A(), B {
  // The compiler requires f() to be overridden:
  override fun f() {
    super<A>.f() // call to A.f()
    super<B>.f() // call to B.f()
  }
}
```
-->

`A` と `B` の両方から継承するのは問題なく、 `C` はそれらの関数の唯一の実装であるため `a()` と `b()` も同様です。しかし `f()` については、2つの実装が `C` に継承されているため、 `C` にある `f()` をオーバライドし、曖昧さを排除するため独自の実装を提供する必要があります。

<!--original
It's fine to inherit from both `A` and `B`, and we have no problems with `a()` and `b()` since `C` inherits only one implementation of each of these functions.
But for `f()` we have two implementations inherited by `C`, and thus we have to override `f()` in `C`
and provide our own implementation that eliminates the ambiguity.
-->



All classes in Kotlin have a common superclass, `Any`, which is the default superclass for a class with no supertypes declared:

```kotlin
class Example // Implicitly inherits from Any
```

`Any` has three methods: `equals()`, `hashCode()`, and `toString()`. Thus, these methods are defined for all Kotlin classes.

By default, Kotlin classes are final – they can't be inherited. To make a class inheritable, mark it with the `open` keyword:

```kotlin
open class Base // Class is open for inheritance

```

To declare an explicit supertype, place the type after a colon in the class header:

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

If the derived class has a primary constructor, the base class can (and must) be initialized in that primary constructor
according to its parameters.

If the derived class has no primary constructor, then each secondary constructor has to initialize the base type using
the `super` keyword or it has to delegate to another constructor which does. Note that in this case different secondary
constructors can call different constructors of the base type:

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Overriding methods

Kotlin requires explicit modifiers for overridable members and overrides:

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

The `override` modifier is required for `Circle.draw()`. If it's missing, the compiler will complain. If there is no
`open` modifier on a function, like `Shape.fill()`, declaring a method with the same signature in a subclass is not allowed,
either with `override` or without it. The `open` modifier has no effect when added to members of a final class – a class
without an `open` modifier.

A member marked `override` is itself open, so it may be overridden in subclasses. If you want to prohibit re-overriding,
use `final`:

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## Overriding properties

The overriding mechanism works on properties in the same way that it does on methods. Properties declared on a superclass
that are then redeclared on a derived class must be prefaced with `override`, and they must have a compatible type.
Each declared property can be overridden by a property with an initializer or by a property with a `get` method:

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

You can also override a `val` property with a `var` property, but not vice versa. This is allowed because a `val` property
essentially declares a `get` method, and overriding it as a `var` additionally declares a `set` method in the derived class.

Note that you can use the `override` keyword as part of the property declaration in a primary constructor:

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

## Derived class initialization order

During the construction of a new instance of a derived class, the base class initialization is done as the first step
(preceded only by evaluation of the arguments for the base class constructor), which means that it happens before the
initialization logic of the derived class is run.

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int = 
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

This means that when the base class constructor is executed, the properties declared or overridden in the derived class
have not yet been initialized. Using any of those properties in the base class initialization logic (either directly or
indirectly through another overridden `open` member implementation) may lead to incorrect behavior or a runtime failure.
When designing a base class, you should therefore avoid using `open` members in the constructors, property initializers,
or `init` blocks.

## Calling the superclass implementation

Code in a derived class can call its superclass functions and property accessor implementations using the `super` keyword:

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

Inside an inner class, accessing the superclass of the outer class is done using the `super` keyword qualified with the
outer class name: `super@Outer`:

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```
{kotlin-runnable="true"}

## Overriding rules

In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits multiple implementations of
the same member from its immediate superclasses, it must override this member and provide its own implementation (perhaps,
using one of the inherited ones).

To denote the supertype from which the inherited implementation is taken, use `super` qualified by the supertype name in
angle brackets, such as `super<Base>`:

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // interface members are 'open' by default
}

class Square() : Rectangle(), Polygon {
    // The compiler requires draw() to be overridden:
    override fun draw() {
        super<Rectangle>.draw() // call to Rectangle.draw()
        super<Polygon>.draw() // call to Polygon.draw()
    }
}
```

It's fine to inherit from both `Rectangle` and `Polygon`,
but both of them have their implementations of `draw()`, so you need to override `draw()` in `Square` and provide a separate
implementation for it to eliminate the ambiguity.
