---
layout: reference
title: "関数"
---
# 関数

Kotlinの関数は *fun*{: .keyword } キーワードを使用して宣言されます。

<!--original
Functions in Kotlin are declared using the *fun*{: .keyword } keyword
-->

``` kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

<!--original
``` kotlin
fun double(x: Int): Int {
}
```
-->

## 関数の使い方

<!--original
## Function Usage
-->

関数の呼び出しは、伝統的なアプローチを採用しています。

<!--original
Calling functions uses the traditional approach
-->

``` kotlin
val result = double(2)
```


<!--original
``` kotlin
val result = double(2)
```

-->

メンバ関数の呼び出しは、ドット表記を使用します。

<!--original
Calling member functions uses the dot notation
-->

``` kotlin
Stream().read() // Streamクラスのインスタンスを作ってread()を呼ぶ
```

<!--original
``` kotlin
Sample().foo() // create instance of class Sample and calls foo
```
-->

### パラメーター

<!--original
### Parameters
-->

関数のパラメータはパスカル記法、すなわち *名前*: *タイプ* を使用して定義されています。パラメータはカンマを使用して分離されます。各パラメータは、明示的に型指定する必要があります。

<!--original
Function parameters are defined using Pascal notation, i.e. *name*: *type*. Parameters are separated using commas. Each parameter must be explicitly typed.
-->

``` kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

関数のパラメータを宣言する時は、[トレーリングカンマ](coding-conventions.md#トレーリングカンマ)を使う事ができます：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // トレーリングカンマ
) { /*...*/ }
```


### デフォルトの引数

<!--original
### Default Arguments
-->

関数パラメータは、対応する引数が省略されているときに使用されるデフォルト値をもつことができます。
これにより、オーバーロードしなければいけない関数の数を減らすことができます：

<!--original
Function parameters can have default values, which are used when you skip the corresponding argument. This reduces the number
of overloads:
-->

``` kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

<!--original
``` kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
...
}
```
-->

デフォルト値は型の後ろに `=` を足してセットします。

<!--original
A default value is set by appending `=` to the type.
-->

オーバーライドしたメソッドは、常にベースメソッドと同じデフォルトのパラメータ値を使用します。
デフォルトのパラメータ値を持つメソッドをオーバーライドする場合は、デフォルトのパラメータ値は、シグネチャから省略されている必要があります。

<!--original
Overriding methods always use the same default parameter values as the base method.
When overriding a method with default parameters values, the default parameter values must be omitted from the signature:
-->

``` kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // デフォルト値は使用できない
}
```

<!--original
``` kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // no default value allowed
}
```
-->

