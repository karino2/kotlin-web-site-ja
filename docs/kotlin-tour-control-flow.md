---
layout: reference
title: "制御フロー（ツアー）"
---
# 制御フロー（ツアー）

- ![ステップ1]({{ site.baseurl }}/assets/images/icons/icon-1-done.svg){:width="20" style="display:inline"} [Hello world](kotlin-tour-hello-world.md)
- ![ステップ2]({{ site.baseurl }}/assets/images/icons/icon-2-done.svg){:width="20" style="display:inline"} [基本型](kotlin-tour-basic-types.md)
- ![ステップ3]({{ site.baseurl }}/assets/images/icons/icon-3-done.svg){:width="20" style="display:inline"} [コレクション](kotlin-tour-collections.md)
- ![ステップ4]({{ site.baseurl }}/assets/images/icons/icon-4.svg){:width="20" style="display:inline"} **制御フロー**
- ![ステップ5]({{ site.baseurl }}/assets/images/icons/icon-5-todo.svg){:width="20" style="display:inline"} [関数](kotlin-tour-functions.md)
- ![ステップ6]({{ site.baseurl }}/assets/images/icons/icon-6-todo.svg){:width="20" style="display:inline"} [クラス](kotlin-tour-classes.md)
- ![ステップ7]({{ site.baseurl }}/assets/images/icons/icon-7-todo.svg){:width="20" style="display:inline"} [Null safety](kotlin-tour-null-safety.md)

他のプログラム言語と同様に、Kotlinもコード片を評価した結果がtrueかどうかによって処理を決定する事が出来ます。
そのようなコード片を**条件式（conditional expressions）**と呼んだりします。
また、Kotlinはループを作成し、処理を繰り返す事も出来ます。

## 条件式

Kotlinには条件式をチェックする目的で、`if`と`when`があります。

> もし`if`と`when`のどちらにしようか迷ったら、`when`を使う事をオススメします。そちらの方がより安全で頑強なプログラムとなるからです。
> 
{: .note}

### If

`if`の使い方は、その後にカッコ`()`の中に条件式を入れて、その次にその結果がtrueだったら実行したいアクションを中括弧`{}`の中に入れます：

{% capture kotlin-tour-if %}
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-if %}

Kotlinには三項演算子、`condition ? then : else`がありません（訳注：C言語などの言語にはあるがKotlinには無い機能）

三項演算子の代わりに、Kotlinは`if`を式として使う事が出来ます。
`if`を式として使う時は、中括弧`{}`がありません：（訳注：中括弧なしでも構わない、という意味だと思う）

{% capture kotlin-tour-if-expression %}
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // 結果の値: 2
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-if-expression %}

### When

条件式に対して複数の分岐がある場合は`when`を使います。
`when`は文としても式としても使う事が出来ます。

`when`を文として使う時の例は以下のようになります：
* 条件文をカッコ`()`の中に入れ、実行すべきアクションを中括弧`{}`の中に入れます
* 各分岐では、`->`を使って条件とアクションを分けます

{% capture kotlin-tour-when-statement %}
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // obj が "1" と等しいかをチェック
        "1" -> println("One")
        // obj が "Hello" と等しいかをチェック
        "Hello" -> println("Greeting")
        // デフォルトの文
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-when-statement %}

> 分岐の条件は一つずつ順番にチェックされて、最初に条件を満たすまでチェックが続く事に注目してください。
> 言い換えると最初に条件に一致した分岐だけが実行されます。
>
{: .note}

以下は`when`を式として使う例です。`when`シンタックスがそのまま変数に直接代入されています：

{% capture kotlin-tour-when-expression %}
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // もし obj が "1" と等しければ、resultを"one"にセットする
        "1" -> "One"
        // もし obj が "Hello" と等しければ、resultを"Greeting"にセットする
        "Hello" -> "Greeting"
        // ここまえの条件がどれも成立しなければ、result を "Unknown"にセットする
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-when-expression %}

`when`を式として使う場合は、コンパイラが分岐の条件節ですべての可能性が尽くされていると判定出来る場合を除いては、else節が必須となります。

さきほどの例では`when`は変数とマッチングするのに便利である事が見て取れました。
ですが`when`はさらに、連鎖するBoolean式をチェックするのにも有用です：


