---
layout: reference
title: "object式とobject宣言"
---
# object式とobject宣言

<!--original
# Object Expressions and Declarations
-->

時々、あるクラスをわずかに修正しただけのオブジェクトを、それのための新しいサブクラスを明示的に宣言せずに作成したい事があります。
Kotlinでは*object式* と *object宣言* でこの事態に対処します。

<!--original
Sometimes you need to create an object that is a slight modification of some class, without explicitly declaring a new
subclass for it. Kotlin can handle this with _object expressions_ and _object declarations_.
-->

## object式

<!--original
## Object expressions
-->

**object式（object expression）** は無名クラス(anonymous class)のオブジェクトを作ります、
無名クラスとはこの場合、明示的に`class`で宣言しないクラスの事です。
そのようなクラスは一度限りの使用の時に便利です。
そのようなクラスを様々な方法で定義する事が出来ます ー 何も無い所から、既存のクラスを継承して、インターフェースを実装する事で、など。
無名クラスのインスタンスは**無名オブジェクト（anonymous object）**とも呼ばれます。
なぜなら、これは名前により定義されるのでは無く式により定義されるからです。

<!--
_Object expressions_ create objects of anonymous classes, that is, classes that aren't explicitly declared with the `class`
declaration. Such classes are useful for one-time use. You can define them from scratch, inherit from existing classes,
or implement interfaces. Instances of anonymous classes are also called _anonymous objects_ because they are defined by
an expression, not a name.
-->

### 無名オブジェクトを何も無い所から作る

object式はキーワード`object`で始めます。

もし自明でない基底型が必要で無いようなオブジェクトを単に欲しいだけなら、
`object`のあとに中括弧でメンバを書けばよろしい：

{% capture object-expression-from-scratch %}
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // object式はAny型を継承します。だから`toString()`には`override`が必要です
        override fun toString() = "$hello $world"
    }
//sampleEnd
    print(helloWorld)
}
{% endcapture %}
{% include kotlin_quote.html body=object-expression-from-scratch %}

### 基底型を継承して無名オブジェクトを作る

なんらかの型（ときには複数）を継承した無名クラスのオブジェクトを作るには、
その型を`object`の後ろにコロンを足して`:`、その後ろに書きます。
この型のメンバを実装したりオーバーライドするのは[通常の継承](inheritance.md)のように行います。

``` kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

基底型がコンストラクタを持っている場合は、適切なコンストラクタのパラメータが渡されなければなりません。
複数の基底型の場合は、コロンの後にコンマ区切りのリストとして指定することができます：

<!--original
If a supertype has a constructor, pass appropriate constructor parameters to it.
Multiple supertypes can be specified as a comma-delimited list after the colon:
-->

``` kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```

<!--original
``` kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```
-->

### returnでの無名オブジェクトの使用とその型

無名オブジェクトがローカルの型か、[private](visibility-modifiers.md#パケージ)かつ[inline](inline-functions.md)定義で無い（関数またはプロパティ）ものに使われた時は、
この関数やプロパティを通してすべてのメンバにアクセス可能となります。

<!--
When an anonymous object is used as a type of a local or [private](visibility-modifiers.md#packages) but not [inline](inline-functions.md)
declaration (function or property), all its members are accessible via this function or property:
-->

```kotlin
class C {
    private fun getObject() = object {
        val x: String = "x"
    }

    fun printX() {
        println(getObject().x)
    }
}
```

もしこの関数やプロパティがpublicかprivate inlineなら、その実際の型は以下のようになる：
* 無名オブジェクトが宣言された基底型を持たないなら `Any`
* 基底型が一つだけ宣言されているならその基底型
* 複数の基底型が宣言されている場合には明示的に宣言した型

このすべてのケースで、無名オブジェクトのメンバはアクセス不可能です。
オーバーライドしたメンバはその実際の型がそのメンバの関数やプロパティを宣言しているならアクセス可能です：

```kotlin
interface A {
    fun funFromA() {}
}
interface B

class C {
    // 戻りの型は Any; xはアクセス出来ない
    fun getObject() = object {
        val x: String = "x"
    }

    // 戻りの型はA; xはアクセス出来ない
    fun getObjectA() = object: A {
        override fun funFromA() {}
        val x: String = "x"
    }

