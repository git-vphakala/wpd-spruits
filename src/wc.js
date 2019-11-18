//****************************************************************************************************************************************************************************
export function wc(comp) {
  let result = false;
  
  if (this[comp.prototype.constructor.name] === undefined) {
    this[comp.prototype.constructor.name] = comp;
    result = true;
  }

  return result;
};

//****************************************************************************************************************************************************************************
export function addCssRules(rules, $dest, pretty) {
  let selector, propsObj, propsStr; // , dest = [];

  /*
  rules.forEach(rule => {
    selector = Object.keys(rule)[0];
    propsObj = Object.values(rule)[0];
    propsStr = Object.entries(propsObj).reduce((all, propAndVal) => { return all + (pretty ? "  ":"") + propAndVal[0] + ":" + propAndVal[1] + (pretty ? "\n":" "); }, "");
    dest.push(selector + ' {' + (pretty ? '\n':' ') + propsStr + '}\n');
  });
  */
  if ($dest) $dest.append(rules);

  return rules; // dest;
}

//****************************************************************************************************************************************************************************
export function addCssRule(rule) {
  let rules = [];
  rules.push(rule);
  return addCssRules(rules, $("#spruits-app-styles"));
}
