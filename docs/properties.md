---
layout: reference
title: "プロパティ"
---
# プロパティ


## プロパティの宣言

<!--original
## Declaring Properties
-->

Kotlinのクラスのプロパティは、*var*{: .keyword } キーワードを使用して、ミュータブル（可変）として宣言することもでき、 *val*{: .keyword } キーワードを使用してイミュータブル（読み取り専用）にすることもできます。

<!--original
Classes in Kotlin can have properties.
These can be declared as mutable, using the *var*{: .keyword } keyword or read-only using the *val*{: .keyword } keyword.
-->

``` kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```


プロパティを使うには、単純に名前で参照するだけで良いです：

<!--original
To use a property, simply refer to it by its name:
-->

``` kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // 'new' キーワードは Kotlin にありません
  result.name = address.name // アクセサが呼ばれる
  result.street = address.street
  // ...
  return result
}
```

<!--original
``` kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // there's no 'new' keyword in Kotlin
  result.name = address.name // accessors are called
  result.street = address.street
  // ...
  return result
}
```
-->

## ゲッターとセッター

<!--original
## Getters and Setters
-->

プロパティを宣言するための完全な構文は次のとおりです：

<!--original
The full syntax for declaring a property is
-->

```
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

イニシャライザ（初期化子）、ゲッター(getter)とセッター(setter)は必須ではありません。
プロパティの型も、イニシャライザから推測出来たり、
getterの返す型から推測出来る場合には必須ではありません：

<!--original
The initializer, getter, and setter are optional. The property type is optional if it can be inferred from the initializer
or the getter's return type, as shown below:
-->

```kotlin
var initialized = 1 // Int型を持ち、デフォルトのゲッターとセッター
// var allByDefault // エラー：明示的なイニシャライザが必要、デフォルトのゲッターとセッターは暗黙
```


<!--original
``` kotlin
var initialized = 1 // has type Int, default getter and setter
// var allByDefault // ERROR: explicit initializer required, default getter and setter implied
```
-->

読み取り専用のプロパティ宣言の完全な構文は、ミュータブルのものと比べて2点異なります。`var` の代わりに `val` で始まるのと、セッターが許されない事です：

<!--original
The full syntax of a read-only property declaration differs from a mutable one in two ways: it starts with `val` instead
of `var` and does not allow a setter:
-->

``` kotlin
val simple: Int? // Int 型を持ち、デフォルトゲッターを持つ。コンストラクタ内で初期化が必要
val inferredType = 1 // Int 型を持ち、デフォルトゲッターを持つ
```

<!--original
``` kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```
-->

プロパティのカスタムアクセサを定義する事も出来ます。
カスタムゲッターを定義すると、プロパティにアクセスする都度毎回呼ばれます（このようにして計算プロパティ（computed property）を実装出来ます）。
ここでは、カスタムゲッターの例を示します：

<!--original
You can define custom accessors for a property. If you define a custom getter, it will be called every time you access
the property (this way you can implement a computed property). Here's an example of a custom getter:
-->

{% capture custom-getter %}
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // ゲッターの戻りの型から推測出来るので、このプロパティの型はオプショナルです
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("幅=${rectangle.width}, 高さ=${rectangle.height}, 面積=${rectangle.area}")
}
{% endcapture %}
{% include kotlin_quote.html body=custom-getter %}

ゲッターから推測出来る場合はプロパティの型は省略出来ます：

```kotlin
val area get() = this.width * this.height
```

カスタムセッターを定義すると、そのプロパティに値をセットする都度、初期化の時を除いて毎回呼ばれるようになります。
カスタムセッターは次のようになります：

<!--original
If you define a custom setter, it will be called every time you assign a value to the property, except its initialization.
A custom setter looks like this:
-->

``` kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // 文字列をパースして他のプロパティへ値を代入する
  }
```

<!--original
``` kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // parses the string and assigns values to other properties
  }
```
-->

慣例により、セッターの引数名は `value` としますが、別の名前が良いならそちらを選択することもできます。

<!--original
By convention, the name of the setter parameter is `value`, but you can choose a different name if you prefer.
-->

アクセサの可視性を変更したりアノテーションを付ける必要があるけれど、デフォルトの実装を変更したくない場合は、その本体を定義せずにアクセサを定義することができます：

<!--original
If you need to annotate an accessor or change its visibility, but you don't want to change the default implementation,
you can define the accessor without defining its body:
-->

``` kotlin
var setterVisibility: String = "abc"
  private set // セッターはプライベートでデフォルトの実装を持つ

