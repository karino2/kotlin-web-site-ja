---
layout: reference
title: "スコープ関数"
---
# スコープ関数

Kotlin標準ライブラリには、オブジェクトのコンテキストでコードのブロックを実行する事だけを目的とするようないくつかの関数があります。
そのような関数を[ラムダ式](lambdas.md)を渡して呼び出せば、それは一時的なスコープを形成します。
このスコープの中ではそのオブジェクトを名前無しでアクセス出来ます。
そのような関数を**スコープ関数(scope functions)**といいます。
そのような関数が5つあります： [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html), [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)
, [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html), [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)
, [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)です。

基本的にはこれらの関数はすべて同じアクションを実行します： そのオブジェクトでコードのブロックを実行する。
違う所はこのオブジェクトがどのように使用出来るのかと式全体の結果が何なのか、という所だけです。

以下は、スコープ関数の典型的な使用例です：

{% capture let-ex %}
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("アリス", 20, "アムステルダム").let {
        println(it)
        it.moveTo("ロンドン")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=let-ex %}

もし同じ例を`let`無しで書こうと思えば、新しい変数を導入して、その名前を使う都度何度も書かないといけません。

{% capture wo-let-ex %}
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("アリス", 20, "アムステルダム")
    println(alice)
    alice.moveTo("ロンドン")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=wo-let-ex %}

スコープ関数は何か新しく技術的に出来る事が増える、というものではありません。ですが、コードをもっと簡潔で読みやすくしてくれます。

スコープ関数同士はとても似ている事から、適切なものを選ぶのはちょっと難しい事もあるかもしれません。
何を選ぶべきかは主に、あなたの意図と、プロジェクトの中の一貫性によって決まる類のものです。
以下では、スコープ関数の間の違いとそのコンベンションについて、詳細に説明します。

## 関数の選択

あなたが正しいスコープ関数を選びやすくするように、
ここにスコープ関数のキーとなる違いを要約したテーブルを示しておきます。

| 関数 |オブジェクトのリファレンス|戻りの値|拡張関数か？|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|ラムダの結果|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|ラムダの結果|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|ラムダの結果|No: コンテキストオブジェクト無しで呼ぶ|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|ラムダの結果|No: コンテキストオブジェクトを引数に取る|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|コンテキストオブジェクト|Yes|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|コンテキストオブジェクト|Yes|

これらの関数の詳細な情報については、以下のそれぞれのセクションで提供します。

以下は意図している目的に応じてスコープ関数を選ぶための短いガイドです：

* 非nullableなオブジェクトにラムダを実行する：`let`
* 式の結果を変数としてローカルスコープに導入したい：`let`
* オブジェクトのコンフィギュレーション：`apply`
* オブジェクトのコンフィギュレーションと結果の計算：`run`
* 式が要求される所で文を実行したい：拡張で無い方の`run`
* 追加の効果：`also`
* オブジェクトに対する関数をグルーピングしたい：`with`

異なるスコープ関数のユースケースの一部はかぶっています。
だからそのスコープ関数を使うかはプロジェクトやチームでどのようなコンベンションになっているかによって選んでよろしい。

スコープ関数はあなたのコードをより簡潔にしてくれるものではありますが、使い過ぎには注意しましょう：
使いすぎるとコードが読みにくくなり、それはエラーへとつながる事もあります。
また、我々のおすすめとしては、スコープ関数をネストするのはやめて、スコープ関数をチェインするのも身長になった方が良いでしょう。
それらをすると、すぐにそれぞれのブロックのコンテキストのオブジェクトや、そこでの`this`や`it`の値がなんなのか混乱しがちだからです。

## （スコープ関数の）違い

スコープ関数は本質的にお互いに似ているものなので、
それらの間の「違い」を理解するのが大切です。
各スコープ関数は主に２つの点で異なります：

* コンテキストオブジェクトを参照する方法
* 戻りの値

