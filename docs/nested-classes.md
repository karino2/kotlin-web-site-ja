---
layout: reference
title: "ネストされたクラスと内部クラス"
---
# ネストされたクラスと内部クラス

<!--original
Nested and inner classes
-->

クラスは他のクラスの中に入れ子にすることができます：

<!--original
Classes can be nested in other classes
-->

``` kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
      fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

<!--original
``` kotlin
class Outer {
  private val bar: Int = 1
  class Nested {
    fun foo() = 2
  }
}

val demo = Outer.Nested().foo() // == 2
```
-->

インターフェースでもネストが出来ます。インターフェースとクラスのどの組み合わせも可能です：
インターフェースの中にクラスを入れたり、クラスの中にインターフェースを入れたり、インターフェースの中にインターフェースを入れたり出来ます。

```kotlin
interface OuterInterface {
    class InnerClass
    interface InnerInterface
}

class OuterClass {
    class InnerClass
    interface InnerInterface
}
```

## 内部クラス

（訳注：inner class）

<!--original
## Inner classes
-->

ネストしたクラスに*inner*{:.keyword} としてマークすると、
外側のクラスのメンバーにアクセスできるようになります。
この内部クラスは、外側のクラスのオブジェクトへの参照をもちます：

<!--original
A nested class marked as `inner` can access the members of its outer class. Inner classes carry a reference to an object of an outer class:
-->

``` kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

<!--original
``` kotlin
class Outer {
  private val bar: Int = 1
  inner class Inner {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```
-->

内部クラス内での *this*{:.keyword} の曖昧さ回避について学びたければ、[限定子付きthis](this-expressions.md#限定子付きthis)を参照してください。

<!--original
See [Qualified *this*{: .keyword } expressions](this-expressions.html) to learn about disambiguation of *this*{: .keyword } in inner classes.
-->

## 無名内部クラス

<!--original
## Anonymous inner classes
-->

無名内部クラスのインスタンスは[object式](object-declarations.md#object式)を使用して作成されます：

<!--original
Anonymous inner class instances are created using an [object expression](object-declarations.html#object-expressions):
-->
                                                      
``` kotlin
window.addMouseListener(object: MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

<!--original
``` kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```
-->

> JVMでは、もしオブジェクトが関数型Javaインターフェース（つまり抽象メソッド一つだけのJavaインターフェースのこと）のインスタンスの場合、
> インタフェースの型が前に付いたラムダ式を使用してオブジェクトを作成できます。
>
>```kotlin
> val listener = ActionListener { println("クリックされたよ") }
> ```
>
{: .note}
