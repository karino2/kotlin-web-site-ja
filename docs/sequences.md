---
layout: reference
title: "シーケンス (Sequence)"
---
# シーケンス (Sequence)

コレクションとともに、Kotlinの標準ライブラリにはもうひとつ別の型、**シーケンス** ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html)) というものがある。
コレクションと異なり、シーケンスは要素を含まず、要素はイテレートされている間に生成される。
シーケンスは[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)と同じ種類の関数を提供するが、
複数ステップに渡るコレクション処理に対しての異なるアプローチとして実装されている。

`Iterable`の処理が複数ステップに渡ると、
それらはeagerで実行される（訳注：複数ステップがある時に一つ目のステップで全要素に対する処理が走ってから次のステップに進む事）：
各ステップは完了してから結果を返す、それは中間のコレクションとなる。
その後のステップはこの中間のコレクションに対して行われる。
他方、シーケンスのマルチステップ処理は可能な時はlazyに実行される：
実際の計算は、全体の処理チェーンの結果が要求された時に発生する。

オペレーションの実行順序も異なる：`Sequence`は一つの要素にすべての処理を行って、それから次の要素に行く。
他方、`Iterable`は一つのステップをすべての要素に対して実行したあとに次のステップに行く。

つまり、シーケンスは中間ステップの結果を生成するのを避け、コレクション処理チェーンの全体のパフォーマンスを改善する。
しかしながら、lazyの特性からくるオーバーヘッドが追加されるので、
小さなコレクションを処理する時や、計算がより単純な時にはそちらのオーバーヘッドの方が大きくなる場合もある。
かくして、`Sequence`と`Iterable`の両方を選択肢として考慮して、自分のその時の状況にとってどちらが良いかをその都度決めていく必要があります。

## 作成

### 要素から

シーケンスを作るには、[`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html)関数を呼び出し、
その引数に要素を並べれば良い。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### Iterableから

もしすてに`Iterable`オブジェクト（例えば`List`や`Set`など）を持っていたら、
そのオブジェクトからシーケンスを、[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html)を呼ぶ事で作れる。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 関数から

シーケンスを作るもう一つの方法としては、要素を計算する関数で構築する、というものがあります。
関数に基づいてシーケンスを構築するには、
[`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)を、関数を引数として呼び出します。
最初の要素を明示的に指定する事も出来ますし、指定しない場合は関数の結果が使われます。
提供した関数が`null`を返すとシーケンス生成は止まります。
以下の例のシーケンスは無限に続きます。

{% capture seq-from-fun %}
fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` は前の要素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // error: このシーケンスは無限
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=seq-from-fun %}

`generateSequence()`を使って有限のシーケンスを作りたければ、あなたが必要とする最後の要素の後には`null`を返す関数を渡せばよろしい。

{% capture seq-from-fun-finite %}
fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=seq-from-fun-finite %}

### チャンクから

最後に、要素を一つずつ、または任意のサイズのチャンクずつ作る関数、[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)関数というものがあります。
この関数は
[`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)と
[`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html)関数の呼び出しを含んだラムダ式を引数に取ります。
これらの関数はシーケンスのコンシューマに要素を返して`sequence()`の実行をサスペンドします。
コンシューマから次の要素を要求されるまでサスペンドするのです。
`yeild()`は要素一つを引数にとり、`yieldAll()`は`Iterable`なオブジェクトか`Iterator`か別の`Sequence`を取ります。
`yieldAll()`にわたす`Sequence`引数は無限でも構いませんが、
そのような`yieldAll()`の呼び出しは最後で無くてはなりません。それに続くコードは決して呼ばれることは無いのですから。


{% capture sequence-fun %}
fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sequence-fun %}

## シーケンスのオペレーション

シーケンスに対するオペレーションは、そのステートに対する要求に応じて以下のグループに分類出来ます:


* **ステートレス**オペレーションは状態を必要とせず、個々の要素を独立して処理出来ます。例えば[`map()`](collection-transformations.md#map)や[`filter()`](collection-filtering.md)などです。
   ステートレスオペレーションにはまた、要素を一つ処理するのに小さい定数量のステートを要求するものも含まれます。例えば[`take()` や `drop()`](collection-parts.md)などです。
* **ステートフル**オペレーションは、無視出来ないほどの量のステートを必要とするものです。通常は要素数に比例する量のステートとなります。

もしシーケンスのオペレーションが別のシーケンスを返すもので、しかもそれがlazyに生成される場合、それは**中間（intermediate）**と呼ばれます。
それ以外の場合、オペレーションは**終端（terminal）**と呼ばれます。
終端のオペレーションの例としては[`toList()`](constructing-collections.md#コピー)や[`sum()`](collection-aggregate.md)などが挙げられます。
シーケンスの要素は終端のオペレーションでのみ取り出すことが出来ます。

シーケンスは複数回イテレート出来ますが、いくつかのシーケンスの実装は一回しかイテレートを許さないように制約を設けている場合もあります。
その場合は、それらのシーケンスのドキュメントに明示的にその旨の記述があります。

## シーケンスを処理する例

例をもとに`Iterable`と`Sequence`の違いを見ていきましょう。

### Iterable

単語のリストがあるとします。以下のコードは3文字以上の単語をフィルタしてその最初の4つの単語の長さを出力するものです。

{% capture iterable-filter-example %}
fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("フィルタ: $it"); it.length > 3 }
        .map { println("長さ: ${it.length}"); it.length }
        .take(4)

    println("3文字以上の単語の最初の4つの長さ:")
    println(lengthsList)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=iterable-filter-example %}

このコードを実行すると、`filter()`と`map()`関数がコードに出てくるのと同じ順番で実行される結果の出力を見ることになります。
まず`フィルタ:`をすべての要素に対して見ることになり、それからフィルタされた後の要素に対して`長さ:`が見られる。
そして最後の2行の出力が見られる。


以下はこのリストの処理がどう進むかを示した図です：

<img src="images/list-processing.png" alt="List processing">

### Sequence

では同じことをシーケンスで書いてみましょう：

{% capture sequence-filter-example %}
fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //リストをシーケンスに変換
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("フィルタ: $it"); it.length > 3 }
        .map { println("長さ: ${it.length}"); it.length }
        .take(4)

    println("3文字以上の単語の最初の4つの長さ:")
    // terminal operation: obtaining the result as a List
    println(lengthsSequence.toList())
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=sequence-filter-example %}

このコードの出力は、`filter()`と`map()`関数が、結果のリストを生成する時になって初めて呼ばれることを示しています。
つまり、最初に見るのは「3文字以上の〜」という行のテキストで、その次にシーケンス処理が始まります。
フィルタして残った要素に関しては、次の要素をフィルタする前にmapが実行されていることに注目してください。
結果のサイズが4に到達すると、処理は停止します。
なぜならそれが`take(4)`が返すことが出来る最大の要素数だからです。


シーケンスの処理は以下の図のように進みます：

<img src="images/sequence-processing.png" width="700" alt="Sequences processing">

この例では、シーケンスの処理は18ステップで済み、同じことをするリストの場合の23ステップより短いです。