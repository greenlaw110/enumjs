"use strict";

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

function getIsFuncName(k) {
  return "is" + _.capitalize(_.camelCase(k));
}

var genEnum = function(key) {
  var ret = {};
  var keys = [];
  if (_.isArray(key)) {
    for (var i = 0, j = key.length; i < j; ++i) {
      var k = key[i];
      if (!k || !_.isString(k)) {
        throw new Error("bad enum key: " + k);
      }
      keys.push(k);
    }
  } else if (key instanceof Object && !Array.isArray(key)) {
    for (k in key) {
      if (key.hasOwnProperty(k)) {
        keys.push(k)
      }
    }
  } else if (!_.isString(key)) {
    throw new Error('Argument must be a string or an array of strings.');
  } else {
    keys = key.split(/[,;:\s]+/);
  }

  var isFuncs = [];
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i], fn = getIsFuncName(k);
    ret[k] = {_id: k};
    isFuncs.push(fn);
  }
  _.forEach(ret, function(en, key) {
    en['toString'] = function() {return en._id;}
    en['name'] = en['toString'];
    en['__is_fun_nm__'] = getIsFuncName(en._id);
    _.forEach(isFuncs, function(fn) {
      en[fn] = function() {
        return fn == en['__is_fun_nm__'];
      }
    })
  })
  return ret;
};

module.exports = genEnum;