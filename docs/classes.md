---
layout: reference
title: "クラス"
---
# クラス

Kotlinでのクラスは、*class*{: .keyword }キーワードを使用して宣言されます。

<!--original
Classes in Kotlin are declared using the keyword *class*{: .keyword }:
-->

``` kotlin
class Person { /*...*/ }
```

クラス宣言はクラス名、クラスヘッダ（型パラメータや主コンストラクタ等の指定）、
そして中括弧で括られたクラス本体で構成されます。
ヘッダと本体は両方とも必須ではありません。
クラスに本体がない場合は、中括弧を省略することができます。

<!--original
The class declaration consists of the class name, the class header (specifying its type parameters, the primary
constructor etc.) and the class body, surrounded by curly braces. Both the header and the body are optional;
if the class has no body, curly braces can be omitted.
-->

``` kotlin
class Empty
```


<!--original
``` kotlin
class Empty
```

-->

## コンストラクタ

<!--original
## Constructors
-->

Kotlinのクラスは、 **プライマリコンストラクタ** を持ち、
また1つまたは複数の **セカンダリコンストラクタ** を持つ場合もあります。
プライマリコンストラクタは、クラスのヘッダーとして宣言され、
クラス名（それに型パラメータをつけることもできます）の後に続きます。

<!--original
A class in Kotlin can have a **primary constructor** and one or more **secondary constructors**. The primary
constructor is part of the class header: it goes after the class name (and optional type parameters).
-->

``` kotlin
class Person constructor(firstName: String) { /*...*/ }
```

<!--original
``` kotlin
class Person constructor(firstName: String) {
}
```
-->

プライマリコンストラクタがアノテーションや可視性修飾子を持っていない場合は、 *constructor*{: .keyword }のキーワードを省略することができます。

<!--original
If the primary constructor does not have any annotations or visibility modifiers, the *constructor*{: .keyword }
keyword can be omitted:
-->

``` kotlin
class Person(firstName: String) { /*...*/ }
```

<!--original
``` kotlin
class Person(firstName: String) {
}
```
-->

プライマリコンストラクタはクラスのインスタンスとクラスヘッダにあるプロパティを初期化します。
プライマリコンストラクタは、どんな実行可能コードも含めることはできません。
オブジェクト生成時に何らかのコードを実行したい場合は、
クラス本体の中の**初期化ブロック(initalizer blocks)** を使います。
初期化ブロックは*init*{: .keyword }キーワードの後に中括弧を続けて宣言します。
実行したコードをなんでもこの中括弧の中に書く事が出来ます。

インスタンスの初期化時には、初期化ブロックはクラス本体に現れるのと同じ順番で実行され、
その間にあるプロパティの初期化が挟まる形になります。

<!--original
The primary constructor initializes a class instance and its properties in the class header. The class header can't contain
any runnable code. If you want to run some code during object creation, use _initializer blocks_ inside the class body.
Initializer blocks are declared with the `init` keyword followed by curly braces. Write any code that you want to run
within the curly braces.

During the initialization of an instance, the initializer blocks are executed in the same order as they appear in the
class body, interleaved with the property initializers:
-->

{% capture initializer-block %}
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "最初のプロパティ: $name".also(::println)
    
    init {
        println("最初の初期化ブロックによる $name のプリント")
    }
    
    val secondProperty = "二番目のプロパティ: ${name.length}".also(::println)
    
    init {
        println("二番目の初期化ブロックによる ${name.length} のプリント")
    }
}
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
{% endcapture %}
{% include kotlin_quote.html body=initializer-block %}

プライマリコンストラクタのパラメータは初期化ブロックで使う事が出来ます。
それらのパラメータはまた、クラス本体に宣言されているプロパティの初期化でも使う事が出来ます：

``` kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

<!--original
``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```
-->

Kotlinには、プロパティの宣言と初期化を主コンストラクタから行うための簡潔な構文があります：

<!--original
Kotlin has a concise syntax for declaring properties and initializing them from the primary constructor:
-->

