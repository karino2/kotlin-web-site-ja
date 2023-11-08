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

### Javaのリフレクションとのインターオペラビリティ

JVMプラットフォーム上では、標準ライブラリにはJavaのリフレクションオブジェクトとの相互間のマッピングを提供するリフレクションクラスの拡張（extension）を含んでいます（`kotlin.reflect.jvm`パッケージを参照のこと）。
例えば、Kotlinのプロパティを提供するようなバッキングフィールドやJavaのメソッドを探したければ、以下のように書く事が出来ます：


```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // "public final int A.getP()"とプリントされる
    println(A::p.javaField)  // "private final int A.p"とプリントされる
}
```

あるJavaクラスに対応するKotlinクラスを取得するには、`.kotlin`拡張プロパティを使う事が出来ます：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### コンストラクタリファレンス

コンストラクタも、通常のメソッドやプロパティのように参照する事が出来ます。
コンストラクタと同じパラメータを取り対応するオブジェクトを返す事を期待するような関数の型のオブジェクトを期待する場所では全て、コンストラクタのリファレンスを使用する事が出来ます。
コンストラクタは`::`オペレータをクラスの名前につける事で参照する事が出来ます。
以下のような、引数無しで戻りの型として`Foo`型を期待するような関数を期待する関数を考えてみましょう：

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

`Foo`クラスの引数零のコンストラクタ、`::Foo`を使えば、以下のように呼ぶ事が出来ます：

```kotlin
function(::Foo)
```

コンストラクタの呼び出し可能リファレンスは、そのパラメータの数に応じた[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html)の派生クラスの型となります。

### 束縛された関数やプロパティのリファレンス

(Bound function and property references)

あるオブジェクトのインスタンスメソッドを参照する、という事が出来ます：

{% capture instance-method-ref %}
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=instance-method-ref %}

`matches`メソッドを直接呼ぶ代わりに、この例ではそれへのリファレンスを用いています。
そのようなリファレンスは、そのレシーバーを束縛しています。
そのようなリファレンスは（上の例のように）直接呼ぶ事も出来ますし、
関数の型を期待する式ならどこでも用いる事が出来ます：


{% capture bound-reference-to-filter %}
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=bound-reference-to-filter %}

束縛されたリファレンスと束縛されてないリファレンスの型を比較してみましょう。
束縛されたリファレンスはそのレシーバーがそのリファレンスに「添付」されています。
だからレシーバーの型はパラメータには現れません：

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

プロパティのリファレンスも束縛出来ます：

{% capture bound-property %}
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=bound-property %}

レシーバーに`this`を指定する必要はありません：`this::foo` と `::foo` は同じ意味となります。

### 束縛されたコンストラクタのリファレンス

(Bound constructor references)

[内部クラス(inner class)](nested-classes.md#内部クラス)のコンストラクタの束縛された呼び出し可能リファレンスを、
その外部クラスのインスタンスを提供する事で取得する事が出来ます：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```
