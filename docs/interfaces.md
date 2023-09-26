---
layout: reference
title: "インターフェース"
---
# インターフェース

<!--original
# Interfaces
-->

Kotlinでのインタフェースは、抽象メソッドの宣言と、さらにメソッドの実装も含めることができます。
抽象クラスと違う所は、インタフェースは状態を持てません。
インタフェースはプロパティを持つことができますが、これらは abstract であること、またはアクセサの実装を提供することが必要です。

<!--original
Interfaces in Kotlin can contain declarations of abstract methods, as well as method
implementations. What makes them different from abstract classes is that interfaces cannot store state. They can have
properties, but these need to be abstract or provide accessor implementations.
-->

インタフェースは、 *interface*{: .keyword } キーワードを使用して定義されます。

<!--original
An interface is defined using the keyword *interface*{: .keyword }
-->

``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 本体(body)をつけてもいい
    }
}
```

<!--original
``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```
-->

## インタフェースの実装

<!--original
## Implementing Interfaces
-->

クラスやオブジェクトは、1つまたは複数のインターフェイスを実装することができます：

<!--original
A class or object can implement one or more interfaces
-->

``` kotlin
class Child : MyInterface {
   override fun bar() {
      // 本体
   }
}
```

<!--original
``` kotlin
class Child : MyInterface {
   override fun bar() {
      // body
   }
}
```
-->

## インターフェイス内のプロパティ

<!--original
## Properties in Interfaces
-->

インターフェイス内にプロパティを宣言することができます。
インタフェースで宣言されたプロパティは、 abstract にするか、アクセサの実装を提供するかしなくてはいけません。
インタフェース内で宣言されたプロパティはバッキングフィールドを持つことはできず、それ故にインタフェース内で宣言されたアクセサはそれらを参照できません。

<!--original
You can declare properties in interfaces. A property declared in an interface can either be abstract, or it can provide
implementations for accessors. Properties declared in interfaces can't have backing fields, and therefore accessors
declared in interfaces can't reference them.
-->

``` kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## インターフェースの継承

インターフェースは他のインターフェースを継承する事が出来ます。
それが意味する所は、
継承元のメンバを継承先のインターフェースが実装して提供したり、
さらに追加で新たな関数やプロパティを宣言出来たりもするという事です。
自然な帰結として、
そのようなインターフェースを実装するクラスは、
実装がまだ提供されていないものだけを実装すれば良くなります。

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // 'name'の実装は必要では無い
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## オーバーライドの競合解決

<!--original
## Resolving overriding conflicts
-->

スーパータイプのリストでたくさんの型を宣言すると、同メソッドの複数の実装を継承するように見えることがあります。例えば：

<!--original
When we declare many types in our supertype list, it may appear that we inherit more than one implementation of the same method. For example
-->

``` kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```

インタフェース *A* と *B* は、両方とも関数 *foo()* と *bar()* を宣言しています。両方とも *foo()* を実装していますが、 *B* のみが *bar()* を実装しています。（ *bar()* は *A* では abstract としてマークされていません。abstractなのはインタフェースで関数が本体を持たないときのデフォルトだからです。） 
さて、もし具象クラス *C* を *A* から継承すれば、 *bar()* をオーバライドし、実装を提供しなければならないことは明らかです。

しかしながら、もし *D* を *A* と *B* から継承すれば、 
複数のインターフェースから継承した全メソッドを実装する必要があり、
つまり*D*でもそれらを実装する必要があります。
このルールは一つの実装だけを継承しているもの（*bar()*）にも、
複数の実装を継承しているもの（*foo()*）にも、どちらにも適用されます。

<!--original
However, if you derive *D* from *A* and *B*, you need to implement all the methods that you have
inherited from multiple interfaces, and you need to specify how exactly *D* should implement them. This rule applies
both to methods for which you've inherited a single implementation (*bar()*) and to those for which you've inherited multiple implementations (*foo()*).
-->