``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

この定義方法では、クラスのプロパティのデフォルト値を含める事も出来ます。

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

クラスのプロパティを宣言する時は、[トレーリングカンマ](coding-conventions.md#トレーリングカンマ)を使う事が出来ます：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

通常のプロパティと同様に、プライマリコンストラクタの中で定義されるプロパティは可変値（ミュータブル） ( *var*{: .keyword } ) または読み取り専用（イミュータブル） ( *val*{: .keyword} ) で宣言することができます。

<!--original
Much the same way as regular properties, the properties declared in the primary constructor can be
mutable (*var*{: .keyword }) or read-only (*val*{: .keyword }).
-->

もしコンストラクタがアノテーションや可視性修飾子を持つ場合は、 *constructor*{: .keyword } キーワードが必要で修飾子はその前に置かれます：

<!--original
If the constructor has annotations or visibility modifiers, the *constructor*{: .keyword } keyword is required, and
the modifiers go before it:
-->

``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```

<!--original
``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```
-->

詳細については、[可視性修飾子](visibility-modifiers.html#コンストラクタ)を参照してください。

<!--original
For more details, see [Visibility Modifiers](visibility-modifiers.html#constructors).

-->

### セカンダリコンストラクタ

<!--original
#### Secondary Constructors
-->

クラスは、 *constructor*{: .keyword } プレフィクスを用いて **セカンダリコンストラクタ** を宣言することができます：

<!--original
The class can also declare **secondary constructors**, which are prefixed with *constructor*{: .keyword }:
-->

``` kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

もしクラスがプライマリコンストラクタを持つなら、それぞれのセカンダリコンストラクタは直接的または他のセカンダリコンストラクタを介して間接的に、プライマリコンストラクタへ委譲する必要があります。
同クラスの他コンストラクタへの委譲は *this*{: .keyword } キーワードを用いて行います：

<!--original
If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class
is done using the *this*{: .keyword } keyword:
-->

``` kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```


初期化ブロックの中のコードは実質的にはプライマリコンストラクタの一部となります。
プライマリコンストラクタへの委譲はセカンダリコンストラクタの最初の文が実行される直前に行われます。
つまり、セカンダリコンストラクタの本体が実行される前にすべての初期化ブロックとプロパティの初期化が実行されるという事です。

<!--original
Code in initializer blocks effectively becomes part of the primary constructor. Delegation to the primary constructor
happens at the moment of access to the first statement of a secondary constructor, so the code in all initializer blocks
and property initializers is executed before the body of the secondary constructor.
-->

クラスがプライマリコンストラクタを持っていなくても、
委譲は暗黙的に行われていて、初期化ブロックはやはり実行されます：

<!--
Even if the class has no primary constructor, the delegation still happens implicitly, and the initializer blocks are
still executed:
 -->


{% capture implicit-primary-constructor %}
//sampleStart
class Constructors {
    init {
        println("Initブロック")
    }

    constructor(i: Int) {
        println("コンストラクタ $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
{% endcapture %}
{% include kotlin_quote.html body=implicit-primary-constructor %}


もし非抽象クラスが何もコンストラクタ（プライマリ、セカンダリ共に）を宣言しなければ、プライマリコンストラクタが引数無しで生成されます。その際のコンストラクタの可視性はpublicになります。

もしpublicなコンストラクタを望まないならば、空のプライマリコンストラクタをデフォルトでない可視性で宣言する必要があります。

<!--original
If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public. If you do not want your class
to have a public constructor, you need to declare an empty primary constructor with non-default visibility:
-->

``` kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> JVMでは、プライマリコンストラクタの全ての引数がデフォルト値を持つなら、
> コンパイラは引数無しコンストラクタを追加で生成し、そのコンストラクタはデフォルト値を使用します。
> これにより、JacksonやJPAのように引数が無いコンストラクタを通してクラスのインスタンスを作るようなライブラリを、
> Kotlinで使いやすくなります。
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{: .note}
 
<!--original
> On the JVM, if all of the primary constructor parameters have default values, the compiler will generate an additional parameterless constructor which will use the default values. This makes it easier to use Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{type="note"}
-->

## クラスのインスタンス生成

<!--original
### Creating instances of classes
-->

クラスのインスタンスを生成するには、コンストラクタを普通の関数のように呼び出せば良いです：

<!--original
To create an instance of a class, we call the constructor as if it were a regular function:
-->

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

<!--original
``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```
-->

> Kotlinに *new*{: .keyword } キーワードはありません。
>
{: .note}

<!--original
> Kotlin does not have a `new` keyword.
>
{type="note"}
-->

ネストされたクラス、インナークラス、そして無名インナークラスの生成時の過程は[ネストされたクラス](nested-classes.html)に記述されています。

<!--original
The process of creating instances of nested, inner, and anonymous inner classes is described in [Nested classes](nested-classes.md).
-->

## クラスメンバ

<!--original
### Class Members
-->

クラスは以下を含めることができます：

<!--original
Classes can contain
-->

* [コンストラクタと初期化ブロック](#コンストラクタ)
* [関数](functions.md)
* [プロパティ](properties.md)
* [ネストしたクラスやインナークラス](nested-classes.md)
* [object宣言](object-declarations.md)


<!--original
* Constructors and initializer blocks
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)

-->

## 継承

クラスは他のクラスから継承出来て、継承ヒエラルキー(inheritance hierarchies)を形成します。
[Kotlinに置ける継承についてより詳しく学ぶ](inheritance.md)。

## 抽象クラス

<!--original
## Abstract Classes
-->

クラスは *abstract*{: .keyword } を使用して抽象クラスとして宣言する事が出来、
そのメンバの幾つか（すべてでも）も*abstract*{: .keyword }を用いて抽象メンバとして宣言出来ます。
抽象メンバはそのクラス内に実装を持ちません。
抽象クラスや抽象関数にopenアノテーションを付ける必要はありません。

<!--original
A class may be declared `abstract`, along with some or all of its members.
An abstract member does not have an implementation in its class.
You don't need to annotate abstract classes or functions with `open`.
-->

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 四角を描く
    }
}
```

（訳注：Polygonは多角形でRectangleは長方形）

非抽象で`open`なメンバを抽象メンバでオーバライドすることもできます。

<!--original
We can override a non-abstract open member with an abstract one
-->

``` kotlin
open class Polygon {
    open fun draw() {
        // なんらかのデフォルトの多角形の描画メソッド
    }
}

abstract class WildShape : Polygon() {
    // WildShapeを継承するクラスはデフォルトのPolygonのdrawメソッドを使わずに、
    // 自分自身のdrawメソッドを提供する必要がある
    abstract override fun draw()
}
```

## コンパニオンオブジェクト (Companion Objects)

<!--original
## Companion Objects
-->

Kotlinでは、JavaやC＃とは異なり、クラスはstaticメソッドを持ちません。ほとんどの場合、代替として、パッケージレベルの関数を使用することが推奨されています。

<!--original
In Kotlin, unlike Java or C#, classes do not have static methods. In most cases, it's recommended to simply use
package-level functions instead.
-->

もしクラスインスタンス無しで呼べるがクラス内部へのアクセスが必要な関数（例えばファクトリメソッド）を書く必要があれば、
そのクラスの中で [object宣言](object-declaration.html) のメンバとして書くことができます。

<!--original
If you need to write a function that can be called without having a class instance but needs access to the internals
of a class (for example, a factory method), you can write it as a member of an [object declaration](object-declarations.html)
inside that class.
-->

より具体的に、[コンパニオンオブジェクト](object-declarations.html#コンパニオンオブジェクト) をクラス内で宣言した場合、
クラス名を識別子として、そのメンバにアクセスすることが出来ます。

<!--original
Even more specifically, if you declare a [companion object](object-declarations.md#companion-objects) inside your class,
you can access its members using only the class name as a qualifier.
-->