    // 戻りの型はB; funFromA()とxはアクセス出来ない
    fun getObjectB(): B = object: A, B { // 明示的なreturnの型の指定が必要
        override fun funFromA() {}
        val x: String = "x"
    }
}
```


### 無名オブジェクトからの変数へのアクセス


object式のコードは、内包するスコープの変数にアクセスすることができます。

<!--original
Just like Java's anonymous inner classes, code in object expressions can access variables from the enclosing scope.
(Unlike Java, this is not restricted to final variables.)
-->

``` kotlin
fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // ...
}
```

## object宣言

[シングルトン](http://en.wikipedia.org/wiki/Singleton_pattern)パターンが有用な場合はしばしばあり、
Kotlinは、シングルトンを容易に宣言できます：

<!--original
The [Singleton](https://en.wikipedia.org/wiki/Singleton_pattern) pattern can be useful in several cases,
and Kotlin makes it easy to declare singletons:
-->

``` kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}
```

これは**object宣言(object declaration)**と呼ばれ、
それは常に object キーワードの後に名前を持ちます。
ちょうど変数宣言と同じように、object宣言は式ではなく、代入文の右側に使用することはできません。

object宣言の初期化はスレッドセーフで、最初のアクセスの時に行われます。

<!--original
This is called an _object declaration_, and it always has a name following the `object` keyword.
Just like a variable declaration, an object declaration is not an expression, and it cannot be used on the right-hand side
of an assignment statement.

The initialization of an object declaration is thread-safe and done on first access.
-->

オブジェクトを参照するために、その名前を直接使用します。

<!--original
To refer to the object, we use its name directly:
-->

``` kotlin
DataProviderManager.registerDataProvider(...)
```

<!--original
``` kotlin
DataProviderManager.registerDataProvider(...)
```
-->

このようなオブジェクトは、スーパータイプを持つことができます：

<!--original
Such objects can have supertypes:
-->

``` kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

<!--original
``` kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```
-->

> object宣言はローカルにすることはできません（つまり、関数内にネストする事は出来ません）。
> ただし、他のobject宣言または内部クラスでないクラスにネストすることはできます。
>
{: .note}

<!--original
> Object declarations can't be local (that is, they can't be nested directly inside a function), but they can be nested
> into other object declarations or non-inner classes.
>
{type="note"}
-->

### データオブジェクト

Kotlinで通常の`object`宣言をprintすると、
そのオブジェクトの文字列表現はその名前とハッシュ値を含んだものになります：

```kotlin
object MyObject

fun main() {
    println(MyObject) // MyObject@1f32e575
}
```

[データクラス](data-classes.md)と同様に、
`object`宣言にも`data`修飾子をつける事が出来ます。
これはコンパイラに、幾つかの関数を自動生成する事を指示します：

* データオブジェクト(data object)の名前を返す `toString()`
* `equals()`/`hashCode()`のペア

> `データオブジェクト`には、カスタムの`equals`と`hashCode`を実装する事は出来ません
>
{: .note}

`toString()`関数はデータオブジェクトの名前を返します:

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

`データオブジェクト`の`equals()`関数は、同じデータオブジェクトのクラスから作られる全オブジェクトがイコールである事を保証します。
多くのケースでは一つのデータオブジェクトのクラスから作られるインスタンスは一つだけです（結局、データオブジェクトもシングルトンを宣言するものですから）。
しかしながら、エッジケースでは実行時に同じクラスの別のオブジェクトが作られてしまうケースも存在します（例えばプラットフォームのリフレクション、`java.lang.reflect`を使ったり、JVMのシリアライゼーションライブラリで内部でリフレクションを使っているものなど）。
このケースでもすべてのオブジェクトがequalになる事を保証します。

> データオブジェクトの比較はいつも構造的に行う（`==`演算子を使って）事。
> リファレンス比較（`===`演算子を使って）は決して行わないようにしましょう。
> そうすることで、一つ以上のデータオブジェクトが存在する場合があるという落とし穴にはまらないで済みます。
>
{: .warning}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // ライブラリが強制的にMySingletonの2番目のインスタンスを作る場合でも、その`equals`メソッドはtrueを返します:
    println(MySingleton == evilTwin) // true

    // データオブジェクトの比較を === では行わないように
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlinのリフレクションはデータオブジェクトのインスタンスを作る事は許可していません。
    // このコードは新規のMySingletonを無理やり作ります（Javaのプラットフォームリフレクションを用いて）
    // こんな事はしないように！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成される`hashCode()`関数も`equals()`関数と一貫した振る舞いをします。
つまり、同じ`データオブジェクト`のクラスから生成されたインスタンスのハッシュコードは同じになります。

### データオブジェクトとデータクラスの違い

データオブジェクトとデータクラスは一緒に用いられて多くの類似点がありますが、
データオブジェクトの方にだけ生成されない関数が幾つかあります:

* `copy()`関数は生成されません。データオブジェクトはシングルトンのオブジェクトとして使う意図で使われるものですから、`copy`関数は生成されません。シングルトンパターンはインスタンスを一つに制限するものですが、インスタンスのコピーを許せばこの制約を違反してしまいます。
* `componentN()`関数は生成されません。データクラスと違い、データオブジェクトにはデータプロパティがありません。データプロパティの無いオブジェクトの分割代入（destructure）は意味をなさないので、`componentN()`関数は生成されないのです。

