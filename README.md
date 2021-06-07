# stylelint-disallow-vendor-prefix
Disallow vendor prefixes for given properties
## Installation

```
npm install stylelint-disallow-vendor-prefix --save-dev
```

## Usage

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-disallow-vendor-prefix"
  ],
  "rules": {
    "plugin/stylelint-disallow-vendor-prefix":{ true,properties:["/transform/","animation/"] },
  }
}
```

The following patterns are considered violations:
```css
.a{-webkit-transform-origin:top;-webkit-animation:myanim;}
```


## Options

 ```js
{true ,properties:["array", "of", "unprefixed properties", /or/, "/regex/"]}
```

