---
layout: reference
title: "リフレクション"
---
# リフレクション

`リフレクション`は実行時にあなたのプログラム自身の構造を調べる（introspect）ことを可能とする、言語機能とライブラリ機能をあわせたものです。
関数やプロパティはKotlinにおいてはファーストクラスの市民であり、
それらを調べる事が出来るのは（例えばプロパティや関数の名前や型を実行時に知る事など）、関数型のスタイルやリアクティブプログラムのスタイルを使う時には必須となります。

> Kotlin/JS はリフレクションの機能については限定的にしかサポートしていません。 より詳しくは[Kotlin/JSにおけるリフレクション](js-reflection.md)を参照のこと
>
{: .note}


## JVMの時の依存ライブラリ

JVMのプラットフォームでは、Kotlinコンパイラの配布にはリフレクションを使うのに必要な機能の実行時コンポーネントが、
別のartifactとして含まれています。
その名も`kotlin-reflect.jar`です。
これは、リフレクションを使わないアプリの実行時のサイズを減らすためにこうなっています。


GradleやMaveのプロジェクトでリフレクションを使うには、`kotlin-reflect`へのdependencyを追加してください。

* GradleでKotlinの場合:

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

* GradleでGroovyの場合:

    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:%kotlinVersion%"
    }
    ```

* Mavenの場合:
    
    ```xml
    <dependencies>
      <dependency>
          <groupId>org.jetbrains.kotlin</groupId>
          <artifactId>kotlin-reflect</artifactId>
      </dependency>
    </dependencies>
    ```

もしGradleもMavenも使ってないなら、プロジェクトのclasspathに`kotlin-reflect.jar`が含まれている事を確かめてください。
その他のサポートしているケース(IntelliJ IDEA プロジェクトでコマンドラインのコンパイラを使っていたりAntの場合)では、
`kotlin-reflect.jar`はデフォルトで追加されます。
コマンドラインのコンパイラやAntで`kotlin-reflect.jar`を除外したければ、
`-no-reflect`コンパイラオプションを使用出来ます。

## classのリファレンス

リフレクションのもっとも基本的な機能としては、Kotlinクラスへの実行時リファレンスを取得する、というものが挙げられます。
静的に分かっているKotlinのクラスのリファレンスを取得するためには、`classリテラル`のシンタックスを使う事が出来ます：

```kotlin
val c = MyClass::class
```

リファレンスは[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)型の値となります。

> JVMでは: Kotlinクラスのリファレンスは、Javaのクラスリファレンスと同じものではありません。Javaのクラスリファレンスを取得するには、
> `KClass`のインスタンスの`.java`プロパティを使用してください。
>
{: .note}

### 束縛されたクラスのリファレンス

（訳注：Bound class references）

あるオブジェクトに対して、そのオブジェクトのクラスのリファレンスを取得するのも、対象のオブジェクトをレシーバーに同様の`::class`シンタックスで取り出すことが出来ます：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

オブジェクトの実際のクラスそのものを取得出来ます。例えばこの場合は`GoodWidget` や `BadWidget`が取得出来ます。
たとえレシーバーの式の型が`Widget`だとしてもです。

## 呼び出し可能リファレンス

（訳注：Callable references）

関数、プロパティ、コンストラクタのリファレンスは、
呼び出したり、[関数の型](lambdas.md#関数の型)のインスタンスとして使うことが出来ます。

すべての呼び出し可能なリファレンスの共通の基底クラスは[`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)です。
ここで`R`は戻りの型です。プロパティの場合はプロパティの型で、コンストラクタの場合はそれが作成するオブジェクトの型です。

### 関数リファレンス

名前の関数を以下のように宣言してあれば、直接それを呼ぶ事はもちろん出来ます (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

それとは別に、関数を関数の型の値として使う事も出来ます。
つまり、別の関数に渡したり出来るという事です。
それをする為には`::`演算子を使います：

{% capture func-reference %}
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=func-reference %}

ここでは、 `::isOdd` は、関数の型 `(Int) -> Boolean` の値です。

関数のリファレンスは[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html)の派生クラスに属します。
どのクラスかはパラメータの個数に寄ります。
例えば、`KFunction3<T1, T2, T3, R>`などです。