### コンテキストオブジェクト: this か it

スコープ関数にわたすラムダの中では、コンテキストオブジェクトはその実際の名前では無くて短いリファレンスで参照出来ます。
各スコープ関数はコンテキストオブジェクトを２つのうちのどちらかの方法で参照します： ラムダの[レシーバ](lambdas.md#レシーバ付き関数リテラル)
(`this`)か、ラムダの引数 (`it`) かです。どちらも同じ機能を提供しますから、ここでは様々なユースケースの場合のそれらの長所と短所を説明し、
どういう時にどちらを使うべきかのオススメを伝授します。


{% capture diff-scope-for-same-ex %}
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("文字列の長さ： $length")
        //println("文字列の長さ： ${this.length}") // 同じ意味
    }

    // it
    str.let {
        println("文字列の長さは ${it.length}")
    }
}
{% endcapture %}
{% include kotlin_quote.html body=diff-scope-for-same-ex %}

#### this

`run`, `with`, `apply`はコンテキストオブジェクトをラムダの[レシーバ](lambdas.md#レシーバ付き関数リテラル)として参照します ー 
つまり、キーワード`this`で参照します。
ようするに、ラムダの中ではオブジェクトは通常のクラスの関数の時のような感じで参照できます。

多くの場合、レシーバのオブジェクトのメンバにアクセスする時には`this`を省略する事が出来て、コードが短く書けます。
一方、`this`を省略するとレシーバのメンバなのか外側のオブジェクトのメンバや関数なのかを区別しづらくなります。
だから、コンテキストオブジェクトをレシーバとして持つ(`this`)ものは、そのラムダが主にそのオブジェクトのメンバを呼び出したりプロパティに値を設定したり、といったようなオブジェクトに対する操作の場合に使うのが良いでしょう。

{% capture this-or-it %}
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("アダム").apply { 
        age = 20                       // this.age = 20 と同じ
        city = "ロンドン"
    }
    println(adam)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=this-or-it %}

#### it

一方、`let` と `also` はコンテキストオブジェクトをラムダの[引数](lambdas.md#ラムダ式の構文)として参照します。
引数の名前を指定しなければ、オブジェクトは暗黙のデフォルトの名前、`it`で参照出来ます。
`it`は`this`よりも短いし、`it`の式の方が通常は読みやすい事が多い。

しかしながら、オブジェクトの関数やプロパティを呼ぶ時には、`this`のように暗黙にオブジェクトを参照する事は出来ません。
一方、コンテキストオブジェクトを主に関数呼び出しの引数などに渡したい時には、`it`で参照する方が良いでしょう。
コードブロックで複数の変数を使いたい時にも`it`の方がいいでしょう。


{% capture it-as-arg %}
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() は値 $it を生成する")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=it-as-arg %}

以下の例ではコンテキストオブジェクトをラムダの名前をつけた引数 `value` で参照する例です。

{% capture context-as-name %}
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() は値 $value を生成する")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=context-as-name %}

### 戻りの値

スコープ関数は結果として返す値が異なっています：

* `apply` と `also` はコンテキストオブジェクトを返します
* `let`, `run`, `with` はラムダの結果を返します

どの戻りの値が良いかは、あなたがコードの中で次に何をしたいかに基づいて良く考える必要があります。
この事が使うべき一番適切なスコープ関数を選ぶ事にもつながります。

#### コンテキストオブジェクト

`apply` と `also` の戻りの型はコンテキストオブジェクト自身です。
つまり、呼び出しチェーンの中に**寄り道**として含める事が出来ます：
同じオブジェクトに対して関数のチェーンを続ける事が出来ます。

{% capture ctx-obj-return %}
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("リストを作成します") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("リストをソートします") }
        .sort()
//sampleEnd
    println(numberList)
}
{% endcapture %}
{% include kotlin_quote.html body=ctx-obj-return %}

コンテキストオブジェクトを返す関数のreturn文で使う事も出来ます。

