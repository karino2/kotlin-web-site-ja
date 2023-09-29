---
layout: reference
title: "委譲プロパティ (Delegated Properties)"
---
# 委譲プロパティ (Delegated Properties)

<!--original
# Delegated Properties
-->
ある種のプロパティは、
必要なときに毎回手作りで実装することもできなくは無いけれど、
一度実装してライブラリに入れて、それをあとで再利用出来る方が嬉しい事があります。
例としては：

<!--original
There are certain common kinds of properties, that, though we can implement them manually every time we need them, 
would be very nice to implement once and for all, and put into a library. Examples include
-->

* 遅延プロパティ (*lazy* properties) ：値は最初のアクセス時に初めて計算されます
* *observable*プロパティ：リスナがこのプロパティの変更に関する通知を受け取ります
* 各プロパティをそれぞれ別のフィールドにはせずに、*マップ*に保存するようなプロパティ

<!--original
* _Lazy_ properties: the value is computed only on first access.
* _Observable_ properties: listeners are notified about changes to this property.
* Storing properties in a _map_ instead of a separate field for each property.
-->

これら（およびその他）のケースをカバーするために、Kotlinは、 *委譲プロパティ (delegated properties)* をサポートしています。

<!--original
To cover these (and other) cases, Kotlin supports _delegated properties_:
-->

``` kotlin
class Example {
    var p: String by Delegate()
}
```

<!--original
``` kotlin
class Example {
  var p: String by Delegate()
}
```
-->

構文は次のとおりです `val/var <プロパティ名>: <型> by <式>`。
`by`の後の式は_委譲（delegate）_です。
というのは、そのプロパティに対応した`get()` （と `set()` ）は、
その式の `getValue()` および `setValue()` メソッドに委譲されるからです。
プロパティの委譲には、特別なインターフェイスを実装する必要はありませんが、
`getValue()` 関数（そして*var*{:.keyword}の場合は `setValue()`関数）を提供する必要があります。例えば：

<!--original
The syntax is: `val/var <property name>: <Type> by <expression>`. The expression after `by` is a _delegate_,
because the `get()` (and `set()`) that correspond to the property will be delegated to its `getValue()` and `setValue()` methods.
Property delegates don't have to implement an interface, but they have to provide a `getValue()` function (and `setValue()` for `var`s).

For example:
-->

``` kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, '${property.name}'を私に委譲してくれてありがとう！"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value は $thisRef の '${property.name}' に代入された。")
    }
}
```

<!--original
``` kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```
-->

`p` を読み込むと、`Delegate`のインスタンスに委譲されて、`Delegate`の`getValue()`が呼ばれます。
その最初のパラメータは、 `p` を読み取る対象となるオブジェクトであり、2番目のパラメータは、 `p` 自体の情報を保持しています（例えば、そこから名前を得ることができます）。例えば：

<!--original
When you read from `p`, which delegates to an instance of `Delegate`, the `getValue()` function from `Delegate` is called.
Its first parameter is the object you read `p` from, and the second parameter holds a description of `p` itself
(for example, you can take its name). 
-->

``` kotlin
val e = Example()
println(e.p)
```

<!--original
``` kotlin
val e = Example()
println(e.p)
```
-->

これは次の通り出力します

<!--original
This prints 
-->

```
Example@33a17727, 'p'を私に委譲してくれてありがとう！
```

<!--original
```
Example@33a17727, thank you for delegating ‘p’ to me!
```
-->
 
同様に、`p` に代入すると`setValue()` 関数が呼び出されます。
最初の2つのパラメータは同じであり、3つ目は、代入された値を保持します。

<!--original
Similarly, when we assign to `p`, the `setValue()` function is called. The first two parameters are the same, and the third holds the value being assigned:
-->

``` kotlin
e.p = "NEW"
```

<!--original
``` kotlin
e.p = "NEW"
```
-->

これは次の通り出力します

<!--original
This prints
-->
 
```
NEW は Example@33a17727 の ‘p’ に代入された。
```

