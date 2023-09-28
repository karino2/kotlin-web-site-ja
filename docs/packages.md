---
layout: reference
title: "パッケージとインポート"
---
# パッケージとインポート

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Packages"
- --
-->

<!--original
# Packages
-->

パッケージ宣言をするときは、ソースファイルの先頭に書いてください。

<!--original
A source file may start with a package declaration:
-->

``` kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

<!--original
``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```
-->

そうすると、ソースファイルの全ての内容（クラスや関数など）は、このパッケージに含まれる事になります。
従って上の例では、`printMessage()`の完全名は`org.example.printMessage`となり、
`Message`の完全名は`org.example.Message`となります。

<!--original
All the contents, such as classes and functions, of the source file are included in this package.
So, in the example above, the full name of `printMessage()` is `org.example.printMessage`,
and the full name of `Message` is `org.example.Message`. 
-->
 

もしパッケージが指定されない場合は、ファイルの内容は名前を持たない**default**パッケージに属することになります。

<!--original
If the package is not specified, the contents of such a file belong to "default" package that has no name.
-->

## デフォルトのインポート

幾つかのパッケージはkotlinのファイルにデフォルトでimportされます。

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

この他にもターゲットとなる環境ごとにインポートされるパッケージがあります。

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## インポート

<!--original
## Imports
-->

デフォルトのインポートとは別に、
それぞれのファイルは独自のインポートディレクティブを含む事が出来ます。

<!--original
Apart from the default imports, each file may contain its own import directives.
Syntax for imports is described in the [grammar](grammar.html#import).
-->

単一の名前を指定してインポートできます：

<!--original
You can import either a single name:
-->

``` kotlin
import org.example.Message // Messageはパッケージ名修飾無しでアクセス可能になります

```

<!--original
``` kotlin
import org.example.Message // Message is now accessible without qualification
```
-->

または、あるスコープ（パッケージ、クラス、オブジェクト等）内の全てのアクセス可能なコンテンツをインポートする事も出来ます：

<!--original
or all the accessible contents of a scope: package, class, object, and so on:
-->

``` kotlin
import org.example.* // 'org.example'内の全てがアクセス可能になります
```

<!--original
``` kotlin
import org.example.* // everything in 'org.example' becomes accessible
```
-->

名前の衝突がある場合、*as*{: .keyword }キーワードを使用して衝突するエンティティを局所的にリネームすることでどちらを指すのかを明確にできます：

<!--original
If there is a name clash, we can disambiguate by using *as*{: .keyword } keyword to locally rename the clashing entity:
-->

``` kotlin
import org.example.Message // Messageはアクセス可能
import org.test.Message as TestMessage // TestMessageは'org.test.Message'を意味する
```

<!--original
``` kotlin
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
```
-->

import キーワードはクラスだけをインポートするために限定されるわけではありません。
クラス以外の宣言をインポートするために使用することもできます：

<!--original
The `import` keyword is not restricted to importing classes; you can also use it to import other declarations:
-->

* トップレベルの関数とプロパティ
* [object宣言](object-declarations.md#object宣言)で宣言された関数とプロパティ
* [enum定数](enum-classes.md)

<!--original
  * top-level functions and properties;
  * functions and properties declared in [object declarations](object-declarations.html#object-declarations);
  * [enum constants](enum-classes.html)
-->

## トップレベル宣言の可視性

<!--original
## Visibility of Top-level Declarations
-->

もしトップレベルの宣言に*private*{: .keyword }マークがついていれば、それが宣言されたファイル内のプライベートです。 （[可視性修飾子](visibility-modifiers.md) を参照してください。）

<!--original
If a top-level declaration is marked `private`, it is private to the file it's declared in (see [Visibility modifiers](visibility-modifiers.md)).
-->