'use strict';

/**
 * Constructs an enumeration with string contains a group of keys separated by space,
 * or an array of String keys
 *
 * For example:
 *
 *   var COLORS = genEnum("blue red green");
 *   var myColor = COLORS.blue;
 *   console.log(myColor._id); // output 'blue'
 *   console.log(myColor.name()); // output 'blue'
 *   console.log(myColor.toString()); // output 'blue'
 *   var isBlue = myColor.isBlue(); // should return true
 *   var isRed = myColor.isRed(); // should return false
 *   var isColorValid = !!COLORS[myColor];
 *
 * @param {string} obj
 * @return {object}
 */

var _ = require('lodash');


function isArray(v) {
  return _.isArray(v);
}

function isObject(v) {
  return v instanceof Object && !isArray(v);
}

function isString(v) {
  return _.isString(v);
}

function ensureValidEnumKeyName(nm) {
  if(!nm || (typeof nm !== 'string') || !isNaN(parseInt(nm))) {
    throw 'bad enum key: ' + nm;
  }
}

function keysFromArray(array) {
  var a = [];
  for (var i = 0, j = array.length; i < j; ++i) {
    var k = array[i];
    ensureValidEnumKeyName(k);
    a.push(array[i]);
  }
  return a;
}

function keysFromObject(obj) {
  var a = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      ensureValidEnumKeyName(k);
      a.push(k);
    }
  }
  return a;
}

function keysFromString(s) {
  var a = s.split(/[,;:\s]+/);
  for (var i = 0, j = a.length; i < j; ++i) {
    ensureValidEnumKeyName(a[i]);
  }
  return a;
}

function getIsFuncName(k) {
  ensureValidEnumKeyName(k);
  return 'is' + _.capitalize(_.camelCase(k));
}

function buildEnum(keys, theEnum, isFuncs) {
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i], fn = getIsFuncName(k);
    theEnum[k] = {_id: k};
    isFuncs.push(fn);
  }
}

function extendIsFuncsToEnum(theEnum, isFuncs, serializable) {
  _.forEach(theEnum, function(en, key) {
    extendIsFuncsToEnumItem(en, isFuncs, serializable);
  });
}

function extendIsFuncsToEnumItem(en, isFuncs, serializable) {
  en.toString = function() {return en._id;};
  en.name = en.toString;
  en.__is_func_nm__ = getIsFuncName(en._id);
  if (serializable) {
    en.__is_func_list__ = isFuncs;
  }
  _.forEach(isFuncs, function(fn) {
    en[fn] = function() {
      return fn === en.__is_func_nm__;
    };
  });
}

function freeze(theEnum) {
  if (Object && Object.freeze) {
    return Object.freeze(theEnum);
  } else {
    return theEnum;
  }
}

var genEnum = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theEnum = {}, isFuncs = [];
  buildEnum(keys, theEnum, isFuncs);
  extendIsFuncsToEnum(theEnum, isFuncs, true);

  return freeze(theEnum);
};

var genConst = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theConst = {};
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i];
    theConst[k] = k;
  }

  return freeze(theConst);
};

var genBitmap = function(key) {
  var keys = [], defVal = false, theObj = false;
  if (arguments.length > 1) {
    if (typeof arguments[0] === 'boolean') {
      defVal = arguments[0];
      var args = [];
      Array.prototype.push.apply(args, arguments);
      args.shift();
      if (args.length == 1) {
        key = args[0];
        if (isString(key)) {
          keys = keysFromString(key);
        } else if (isObject(key)) {
          theObj = key;
          keys = keysFromObject(key);
        } else if (isArray(key)) {
          keys = keysFromArray(key);
        } else {
          throw new Error('Argument must be a string or an array of strings.');
        }
      } else {
        keys = keysFromArray(args);
      }
    } else {
      keys = keysFromArray(arguments);
    }
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    theObj = key;
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theBitmap = {};
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i];
    if (theObj && typeof theObj[k] === 'boolean') {
      theBitmap[k] = theObj[k]; 
    } else {
      theBitmap[k] = defVal;
    }
  }

  return freeze(theBitmap);
};


var _unJSON = function(v) {
  if (v && v._id && v.__is_func_list__ && v.__is_func_nm__) {
    extendIsFuncsToEnumItem(v, v.__is_func_list__, true);
  } else if (isObject(v)) {
    for (var k in v) {
      if (v.hasOwnProperty(k)) {
        _unJSON(v[k]);
      }
    }
  }
}

var unJSON = function(v) {
  if (typeof(v) === 'string') {
    v = JSON.parse(v);
  }
  _unJSON(v);
  return v;
};

module.exports = {
  enum: genEnum,
  const: genConst,
  bitmap: genBitmap,
  unJSON: unJSON
};