<!--original
```
NEW has been assigned to ‘p’ in Example@33a17727.
```
-->

委譲される側のオブジェクトに要求される仕様は[以下](#プロパティを委譲するための要件)に説明があります。

関数やコードブロックの中で委譲プロパティを定義する事も出来ます。別にクラスのメンバである必要はありません。
以下に[その例](#ローカル委譲プロパティ)も出てきます。


## 標準デリゲート

<!--original
## Standard Delegates
-->

Kotlin標準ライブラリでは、いくつかの有用なデリゲートのファクトリメソッドを提供します。

<!--original
The Kotlin standard library provides factory methods for several useful kinds of delegates.
-->

### 遅延プロパティ (lazy properties)

<!--original
### Lazy properties
-->

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) はラムダを引数にとり、遅延プロパティを実装するためのデリゲートとして機能する `Lazy<T>` のインスタンスを返す関数です。
最初の`get()` の呼び出しは `lazy()` に渡されたラムダを実行し、結果を記憶します。 それ以降、`get()` を呼び出すと、単に記憶された結果が返されます。

<!--original
[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) is a function that takes a lambda and returns an instance of `Lazy<T>`, which can serve as a delegate for implementing a lazy property.
The first call to `get()` executes the lambda passed to `lazy()` and remembers the result.
Subsequent calls to `get()` simply return the remembered result. 
-->

{% capture lazy-delegate %}
val lazyValue: String by lazy {
    println("計算実行!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
{% endcapture %}
{% include kotlin_quote.html body=lazy-delegate %}

<!--original
``` kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```
-->

デフォルトでは、遅延プロパティの評価は **同期されます(synchronized)** 。
値は1つのスレッドで計算され、すべてのスレッドから同じ値が見えます。
もし初期化デリゲートの同期が必要ではない場合は、 複数のスレッドが同時に初期化を実行できるように `LazyThreadSafetyMode.PUBLICATION` を `lazy()` 関数のパラメータとして渡します。

初期化が常に単一のスレッドで起こると確信しているなら、任意のスレッドの安全性の保証および関連するオーバーヘッドが発生しない `LazyThreadSafetyMode.NONE` モードを使用することができます。
このモードは一切のスレッドセーフティの保証をせず、関連するオーバーヘッドも存在しません。

<!--original
By default, the evaluation of lazy properties is **synchronized**: the value is computed only in one thread, and all threads
will see the same value. If the synchronization of initialization delegate is not required, so that multiple threads
can execute it simultaneously, pass `LazyThreadSafetyMode.PUBLICATION` as a parameter to the `lazy()` function. 
And if you're sure that the initialization will always happen on a single thread, you can use `LazyThreadSafetyMode.NONE` mode, 
which doesn't incur any thread-safety guarantees and the related overhead.

-->

### Observableプロパティ

<!--original
### Observable
-->

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) は、2つの引数を取ります。
初期値と修正のためのハンドラです。
ハンドラはプロパティに値が代入されるたびに（代入が行われた _後_ に）呼び出されます。
それには3つのパラメータがあり、割り当てられているプロパティ、古い値、そして新しい値です：

<!--original
`Delegates.observable()` takes two arguments: the initial value and a handler for modifications.
The handler gets called every time we assign to the property (_after_ the assignment has been performed). It has three
parameters: a property being assigned to, the old value and the new one:
-->

{% capture observable-delegate %}
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
{% endcapture %}
{% include kotlin_quote.html body=observable-delegate %}

<!--original
``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```
-->

もし代入に割り込んで、場合によってはそれを*拒否(veto)*したい場合には、
`observable()`の代わりに[`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html)を使うと良いでしょう。
 `vetoable` に渡されたハンドラは、新しいプロパティ値の割り当てが行われる _前_ に呼び出されます。

<!--original
If you want to be able to intercept an assignment and "veto" it, use `vetoable()` instead of `observable()`.
The handler passed to the `vetoable` is called _before_ the assignment of a new property value has been performed.
-->

## 他のプロパティへの委譲

プロパティは、そのゲッターとセッターを他のプロパティに委譲する事が出来ます。
そのような委譲はトップレベルとクラスのプロパティで使用可能です（メンバと拡張（extension））。
委譲されるプロパティは：
* トップレベルのプロパティ
* 同じクラスのメンバや拡張（extension）プロパティ
* 他のクラスのメンバや拡張プロパティ

あるプロパティを別のプロパティに委譲するには、委譲先の名前に`::`の限定子（qualifier）をつけます。
例えば、`this::delegate`や`MyClass::delegate`など。

<!--
A property can delegate its getter and setter to another property. Such delegation is available for
both top-level and class properties (member and extension). The delegate property can be:
* A top-level property
* A member or an extension property of the same class
* A member or an extension property of another class

To delegate a property to another property, use the `::` qualifier in the delegate name, for example, `this::delegate` or
`MyClass::delegate`.

 -->


```kotlin
var topLevelInt: Int = 0
class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt
    
    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}
var MyClass.extDelegated: Int by ::topLevelInt
```

この機能は例えば、プロパティのりネームを後方互換を保ちつつ行う時などに便利でしょう：
新しいプロパティを作り、古い方には`@Deprecated`アノテーションをつけて、そして実装を委譲する訳です。

{% capture backward-compat-rename %}
class MyClass {
   var newName: Int = 0
   @Deprecated("代わりに 'newName' を使ってね", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // Notification: 'oldName: Int' is deprecated.
   // 代わりに 'newName' を使ってね
   myClass.oldName = 42
   println(myClass.newName) // 42
}
{% endcapture %}
{% include kotlin_quote.html body=backward-compat-rename %}


## プロパティをマップに格納する

<!--original
## Storing Properties in a Map
-->

一般的な委譲プロパティの使用例のひとつとして、プロパティの値をマップ内に記憶するというのがあります。
これはJSONをパースしたり、他の「動的」なことをやるようなアプリケーションで頻繁に遭遇します。
このケースでは、委譲プロパティのデリゲートとしてマップのインスタンス自体を使用することができます。

<!--original
One common use case is storing the values of properties in a map.
This comes up often in applications for things like parsing JSON or performing other dynamic tasks.
In this case, you can use the map instance itself as the delegate for a delegated property.
-->

``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

<!--original
``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```
-->

この例では、コンストラクタは、マップを取ります。

<!--original
In this example, the constructor takes a map:
-->

``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

<!--original
``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```
-->

委譲プロパティは、このマップから文字列キーを使って値を取り出します。
この文字列キーはプロパティの名前に対応しています：

<!--original
Delegated properties take values from this map through string keys, which are associated with the names of properties:
-->

{% capture delegate-map-example %}
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))
//sampleStart
    println(user.name) // 出力："John Doe"
    println(user.age)  // 出力：25
