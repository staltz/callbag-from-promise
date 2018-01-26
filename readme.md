# callbag-from-promise

Convert a Promise to a callbag listenable source.

`npm install callbag-from-promise`

## example

```js
const fromPromise = require('callbag-from-promise');
const observe = require('callbag-observe');

const source = fromPromise(
  fetch('http://jsonplaceholder.typicode.com/users/1')
    .then(res => res.json())
);

source(0, observe(user => console.log(user.name))); // Leanne Graham
```
