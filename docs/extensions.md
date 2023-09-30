---
layout: reference
title: "拡張 (extension)"
---
# 拡張 (extension)

<!--original
# Extensions
-->

Kotlinは、クラスやインターフェースを、継承したりDecoratorのようなデザインパターンを使用せずとも、新しい機能で拡張する能力を提供します。
これは、 *拡張 (extension)* と呼ばれる特別な宣言を介して行われます。

<!--original
Kotlin provides the ability to extend a class or an interface with new functionality
without having to inherit from the class or use design patterns such as _Decorator_.
This is done via special declarations called _extensions_.
-->

例えば、あなたが変更出来ないようなサードパーティーのライブラリのクラスやインターフェース用に関数を書く事が出来ます。
そのような関数は、まるで元のクラスのメソッドであるかのように、普通の呼び方で呼び出す事が出来ます。
このメカニズムを*拡張関数（extension function）*と呼びます。
また、既存のクラスに新たなプロパティを追加する事を可能とする*拡張プロパティ（extension properties）*もあります。

## 拡張関数

<!--original
## Extension Functions
-->

拡張関数を宣言するには *レシーバの型 (receiver type)* を関数名の前に付ける必要があります。
レシーバの型とは拡張したい型の事です。
次の例では、 `swap` 関数を `MutableList<Int>` に追加しています：

<!--original
To declare an extension function, prefix its name with a _receiver type_, which refers to the type being extended.
The following adds a `swap` function to `MutableList<Int>`:
-->

``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' がリストに対応する
    this[index1] = this[index2]
    this[index2] = tmp
}
```

<!--original
``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```
-->

拡張関数内での *this*{: .keyword } キーワードは、レシーバオブジェクト（ドットの前に渡されたもの）に対応しています。
これで、この関数をどの `MutableList<Int>` からも呼べるようになりました：

<!--original
The `this` keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot).
Now, you can call such a function on any `MutableList<Int>`:
-->

``` kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 中の 'this' は 'list' の値となる
```

<!--original
``` kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'list'
```
-->

もちろん、任意の `MutableList<T>` についてもこの関数は考える事が出来るので、ジェネリックにもできます：

<!--original
This function makes sense for any `MutableList<T>`, and you can make it generic:
-->

``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' はリストに対応する
    this[index1] = this[index2]
    this[index2] = tmp
}
```

<!--original
``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```
-->

関数名の前でジェネリック型のパラメータを宣言する必要があります。
そうするとレシーバ型の式で使用できるようになります。
ジェネリクスについての詳細は[ジェネリック関数](generics.md)を参照してください。

<!--original
We declare the generic type parameter before the function name for it to be available in the receiver type expression. 
See [Generic functions](generics.html).
-->

## 拡張は **静的** に解決される

<!--original
## Extensions are resolved **statically**
-->

拡張機能（extension）は拡張したクラスを実際に変更するわけではありません。
拡張を定義すると、クラスに新たなメンバを挿入するのではなく、そのクラスのインスタンスにおいて、ただ単にその新しい関数をドット表記で呼べるようにするだけです。

<!--original
Extensions do not actually modify the classes they extend. By defining an extension, you are not inserting new members into
a class, only making new functions callable with the dot-notation on variables of this type.
-->

拡張関数は **静的に** ディスパッチされます。
つまり、どの拡張関数が呼ばれるかは、レシーバの型によりコンパイル時にしられています。
例えば：

<!--original
Extension functions are dispatched _statically_. So which extension function is called is already known at compile time
based on the receiver type. For example:
-->

{% capture extension-function-1 %}
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=extension-function-1 %}

この例では、 "Shape"を出力します。呼び出されている拡張関数は パラメータ `s` として宣言されている型のみに依存し、
それは`Shape`クラスだからです。

<!--original
This example prints _Shape_, because the extension function called depends only on the declared type of the
parameter `s`, which is the `Shape` class.
-->

もし、あるクラスにメンバ関数をあり、
さらに、そのメンバ関数と同じレシーバ型、同じ名前を有し、同じ引数を与えられた時に適用可能な拡張関数を定義すると、
**常にメンバ関数が優先されます** 。例えば：

