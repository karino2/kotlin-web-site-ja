---
layout: reference
title: "returnとジャンプ"
---

# returnとジャンプ

<!--original
# Returns and Jumps
-->

Kotlinには3つの構造的ジャンプ演算子があります。

<!--original
Kotlin has three structural jump operators
-->

* *return*{: .keyword } はデフォルトではそれを包む最も近い関数または[無名関数](lambdas.html#無名関数)から抜け出します。
* *break*{: .keyword } はそれを包む最も近いループを終わらせます。
* *continue*{: .keyword } はそれを包む最も近いループを、次のステップに進めます。

<!--original
* *return*{: .keyword }. By default returns from the nearest enclosing function or [anonymous function](lambdas.html#anonymous-functions).
* *break*{: .keyword }. Terminates the nearest enclosing loop.
* *continue*{: .keyword }. Proceeds to the next step of the nearest enclosing loop.
-->

これらはすべて、より大きな式の一部として使う事が出来ます：

```kotlin
val s = person.name ?: return
```

これらの式の型は[Nothing型](exceptions.md#nothing型)です。


## breakとcontinueのラベル

<!--original
## Break and Continue Labels
-->

Kotlinにおける任意の式を *label*{: .keyword }でマークすることができます。ラベルは、識別子の後ろに`@` 記号が続く形式です。
例えば`abc@` 、`fooBar@`など。
式にラベルを付けるには、式の前にラベルを置きましょう：

<!--original
Any expression in Kotlin may be marked with a _label_.
Labels have the form of an identifier followed by the `@` sign, such as `abc@` or `fooBar@`.
To label an expression, just add a label in front of it.
-->

``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```

<!--original
``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```
-->

さあ、これで私たちは *break*{: .keyword } や *continue*{: .keyword } をラベル付きで出来るようになりました：

<!--original
Now, we can qualify a *break*{: .keyword } or a *continue*{: .keyword } with a label:
-->

``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
        if (...) break@loop
  }
}
```

<!--original
``` kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```
-->

ラベル付き *break*{: .keyword }  はそのラベルが付いたループのすぐ後の実行ポイントへジャンプします。
*continue*{: .keyword } はそのループの次の繰り返し実行（イテレーション）まで進みます。

<!--original
A *break*{: .keyword } qualified with a label jumps to the execution point right after the loop marked with that label.
A *continue*{: .keyword } proceeds to the next iteration of that loop.

-->

## ラベルにreturnする

<!--original
## Return at Labels
-->

Kotlinでは、関数リテラル、ローカル変数、オブジェクト式を使用すると、関数を入れ子にすることができます。
ラベル付きの *return*{: .keyword }を使うと、外側の関数からreturnすることができます。
最も重要なユースケースは、ラムダ式からのreturnです。
以下のように書くと、`return`式は最も近いそれを包んでいる関数、つまり`foo`からreturnする事を思い出してください：

{% capture non-local-return %}
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return // non-local return　はfoo()の呼び出し元に直接帰ってしまう
        print(it)
    }
    println("この地点には来ません")
}
//sampleEnd

fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=non-local-return %}

このようなnon-local なreturnは[インライン関数](inline-functions.md)に渡されたラムダ式でのみサポートされていることに注意してください。
もしラムダ式からだけ復帰する必要がある場合は、そのラムダ式にラベルを付け、 *return*{: .keyword } をラベルで修飾する必要があります：

<!--original
Note that such non-local returns are supported only for lambda expressions passed to [inline functions](inline-functions.md).
To return from a lambda expression, label it and qualify the `return`:
-->

{% capture local-return %}
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // ラムダの呼び出し元、つまりforEachループにreturnするlocal return
        print(it)
    }
    print("明示的なラベル指定あり")
}
//sampleEnd

fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=local-return %}

上の例は、（二つ前の例と異なり）ラムダ式からのみ復帰しています。

多くの場合、**暗黙のラベル(implicit labels)**を使用する方が便利です。
そのようなラベルは、ラムダが渡された関数と同じ名前を持っています。

<!--original
Now, it returns only from the lambda expression. Oftentimes it is more convenient to use implicits labels:
such a label has the same name as the function to which the lambda is passed.
-->

{% capture local-return-implicit %}
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // ラムダの呼び出し元、つまりforEachループにreturnするlocal return
        print(it)
    }
    print("暗黙のラベル指定あり")
}
//sampleEnd

fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=local-return-implicit %}

<!--original
``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```
-->

代わりの手法として、ラムダ式の代わりに[無名関数](lambdas.md#無名関数)を使うという方法もあります。
無名関数内の *return*{: .keyword } 文は、その無名関数自体から復帰します。

<!--original
Alternatively, we can replace the lambda expression with an [anonymous function](lambdas.html#anonymous-functions).
A *return*{: .keyword } statement in an anomymous function will return from the anonymous function itself.
-->

{% capture anonymous-function-return %}
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 無名関数の呼び出し元、つまりforEachループにreturnする local return
        print(value)
    })
    print("無名関数を使った場合")
}
//sampleEnd

fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=anonymous-function-return %}

上記の3つのlocal returnの例は、通常のループの`continue`と似ているということに注目してください。

`break`相当のものは直接は存在しませんが、
外側にlambdaを足してそこからnon-localにreturnすれば同じような機能を実現出来ます：

{% capture local-return-simulate-break %}
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // runに渡されたラムダからのnon-localなreturn
            print(it)
        }
    }
    print(" ループのネストを使った場合")
}
//sampleEnd

fun main() {
    foo()
}
{% endcapture %}
{% include kotlin_quote.html body=local-return-simulate-break %}


値を返すとき、パーサはラベル付けreturnの方を優先します。すなわち、

<!--original
When returning a value, the parser gives preference to the qualified return, i.e.
-->

``` kotlin
return@a 1
```

<!--original
``` kotlin
return@a 1
```
-->

上記は「 `@a` ラベルからのreturn `1` 」を意味し、「 ラベルが付いた式`(@a 1)` をreturn」ではありません。

<!--original
means "return `1` at label `@a`" and not "return a labeled expression `(@a 1)`".
-->