<!--
While `data object` and `data class` declarations are often used together and have some similarities, there are some functions that are not generated for a `data object`:

* No `copy()` function. Because a `data object` declaration is intended to be used as singleton objects, no `copy()` function is generated. The singleton pattern restricts the instantiation of a class to a single instance, which would be violated by allowing copies of the instance to be created.
* No `componentN()` function. Unlike a `data class`, a `data object` does not have any data properties. Since attempting to destructure such an object without data properties would not make sense, no `componentN()` functions are generated.
-->

#### selaedの継承階層でのデータオブジェクトの使用

データオブジェクト宣言は[sealedなクラスとインターフェース](sealed-classes.md)で述べたようなsealedの継承階層で使うととても便利です。
なぜならこれを使えば、そのオブジェクトと同列に定義しているデータクラスと対称性を維持する事が出来るからです：

<!-- 
`data object` declarations are a particularly useful for sealed hierarchies, like [sealed classes or sealed interfaces](sealed-classes.md), since they allow you to maintain symmetry with any data classes you may have defined alongside the object:
-->

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun printReadResult(r: ReadResult) {
    when(r) {
        is Number -> println("Num(${r.number}")
        is Text -> println("Txt(${r.text}")
        is EndOfFile -> println("EOF")
    }
}

fun main() {
    printReadResult(EndOfFile) // EOF
}
```

### コンパニオンオブジェクト

 (訳注： Companion Objects)

<!--original
### Companion Objects
-->

クラス内のobject宣言を、 *companion*{: .keyword } キーワードでマークすることができます。

<!--original
An object declaration inside a class can be marked with the *companion*{: .keyword } keyword:
-->

``` kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

<!--original
``` kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```
-->

コンパニオンオブジェクトのメンバーは限定子（qualifier）として単にクラス名を使用して呼び出すことができます：

<!--original
Members of the companion object can be called by using simply the class name as the qualifier:
-->

``` kotlin
val instance = MyClass.create()
```

<!--original
``` kotlin
val instance = MyClass.create()
```
-->

コンパニオンオブジェクトの名前は省略することができます。この場合、 `Companion` という名前が使用されます。

<!--original
The name of the companion object can be omitted, in which case the name `Companion` will be used:
-->

```kotlin
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```

クラスのメンバは、そのコンパニオンオブジェクトのprivateなメンバにもアクセス出来ます。

クラスの名前を（他の名前の前に限定子として使うのでは無く）単体で使うと、
そのクラスのコンパニオンオブジェクトへの参照のように振る舞います（コンパニオンオブジェクトに名前があっても無くても）:

```kotlin
class MyClass1 {
    companion object Named { }
}

val x = MyClass1

class MyClass2 {
    companion object { }
}

val y = MyClass2
```



コンパニオンオブジェクトのメンバは、他の言語のスタティックメンバのように見えますが、
実行時にはそれらは実際のオブジェクトのインスタンスメンバである事には注意が必要で、たとえばインターフェイスを実装できたりします：

<!--original
Note that even though the members of companion objects look like static members in other languages, at runtime those
are still instance members of real objects, and can, for example, implement interfaces:
-->

``` kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        override fun create(): MyClass = MyClass()
    }
}

val f: Factory<MyClass> = MyClass
```

しかしながら、JVM上では、 `@JvmStatic` アノテーションを使用すると、コンパニオンオブジェクトのメンバを実際の静的メソッドやフィールドとして生成することもできます。
詳細については、[Javaの相互運用性](java-to-kotlin-interop.md#static-fields)のセクションを参照してください。

<!--original
However, on the JVM you can have members of companion objects generated as real static methods and fields, if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.html#static-fields) section
for more details.

-->

### object式とobject宣言の間の意味（semantics）の違い

<!--original
### Semantic difference between object expressions and declarations
-->

object式とobject宣言の間には、ある重要な意味上の違いがあります：

<!--original
There is one important semantic difference between object expressions and object declarations:
-->

* object式は 使用された場所で**すぐに** （初期化されて）実行されます
* object宣言は、初回アクセス時まで **遅延して** 初期化されます
* コンパニオンオブジェクトは、対応するクラスが読み込まれた（解決）されたときに初期化され、これは Java の静的初期化子のセマンティクスに一致します

<!--original
* object expressions are executed (and initialized) **immediately**, where they are used
* object declarations are initialized **lazily**, when accessed for the first time
* a companion object is initialized when the corresponding class is loaded (resolved), matching the semantics of a Java static initializer
-->
