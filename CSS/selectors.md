Descendant Selector:
This selector selects all elements that are descendants of a specified element. For example, if you want to apply a style to all the li elements inside a ul element, you can use the following code:

```
ul li {
  /* styles go here */
}
```
Child Selector:
This selector selects all direct child elements of a specified parent element. For example, if you want to apply a style to all the direct p children of a div element, you can use the following code:

```
div > p {
  /* styles go here */
}
```
Adjacent Sibling Selector:
This selector selects the element that comes immediately after a specified sibling element. For example, if you want to apply a style to all h2 elements that come immediately after a p element, you can use the following code:

```
p + h2 {
  /* styles go here */
}
```
General Sibling Selector:
This selector selects all elements that are siblings of a specified element, and come after it. For example, if you want to apply a style to all p elements that come after a h2 element, you can use the following code:

```
h2 ~ p {
  /* styles go here */
}
```
Grouping Selector:
This selector groups multiple selectors together and applies the same style to all of them. For example, if you want to apply the same style to all h1, h2, and h3 elements, you can use the following code:

```
h1, h2, h3 {
  /* styles go here */
}
```