もしデフォルトのあるパラメータがデフォルト値の無いパラメータの前に置かれる時は、
デフォルト値は関数を[名前付き引数](#名前付き引数)で呼ばないと使う事が出来ません：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // デフォルト値、 bar = 0 が使われる
```


デフォルト値の後ろの最後の引数が[ラムダ](lambdas.md#ラムダ式の構文)の場合は、
名前付き引数で渡す他に[カッコの外側で渡す](lambdas.md#トレーリングラムダを渡す)事も出来ます：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // デフォルト値 baz = 1 が使われる
foo(qux = { println("hello") }) // 両方ともデフォルト値 bar = 0 と baz = 1 が使われる
foo { println("hello") }        // 両方ともデフォルト値 bar = 0 と baz = 1 が使われる
```


### 名前付き引数

<!--original
### Named Arguments
-->

関数を呼び出すとき、関数のパラメータに名前を付けることができます。
これは関数が沢山の引数を持ち、どの値がどの引数か関連付けが難しいようなケース、
特にbooleanや`null`の引数にとても便利です。

関数呼び出しで名前付き引数を使うと、引数の順番を自由に並べ替える事が出来ます。
デフォルト値を使いたければ、それらの引数を単に省略すればOKです。

<!--original
You can name one or more of a function's arguments when calling it. This can be helpful when a function has many
arguments and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order that they are listed in. If you want to
use their default values, you can just leave these arguments out altogether.
-->

4つの引数とデフォルト値を持つ`reformat()`関数を考えます：

<!--original
Given the following function
-->

``` kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

この関数を呼ぶ時に、全部を名前付き引数にしないといけない訳ではありません：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

デフォルト値のあるものはすべてスキップする事が出来ます：

``` kotlin
reformat("This is a long String!") // 訳：これは長いStringです！
```

<!--original
``` kotlin
reformat("This is a long String!")
```
-->

全部の引数を省略するのでは無く、
特定の引数だけをデフォルト値としてスキップする事も出来ます。
しかし、最初にスキップした引数のあとは、全ての引数に名前をつける必要があります：

```kotlin
// 訳：これは短いStringです！
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

<!--
```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```
-->

[可変長引数(`vararg`)](#可変長引数vararg)を名前付き引数として渡すには、
`spread` 演算子が使えます:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> JVMでJavaの関数を呼び出す時には、
> Javaバイトコードは常に関数パラメータの名を保存する訳では無い為、
> 名前付き引数構文を使用できないことに注意してください。
>
{: .note}

<!--original
> When calling Java functions on the JVM, you can't use the named argument syntax because Java bytecode does not
> always preserve the names of function parameters.
>
{type="note"}
-->

### Unit を返す関数

<!--original
### Unit-returning functions
-->

関数が有用な値を何も返さない場合、その戻り値の型は `Unit` になります。 
`Unit` は、唯一の値 ( `Unit` ) だけを持つ型です。
この値は、明示的に return しなくてもかまいません：

<!--original
If a function does not return a useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`.
This value does not have to be returned explicitly:
-->

``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` としても良いが `return` は必須ではない
}
```

<!--original
``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```
-->

`Unit` の戻り型の宣言も任意です。上記のコードは次と等価です：

<!--original
The `Unit` return type declaration is also optional. The above code is equivalent to
-->

``` kotlin
fun printHello(name: String?) { ... }
```

<!--original
``` kotlin
fun printHello(name: String?) { ... }
```
-->

### 単一式関数

<!--original
### Single-Expression functions
-->

関数の本体が単一の式の場合は、
中括弧を省略することができ、本体は `=` 記号の後に指定します：

<!--original
When the function body consists of a single expression, the curly braces can be omitted and the body specified after an `=` symbol:
-->

``` kotlin
fun double(x: Int): Int = x * 2
```

<!--original
``` kotlin
fun double(x: Int): Int = x * 2
```
-->

コンパイラによって戻り値の型を推論することができる時には、明示的な戻り値の型の宣言は[任意です](#明示的な戻り値の型)：

<!--original
Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler
-->

``` kotlin
fun double(x: Int) = x * 2
```

<!--original
``` kotlin
fun double(x: Int) = x * 2
```
-->

### 明示的な戻り値の型

<!--original
### Explicit return types
-->

`Unit` を返すことを意図していない限り([その場合は戻りの型の指定はオプショナルです](#unit-を返す関数))、
ブロックの本体を持つ関数は、常に明示的に戻り値の型を指定しなければなりません。

Kotlinはブロックの本体から関数の戻り値の型を推論することはありません。
なぜならこのような関数は本体内に複雑な制御フローをもつことがあり、
戻り値の型が読み手に（時にはコンパイラにも）自明ではないからです。

<!--original
Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow
in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler).
-->

### 可変長引数（vararg）

<!--original
### Variable number of arguments (Varargs)
-->

関数（通常は最後のひとつ）のパラメータは、 `vararg` 修飾子でマークする事が出来ます：

<!--original
You can mark a parameter of a function (usually the last one) with the `vararg` modifier:
-->

``` kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts は配列
        result.add(t)
    return result
}
```

<!--original
``` kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```
-->

この場合、関数に可変の引数を渡すことができます：

<!--original
In this case, you can pass a variable number of arguments to the function:
-->

```kotlin
  val list = asList(1, 2, 3)
```

<!--original
```kotlin
  val list = asList(1, 2, 3)
```
-->

関数の中では、 `T` 型の `vararg` をつけたパラメータは `T` の配列として見えます。
すなわち、前述例での `ts` 変数は `Array<out T>` 型を持ちます。

<!--original
Inside a function a `vararg`-parameter of type `T` is visible as an array of `T`, i.e. the `ts` variable in the example above has type `Array<out T>`.
-->

`vararg` としてマーク出来るパラメータは一つだけです。
`vararg` パラメータが変数リストの最後のひとつでない場合には、
その後に続くパラメータは 
名前付き引数の構文を使用するか、またはパラメータが関数の型をもっている場合は括弧の外でラムダを渡すことによって、渡すことができます。

<!--original
Only one parameter can be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
subsequent parameters can be passed using named argument syntax, or, if the parameter has a function type, by passing
a lambda outside the parentheses.
-->

`vararg` をもつ関数を呼び出すとき、例えば `asList(1, 2, 3)` のように、一つずつ引数を渡すことができます。
または、すでに配列を持っており、関数にその内容を渡したい場合は、（ * を配列名の接頭辞にする） **spread** 演算子を使用します：

<!--original
When you call a `vararg`-function, you can pass arguments individually, for example `asList(1, 2, 3)`. If you already have
an array and want to pass its contents to the function, use the *spread* operator (prefix the array with `*`):
-->

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

<!--original
```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```
-->


[プリミティブ型の配列](arrays.md#プリミティブ型の配列)を`vararg`に渡したい時は、
`toTypedArray()`関数を使って通常の（型付き）配列に変換して渡す必要があります：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArrayはプリミティブ型の配列
val list = asList(-1, 0, *a.toTypedArray(), 4)
```


### 中置記法

<!--original
### Infix notation
-->

`infix`キーワードでマークした関数は、中置表記法 (infix notations) を使用して関数を呼び出すことができます。
中置記法ではドットやカッコを省略します。
中置関数（infix funciton）は以下の要件を満たす必要があります：

<!--original
Functions can also be called using infix notations when
-->

* メンバ関数や[拡張関数](extensions.md)である
* パラメータをただ一つだけ持っている
* パラメータは[可変長引数](#可変長引数vararg)では無い、またデフォルト引数もあってはならない

<!--original
* They must be member functions or [extension functions](extensions.md).
* They must have a single parameter.
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have
no [default value](#default-arguments).
-->

``` kotlin
// Intにエクステンションを定義
infix fun Int.shl(x: Int): Int {
...
}

// 拡張関数を infix ノーテーションを使用して呼ぶ
1 shl 2

// これは次と同じ
1.shl(2)
```

<!--original
``` kotlin
// Define extension to Int
infix fun Int.shl(x: Int): Int {
...
}

// call extension function using infix notation

1 shl 2

// is the same as

1.shl(2)
```
-->


> 中置の関数は算術演算子、型キャスト、`rangeTo`演算子より低い優先度となります。
> 以下の式は等価です：
> * `1 shl 2 + 3` は `1 shl (2 + 3)` と同じ意味
> * `0 until n * 2` は `0 until (n * 2)` と同じ意味
> * `xs union ys as Set<*>` は `xs union (ys as Set<*>)` と同じ意味
>
> 一方、中置の関数は論理演算子`&&` と `||`, `is`や`in`などのチェックなどの演算子よりは高い優先順位となります。
> だから以下の式も同じ意味となります：
> * `a && b xor c` は `a && (b xor c)` と同じ意味
> * `a xor b in c` は `(a xor b) in c` と同じ意味
>
{: .note}

中置関数はいつもレシーバとパラメーターの両方を指定する必要がある事に注意してください。
現在のレシーバのメソッドを中置記法で呼ぶためには、thisを明示的に指定してください。
これはパースの曖昧性を解決する為に必要です：

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 正しい
        add("abc")       // 正しい
        //add "abc"        // 誤り: レシーバを指定しないといけない
    }
}
```


## 関数のスコープ

<!--original
## Function Scope
-->

Kotlinでは、関数をファイルのトップレベルで宣言することができます。これは、関数を保持するためのクラスを作成する必要がないことを意味します。
JavaやC#, Scala([トップレベル定義はScala 3からは利用可能](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main))などの言語ではクラスを定義する必要がある所ですが。
トップレベルの関数に加えて、Kotlinの関数はメンバ関数や拡張機能として、ローカルに宣言することもできます。

<!--original
Kotlin functions can be declared at the top level in a file, meaning you do not need to create a class to hold a function,
which you are required to do in languages such as Java, C#, and Scala ([top level definition is available since Scala 3](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)). In addition
to top level functions, Kotlin functions can also be declared locally as member functions and extension functions.
-->

### ローカル関数

<!--original
### Local Functions
-->

Kotlinはローカル関数、すなわち、ある関数内の別の関数をサポートしています。

<!--original
Kotlin supports local functions, which are functions inside other functions:
-->

``` kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

<!--original
``` kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```
-->

ローカル関数は、外側の関数のローカル変数（すなわちクロージャ）にアクセスすることができます。
これにより、上記の場合には、 visited をローカル変数にすることができます。

<!--original
Local function can access local variables of outer functions (i.e. the closure), so in the case above, the *visited* can be a local variable
-->

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```

<!--original
```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```
-->

### メンバ関数

<!--original
### Member Functions
-->

メンバ関数は、クラスやオブジェクトの内部で定義される関数です。

<!--original
A member function is a function that is defined inside a class or object
-->

``` kotlin
class Sample() {
    fun foo() { print("Foo") }
}
```

<!--original
``` kotlin
class Sample() {
  fun foo() { print("Foo") }
}
```
-->

メンバ関数は、ドット表記によって呼ばれます。

<!--original
Member functions are called with dot notation
-->

``` kotlin
Sample().foo() // Sampleクラスのインスタンスを作り、 foo を呼ぶ
```

<!--original
``` kotlin
Sample().foo() // creates instance of class Sample and calls foo
```
-->

クラスおよびメンバのオーバーライドに関する詳細については [クラス](classes.md)と[継承](classes.md#継承) を参照してください。

<!--original
For more information on classes and overriding members see [Classes](classes.html) and [Inheritance](classes.html#inheritance)
-->

## ジェネリック関数

<!--original
## Generic Functions
-->

関数は、関数名の前に角括弧（訳注：＜＞のことです）を使用して指定する事で、ジェネリックパラメータを持つことができます。

<!--original
Functions can have generic parameters which are specified using angle brackets before the function name
-->

``` kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

<!--original
``` kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```
-->

ジェネリック関数の詳細については、[ジェネリクス](generics.md) を参照してください。

<!--original
For more information on generic functions see [Generics](generics.html)
-->

## 末尾再帰関数

<!--original
## Tail recursive functions
-->

Kotlinは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られている関数型プログラミングのスタイルをサポートしています。
これは通常ループを使用して書かれるいくつかのアルゴリズムを代わりに再帰で、しかし、普通の再帰と違ってスタックオーバーフローのリスクがないように書くことです。
ある関数が `tailrec` 修飾子でマークされ、必要な形式を満たしている場合、コンパイラは再帰を最適化して、高速かつ効率的なループベースのバージョンを結果として生成します：

<!--original
Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
For some algorithms that would normally use loops, you can use a recursive function instead without the risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required formal conditions, the compiler optimizes out
the recursion, leaving behind a fast and efficient loop based version instead:
-->

``` kotlin
val eps = 1E-10 // "十分良い", 10^-15とかでも良いかも

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

<!--original
``` kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```
-->

このコードは、数学定数であるコサインの不動点（fixpoint）を算出します。
それは Math.cos を 1.0 から始めて、それ以上変化しなくなるまで単に繰り返し呼び出します、
その結果、指定した`eps`の精度では`0.7390851332151611`を得ます。
その結果のコードは、以下のより伝統的なスタイルに相当します。

<!--original
This code calculates the `fixpoint` of cosine, which is a mathematical constant. It simply calls `Math.cos` repeatedly
starting at `1.0` until the result no longer changes, yielding a result of `0.7390851332151611` for the specified
`eps` precision. The resulting code is equivalent to this more traditional style:
-->

``` kotlin
val eps = 1E-10 // "十分良い", 10^-15とかでも良いかも

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

<!--original
``` kotlin
val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```
-->

`tailrec` 修飾子の対象となるためには、関数は実行する最後の操作として自身を呼び出す必要があります。
再帰呼び出しの後にさらにコードがあるときは、末尾再帰を使用することはできません。
try / catch / finally ブロック内で使用することもできません。
現在、末尾再帰はJVMとKotlin/Nativeのバックエンドでのみサポートされています。

<!--original
To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use
tail recursion when there is more code after the recursive call, within `try`/`catch`/`finally` blocks, or on open functions.
Currently, tail recursion is supported by Kotlin for the JVM and Kotlin/Native.
-->

**以下も見てね**：
* [インライン関数](inline-functions.md)
* [拡張関数](extensions.md)
* [高階関数とラムダ](lambdas.md)