{% capture kotlin-tour-when-expression-boolean %}
fun main() {
//sampleStart
    val temp = 18

    val description = when {
        // もし temp < 0 が trueなら、descriptionに "very cold" をセット
        temp < 0 -> "very cold"
        // もし temp < 10 が trueなら、descriptionに "a bit cold" をセット
        temp < 10 -> "a bit cold"
        // もし temp < 20 が trueなら、 descriptionに "warm" をセット
        temp < 20 -> "warm"
        // もしここまでの条件が一つも成立してなければ、description を "hot" にセット
        else -> "hot"             
    }
    println(description)
    // warm
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-when-expression-boolean %}

## 範囲（Range）

ループについての話をする前に、ループでどの範囲を反復処理をするかを指定するのに使えるrangeというものを、どのように構築するかを知っておくと良いでしょう。

Kotlinでもっとも一般的なrangeの作り方は、`..`演算子 を使う方法です。例えば、`1..4` は `1, 2, 3, 4` という意味になります。

終わりの値を含まないrangeを作りたい場合は、`..<`演算子 を使います。例えば、`1..<4` は `1, 2, 3` という意味になります。

逆の順序でrangeを作りたい場合は`downTo`を使います。例えば、`4 downTo 1` は `4, 3, 2, 1` という意味になります。

1以外のステップで増えていくようなrangeを作りたい場合は、`step`を使ってお望みの増加幅を指定します。
例えば、`1..5 step 2` は `1, 3, 5` という意味になります。

ここまで話した事は `Char` のrangeでも同様となります：
* `'a'..'d'` は `'a', 'b', 'c', 'd'` という意味になります
* `'z' downTo 's' step 2` は `'z', 'x', 'v', 't'` という意味になります

## ループ

プログラムにおいて最も一般的なループ構造といえば、`for`と`while`でしょう。
`for`はrangeの値に渡って繰り返し処理を行いたい時に使います。
`while`は特定の条件が満たされるまで処理をし続けます。

### For

rangeについて新たに学んだ知識をもとに、数字を1から5まで繰り返してその数字をprintするforループを作る事が出来ます。

カッコ　`()`　の中にイテレータかrangeを、キーワードの　`in`　とともに置きます。
そして行いたいアクションを中括弧 `{}` の中に置きます：


{% capture kotlin-tour-for-loop %}
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number が iterator　で 1..5 が range
        print(number)
    }
    // 12345
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-for-loop %}

（訳注：iteratorでは無いような…）

コレクションもループで反復処理出来ます：

{% capture kotlin-tour-for-collection-loop %}
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("美味しい！ $cake ケーキだ！")
    }
    //美味しい！ carrot ケーキだ!
    //美味しい！ cheese ケーキだ!
    //美味しい！ chocolate ケーキだ!
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-for-collection-loop %}

### While

`while` は2通りの使い方があります:
  * 条件式がtrueの間はコードブロックを実行し続ける (`while`)
  * コードブロックをまず実行し、そしてその後に条件式をチェックする (`do-while`)

最初のユースケースでは (`while`):
* whileループを続ける条件となる条件式を、カッコ `()` の中に宣言する
* 実行したいアクションを、中括弧 `{}` の中に置く

> 以下の例では [インクリメント演算子](operator-overloading.md#increments-and-decrements) `++` を、
> `cakesEaten`変数の値をインクリメントするのに使っています。
>
{: .note}

{% capture kotlin-tour-while-loop %}
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("ケーキを食べろ")
        cakesEaten++
    }
    // ケーキを食べろ
    // ケーキを食べろ
    // ケーキを食べろ
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-while-loop %}

二番目のユースケースでは (`do-while`):
* whileループを続ける条件となる条件式を、カッコ `()` の中に宣言する
* 実行したいアクションを、中括弧 `{}` の中に、`do`キーワードとともに定義する

{% capture kotlin-tour-while-do-loop %}
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("ケーキを食べろ")
        cakesEaten++
    }
    do {
        println("ケーキを焼け")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // ケーキを食べろ
    // ケーキを食べろ
    // ケーキを食べろ
    // ケーキを焼け
    // ケーキを焼け
    // ケーキを焼け
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-while-do-loop %}


