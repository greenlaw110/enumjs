gen_enum
========

Create an enum object with key names specified in String or object

Background Story
-----------------

I've just started playing with ReactJS from facebook and found the utilty `keyMirror` is really cool. It's not unusual the we define java enum style of data structure in JS with `keyMirror`, e.g. something like

```javascript
var keyMirror = require('keyMirror');

var AppMode = keyMirror({
    LOG_IN: null,
    SIGN_UP: null
});

module.exports = AppMode;
```

And then we can reference to the `AppMode` enum in our JS code:

```javascript
var AppMode = require('../const/app_mode');

...
if (curMode == AppMode.LOG_IN) {
    ...
} else {
    ...
}
...

var className = (curMode == AppMode.LOG_IN) ? 'login-form' : 'signup-form';
...

```

So far it looks all good. However I found it's quite often that I use things like `curMode == AppMode.LOG_IN` and it always require me to `require('../const/app_mode')`, I want to make it easier to use, something like `curMode.isLogIn()` should be cool. And hence here come up with this `gen_enum` utility

Usage
-----

`npm install gen_enum`

```javascript
var genEnum = require('gen_enum');
var COLORS = genEnum("blue red");
var myColor = COLORS.blue;
console.log(myColor._id); // output blue
console.log(myColor.isBlue()); //output true
console.log(myColor.isRed()); //output false
console.log(myColor.name()); //output blue
console.log(myColor.toString()); //output blue
```

Input:  `"key1 key2 ..."`

Note, other than `space`, keys could also be separated by `,`, `;` and `:`

Output: 

```javascript
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

Input variations
-----------------

Instead of a string of keys sepated by separators specified above, it can use another two variaions of input to specify keys:

```javascript

// use array of strings to specify keys
var Color = genEnum(["blue", "red"]);
var myColor = Color.blue;

// use arguments array to specify keys
var BuildTool = genEnum("gulp", "grunt");
var myTool = BuildTool.gulp;

// use object to specify keys
var WeekDay = genEnum({
    Monday: null,
    Tuesday: null
})
var myDay = WeekDay.Monday;
```

About CamelCase
----------------

A nice thing about this utility is it handles tranditional Captical case with underscore keys nicely:

```javascript
var AppMode = genEnum('SIGN_UP, LOG_IN, FORGOT_PASSWORD');
var curMode = AppMode.LOG_IN;
console.log(curMode.isLogIn()); // output true
console.log(curMode.isSignUp()); // output false
console.log(curMode.isForgotPassword()); // output false
```


Immutatibility
---------------

`gen_enum` tried to use `Object.freeze()` to make the enum object be immutabile. If your environment doesn't support `Object.freeze()`, e.g. IE 8 or before, you can still use `gen_enum`, but the object returned is not immutable.

Limits
----------

The object created by `gen_enum` won't survive `JSON` `stringify`/`parse` cicle as all the methods associated with the object has been lost after `JSON.parse`. If you do need enum definition that needs to run across JSON serialize/deserialize, please try https://www.npmjs.com/package/gen_const 

Dependencies
--------------

This module depends on `lodash`