//sampleEnd

{% endcapture %}
{% include kotlin_quote.html body=delegate-map-example %}


読み取り専用 `Map` の代わりに `MutableMap` を使用すると、*var*{:.keyword} のプロパティに対しても動作します：

<!--original
This also works for `var`'s properties if you use a `MutableMap` instead of a read-only `Map`:
-->

``` kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

<!--original
``` kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```
-->

## ローカル委譲プロパティ

(Local delegated properties)

ローカル変数を委譲プロパティとして宣言する事も出来ます。
例えば、ローカル変数を遅延プロパティ（lazy）にしたり出来ます：

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

（訳注：memoizedはいわゆる`メモ化`の事だと思われる）

`memoizedFoo`変数 は最初のアクセスの時だけ計算される。
`someCondition`が満たされなければ、この変数は一切計算されない。

## プロパティを委譲するための要件

<!--original
## Property Delegate Requirements
-->


**読み取り専用**プロパティ（すなわち *val*{:.keyword}）のために、デリゲートは、次のパラメータを取る `getValue()` という名前の関数を提供する必要があります。

<!--original
For a **read-only** property (i.e. a *val*{:.keyword}), a delegate has to provide a function named `getValue` that takes the following parameters:
-->

* `thisRef` は、_プロパティの所有者_ のと同じ型かその基底型でなければなりません（拡張プロパティの場合は拡張される対象の型）。
* `property` は、型 `KProperty <*>`またはその基底型でなければなりません。

<!--original
* `thisRef` must be the same type as, or a supertype of, the *property owner* (for extension properties, it should be the type being extended).
* `property`  must be of type `KProperty<*>` or its supertype.
-->

`getValue()`は、プロパティと同じ型（またはそのサブタイプ）を返さなければなりません。

<!--original
`getValue()` must return the same type as the property (or its subtype).
-->

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

**変更可能な** プロパティ ( *var*{:.keyword} ) の場合、デリゲートは、さらに`setValue()` という名前の関数で次のパラメータを取るものを追加で提供する必要があります：

<!--original
For a *mutable* property (`var`), a delegate has to additionally provide an operator function `setValue()`
with the following parameters:
-->
 
* `thisRef`は、_プロパティの所有者_ のと同じ型かその基底型でなければなりません（拡張プロパティの場合は拡張される対象の型）。
* `property` は、型 `KProperty <*>`またはその基底型でなければなりません。
* `value` はプロパティと同じ型（またはその基底型）でなければなりません。

<!--original
* `thisRef` must be the same type as, or a supertype of, the *property owner* (for extension properties, it should be the type being extended).
* `property` must be of type `KProperty<*>` or its supertype.
* `value` must be of the same type as the property (or its supertype).
-->

```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

