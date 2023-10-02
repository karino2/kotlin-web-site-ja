---
layout: reference
title: "Nullセーフティ"
---
# Nullセーフティ


## Nullable型と非nullable型

Kotlinの型システムはnull参照を排除するように作られています。
null参照は[10億ドルの過ち](https://en.wikipedia.org/wiki/Null_pointer#History)としても知られています。

多くのプログラム言語（Javaも含む）においてもっとも一般的な落とし穴の一つは、
nullリファレンスにアクセスして、null参照の例外になってしまうというものです。
Javaではこれは`NullPointerException`と言われていて、略して**NPE**とも呼ばれています。（訳注：日本語だとぬるぽ、と言われているが、少しくだけ過ぎと思うのでこの文書ではNPEと呼ぶ事にする）

KotlinにおけるNPEが起こりうる原因というのは以下しかありません：

* `throw NullPointerException()`というコードの明示的な呼び出し
* 以下で述べる`!!`の使用
* 初期化に対するデータの不整合、例えば：
  * コンストラクタで使う事が出来る未初期化の`this`を他に渡して他の場所で使ってしまう（`this`リーク）
  * [基底クラスのコンストラクタがopenのメンバを呼び出してしまい](inheritance.md#派生クラスの初期化の順番)、派生クラスのそのメンバが未初期化の状態を使ってしまう場合
* Javaとの相互運用：
  * [platform type](java-interop.md#null-safety-and-platform-types)の`null`参照のメンバにアクセスしようとする場合
  * ジェネリック型をJavaと相互運用する時のnullabilityの問題。例えばKotlinの`MutableList<String>`にJavaの側で`null`を追加してしまうなど。この場合は`MutableList<String?>`とする必要がある。
  * 外部のJavaのコードによって引き起こされるその他の問題

Kotliでは型システムが`null`を保持出来る参照（nullableな参照）と、保持出来ない参照（非nullable参照）を区別します。
例えば、通常の`String`型の変数は`null`を保持出来ません：

{% capture default-non-nullable %}
fun main() {
//sampleStart
    var a: String = "abc" // 通常の初期化はデフォルトの非nullableを意味する
    a = null // コンパイルエラー
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=default-non-nullable %}

nullを許容する為には、変数を`String?`と書いてnullableなStringとして宣言しなくてはいけません：

{% capture explicit-nullable %}
fun main() {
//sampleStart
    var b: String? = "abc" // nullをセット可能
    b = null // おっけー
    print(b)
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=explicit-nullable %}

ここで、もし`a`のメソッドを呼んだりプロパティにアクセスしても、NPEを起こさない事は保証されています。
だから以下のように安全に書く事が出来ます：

```kotlin
val l = a.length
```

しかしもし`b`のプロパティにアクセスしようと思えば、それは安全では無い事がありえる。
だからコンパイラはエラーを報告してくれます：

```kotlin
val l = b.length // エラー: 変数 'b' はnullかもしれない
```

けれど、bのプロパティにアクセスする必要もありますよね？それには幾つかの方法があります。

## 条件の所で`null`をチェックする

まず最初の手段としては、`b`が`null`かどうかを明示的にチェックして、二つの可能性を別々に処理する事です：

```kotlin
val l = if (b != null) b.length else -1
```

コンパイラはあなたが実行したチェックを追跡して、`if`の中の`length`呼び出しを許可します。
より複雑な条件もサポートされています：

{% capture complex-null-check %}
fun main() {
//sampleStart
    val b: String? = "Kotlin"
    if (b != null && b.length > 0) {
        print("長さ ${b.length} のString")
    } else {
        print("空文字列")
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=complex-null-check %}

この手段が使えるのは`b`がイミュータブル（つまりローカル変数でチェックと使う所の間で変更していないか、`val`のメンバでバッキングフィールドがあるものでoverride可能で無いもの）の時だけです。
なぜならそうでないと、`b`がチェックの後に`null`に変更される可能性があるからです。

## セーフコール （安全な呼び出し）

二つ目の選択肢としては、セーフコール演算子 `?.`を使ってnullableな変数のプロパティなどにアクセスする、というものです：

{% capture safe-call %}
fun main() {
//sampleStart
    val a = "Kotlin"
    val b: String? = null
    println(b?.length)
    println(a?.length) // 不要なセーフコール
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=safe-call %}

これは`b`がnullで無ければ`b.length`を返し、そうでなければ`null`を返します。
この式の型は`Int?`となります。

セーフコールは連鎖して使うのに便利です。例えば、Bobは部署に配属されているかもしれない（し、されてないかもしれない）会社員で、
部署には部署長がいるかもしれない、というような時を考えます。
Bobの部署の部署長の名前を（もし居れば）得ようと思えば、以下のように書けます：

```kotlin
bob?.department?.head?.name
```

このような連鎖的な呼び出しは、どれかのプロパティが`null`だったら全体としても`null`を返します。

何らかの処理を非nullの値にだけ行いたい場合は、[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)とセーフコール演算子を組み合わせて使う事が出来ます：

{% capture safe-let %}
fun main() {
//sampleStart
    val listWithNulls: List<String?> = listOf("Kotlin", null)
    for (item in listWithNulls) {
         item?.let { println(it) } // nullは無視してKotlinは出力
    }
//sampleEnd
}
{% endcapture %}
{% include kotlin_quote.html body=safe-let %}

セーフコールは代入の左辺に使う事も出来ます。
その場合、セーフコールのレシーバが一つでも`null`だったらば、その代入はスキップされて、右辺は全く評価されません：


```kotlin
// `person` か `person.department` が nullだったら関数は呼ばれない:
person?.department?.head = managersPool.getManager()
```

## Nullableレシーバ

拡張関数は[nullableレシーバ](extensions.md#nullableレシーバ)に定義する事が出来ます。
こうすることで、null値の振る舞いを指示することが出来て、呼び出す都度nullかどうかをチェックする必要が無くなります。

例えば、[`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html)はnullableレシーバに対して定義されています。
これはnull値に対しては"null"というStringを返します（`null`の値では無く）。
これはロギングとかのシチュエーションで便利です。


```kotlin
val person: Person? = null
logger.debug(person.toString()) // "null"とログに吐かれる。例外は投げられない
```

もし`toString()`を呼んでnullableなStringが結果として欲しければ、[セーフコール演算子 `?.`](#セーフコール)を使えばよろしい：

```kotlin
var timestamp: Instant? = null
val isoTimestamp = timestamp?.toString() // String?オブジェクトを返す、この場合は`null`
if (isoTimestamp == null) {
   // timestampが`null`の場合の処理
}
```

## Elvis演算子

あるnullableな参照、例えば`b`があるとして、
「もし`b`が`null`で無ければその値を使い、そうで無ければ何らかの非nullの値を使いたい」というような場合、以下のように書く事も出来ますが：


```kotlin
val l: Int = if (b != null) b.length else -1
```

このように完全な`if`式を書く変わりに、Elvis演算子`?:`を使うという方法もあります：

```kotlin
val l = b?.length ?: -1
```

もし`?:`の左側の式が`null`で無ければ、Elvis演算子はその値をそのまま返します。そうでなければ右側の値を返します。
右側の式は左側の式が`null`の時だけ評価される事に注意してください。

`throw`や`return`もKotlinでは式なので、
Elvis演算子の右側に使う事が出来ます。

これは関数の引数をチェックする時などに便利です。

```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("nameがあるのを想定しています")
    // ...
}
```

## `!!`演算子

NPE好きには三番目の選択肢があります： nullでないと断言する演算子(not-null assersion operator)である `!!` です。
これはどのような値でも非nullableに変換して、値が`null`だったら例外を投げる、というものです。
`b!!`と書けば、`b`が`null`でなければその値（我々の例では`String`の値）を、もし`null`ならNPEを投げます。

```kotlin
val l = b!!.length
```

つまり、もしNPEを望むなら、そう振る舞わせる事は出来ます。
ですがそうしたいなら明示的にそう頼む必要があって、何も無い青空から突然降って湧いたりはしません。

## セーフキャスト

通常のキャストは、オブジェクトが指定した型で無ければ、`ClassCastException`になります。
それ以外の選択肢として、キャストの試みが失敗したら`null`を返すセーフキャストというものがあります：

```kotlin
val aInt: Int? = a as? Int
```

## Nullable型のコレクション

Nullable型の要素のコレクションがあった時に、nullでない値だけでフィルターして非nullableのコレクションを得たい時は、
`filterNotNull`を使う事で行なえます：

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```

## 次は何を読むべき？

* [JavaとKotlinでnullabilityをどう処理するか](java-to-kotlin-nullability-guide.md)を学ぶ
* [definitely non-nullable型](generics.md#definitely-non-nullable型)なジェネリクス型について学ぶ