var setterWithAnnotation: Any? = null
  @Inject set // セッターに Inject でアノテーションを付ける
```

<!--original
``` kotlin
var setterVisibility: String = "abc"
  private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
  @Inject set // annotate the setter with Inject
```
-->

### バッキングフィールド

(訳注： Backing Fields)

<!--original
### Backing Fields
-->

Kotlinにおいては、フィールドはプロパティの一部としてメモリに値を保持する時にだけ使われます。
フィールドを直接定義する事は出来ません。
しかし、プロパティがバッキングフィールド(backing field)を必要とする時には、Kotlinは自動的にそれを提供します。
このバッキングフィールドはアクセサの中で`field` 識別子を使用して参照することができます：

<!--original
In Kotlin, a field is only used as a part of a property to hold its value in memory. Fields cannot be declared directly.
However, when a property needs a backing field, Kotlin provides it automatically. This backing field can be referenced in
the accessors using the `field` identifier:
-->

``` kotlin
var counter = 0 // イニシャライザはバッキングフィールドに直に書き込む
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // エラー スタックオーバーフロー: 実際の名前である'counter'を使うとセッターの再帰呼び出しを引き起こしてしまう
    }
```

<!--original
``` kotlin
var counter = 0 // the initializer assigns the backing field directly
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: Using actual name 'counter' would make setter recursive
    }
```
-->

`field` 識別子は、プロパティのアクセサの中でのみ使用することができます。

<!--original
The `field` identifier can only be used in the accessors of the property.
-->

バッキングフィールドは、プロパティがアクセサのデフォルトの実装のうち少なくとも1つを使用するか、カスタムアクセサが `field` 識別子でバッキングフィールドを参照した場合に、そのプロパティ用に生成されます。

<!--original
A backing field will be generated for a property if it uses the default implementation of at least one of the accessors,
or if a custom accessor references it through the `field` identifier.
-->

たとえば、以下のような場合にはバッキングフィールドは存在しません：

<!--original
For example, in the following case there will be no backing field:
-->

``` kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

<!--original
``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```
-->

### バッキングプロパティ

<!--original
### Backing Properties
-->

「暗黙のバッキングフィールド」にそぐわないことをやりたい場合には、
いつでも *バッキングプロパティ (backing property)* を持つという代替案が使えます：

<!--original
If you want to do something that does not fit into this _implicit backing field_ scheme, you can always fall back to having
a _backing property_:
-->

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 型パラメータは推論される
        }
        return _table ?: throw AssertionError("他スレッドによってnullをセットされた")
  }
```

<!--original
``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
  get() {
    if (_table == null)
      _table = HashMap() // Type parameters are inferred
    return _table ?: throw AssertionError("Set to null by another thread")
  }
```
-->

> JVMにおいて： privateプロパティへデフォルトゲッターとセッターでアクセスすると、関数呼び出しのオーバヘッドが無いように最適化されます。
>
{: .note}

<!--original
> On the JVM: Access to private properties with default getters and setters is optimized to avoid function call overhead.
>
{type="note"}
-->

## コンパイル時定数

<!--original
## Compile-Time Constants
-->

読み取り専用のプロパティの値がコンパイル時にわかる場合は、 `const` 修飾子を使用して、 **コンパイル時定数 (compile time constants)** としてマークすることができます。
このようなプロパティは、次の要件を満たす必要があります：

<!--original
Properties the value of which is known at compile time can be marked as _compile time constants_ using the `const` modifier.
Such properties need to fulfil the following requirements:
-->

  * トップレベルまたは [object宣言](object-declarations.md#object宣言)か**[コンパニオンオブジェクト](object-declarations.md#コンパニオンオブジェクト)**のメンバ
  * String 型の値またはプリミティブ型で初期化される
  * カスタムゲッターが無い

<!--original
  * Top-level or member of an `object`
  * Initialized with a value of type `String` or a primitive type
  * No custom getter
-->

コンパイラは定数の使用をインライン化してこのプロパティへの参照を実際の値に置き換えます。
しかし、フィールドが削除される訳では無く、だから[リフレクション](reflection.md)を使ってやり取り出来ます。

<!--original
The compiler will inline usages of the constant, replacing the reference to the constant with its actual value. However, the field will not be removed and therefore can be interacted with using [reflection](reflection.md).
-->

このようなプロパティは、アノテーションに使う事も出来ます：

<!--original
Such properties can be used in annotations:
-->

``` kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```


<!--original
``` kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

