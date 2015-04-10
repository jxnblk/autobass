---
title: Typography
---

# Basscss Base Typography

Base typography styles module for Basscss http://basscss.com

## Base type scale
Typographic elements are normalized to a simple type scale that works well across devices. Default top and bottom margins are set for commonly-used typographic elements.

```html
<h1>Hamburger 1</h1>
<h2>Hamburger 2</h2>
<h3>Hamburger 3</h3>
<h4>Hamburger 4</h4>
<h5>Hamburger 5</h5>
<h6>Hamburger 6</h6>
```

## Type scale utilities
The `.h1` – `.h6` font-size utilities can be used to override an element’s default size.

```html
<p class="h1">Pastrami 1</p>
<p class="h2">Pastrami 2</p>
<p class="h3">Pastrami 3</p>
<p class="h4">Pastrami 4</p>
<p class="h5">Pastrami 5</p>
<p class="h6">Pastrami 6</p>
```

## Lists
By default, lists have bullets or numbers and padding left.

```html
<ul>
  <li>Half-Smoke</li>
  <li>Kielbasa</li>
  <li>Bologna</li>
</ul>
<ol>
  <li>Prosciutto</li>
  <li>Andouille</li>
  <li>Bratwurst</li>
  <li>Chorizo</li>
</ol>
```

To remove default list styling, use `.list-reset`.

```html
<ul class="list-reset">
  <li>List Reset</li>
  <li>Removes bullets</li>
  <li>Removes numbers</li>
  <li>Removes padding</li>
</ul>
```

To set lists inline, use utilities.

```html
<ul class="list-reset">
  <li class="inline-block mr1">Half-Smoke</li>
  <li class="inline-block mr1">Kielbasa</li>
  <li class="inline-block mr1">Bologna</li>
  <li class="inline-block mr1">Prosciutto</li>
</ul>
```