`getValue()` および/または `setValue()` 関数は、委譲クラスのメンバ関数か、拡張関数のどちらかの形で提供することができます。
もともとはこれらの機能を提供していないオブジェクトにプロパティを委譲する必要がある場合、後者が便利です。
関数の両方を `operator` キーワードでマークする必要があります。

<!--original
`getValue()` and/or `setValue()` functions can be provided either as member functions of the delegate class or as extension functions.
The latter is handy when you need to delegate a property to an object that doesn't originally provide these functions.
Both of the functions need to be marked with the `operator` keyword.
-->

新しいクラスを作らずに無名オブジェクトでデリゲートを作る事も出来ます。
その為にはKotlinの標準ライブラリの`ReadOnlyProperty`と`ReadWriteProperty`インターフェースを使います。
これらは必要なメソッドを提供しています：`getValue()`は`ReadOnlyProperty`に定義されていて、
`ReadWriteProperty`はそれを継承してさらに`setValue()`を追加しています。
これはつまり、`ReadOnlyProperty`が渡せる所にはいつでも`ReadWriteProperty`を渡す事が出来る、という事を意味します。

<!--
You can create delegates as anonymous objects without creating new classes, by using the interfaces `ReadOnlyProperty` and `ReadWriteProperty` from the Kotlin standard library.
They provide the required methods: `getValue()` is declared in `ReadOnlyProperty`; `ReadWriteProperty`
extends it and adds `setValue()`. This means you can pass a `ReadWriteProperty` whenever a `ReadOnlyProperty` is expected.
-->

```kotlin
fun resourceDelegate(resource: Resource = Resource()): ReadWriteProperty<Any?, Resource> =
    object : ReadWriteProperty<Any?, Resource> {
        var curValue = resource 
        override fun getValue(thisRef: Any?, property: KProperty<*>): Resource = curValue
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: Resource) {
            curValue = value
        }
    }

val readOnlyResource: Resource by resourceDelegate()  // ReadWriteProperty を val に使う
var readWriteResource: Resource by resourceDelegate()
```

## 委譲プロパティのトランスレーションルール

水面下では、Kotlinコンパイラはある種の委譲プロパティの場合には、補助的なプロパティを生成して、それに委譲します。

