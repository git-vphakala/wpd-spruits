var spruits2 = (function(){
"use strict";

let 
  isArray, isFunction, isString, id = 0, getId, mediaQuery, getAttr,
  Component,
  InputText, AlphaNumericString, DigitString, DecimalDigitString,
  InputCheckbox,
  Select,
  Month, Modal, Calendar, InputDate,
  Modes, Spinner, TimePicker, InputTime, InputDateAndTime,
  ResizeAgent,
  Table, TabSheet, CustomType,
  Entity, Container,
  Menu,
  Crud,
  Notification,
  PageManager,
  TouchManager,
  init,
  wc,
  addCssRules,
  addCssRule;

const TABLE = "<table>";
const TH = "<th>";
const TR  = "<tr>";
const TD = "<td>";
const DIV = "<div>";
const SPAN = "<span>";
const INPUT = "<input>";
const I = "<i>";

const DEFAULT_FIELD_CLASS = "spruit-field";

isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

isFunction = function(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

getId = function(base) {
  let yourId;

  if (base !== undefined) {
    yourId = base + id;
  } else {
    yourId = "" + id;
  }
  id++;

  return yourId;
}

mediaQuery = function(){ 
  return ($(window).width() >= 800); 
}; // mediaQuery

// attrs = { attr1:X, attr2:Y, ... },                            for example: { span:{ class:"my-span" }, label: { style:"width:1em;height:10em;" } }
// defVal = the default value if searched for attr is not found, for example: "width:2em;"
// 3rd, 4th, ... args = keys, attrs[arg3][args4][...],           for example: 3rd arg = "label", 4th arg = "style"
//                                                               usage:       getAttr(args, "width:2em;", "label", "style");
getAttr = function getAttr(attrs, defVal) {
  let val = attrs, attr = [].slice.call(arguments).slice(2), len = attr.length, i;

  if (val !== undefined) {
    for (i=0; i<len; i++) {
      val = val[attr[i]];
      if (val === undefined) break;
    }
  }

  if (val === undefined) val = defVal;
  
  return val;
}
