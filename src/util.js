export const TABLE = "<table>";
export const TH = "<th>";
export const TR  = "<tr>";
export const TD = "<td>";
export const DIV = "<div>";
export const SPAN = "<span>";
export const INPUT = "<input>";
export const I = "<i>";

export const DEFAULT_FIELD_CLASS = "spruit-field";

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

export function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

export function getId(base) {
  let yourId;

  if (base !== undefined) {
    yourId = base + id;
  } else {
    yourId = "" + id;
  }
  id++;

  return yourId;
}

export function mediaQuery() { 
  return ($(window).width() >= 800); 
}; // mediaQuery

// attrs = { attr1:X, attr2:Y, ... },                            for example: { span:{ class:"my-span" }, label: { style:"width:1em;height:10em;" } }
// defVal = the default value if searched for attr is not found, for example: "width:2em;"
// 3rd, 4th, ... args = keys, attrs[arg3][args4][...],           for example: 3rd arg = "label", 4th arg = "style"
//                                                               usage:       getAttr(args, "width:2em;", "label", "style");
export function getAttr(attrs, defVal) {
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

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
