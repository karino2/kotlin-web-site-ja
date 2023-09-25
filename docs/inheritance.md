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

`Any` は三つのメソッド、 `equals()` 、 `hashCode()` 、 `toString()` を持ちます。
つまり、これらのメソッドはすべてのkotlinのクラスで定義されています。

デフォルトでは、Kotlinのクラスは final です。それらは継承出来ません。
クラスを継承可能にするためには、`open`キーワードでマークする必要があります。

<!--original
`Any` has three methods: `equals()`, `hashCode()`, and `toString()`. Thus, these methods are defined for all Kotlin classes.

By default, Kotlin classes are final – they can't be inherited. To make a class inheritable, mark it with the `open` keyword:
-->

```kotlin
open class Base // クラスは継承可能（継承に関してオープンである）
```

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

もし継承したクラスがプライマリコンストラクタをもつなら、
基底の型をプライマリコンストラクタの引数を使用して、プライマリコンストラクタで初期化できる（し、しなければいけません）。

<!--original
If the derived class has a primary constructor, the base class can (and must) be initialized in that primary constructor
according to its parameters.
-->

もし継承したクラスがプライマリコンストラクタを持たないならば、セカンダリコンストラクタはそれぞれ基底の型を *super*{: .keyword } キーワードを使って初期化するか、他の`super`キーワードを使って初期化してくれるコンストラクタに委譲しなければいけません。
この場合は異なるセカンダリコンストラクタはそれぞれ異なる基底の型のコンストラクタを呼び出しても構いません：

<!--original
If the derived class has no primary constructor, then each secondary constructor has to initialize the base type using
the `super` keyword or it has to delegate to another constructor which does. Note that in this case different secondary
constructors can call different constructors of the base type:
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


## メソッドのオーバーライド

<!--original
## Overriding methods
-->

Kotlinはオーバーライド可能なメンバとオーバライドする側の両方に、明示的な修飾(modifier)を必要とします。

<!--original
Kotlin requires explicit modifiers for overridable members and overrides:
-->

``` kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
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

`Circle.draw()`には*override*{: .keyword } 修飾が必要です。
もしなければ、コンパイラは文句を言うでしょう。
もし `Shape.fill()` のように *open*{: .keyword } 修飾が関数になければ、
サブクラス内で同じシグニチャのメソッドを宣言することは *override*{: .keyword } があっても無くても許されません。
ファイナルクラス（つまり *open*{: .keyword } 修飾を持たないクラス）の中では、メンバの`open`修飾は何の意味も持ちません。

<!--original
The `override` modifier is required for `Circle.draw()`. If it's missing, the compiler will complain. If there is no
`open` modifier on a function, like `Shape.fill()`, declaring a method with the same signature in a subclass is not allowed,
either with `override` or without it. The `open` modifier has no effect when added to members of a final class – a class
without an `open` modifier.
-->

*override*{: .keyword } としてマークされているメンバは、それ自身もopenとなります。
すなわち、サブクラス内でオーバライドされる可能性があります。
もし再オーバライドを禁止したければ、 *final*{: .keyword } キーワードを使ってください：

<!--original
A member marked `override` is itself open, so it may be overridden in subclasses. If you want to prohibit re-overriding,
use `final`:
-->

``` kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## プロパティのオーバーライド

プロパティのオーバライドもメソッドのオーバライドと同じように動きます。
基底クラスで宣言されているプロパティが継承されたクラスで再宣言される場合は、
`override`をつけなくてはならず、しかも型が互換（compatible）で無くてはなりません。
各宣言されたプロパティは初期化子や`get`メソッドでオーバーライド出来ます。

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val` プロパティを `var` プロパティとしてオーバライドすることは出来ますが、逆は出来ません。
前者が許されるのは`val` のプロパティは、本質的に`get`メソッドを宣言しているためであり、
それを `var` としてオーバライドすることは、さらに`set`メソッドを追加で派生クラスに宣言する事になるだけだからです。

<!--original
You can also override a `val` property with a `var` property, but not vice versa. This is allowed because a `val` property
essentially declares a `get` method, and overriding it as a `var` additionally declares a `set` method in the derived class.
-->




プライマリコンストラクタでのプロパティ宣言でも、
overrideキーワードを使用できることに注意してください：

<!--original
Note that you can use the `override` keyword as part of the property declaration in a primary constructor:
-->

``` kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // いつも頂点は4つ（訳注：長方形だから）

