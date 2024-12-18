---
layout: reference
title: "アノテーション"
---
# アノテーション

アノテーションはコードにメタデータを付加する手段です。
アノテーションを宣言するには、`annotation`修飾子をclassの前に置きます：

```kotlin
annotation class Fancy
```
メタアノテーションでアノテーションクラスをアノテートする事で、アノテーションに追加の属性を指定する事が出来ます：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) でそのアノテーションがアノテート出来る要素を指定します（例えばクラス、関数、プロパティ、式など）
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) でアノテーションがコンパイル結果のクラスファイルにも格納されるか、そして実行時にリフレクション越しに見る事が出来るかを指定します（デフォルトではどちらもtrueです）
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) は、同じアノテーションを一つの要素に複数回指定出来るようにします。
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) はアノテーションがパブリックなAPIの一部であり、生成されるAPIドキュメントのメソッドやクラスのシグニチャに表示されるようにします。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 使い方

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

クラスのプライマリーコンストラクタをアノテートしたければ、コンストラクタ定義に`constructor`キーワードを追加して、
その前にアノテーションを追加します：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

プロパティのアクセサにアノテートする事も出来ます：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## Constructors

Annotations can have constructors that take parameters.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

Allowed parameter types are:

 * Types that correspond to Java primitive types (Int, Long etc.)
 * Strings
 * Classes (`Foo::class`)
 * Enums
 * Other annotations
 * Arrays of the types listed above

Annotation parameters cannot have nullable types, because the JVM does not support storing `null` as a value
of an annotation attribute.

If an annotation is used as a parameter of another annotation, its name is not prefixed with the `@` character:

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

If you need to specify a class as an argument of an annotation, use a Kotlin class
([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)). The Kotlin compiler will
automatically convert it to a Java class, so that the Java code can access the annotations and arguments
normally.

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## Instantiation

In Java, an annotation type is a form of an interface, so you can implement it and use an instance.
As an alternative to this mechanism, Kotlin lets you call a constructor of an annotation class in arbitrary code 
and similarly use the resulting instance.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

Learn more about instantiation of annotation classes in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md).

## Lambdas

Annotations can also be used on lambdas. They will be applied to the `invoke()` method into which the body
of the lambda is generated. This is useful for frameworks like [Quasar](https://docs.paralleluniverse.co/quasar/),
which uses annotations for concurrency control.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## Annotation use-site targets

When you're annotating a property or a primary constructor parameter, there are multiple Java elements which are
generated from the corresponding Kotlin element, and therefore multiple possible locations for the annotation in
the generated Java bytecode. To specify how exactly the annotation should be generated, use the following syntax:

```kotlin
class Example(@field:Ann val foo,    // annotate Java field
              @get:Ann val bar,      // annotate Java getter
              @param:Ann val quux)   // annotate Java constructor parameter
```

The same syntax can be used to annotate the entire file. To do this, put an annotation with the target `file` at
the top level of a file, before the package directive or before all imports if the file is in the default package:

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

If you have multiple annotations with the same target, you can avoid repeating the target by adding brackets after the
target and putting all the annotations inside the brackets:

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

The full list of supported use-site targets is:

  * `file`
  * `property` (annotations with this target are not visible to Java)
  * `field`
  * `get` (property getter)
  * `set` (property setter)
  * `receiver` (receiver parameter of an extension function or property)
  * `param` (constructor parameter)
  * `setparam` (property setter parameter)
  * `delegate` (the field storing the delegate instance for a delegated property)

To annotate the receiver parameter of an extension function, use the following syntax:

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

If you don't specify a use-site target, the target is chosen according to the `@Target` annotation of the annotation
being used. If there are multiple applicable targets, the first applicable target from the following list is used:

  * `param`
  * `property`
  * `field`

## Java annotations

Java annotations are 100% compatible with Kotlin:

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // apply @Rule annotation to property getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Since the order of parameters for an annotation written in Java is not defined, you can't use a regular function
call syntax for passing the arguments. Instead, you need to use the named argument syntax:

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

Just like in Java, a special case is the `value` parameter; its value can be specified without an explicit name:

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### Arrays as annotation parameters

If the `value` argument in Java has an array type, it becomes a `vararg` parameter in Kotlin:

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

For other arguments that have an array type, you need to use the array literal syntax or 
`arrayOf(...)`:

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### Accessing properties of an annotation instance

Values of an annotation instance are exposed as properties to Kotlin code:

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### Ability to not generate JVM 1.8+ annotation targets

If a Kotlin annotation has `TYPE` among its Kotlin targets, the annotation maps to `java.lang.annotation.ElementType.TYPE_USE`
in its list of Java annotation targets. This is just like how the `TYPE_PARAMETER` Kotlin target maps to
the `java.lang.annotation.ElementType.TYPE_PARAMETER` Java target. This is an issue for Android clients with API levels
less than 26, which don't have these targets in the API.

To avoid generating the `TYPE_USE` and `TYPE_PARAMETER` annotation targets, use the new compiler argument `-Xno-new-java-annotation-targets`.

## Repeatable annotations

Just like [in Java](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html), Kotlin has repeatable annotations,
which can be applied to a single code element multiple times. To make your annotation repeatable, mark its declaration
with the [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)
meta-annotation. This will make it repeatable both in Kotlin and Java. Java repeatable annotations are also supported
from the Kotlin side.

The main difference with the scheme used in Java is the absence of a _containing annotation_, which the Kotlin compiler
generates automatically with a predefined name. For an annotation in the example below, it will generate the containing
annotation `@Tag.Container`:

```kotlin
@Repeatable
annotation class Tag(val name: String)

// The compiler generates the @Tag.Container containing annotation
```

You can set a custom name for a containing annotation by applying the
[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) meta-annotation
and passing an explicitly declared containing annotation class as an argument:

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

To extract Kotlin or Java repeatable annotations via reflection, use the [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)
function.

Learn more about Kotlin repeatable annotations in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md).