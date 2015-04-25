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

function extendIsFuncsToEnum(theEnum, isFuncs) {
  _.forEach(theEnum, function(en, key) {
    en.toString = function() {return en._id;};
    en.name = en.toString;
    en.__is_fun_nm__ = getIsFuncName(en._id);
    _.forEach(isFuncs, function(fn) {
      en[fn] = function() {
        return fn === en.__is_fun_nm__;
      };
    });
  });
}

function freeze(theEnum) {
  try {
    return Object.freeze(theEnum);
  } catch (e) {
    return theEnum;
  }
}

var genEnum = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (_.isArray(key)) {
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
  extendIsFuncsToEnum(theEnum, isFuncs);

  return freeze(theEnum);
};

module.exports = genEnum;