期待する型が文脈から分かる場合は、`::`を多重定義された型に使うことも出来ます。
例えば：

{% capture overload-function-reference %}
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // isOdd(x: Int)を参照
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=overload-function-reference %}

または、明示的に型を指定した変数にメソッドリファレンス（訳注：関数リファレンスのことか）を格納することで、必要な文脈を与えることも出来ます：

```kotlin
val predicate: (String) -> Boolean = ::isOdd   //  isOdd(x: String)を参照
```

クラスのメンバ関数や拡張関数を使いたければ、限定子をつける(qualified)必要があります：`String::toCharArray`のように。

拡張関数で変数を初期化しても、その変数の型はレシーバー無しの型で、レシーバーのオブジェクトを受け取る追加のパラメータがある関数として推論されてしまいます。
もしレシーバー付き関数の型としたければ、型を明示的に指定します：

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 例: 関数の合成

以下の関数を考えてみます：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

これは渡された２つの関数を合成した関数を返します：`compose(f, g) = f(g(*))`

この関数を呼び出し可能リファレンスに対して適用する（applyする）ことが出来ます：

{% capture compose-ex %}
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=compose-ex %}

### プロパティリファレンス

プロパティをファーストクラスのオブジェクトとしてアクセスするには、Kotlinでは`::`オペレータを使います：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

`::x`という式は`KProperty0<Int>`型のプロパティオブジェクトとして評価されます。
その値は`get()`を用いて読み出すことが出来るし、プロパティの名前は`name`プロパティを使って取り出すことが出来ます。
もっと詳細を知りたい人は、[`KProperty`クラスのドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)を参照してください。

`var y = 1`のようなミュータブルなプロパティの場合だと、`::y` は [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html)型の値を返します。
これは`set()`メソッドを持ちます：

{% capture mutable-prop-ref %}
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
{% endcapture %}
{% include kotlin_quote.html body=mutable-prop-ref %}

プロパティのリファレンスは、ジェネリック引数一つの関数が期待される場所で使うことが出来ます：

{% capture prop-ref-as-func %}
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=prop-ref-as-func %}

クラスのメンバのプロパティにアクセスする為には、以下のように限定子をつけて限定します：

{% capture prop-ref-from-class %}
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=prop-ref-from-class %}

拡張プロパティの場合は以下のようにします：

{% capture prop-ref-of-extension %}
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
{% endcapture %}
{% include kotlin_quote.html body=prop-ref-of-extension %}

### Interoperability with Java reflection

On the JVM platform, the standard library contains extensions for reflection classes that provide a mapping to and from Java
reflection objects (see package `kotlin.reflect.jvm`).
For example, to find a backing field or a Java method that serves as a getter for a Kotlin property, you can write something like this:

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

To get the Kotlin class that corresponds to a Java class, use the `.kotlin` extension property:

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### コンストラクタリファレンス

Constructors can be referenced just like methods and properties. You can use them wherever the program expects a function type object
that takes the same parameters as the constructor and returns an object of the appropriate type.
Constructors are referenced by using the `::` operator and adding the class name. Consider the following function
that expects a function parameter with no parameters and return type `Foo`:

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

Using `::Foo`, the zero-argument constructor of the class `Foo`, you can call it like this:

```kotlin
function(::Foo)
```

Callable references to constructors are typed as one of the
[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) subtypes
depending on the parameter count.

### 束縛された関数やプロパティのリファレンス

(Bound function and property references)

You can refer to an instance method of a particular object:

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Instead of calling the method `matches` directly, the example uses a reference to it.
Such a reference is bound to its receiver.
It can be called directly (like in the example above) or used whenever a function type expression is expected:

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Compare the types of the bound and the unbound references.
The bound callable reference has its receiver "attached" to it, so the type of the receiver is no longer a parameter:

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

A property reference can be bound as well:

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You don't need to specify `this` as the receiver: `this::foo` and `::foo` are equivalent.

### Bound constructor references

A bound callable reference to a constructor of an [inner class](nested-classes.md#inner-classes) can
be obtained by providing an instance of the outer class:

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```