{% capture return-also %}
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=return-also %}

#### ラムダの結果

`let`, `run`, `with`はラムダの結果を返します。
だから結果を変数に代入したり、結果にオペレーションをチェーンしたり、といった事が可能です。


{% capture lambda-result %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("末尾がeで終わる要素は $countEndsWithE 個あります")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=lambda-result %}

さらに、戻りの値を無視して、ローカル変数のための一時的なスコープを作るためにスコープ関数を使う事も出来ます。

{% capture temp-scope %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("最初の要素: $firstItem, 最後の要素: $lastItem")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=temp-scope %}

## 実際の関数たち

あなたのユースケースに合わせた適切なスコープ関数を選ぶ事を助けるために、
スコープ関数を詳細に説明して推奨する使い方を以下で説明します。
技術的にはスコープ関数は多くの場合に取り替え可能でどれを使う事も出来る場合が多々あるので、
以下の例では慣例的に何を使うかを示してもいます。

### let

- **コンテキストオブジェクト**は引数(`it`)で扱える
- **戻りの値**はラムダの結果

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)は呼び出しチェーンの結果に対して関数を呼び出すのに使えます。
例えば以下の例では、コレクションの２つのオペレーションの結果をprintしていますが：

{% capture wo-let-callchain %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=wo-let-callchain %}

`let`を使えば、上のコードをリストオペレーションの結果を変数に代入しないように書き直す事が可能です：

{% capture with-let %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // もし必要ならここでさらに関数を呼び出す事もできる
    } 
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=with-let %}

もし`let`に渡しているコードブロックが引数が`it`の関数一つの場合は、ラムダを引数にわたす代わりにメソッドリファレンス(`::`)を渡す事も出来ます：

{% capture let-method-ref %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=let-method-ref %}

`let`は非nullの値を含むコードブロックを実行するのに良く使われます。
非nullのオブジェクトにアクションを実行したい場合は、
そのオブジェクトに[セーフコール演算子 `?.`](null-safety.md#セーフコール)を使用して、実行したいアクションをラムダで渡した`let`を呼び出します。


{% capture safe-call-let %}
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // コンパイルエラー: strはnullかもしれないから
    val length = str?.let { 
        println("$it に対し、let()を呼び出した")
        processNonNullString(it)      // OK: '?.let { }'の中の'it'はnullでは無いから
        it.length
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=safe-call-let %}

限定した範囲内だけでローカル変数を導入する事でコードを読みやすくしたい、という時にも`let`を使う事が出来ます。
コンテキストオブジェクトを表す新しい変数を定義するためには、
ラムダの引数として名前を与える事で、デフォルトの`it`の代わりとして使う事が出来ます。


{% capture let-for-newvar %}
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("リストの最初の要素は '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("修正した後の最初の要素: '$modifiedFirstItem'")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=let-for-newvar %}

### with

- **コンテキストオブジェクト**はレシーバ(`this`)として扱える
- **戻りの値**はラムダの結果

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)は拡張関数ではありません：
コンテキストオブジェクトは引数として渡されます。ですがラムダの中ではレシーバ(`this`)として参照出来ます。

`with`は、コンテキストオブジェクトに対して関数を呼び出して、その結果が必要無いような用途の時に使う事を推奨しています。
コードの中では`with`は、以下の英文のように読む事が出来ます："_with this object, do the following._"（このオブジェクトの対して、以下をしなさい）

{% capture with-ex1 %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with'が引数 $this で呼び出されました")
        println("それは $size 要素を保持しています")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=with-ex1 %}

`with`をなんらかの値を計算するのに使うヘルパーオブジェクトを導入して、そのヘルパーオブジェクトのプロパティや関数を使って計算を行うような用途に使う事も出来ます。

{% capture with-ex2 %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "最初の要素は ${first()}、 " +
        "最後の要素は ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=with-ex2 %}

### run

- **コンテキストオブジェクト**はレシーバ(`this`)として扱える 
- **戻りの値**はラムダの結果

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) は `with` と同じ事を拡張関数で行います。
つまり、`let`のように、コンテキストオブジェクトにドット記法で呼び出す事が出来ます。

`run`はラムダでオブジェクトの初期化をしつつ結果の値を計算するような時に便利です。

{% capture run-ex1 %}
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "デフォルトのリクエスト"
    fun query(request: String): String = "クエリ '$request' の結果"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " をポート $port に")
    }
    
    // let() 関数を使って同じコードを書いてみる:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " をポート ${it.port} に")
    }
