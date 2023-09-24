---
layout: reference
title: "クラス（ツアー）"
---
# クラス（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-done.svg){:width="20" style="display:inline"} [基本型](kotlin-tour-basic-types.md)
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-done.svg){:width="20" style="display:inline"} [コレクション](kotlin-tour-collections.md)
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4-done.svg){:width="20" style="display:inline"} [制御フロー](kotlin-tour-control-flow.md)
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-done.svg){:width="20" style="display:inline"} [関数](kotlin-tour-functions.md)
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6.svg){:width="20" style="display:inline"} **クラス**
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} [Nullセーフティ](kotlin-tour-null-safety.md)

Kotlinはクラスとオブジェクトによるオブジェクト指向プログラミングをサポートしています。
オブジェクトはプログラムのデータを格納するのに便利です。
クラスはオブジェクトの特性を記述するのに使います。
クラスからオブジェクトを作れば、個々のオブジェクトにこの特性を繰り返し記述する必要がなくなるので時間の節約になります。

クラスを宣言するには、`class`キーワードを使います：

```kotlin
class Customer
```

## プロパティ

クラスに所属するオブジェクトの特性は、プロパティで宣言する事が出来ます。
クラスのプロパティは以下のように作る事が出来ます：
* クラス名のあとのカッコ `()` の中
```kotlin
class Contact(val id: Int, var email: String)
```
* 中括弧 `{}` の中のクラスの本体の中
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

クラスのインスタンスを作った後に変更したい場合を除いて、プロパティは読み取り専用(`val`)にしておく事をオススメします。

カッコの中の`val`や`var`無しでもプロパティを定義する事は出来ますが、これらのプロパティはインスタンスを作った後はアクセス出来ません。

> * カッコ `()` の中に置くものは **クラスヘッダ（class header）** と呼ばれます。
> * クラスのプロパティを宣言する時は、[トレーリングカンマ(trailing comma)](coding-conventions.md#トレーリングカンマ)を使う事が出来ます。
>
{: .note}

関数の引数と同様、クラスのプロパティもデフォルトの値を持つ事が出来ます：
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## インスタンスの作成

オブジェクトをクラスから作るには、**コンストラクタ（constructor）**を使って**インスタンス（instance）**を作らないといけません。

デフォルトでは、Kotlinはクラスヘッダに定義された内容のパラメータを持つコンストラクタを自動的に生成します。

例を挙げましょう：
{% capture kotlin-tour-class-create-instance %}
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-class-create-instance %}

この例において:
* `Contact` はクラス
* `contact` は`Contact`クラスのインスタンス
* `id` と `email` はプロパティ
* `id` と `email` はデフォルトコンストラクタで`contact`を作るのにも使われている

Kotlinのクラスはたくさんのコンストラクタを持つ事が出来、あなたが自身で定義出来るものも含みます。
どうやって複数のコンストラクタを宣言するのかを学びたければ、[コンストラクタ](classes.md#コンストラクタ)を参照してください。

## プロパティにアクセスする

インスタンスのプロパティにアクセスするには、インスタンスの名前の後にピリオド`.`をつけて、その後ろにプロパティの名前を書きます：

{% capture kotlin-tour-access-property %}
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // プロパティの値を出力: email
    println(contact.email)           
    // mary@gmail.com

    // プロパティの値を更新: email
    contact.email = "jane@gmail.com"
    
    // 新しくなったプロパティの値を出力: email
    println(contact.email)           
    // jane@gmail.com
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-access-property %}

> プロパティの値を文字列とつなげるには、文字列テンプレート(`$`)が使えます。
> たとえば：
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{: .tip}

## メンバ関数

オブジェクトの特性としてプロパティを宣言するのに加えて、オブジェクトの振る舞いをメンバ関数として定義する事も出来ます。

Kotlinでは、メンバ関数はクラスの本体の中に定義しなくてはなりません。
インスタンスのメンバ関数を呼ぶためには、
インスタンスの名前の後にピリオド`.`をつなげて、その後にメンバ関数名を書きます。
例えば：

{% capture kotlin-tour-member-function %}
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // メンバ関数 printId() を呼ぶ
    contact.printId()           
    // 1
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-member-function %}

## データクラス

Kotlinには**データクラス**があります。
それは、データを格納するのにとりわけ便利です。
データクラスはクラスと同じ機能を持ち、それに加えて追加のメンバ関数がいくつか自動生成されます。
これらの自動生成されるメンバ関数のおかげで、
インスタンスを人間が読む事が出来るような出力でプリントしたり、
同じクラスから作られたインスタンス同士を比較したり、インスタンスをコピーしたり、その他さまざまな事が簡単に出来るようになります。
これらの関数は自動的に作られて使う事が出来るので、各クラスでいつも同じようなお決まりのコード（boilerplate code）を何度も繰り返し書かなくて済みます。