<!--original
If a class has a member function, and an extension function is defined which has the same receiver type, the same name
and is applicable to given arguments, the **member always wins**.
For example:
-->
{% capture member-win %}
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("クラスのメソッド") }
    }
    
    fun Example.printFunctionType() { println("拡張関数") }
    
    Example().printFunctionType()
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=member-win %}

このコードは*クラスのメソッド*を出力します。

<!--original
If we call `c.foo()` of any `c` of type `C`, it will print "member", not "extension".
-->

しかしながら、異なるシグニチャを持つが同名のメンバ関数を拡張関数がオーバライドすることは全く問題ありません：

<!--original
However, it's perfectly OK for extension functions to overload member functions which have the same name but a different signature:
-->

{% capture extension-overload %}
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("クラスのメソッド") }
    }
    
    fun Example.printFunctionType(i: Int) { println("拡張関数 #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=extension-overload %}

## Nullableレシーバ

<!--original
## Nullable Receiver
-->

拡張は、nullableなレシーバの型で定義できることに注意してください。
このような拡張は、オブジェクトの変数に対して、その値がnullの場合でも呼び出すことができます。
もしレシーバが`null`なら`this`が`null`となります。
だからnullableなレシーバ型に対して対して拡張を定義する時は、
コンパイルエラーを避ける為に関数の本体で`this == null`のチェックを実行する事を推奨しています。

これにより、null をチェックせずに Kotlin で toString() を呼び出すことができます。チェックは拡張関数内で行われるからです。

<!--original
Note that extensions can be defined with a nullable receiver type. These extensions can be called on an object variable
even if its value is null. If the receiver is `null`, then `this` is also `null`. So when defining an extension with a 
nullable receiver type, we recommend performing a `this == null` check inside the function body to avoid compiler errors. 

You can call `toString()` in Kotlin without checking for `null`, as the check already happens inside the extension function:
-->

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // nullチェックの後だと、 'this' は非nullable型に自動キャストされるので、
    // 下記の toString() は Any クラスのメンバであると解決される
    return toString()
}
```

<!--original
``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```
-->

## 拡張プロパティ

<!--original
## Extension Properties
-->

関数と同様、Kotlinは拡張プロパティ(extension properties)をサポートしています。

<!--original
Similarly to functions, Kotlin supports extension properties:
-->

``` kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

<!--original
``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```
-->

> 拡張機能は実際にはクラスにメンバを挿入しないので、
> 拡張プロパティが[バッキングフィールド](properties.md#バッキングフィールド)を持つ効率的な方法はありません。
> これが **初期化子(initializer)が、拡張プロパティでは許可されていない** 理由です。
> 拡張プロパティの挙動は、明示的にゲッター/セッターを作ることによってのみ定義することができます。
>
{: .note}


<!--original
> Since extensions do not actually insert members into classes, there's no efficient way for an extension
> property to have a [backing field](properties.md#backing-fields). This is why _initializers are not allowed for
> extension properties_. Their behavior can only be defined by explicitly providing getters/setters.
>
{type="note"}
-->

例：

<!--original
Example:
-->

``` kotlin
val Foo.bar = 1 // エラー：初期化子は拡張プロパティでは許可されていない
```


<!--original
``` kotlin
val Foo.bar = 1 // error: initializers are not allowed for extension properties
```

-->

## コンパニオンオブジェクトの拡張

<!--original
## Companion Object Extensions
-->

クラスに[コンパニオンオブジェクト](object-declarations.md#コンパニオンオブジェクト)が定義されている場合は、
コンパニオンオブジェクトの拡張関数と拡張プロパティを定義することもできます。
それらはクラス名だけを限定子(qualifier)として呼ぶ事が出来ます。

<!--original
If a class has a [companion object](object-declarations.html#companion-objects) defined, you can also define extension
functions and properties for the companion object:
-->

{% capture companion-extension %}
class MyClass {
    companion object { }  // "コンパニオン" と呼ばれるもの
}

fun MyClass.Companion.printCompanion() { println("コンパニオン") }

fun main() {
    MyClass.printCompanion()
}
{% endcapture %}
{% include kotlin_quote.html body=companion-extension %}


## 拡張関数のスコープ

<!--original
## Scope of Extensions
-->

ほとんどの場合、拡張はトップレベル、すなわちパッケージ直下に定義します：

<!--original
In most cases, you define extensions on the top level, directly under packages:
-->
 

``` kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
``` 


そのような拡張を宣言しているパッケージの外で使用するには、
それを呼び出し箇所でインポートする必要があります：

<!--original
To use such an extension outside its declaring package, we need to import it at the call site:
-->

``` kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

詳細については、[インポート](packages.md#インポート)を参照してください。

<!--original
See [Imports](packages.html#imports) for more information.
-->

## メンバとして拡張関数を宣言

<!--original
## Declaring Extensions as Members
-->

クラス内にも、別のクラスの拡張を宣言することができます。
そのような拡張の中では、複数の **暗黙的なレシーバ**が存在する事になります。
それらのレシーバのメンバは、修飾子なしでアクセスできる事になります。
拡張が宣言されているクラスのインスタンスは *ディスパッチレシーバ (dispatch receiver)* と呼ばれ、
拡張関数のレシーバ型のインスタンスは *拡張レシーバ* と呼ばれます。

<!--original
You can declare extensions for one class inside another class. Inside such an extension, there are multiple _implicit receivers_ -
objects whose members can be accessed without a qualifier. An instance of a class in which the extension is declared is called a
_dispatch receiver_, and an instance of the receiver type of the extension method is called an _extension receiver_.
-->

{% capture multiple-receiver %}
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // Host.printHostname()を呼ぶ
        print(":")
        printPort()   // Connection.printPort()を呼ぶ
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 拡張関数を呼ぶ
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // error, the extension function is unavailable outside Connection
}
{% endcapture %}
{% include kotlin_quote.html body=multiple-receiver %}

ディスパッチレシーバのメンバーと拡張レシーバの名前が衝突する場合には、拡張レシーバが優先されます。
ディスパッチレシーバのメンバを参照するには、[限定子付き `this` の構文](this-expressions.md#限定子付きthis)を使用することができます。

<!--original
In case of a name conflict between the members of the dispatch receiver and the extension receiver, the extension receiver takes
precedence. To refer to the member of the dispatch receiver you can use the [qualified `this` syntax](this-expressions.html#qualified).
-->

``` kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // Host.toString()の呼び出し
        this@Connection.toString()  // Connection.toString()の呼び出し
    }
}
```

メンバとして宣言する拡張関数は、 `open` として宣言する事も出来て、
その場合はサブクラスでオーバーライドすることができます。
これは、そのような関数のディスパッチは、ディスパッチレシーバ型に関しては仮想関数的であるけれど、拡張レシーバ型に関しては静的であることを意味します。

<!--original
Extensions declared as members can be declared as `open` and overridden in subclasses. This means that the dispatch of such
functions is virtual with regard to the dispatch receiver type, but static with regard to the extension receiver type.
-->

{% capture open-member-extension %}
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("BaseCallerの中のBaseの拡張関数")
    }

    open fun Derived.printFunctionInfo() {
        println("BaseCallerの中のDerivedクラスの拡張関数")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 拡張関数の呼び出し
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("DerivedCallerの中のBaseの拡張関数")
    }

    override fun Derived.printFunctionInfo() {
        println("DerivedCallerの中のDerivedの拡張関数")
    }
}

fun main() {
    BaseCaller().call(Base())   // "BaseCallerの中のBaseの拡張関数"
    DerivedCaller().call(Base())  // "DerivedCallerの中のBaseの拡張関数" -  ディスパッチレシーバは仮想的に解決される
    DerivedCaller().call(Derived())  // "DerivedCallerの中のBaseの拡張関数" - 拡張レシーバは静的に解決される
}
{% endcapture %}
{% include kotlin_quote.html body=open-member-extension %}


<!--original
``` kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // call the extension function
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - dispatch receiver is resolved virtually
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - extension receiver is resolved statically
}
``` 
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

-->

## 可視性についてのメモ

拡張（extension）も同じスコープに関数が定義され時と同様の[可視性修飾子](visibility-modifiers.md)の振る舞いとなる。
例えば：

* ファイルのトップレベルに定義された拡張は、同じファイルの`private`のトップレベル宣言にアクセス出来る
* 拡張がレシーバ型の外で定義されれば、レシーバの`private`や`protected`のメンバにはアクセス出来ない