//sampleEnd
    println(result)
    println(letResult)
}
{% endcapture %}
{% include kotlin_quote.html body=run-ex1 %}

`run`を拡張関数でなく実行する事も出来ます。
拡張関数でない版の`run`はコンテキストオブジェクトを持たず、
結果はラムダの結果を返します。
拡張関数でない版の`run`は、式が期待されている所に複数の文を書く事を可能にしてくれます。

{% capture run-ex2 %}
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=run-ex2 %}

### apply

- **コンテキストオブジェクト**はレシーバ(`this`)として扱える 
- **戻りの値**はオブジェクト自身

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)はコンテキストオブジェクト自身を返すので、
コードブロックが値を返さずに、そのコードブロックの主な目的がレシーバオブジェクトのメンバを操作する事である場合に使う事をオススメしています。
`apply`のもっとも良くある使われ方は、オブジェクトのコンフィギュレーションです。
そのような呼び出しは、以下のような英文のように読めます。
"_apply the following assignments to the object._" （オブジェクトに以下の代入を適用せよ）


{% capture apply-config %}
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("アダム").apply {
        age = 32
        city = "ロンドン"        
    }
    println(adam)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=apply-config %}

もうひとつよくある `apply` の使用例としては、
複数の呼び出しチェーンの中により複雑な処理を含めたい場合が挙げられます。

### also

- **コンテキストオブジェクト**は引数(`it`)で扱える 
- **戻りの値**はオブジェクト自身

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)はコンテキストオブジェクトを引数に取るようなアクションを実行したい時に便利です。
`also`はコンテキストオブジェクトのプロパティよりもコンテキストオブジェクト自身への参照を必要とするケースや、
外側のスコープの`this`をシャドー（隠す）してしまいたくない時に使いましょう。

`also`をコードで見た時は、以下の英文のように読めます。"_and also do the following with the object._" （そしてさらに以下をオブジェクトにせよ）

{% capture also-ex %}
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("新しいのを足す前のリストの要素たち： $it") }
        .add("four")
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=also-ex %}

## takeIf と takeUnless

スコープ関数に加えて、標準ライブラリには[`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) と [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)
関数もあります。
これらの関数は呼び出しチェーンの中にオブジェクトの状態のチェックを含める事を可能にします。

When called on an object along with a predicate, `takeIf` returns this object if it satisfies the given predicate.
Otherwise, it returns `null`. So, `takeIf` is a filtering function for a single object.

`takeUnless` has the opposite logic of `takeIf`. When called on an object along with a predicate, `takeUnless` returns 
`null` if it satisfies the given predicate. Otherwise, it returns the object.

When using `takeIf` or `takeUnless`, the object is available as a lambda argument (`it`).

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> When chaining other functions after `takeIf` and `takeUnless`, don't forget to perform a null check or use a safe call
> (`?.`) because their return value is nullable.
>
{type="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` and `takeUnless` are especially useful in combination with scope functions. For example, you can chain 
`takeIf` and `takeUnless` with `let` to run a code block on objects that match the given predicate. To do this, 
call `takeIf` on the object and then call `let` with a safe call (`?`). For objects that don't match the predicate, 
`takeIf` returns `null` and `let` isn't invoked.

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For comparison, below is an example of how the same function can be written without using `takeIf` or scope functions:

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