> 最適化のために、コンパイラは[幾つかのケースでは補助的なプロパティを生成**しません**](#委譲プロパティが最適化されるケース)。
> [他のプロパティへの委譲](#他のプロパティへの委譲の場合のトランスレーションルール)の例で最適化について学べます。
>
{: .note}

例えば、プロパティ`prop`に対しては隠しプロパティの`prop$delegate`が生成されて、アクセサのコードは単にこの追加のプロパティに委譲します：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// このコードがコンパイラに生成される
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlinコンパイラは`prop`についての必要な全情報を提供します： 最初の引数の`this`は外側のクラス`C`のインスタンスで、`this::prop`は`prop`自身を記述する`KProperty`型のリフレクションオブジェクトです。

### 委譲プロパティが最適化されるケース

`$delegate` フィールドはデリゲートが以下のケースでは省略されます：
* プロパティの参照（referenced property）:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 名前付きオブジェクト:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* finalな `val` プロパティでバッキングフィールドがあってデフォルトのゲッターで同じモジュールにある場合：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 定数式、列挙型のエントリ、`this`、 `null`など。 以下は`this`の例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 他のプロパティへの委譲の場合のトランスレーションルール

他のプロパティへ委譲する時は、参照先のプロパティへ直接参照するコードを生成する。
それが意味する所は、`prop$delegate`フィールドは生成されない、という事だ。
この最適化はメモリを節約してくれる。

以下のコードを見てみよう：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop`変数へのプロパティアクセサは、`impl`変数を直接実行し、
`getValue`と`setValue`演算子を省略し、その結果`KProperty`参照オブジェクトは不要となる。

さきほどのコードから、コンパイラは以下のコードを生成する：

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // このメソッドはリフレクションの為だけに必要
}
```

## 委譲の提供（Providing a delegate）

`provideDelegate`演算子を定義すると、
プロパティの実装が委譲される対象のオブジェクトの生成のロジックを拡張出来る。
`by`の右側で使われるオブジェクトに`provideDelegate`がメンバか拡張（extension）として定義してあると、
プロパティの委譲先インスタンス（delegate instance）を作るのに呼ばれる。

`provideDelegate`の考えられるユースケースの一つに、
その初期化時に対象のプロパティの一貫性をチェックするというのが挙げられる。

例えば、バインディングに先立ちプロパティの名前をチェックするには、以下のようなコードを書く事が出来る：

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}
    
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // デリゲートの作成
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate`のパラメータは`getValue`のものと同じです：

* `thisRef` は、_プロパティの所有者_ のと同じ型かその基底型でなければなりません（拡張プロパティの場合は拡張される対象の型）。
* `property` は、型 `KProperty <*>`またはその基底型でなければなりません。

`MyUI`インスタンスの作成時にその各プロパティに対してそれぞれ`provideDelegate`メソッドは呼ばれ、
その場で必要なバリデーションを実行する。

プロパティとデリゲートの間のバインディングを横取りするこの機能が無ければ、
同じような機能を達成する為には、
プロパティの名前を明示的に渡さないといけなくなってしまうが、
それはあんまり便利とは言えない：

```kotlin
// "provideDelegate"の機能無しでのプロパティ名のチェック
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // デリゲートの作成
}
```

生成されたコードでは、`provideDelegate`メソッドは補助的なプロパティ `prop$delegate`を初期化するために呼ばれる。
[上にある](#委譲プロパティのトランスレーションルール)`val prop: Type by MyDelegate()`と宣言された時に生成されるコード（`provideDelegate`メソッドが無い場合）と比較せよ：

（訳注：たぶんvar prop: Type by MyDelegate()の間違いだと思う）

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// `provideDelegate`関数が使える時は、
// 以下のコードがコンパイラにより生成される
class C {
    // 追加の"delegate"プロパティを作る為に"provieDelegate"を呼び出す
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

`provideDelegate`メソッドは補助的なプロパティの生成に影響するだけで、
ゲッターとセッターのために生成されるコードには影響を与えない事に注目して欲しい。

標準ライブラリの`PropertyDelegateProvider`インターフェースを使えば、
新しいクラスを作らずにデリゲートプロバイダを作成出来る：

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider
```

