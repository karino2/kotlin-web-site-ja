---
layout: reference
title: "データクラス"
---
# データクラス

Kotlinのデータクラスは、主な目的がデータの保持であるようなクラスの事です。
データクラスはインスタンスを人間に読めるような形式で出力したり、
インスタンスを比較したり、インスタンスをコピーしたり、そのほか様々なメンバ関数が自動でついてきます。

データクラスは`data`でマークされます：

<!--original
Data classes in Kotlin are classes whose main purpose is to hold data. Data classes come automatically with additional
member functions that allow you to print an instance to readable output, compare instances, copy instances, and more.
Data classes are marked with `data`:
-->
 
``` kotlin
data class User(val name: String, val age: Int)
```

<!--original
``` kotlin
data class User(val name: String, val age: Int)
```
-->

コンパイラは自動的に、プライマリコンストラクタで宣言されたすべてのプロパティから、次のメンバを派生します：

<!--original
The compiler automatically derives the following members from all properties declared in the primary constructor:
-->
  
  * `equals()` / `hashCode()` のペア、
  * `"User(name=John, age=42)"` 形式の `toString()` 、
  * 宣言した順番でプロパティに対応する [`componentN()` 関数](destructuring-declarations.md)、
  * `copy()` 関数（下記参照）。

<!--original
  * `equals()`/`hashCode()` pair, 
  * `toString()` of the form `"User(name=John, age=42)"`,
  * [`componentN()` functions](multi-declarations.html) corresponding to the properties in their order of declaration,
  * `copy()` function (see below).
-->
  

生成されたコードの一貫性と意味のある動作を保証するために、
データクラスは、次の要件を満たさなければなりません：

<!--original
To ensure consistency and meaningful behavior of the generated code, data classes have to fulfil the following requirements:
-->

  * プライマリコンストラクタは、少なくとも1つのパラメータを持っている必要があります。
  * すべてのプライマリコンストラクタのパラメータは、 `val` または `var` としてマークする必要があります。
  * データクラスは、 abstract, open, sealed または inner にすることはできません。

<!--original
  * The primary constructor needs to have at least one parameter;
  * All primary constructor parameters need to be marked as `val` or `var`;
  * Data classes cannot be abstract, open, sealed or inner;
-->

さらに、メンバの継承に関連して、生成されるデータクラスのメンバは以下のルールに従います：

* `.equals()`, `.hashCode()`, `.toString()`の明示的な実装がデータクラスの本体にあるか、基底クラスに`final`の実装があれば、これらの関数は生成されず、すでにある実装が使われます。
* 基底型が`.componentN()`を`open`で定義してあって戻りの型が互換性があれば、生成される対応する関数は基底クラスのoverrideとして実装されます。また、シグニチャが互換性が無かったりfinalだたりしてoverride出来ない時は、エラーとして報告されます。
* `.componentN()`や`.copy()`を明示的に実装する事は禁止されています。

<!--original
* If there are explicit implementations of `.equals()`, `.hashCode()`, or `.toString()` in the data class body or
  `final` implementations in a superclass, then these functions are not generated, and the existing
  implementations are used.
* If a supertype has `.componentN()` functions that are `open` and return compatible types, the
  corresponding functions are generated for the data class and override those of the supertype. If the functions of the
  supertype cannot be overridden due to incompatible signatures or due to their being final, an error is reported.
* Providing explicit implementations for the `.componentN()` and `.copy()` functions is not allowed.
-->


データクラスは他のクラスを継承する事が出来ます（[sealedクラス](sealed-classes.md)に例があります）。



> JVM上で、生成されたクラスがパラメータなしのコンストラクタを持つ必要がある場合は、
> すべてのプロパティのデフォルト値を指定する必要があります（[コンストラクタ](classes.md#コンストラクタ)を参照してください）。
>
{: .note}

``` kotlin
data class User(val name: String = "", val age: Int = 0)
```

## クラス本体に宣言されたプロパティ

コンパイラが自動生成に使うのはプライマリコンストラクタに含まれているプロパティだけです。
だからあるプロパティを自動生成から除外したければ、
クラスの本体に実装すればいいでしょう：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```


<!--
The compiler only uses the properties defined inside the primary constructor for the automatically generated
functions. To exclude a property from the generated implementations, declare it inside the class body:
-->

この例では、`name`プロパティだけが `.toString()`、 `.equals()`、 `.hashCode()`、 `.copy()`の実装で使われて、
コンポーネント関数も`.component1()`だけです。
`age`プロパティが`.toString()`、 `.equals()`、 `.hashCode()`、 `.copy()`の実装で使われない理由は、
`age`プロパティがクラス本体に宣言されているからです。
もし二つの`Person`オブジェクトが異なるage（訳注：年齢）でありながら`name`が同じなら、
両者は等価として扱われます。
これは`.equals`関数が`name`の等価(equality)チェックしかしないからです。
例えば：

<!--
In this example, only the `name` property can be used inside the `.toString()`, `.equals()`, `.hashCode()`, and `.copy()` implementations,
and there is only one component function `.component1()`. The `age` property can't be used inside the `.toString()`, 
`.equals()`, `.hashCode()`, and `.copy()` implementations because it's declared inside the class body. If two `Person` 
objects have different ages but the same `name`, then they are treated as equal. This is because the `.equals()` function
can only check for equality of the `name` property. For example:
-->

{% capture dataclass-body-property %}
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1は年齢 ${person1.age}: ${person1}")
    // person1は年齢 10: Person(name=John)
  
    println("person2は年齢 ${person2.age}: ${person2}")
    // person2は年齢 20: Person(name=John)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=dataclass-body-property %}


## コピー

オブジェクトをコピーするには`.copy()`関数が使えます。
プロパティの _いくつか_ を変更し、残りをそのままにしてオブジェクトをコピーする、という事も出来ます。
`User` クラスの場合、その実装は次のようになります。

<!--original
Use the `.copy()` function to copy an object, allowing you to alter _some_ of its properties while keeping the rest unchanged. The implementation of this function for the `User` class above would be as follows:
-->

``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     

<!--original
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     
-->

これを用いて、次のように書くことができます：

<!--original
This allows us to write
-->

``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

<!--original
``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```
-->

## データクラスと分解宣言 (Destructuring Declarations)

<!--original
## Data Classes and Destructuring Declarations
-->

データクラスのために生成された _コンポーネント関数_ は、[分解宣言(destructuring declaration)](destructuring-declarations.md)で使用できます。

<!--original
_Component functions_ generated for data classes make it possible to use them in [destructuring declarations](destructuring-declarations.md):
-->

``` kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, 年齢は $age 歳") 
// Jane, 年齢は 35 歳
```

<!--original
``` kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```
-->

## 標準データクラス

<!--original
## Standard Data Classes
-->

標準ライブラリは、 `Pair` と `Triple` を提供します。
ですがほとんどの場合、プロパティに意味のある名前を提供することによりコードが読みやすくなるため、
データクラスを使う方がより良い設計上の選択です。

<!--original
The standard library provides the `Pair` and `Triple` classes. In most cases, though, named data classes are a better design choice
because they make the code easier to read by providing meaningful names for the properties.
-->