条件式とループについてさらに知りたい人は、[条件式とループ](control-flow.md)を参照ください。

今やあなたはKotlinの制御フローの基礎を理解しました。あなた自身の[関数](kotlin-tour-functions.md)を書く方法を学ぶ時が来ました。

## 練習問題

### 練習問題 1

`when`式を使って、ゲームボーイのボタンの名前を入れたらそのボタンで実行される事をprintするように以下のプログラムを変更せよ。

| **Button** | **アクション**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| それ以外    | そんなボタンありません |

{% capture kotlin-tour-control-flow-exercise-1 %}
fun main() {
    val button = "A"

    println(
        // ここにコードを書いてね
    )
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-control-flow-exercise-1 %}

{% capture kotlin-tour-control-flow-solution-1 %}
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "そんなボタンありません"
        }
    )
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-control-flow-solution-1 %}

### 練習問題 2

スライスされたピザを数えて行って、8スライスでまるまるピザ一枚になるまで数える以下のプログラムがあります。
このプログラムを二つの方法でリファクタリングしてください：
* `while` ループを使って
* `do-while` ループを使って

{% capture kotlin-tour-control-flow-exercise-2 %}
fun main() {
    var pizzaSlices = 0
    // Start refactoring here
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    println("ピザが $pizzaSlices 片しか無い :(")
    pizzaSlices++
    // End refactoring here
    println("ピザが $pizzaSlices 片！ やったね！ ピザがまるごと一枚あるよ！ :D")
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-control-flow-exercise-2 %}

{% capture kotlin-tour-control-flow-exercise-2-solution-1 %}
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("ピザが $pizzaSlices 片しか無い :(")
    }
    pizzaSlices++
    println("ピザが $pizzaSlices 片！ やったね！ ピザがまるごと一枚あるよ！ :D")
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例 1" body=kotlin-tour-control-flow-exercise-2-solution-1 %}

{% capture kotlin-tour-control-flow-exercise-2-solution-2 %}
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("ピザが $pizzaSlices 片しか無い :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("ピザが $pizzaSlices 片！ やったね！ ピザがまるごと一枚あるよ！ :D")
}

```
{% endcapture %}
{% include collapse_quote.html title="解答例 2" body=kotlin-tour-control-flow-exercise-2-solution-2 %}

### 練習問題 3

[Fizz Buzz](https://ja.wikipedia.org/wiki/Fizz_Buzz)ゲームをシミュレートするプログラムを書け。
あなたの任務は数字を1から100まで増やして行って、3で割れる時はその数字を"fizz"に置き換え、
5で割れる数字は"buzz"で置き換え、3と5の両方で割れる数字は"fizzbuzz"に置き換えたものをprintlnするというものです。

{% capture kotlin-tour-control-flow-exercise-3-hint %}
数字をカウントするには`for`ループを使い、各ステップで何を出力するかを決める所では`when`式を使えば良い。
{% endcapture %}
{% include collapse_quote.html title="ヒント" body=kotlin-tour-control-flow-exercise-3-hint %}

{% capture kotlin-tour-control-flow-exercise-3 %}
fun main() {
    // ここにコードを書いてね
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-control-flow-exercise-3 %}

{% capture kotlin-tour-control-flow-solution-3 %}
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> number.toString()
            }
        )
    }
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-control-flow-solution-3 %}

### 練習問題 4

単語のリストがあります。`for`と`if`を使って、文字`l`から始まる単語だけをprintしてください。

{% capture kotlin-tour-control-flow-exercise-4-hint %}
String型の[`.startsWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html)関数を使おう。
{% endcapture %}
{% include collapse_quote.html title="ヒント" body=kotlin-tour-control-flow-exercise-4-hint %}



{% capture kotlin-tour-control-flow-exercise-4 %}
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // ここにコードを書いてね
}
{% endcapture %}
{% include kotlin_quote.html body=kotlin-tour-control-flow-exercise-4 %}

{% capture kotlin-tour-control-flow-solution-4 %}
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{% endcapture %}
{% include collapse_quote.html title="解答例" body=kotlin-tour-control-flow-solution-4 %}

## 次回

[関数](kotlin-tour-functions.md)