-->

## 遅延初期化プロパティと変数

<!--original
## Late-initialized properties and variables
-->

通常、非nullable型として宣言されたプロパティは、コンストラクタ内で初期化される必要があります。
しかし、これが便利では無いケースもしばしば見られます。
たとえば、プロパティがDI(dependency injection; 依存性注入, 訳注：[参考](http://blog.a-way-out.net/blog/2015/08/31/your-dependency-injection-is-wrong-as-I-expected/))で初期化されたり、
またはユニットテストのセットアップメソッドで初期化する場合などです。
この手の場合、非nullableのイニシャライザをコンストラクタ内で提供することができませんが、それでもなおクラス内の本体にあるプロパティを参照する際にnullチェックを避けたいでしょう。

<!--original
Normally, properties declared as having a non-nullable type must be initialized in the constructor.
However, it is often the case that doing so is not convenient. For example, properties can be initialized through dependency
injection, or in the setup method of a unit test. In these cases, you cannot supply a non-nullable initializer in the constructor,
but you still want to avoid null checks when referencing the property inside the body of a class.
-->

このようなケースに対応するには、`lateinit` 修飾子でプロパティをマークすると良いでしょう：

<!--original
To handle such cases, you can mark the property with the `lateinit` modifier:
-->

``` kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接参照する(dereference directly)
    }
}
```

<!--original
``` kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```
-->

この修飾子は、クラス本体（プライマリコンストラクタでない）の中で宣言され、カスタムゲッターやカスタムセッターを持たない `var` プロパティ、
トップレベルのプロパティ、ローカル変数などで使用することができます。
プロパティや変数の型が非nullableでなくてはならず、かつプリミティブ型であってはなりません。

<!--original
This modifier can be used on `var` properties declared inside the body of a class (not in the primary constructor,
and only when the property does not have a custom getter or setter), as well as for top-level properties and local variables.
The type of the property or variable must be non-nullable, and it must not be a primitive type.
-->

`lateinit` プロパティが初期化される前にアクセスした場合、アクセスされたプロパティがどれかがわかり、それが初期化されていないことを示すような特別な例外が投げられます。

<!--original
Accessing a `lateinit` property before it has been initialized throws a special exception that clearly identifies the property
being accessed and the fact that it hasn't been initialized.
-->

### `lateinit var`が初期化されたかどうかをチェックする

`lateinit var`がすでに初期化されたかをチェックするには、[そのプロパティのリファレンス](reflection.md#property-references)に対して`.isInitialized`を使います：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

このチェックはレキシカルにアクセス可能な所でだけ使えます。
同じ型内、外側(outer)の型、または同じファイルのトップレベルなどという事です。

## プロパティのオーバライド

<!--original
## Overriding Properties
-->

[プロパティのオーバライド](inheritance.md#プロパティのオーバーライド) を参照してください。

<!--original
See [Overriding Members](classes.html#overriding-members)
-->

## 委譲プロパティ (Delegated Properties)

<!--original
## Delegated Properties
-->
  

プロパティのうち最も一般的なのは、単純にバッキングフィールドからの読み込み（そしてもしかしたら書き込み）ですが、
カスタムゲッターとセッターを使えばプロパティの振る舞いを如何様にも実装できます。
この前者の簡単なケースと後者のなんでも出来るの間には、
プロパティでどんな事をしたいかについての確立された共通パターンがあります。
いくつかの例を挙げます：遅延評価値、与えられたキーでのmapの読み込み、データベースへのアクセス、アクセスをトリガとするリスナへの通知等。

<!--original
The most common kind of property simply reads from (and maybe writes to) a backing field, but custom getters and setters
allow you to use properties so one can implement any sort of behavior of a property.
Somewhere in between the simplicity of the first kind and variety of the second, there are common patterns for what properties
can do. A few examples: lazy values, reading from a map by a given key, accessing a database, notifying a listener on access.
-->

このような共通の振る舞いは、[委譲プロパティ (delegated properties)](delegated-properties.md) を使ってライブラリとして実装することができます。

<!--original
Such common behaviors can be implemented as libraries using [delegated properties](delegated-properties.md).
-->