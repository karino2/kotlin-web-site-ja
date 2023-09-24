---
layout: reference
title: "型チェックとキャスト"
---
# 型チェックとキャスト

Kotlinでは、オブジェクトの型を実行時にチェックする事が出来ます。
Typeキャストはオブジェクトを別の型に変換します。


> **ジェネリクス**の型チェックとキャストについてを知りたい人、たとえば`List<T>`、 `Map<K,V>`などの型チェックやキャストについて知りたい人は、[ジェネリクスの型チェックとキャスト](generics.md#ジェネリクスの型チェックとキャスト)を参照されたし
>
{: .tip}


## `is`と`!is`演算子

`is`演算子やその否定形の`!is`演算子を用いて、
あるオブジェクトが指定された型に準拠しているかを実行時にチェック出来ます：

``` kotlin
if (obj is String) {
  print(obj.length)
}

if (obj !is String) { // !(obj is String) と同じ意味
  print("Stringではありません")
}
else {
  print(obj.length)
}
```

## スマートキャスト

ほとんどの場合、Kotlinでは明示的なキャストを使う必要はありません。
なぜならコンパイラは`is`のチェックや[明示的なキャスト](#unsafeなキャスト演算子)を追跡して、
必要な所には(safeな)キャストを自動的に挿入してくれるからです：

``` kotlin
fun demo(x: Any) {
  if (x is String) {
    print(x.length) // x は自動的にStringにキャストされる
  }
}
```

コンパイラは十分に賢いので否定のチェックがreturnをしているケースでもキャストがsafeかどうかを判断出来ます：

``` kotlin
  if (x !is String) return
  print(x.length) // x は自動的に String にキャストされる
```

また、`&&` や `||` の右側も判断出来ます：

``` kotlin
// `||`の右側では x は自動的に String にキャストされる
if (x !is String || x.length == 0) return

// `&&`の右側では x は自動的に String にキャストされる
if (x is String && x.length > 0) {
    print(x.length) // x は自動的に String にキャストされる
}
```

スマートキャストは[`when`式](control-flow.md#when式)と
[`while`ループ](control-flow.md#whileループ)でも同様に機能します:

``` kotlin
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is IntArray -> print(x.sum())
}
```

> スマートキャストはチェックした所と使用する所の間で変数が変更されないと補償出来る場合のみ行われる事に注意しましょう。
>
{: .warning}

スマートキャストは以下のケースで使う事が出来ます：

  * *val*{: .keyword } ローカル変数 - [ローカル委譲プロパティ](delegated-properties.md)を除いていつでも。
  * *val*{: .keyword } プロパティ - プロパティがprivateかinternalか、チェックが宣言されたのと同一[モジュール](visibility-modifiers.md#モジュール)内で行われている場合。カスタムgetterがある場合と`open`なプロパティの場合はスマートキャストは使えません。
  * *var*{: .keyword } ローカル変数 - もし変数がチェックと使用の間で変更されていなく、その変数を変更するラムダに変数捕捉されていなくて、ローカル委譲プロパティで無い場合。
  * *var*{: .keyword } プロパティ - 使えるケースはありません。なぜならこの変数はどんな時でも他のコードに変更され得るからです。


## "Unsafe"なキャスト演算子

通常、キャスト演算子はキャストが出来ない時は例外を投げます。だからこのキャストは**unsafe**と呼ばれます。
Kotlinでは**unsafe**なキャストは中置演算子である *as*{: .keyword } でおこおないます：

``` kotlin
val x: String = y as String
```

ここで`null`は`String`にはキャスト出来ない事に注意してください。
なぜなら`String`は[nullable](null-safety.md)では無いからです。
つまり、`y`がもしnullだったら、上のコードは例外を投げます。
このようなコードでnullの場合も許したければ、キャストの右側の型をnullabeにします：

``` kotlin
val x: String? = y as String?
```

## "Safe" (nullable)なキャスト演算子

例外が投げられないようにしたければ、
*safe*なキャスト演算子、*as?*{: .keyword }を使う事が出来ます。
この演算子はキャストに失敗すると`null`を返します。

``` kotlin
val x: String? = y as? String
```

`as?`の右側の型がnullable**では無い**`String`型なのに、結果の型はnullableなのに注目してください。