データクラスを宣言するには、キーワード`data`を使います：
```kotlin
data class User(val name: String, val id: Int)
```

データクラスに最初から定義されるメンバ関数のうちで、特に便利なものを挙げると：

| **関数**             | **説明**                                                                                                       |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| `.toString()`       | クラスのインスタンスとそのプロパティについて人間が読むことが出来るような文字列を得る                                         |
| `.equals()` or `==` | クラスのインスタンス同士を比較する                                                                                   |
| `.copy()`           | あるインスタンスからコピーする事でクラスのインスタンスを作成する、幾つかのパラメータをコピー時に変更したりも出来る                |

これらの関数をどうやって使うかは、続く以下のセクションを参照ください：
* [文字列としてプリント](#文字列としてプリント)
* [インスタンス同士の比較](#インスタンス同士の比較)
* [インスタンスのコピー](#インスタンスのコピー)

### 文字列としてプリント

クラスのインスタンスの可読な文字列をプリントするには、`.toString()`を明示的に呼ぶか、
print関数(`println()` と `print()`)を呼べば良いです（print関数は自動的に`.toString()`を呼んでくれます）：


{% capture kotlin-tour-data-classes-print-string %}
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // 自動的に toString() 関数が使われるので、結果の出力は読みやすいものになっている
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-data-classes-print-string %}

この機能はデバッグやログを作るのに特に便利です。

### インスタンス同士の比較

データクラスのインスタンス同士を比較するには、等価演算子`==`を使います：

{% capture kotlin-tour-data-classes-compare-instances %}
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // user と second user を比較
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // user と third user を比較
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-data-classes-compare-instances %}

### インスタンスのコピー

データクラスのインスタンスの、そのまんまのコピーを作るには、インスタンスの`.copy()`関数を呼びます。

データクラスのインスタンスのコピーを作り、**しかも**幾つかのプロパティは変更したければ、
インスタンスの`.copy()`関数を呼んで、**しかも**置き換えたいプロパティを関数の引数として渡します。

例を挙げると:

{% capture kotlin-tour-data-classes-copy-instance %}
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // userのそのまんまのコピー
    println(user.copy())       
    // User(name=Alex, id=1)

    // userをnameだけ"Max"にしてコピー
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // userをidだけ3にしてコピー
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-data-classes-copy-instance %}

元インスタンスを変更するよりも、インスタンスのコピーを作る方が安全です。
なぜなら、元のインスタンスに依存したすべてのコードは、あなたがコピーに何をしても一切影響が無いからです。

データクラスについてのより詳細な情報は、[データクラス](data-classes.md)を参照ください。 

このツアーの最後の章は、Kotlinの[Nullセーフティ](kotlin-tour-null-safety.md)に関してです。

## 練習問題

### 練習問題 1

`Employee`という名前で以下の二つのプロパティを持つデータクラスを作成せよ：一つがname、もう一つがsalary（訳注：給料の意味）。
salaryプロパティはmutableにし忘れないように。そうしないと年末に昇給しなくなってしまいますから！
main関数ではこのデータクラスをどう使うかを示しています。

（訳注：Employeeは社員、salaryは給料という意味）

{% capture kotlin-tour-classes-exercise-1 %}
// ここにコードを書いてね

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-classes-exercise-1 %}

{% capture kotlin-tour-classes-solution-1 %}
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-classes-solution-1 %}

### 練習問題 2

あなたのコードをテストするために、ランダムな社員を作る必要が出てきました。
以下のようなクラスを作成しなさい：名前の候補をリストで（クラスの本体の中に）持ち、最低額と最高額の賃金を設定出来る（クラスヘッダの中で）。
ここでも、main関数では作るべきクラスをどう使うかを示しています。

{% capture kotlin-tour-classes-exercise-2-hint-1 %}
リストには[`.random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)というextension関数があり、
これがリストの中の要素をランダムに返してくれます。
{% endcapture %}
{% include collapse_quote.html title="ヒント1" body=kotlin-tour-classes-exercise-2-hint-1 %}

{% capture kotlin-tour-classes-exercise-2-hint-2 %}
`Random.nextInt(from = ..., until = ...)`は指定した範囲の`Int`の数値を返します（訳注：fromは一番下、untilは一番上を表します、fromは含みますがuntilは含みません）
{% endcapture %}
{% include collapse_quote.html title="ヒント2" body=kotlin-tour-classes-exercise-2-hint-2 %}

{% capture kotlin-tour-classes-exercise-2 %}
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// ここにコードを書いてね

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-classes-exercise-2 %}

{% capture kotlin-tour-classes-solution-2 %}
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-classes-solution-2 %}

## 次回

[Nullセーフティ](kotlin-tour-null-safety.md)