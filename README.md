EnumJS
=========

Create an enum object with key names specified in String or object

I thought `keyMirror` was useful and wanted to extends the function


Usage
-----

`npm install enumjs`

```javascript
var createEnum = require('enumjs');
var COLORS = createEnum("blue red");
var myColor = COLORS.blue;
console.log(myColor._id); // output blue
console.log(myColor.isBlue()); //output true
console.log(myColor.isRed()); //output false
console.log(myColor.name()); //output blue
console.log(myColor.toString()); //output blue
```

Input:  `"key1 key2"`

Output: 

```
{
    key1: {
        _id: 'key1',
        name: function() {
            return 'key1';
        },
        toString: function() {
            return 'key1';
        },
        isKey1: function() {
            return true;
        },
        isKey2: function() {
            return false;
        }
    },
    key2: {
        _id: 'key2',
        name: function() {
            return 'key2';
        },
        toString: function() {
            return 'key2';
        },
        isKey1: function() {
            return false;
        },
        isKey2: function() {
            return true;
        }
    }
}
```

This module depends on `lodash`