---
layout: reference
title: "型チェックとキャスト"
---
# 型チェックとキャスト

In Kotlin, you can perform type checks to check the type of an object at runtime. Type casts convert objects to a 
different type.

> To learn specifically about **generics** type checks and casts, for example `List<T>`, `Map<K,V>`, see [Generics type checks and casts](generics.md#generics-type-checks-and-casts).
>
{: .tip}


## `is` and `!is` Operators

We can check whether an object conforms to a given type at runtime by using the `is` operator or its negated form `!is`:

``` kotlin
if (obj is String) {
  print(obj.length)
}

if (obj !is String) { // same as !(obj is String)
  print("Not a String")
}
else {
  print(obj.length)
}
```

## スマートキャスト

In most cases, you don't need to use explicit cast operators in Kotlin because the compiler tracks the
`is`-checks and [explicit casts](#unsafeなキャスト演算子) for immutable values and inserts (safe) casts automatically when necessary:

``` kotlin
fun demo(x: Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
```

The compiler is smart enough to know a cast to be safe if a negative check leads to a return:

``` kotlin
  if (x !is String) return
  print(x.length) // x is automatically cast to String
```

or in the right-hand side of `&&` and `||`:

``` kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
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

> Note that smart casts work only when the compiler can guarantee that the variable won't change between the check and its usage.
>
{: .warning}

Smart casts can be used in the following conditions:

  * *val*{: .keyword } local variables - Always, except [local delegated properties](delegated-properties.md).
  * *val*{: .keyword } properties - If the property is private or internal, or the check is performed in the same [module](visibility-modifiers.md#モジュール) where the property is declared. Smart casts can't be used to `open`` properties or properties that have custom getters.
  * *var*{: .keyword } local variables - If the variable is not modified between the check and its usage, is not captured in a lambda that modifies it, and is not a local delegated property.
  * *var*{: .keyword } properties - Never, because the variable can be modified at any time by other code.


## "Unsafe"なキャスト演算子

Usually, the cast operator throws an exception if the cast is not possible. Thus, we call it *unsafe*.
The unsafe cast in Kotlin is done by the infix operator *as*{: .keyword } (see [operator precedence](grammar.html#operator-precedence)):

``` kotlin
val x: String = y as String
```

Note that *null*{: .keyword } cannot be cast to `String` as this type is not [nullable](null-safety.html),
i.e. if `y` is null, the code above throws an exception.
In order to match Java cast semantics we have to have nullable type at cast right hand side, like

``` kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a *safe* cast operator *as?*{: .keyword } that returns *null*{: .keyword } on failure:

``` kotlin
val x: String? = y as? String
```

Note that despite the fact that the right-hand side of *as?*{: .keyword } is a non-null type `String` the result of the cast is nullable.