class Polygon : Shape {
    override var vertexCount: Int = 0  // どんな値にもセットされうる
}
```

<!--original
``` kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```
-->

## 派生クラスの初期化の順番

継承したクラスのインスタンスを新しく作る時には、
基底クラスの初期化が最初のステップとして行われます（唯一それに先立つのは基底クラスのコンストラクタに渡す引数の評価だけです）。
つまり、基底クラスの初期化は派生クラスの初期化のロジックが走るよりも前に起こる、という事です。

{% capture initialization-order %}
//sampleStart
open class Base(val name: String) {

    init { println("基底クラスの初期化") }

    open val size: Int = 
        name.length.also { println("基底クラスのsizeの初期化: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("基底クラスへ渡す引数: $it") }) {

    init { println("継承先クラスの初期化") }

    override val size: Int =
        (super.size + lastName.length).also { println("継承先クラスのsizeの初期化: $it") }
}
//sampleEnd

fun main() {
    println("継承したクラスの作成(\"hello\", \"world\")")
    Derived("hello", "world")
}
{% endcapture %}
{% include kotlin_quote.html body=initialization-order %}

このことは、基底クラスのコンストラクタが実行される時には、
派生クラスで宣言されたりオーバーライドされたプロパティはまだ初期化されてない、という事を意味します。
それらのプロパティなどを基底クラスの初期化処理で使う事は、
直接的であれ`open`メンバの実装を通して間接的にであれ、
おかしな事になったり実行時の失敗（runtime failure）になります。
基底クラスを設計する時には、
コンストラクタ、プロパティの初期化子、`init`ブロックで`open`メンバを使う事は避けましょう。

## 基底クラスの実装の呼び出し

派生クラスのコードは、
基底クラスの関数やプロパティアクセサの実装を、
`super`キーワードを使って呼び出す事が出来ます：

```kotlin
open class Rectangle {
    open fun draw() { println("長方形を描く") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("長方形を塗りつぶす")
    }

    val fillColor: String get() = super.borderColor
}
```

インナークラスの中で外側のクラスの基底クラスにアクセスしたい場合は、
`super`キーワードに外側のクラスの名前をつけます： `super@Outer`のように：

{% capture outer-super %}
open class Rectangle {
    open fun draw() { println("長方形を描く") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("塗りつぶし") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // 長方形のdraw()の実装の呼び出し
            fill()
            println("塗りつぶされた長方形の描画、色は${super@FilledRectangle.borderColor}") // RectangleのborderColorのget()の実装を使用
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}

{% endcapture %}
{% include kotlin_quote.html body=outer-super %}


## オーバーライドのルール


<!--original
### Overriding Rules
-->

Kotlinでは、実装の継承は次のルールで定められています：
もしクラスが直接の基底クラスから同じメンバの複数の実装を継承する場合、
派生クラスはこのメンバをoverrideし、その独自の実装（おそらく、継承されたものの一つを使用して）を提供しなければいけません。

どの基底型から継承した実装かを示すためには、
`super`キーワードに基底型を角括弧でつけます。例えば `super<Base>`のように：

<!--original
In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits multiple implementations of
the same member from its immediate superclasses, it must override this member and provide its own implementation (perhaps,
using one of the inherited ones).

To denote the supertype from which the inherited implementation is taken, use `super` qualified by the supertype name in
angle brackets, such as `super<Base>`:
-->

``` kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } //  // インタフェースのメンバはデフォルトで'open'
}

class Square() : Rectangle(), Polygon {
   // コンパイラはdraw()をオーバライドする事を要求する
   override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw()の呼び出し
        super<Polygon>.draw() // Polygon.draw()の呼び出し
    }
}
```


`Rectangle` と `Polygon`の両方から継承するのは問題ありませんが、
 どちらも `draw()` の実装を持っているため、
 `Square`では`draw()`をoverrideする必要があります。
 独立した実装を提供する事で曖昧さを無くさなくてはいけません。


<!--original
It's fine to inherit from both `Rectangle` and `Polygon`,
but both of them have their implementations of `draw()`, so you need to override `draw()` in `Square` and provide a separate
implementation for it to eliminate the ambiguity.
-->
